import express from "express";
import { db } from "../config/firebase.js";
import { authenticateFirebase } from "../middlewares/authenticateFirebase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { region } = req.query;

  const snapshot = await db.collection("parameters").get();
  const allParams = snapshot.docs.map((doc) => {
    const data = doc.data();
    const localizedValue = region && data.localizedValues?.[region];
    const valueToSend =
      localizedValue !== undefined ? localizedValue : data.defaultValue;

    return {
      parameterKey: data.parameterKey,
      value: valueToSend,
      description: data.description || "",
      createDate: data.createDate || "",
      version: data.version || 0,
    };
  });

  return res.json({ data: allParams });
});

router.post("/", authenticateFirebase, async (req, res) => {
  const { parameterKey, value, description = "" } = req.body;

  if (!parameterKey || value === undefined) {
    return res.status(400).json({ message: "Key and value are required" });
  }

  const docRef = db.collection("parameters").doc(parameterKey);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    return res.status(400).json({ message: "Parameter already exists" });
  }

  let data = {
    parameterKey: parameterKey,
    defaultValue: value,
    description,
    createDate: new Date().toISOString(),
    version: 1,
  };

  await docRef.set(data);

  res.status(201).json({
    message: "Parameter created",
    data: {
      parameterKey: data.parameterKey,
      value: data.defaultValue,
      description: data.description,
      createDate: data.createDate,
      version: data.version,
    },
  });
});

router.put("/", authenticateFirebase, async (req, res) => {
  const { parameterKey, value, description = "", version } = req.body;
  const { region } = req.query;

  if (!parameterKey || !value || !version) {
    return res.status(400).json({ message: "Key and value are required" });
  }

  const docRef = db.collection("parameters").doc(parameterKey);
  const docSnap = await docRef.get();

  /* Check if the parameter exists */
  if (!docSnap.exists) {
    return res.status(404).json({ message: "Parameter not found" });
  }

  const data = docSnap.data();

  /* Check if the version is correct */
  if (data.version !== version) {
    return res.status(409).json({
      message:
        "Someone has updated the parameter. Please check the new value and try again.",
      data: {
        parameterKey: data.parameterKey,
        value: data.defaultValue,
        description: data.description,
        createDate: data.createDate,
        version: data.version,
      },
    });
  }

  /* Prepare updated data */
  if (region) {
    data.localizedValues = { ...data.localizedValues, [region]: value };
  } else {
    data.defaultValue = value;
  }

  data.description = description || data.description;
  data.version = version + 1;

  await docRef.set(data);

  res.json({
    message: "Parameter updated successfully",
    data: {
      parameterKey: data.parameterKey,
      value,
      description: data.description,
      createDate: data.createDate,
      version: data.version,
    },
  });
});

router.delete("/", authenticateFirebase, async (req, res) => {
  const { parameterKey } = req.body;

  if (!parameterKey) {
    return res.status(400).json({ message: "Key is required" });
  }

  const docRef = db.collection("parameters").doc(parameterKey);
  const docSnap = await docRef.get();

  /* Check if the parameter exists */
  if (!docSnap.exists) {
    return res.status(404).json({ message: "Parameter not found" });
  }
  await docRef.delete();

  res.json({ message: `Parameter "${parameterKey}" deleted successfully` });
});

export default router;
