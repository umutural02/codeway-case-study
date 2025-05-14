import express from "express";
import { db } from "../config/firebase.js";
import { authenticateFirebase } from "../middlewares/authenticateFirebase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { key, region } = req.query;

  if (key) {
    const docSnap = await db.collection("parameters").doc(key).get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Parameter not found" });
    }

    const data = docSnap.data();
    const localizedValue = region && data.localizedValues?.[region];
    const valueToSend =
      localizedValue !== undefined ? localizedValue : data.defaultValue;

    return res.json({
      parameterKey: data.parameterKey,
      value: valueToSend,
      description: data.description || "",
      createDate: data.createDate || "",
      version: data.version || 0,
    });
  }

  const snapshot = await db.collection("parameters").get();
  const allParams = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      parameterKey: data.parameterKey,
      value: region ? data.localizedValues?.[region] : data.defaultValue,
      description: data.description || "",
      createDate: data.createDate || "",
      version: data.version || 0,
    };
  });

  return res.json(allParams);
});

router.post("/", authenticateFirebase, async (req, res) => {
  const { key, value, description = "" } = req.body;
  const { region } = req.query;

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
  if (region) {
    data.localizedValues = { ...data.localizedValues, [region]: value };
  } else {
    data.defaultValue = value;
  }

  // Always update description if provided
  data.description = description || data.description;
  data.version = (data.version || 1) + 1;

  await docRef.set(data);

  const localizedValue = region && data.localizedValues?.[region];
  const valueToSend =
    localizedValue !== undefined ? localizedValue : data.defaultValue;

  res.status(201).json({
    message: "Parameter created or updated",
    parameterKey: data.parameterKey,
    value: valueToSend,
    description: data.description,
    createDate: data.createDate,
    version: data.version,
  });
});

router.put("/", authenticateFirebase, async (req, res) => {
  const { key, value, description = "", version } = req.body;
  const { region } = req.query;

  if (!key || value === undefined || !version) {
    return res
      .status(400)
      .json({ error: "key, value, and version are required" });
  }

  try {
    const docRef = db.collection("parameters").doc(key);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Parameter not found" });
    }

    const data = docSnap.data();

    if (data.version !== version) {
      return res.status(409).json({
        error: "Version conflict",
        currentVersion: data.version,
        parameter: data,
      });
    }

    // Prepare updated data
    if (region) {
      data.localizedValues = { ...data.localizedValues, [region]: value };
    } else {
      data.defaultValue = value;
    }

    data.description = description || data.description;
    data.version = version + 1;

    await docRef.set(data);

    const localizedValue = region && data.localizedValues?.[region];
    const valueToSend =
      localizedValue !== undefined ? localizedValue : data.defaultValue;

    res.json({
      message: "Parameter updated successfully",
      parameterKey: data.parameterKey,
      value: valueToSend,
      description: data.description,
      createDate: data.createDate,
      version: data.version,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to update parameter.", details: error.message });
  }
});

router.delete("/", authenticateFirebase, async (req, res) => {
  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ error: "key is required" });
  }

  try {
    const docRef = db.collection("parameters").doc(key);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Parameter not found" });
    }

    await docRef.delete();

    res.json({ message: `Parameter "${key}" deleted successfully` });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to delete parameter.", details: error.message });
  }
});

export default router;
