import express from "express";
import { db } from "../config/firebase.js";
import { authenticateFirebase } from "../middlewares/authenticateFirebase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { key, country } = req.query;

  if (key) {
    const docSnap = await db.collection("parameters").doc(key).get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Parameter not found" });
    }

    const data = docSnap.data();
    const localizedValue = country && data.localizedValues?.[country];
    const valueToSend =
      localizedValue !== undefined ? localizedValue : data.defaultValue;

    return res.json({
      parameterKey: data.parameterKey,
      value: valueToSend,
      description: data.description || "",
      createDate: data.createDate || "",
    });
  }

  const snapshot = await db.collection("parameters").get();
  const allParams = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      parameterKey: data.parameterKey,
      value: country ? data.localizedValues?.[country] : data.defaultValue,
      description: data.description || "",
      createDate: data.createDate || "",
    };
  });

  return res.json(allParams);
});

router.post("/", authenticateFirebase, async (req, res) => {
  const { key, value, description = "" } = req.body;
  const { country } = req.query;

  if (!key || value === undefined) {
    return res.status(400).json({ error: "key and value are required" });
  }

  const docRef = db.collection("parameters").doc(key);
  const docSnap = await docRef.get();

  let data = {
    parameterKey: key,
    description,
    createDate: new Date().toISOString(),
    version: 1,
  };

  if (docSnap.exists) {
    data = docSnap.data();
  }

  // Update either localized or default value
  if (country) {
    data.localizedValues = { ...data.localizedValues, [country]: value };
  } else {
    data.defaultValue = value;
  }

  // Always update description if provided
  data.description = description || data.description;
  data.version = (data.version || 1) + 1;

  await docRef.set(data);

  const localizedValue = country && data.localizedValues?.[country];
  const valueToSend =
    localizedValue !== undefined ? localizedValue : data.defaultValue;

  res.status(201).json({
    message: "Parameter created or updated",
    parameterKey: data.parameterKey,
    value: valueToSend,
    description: data.description,
    createDate: data.createDate,
  });
});

export default router;
