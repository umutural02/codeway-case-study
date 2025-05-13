import express from "express";
import { db } from "../config/firebase.js";
import { authenticateFirebase } from "../middlewares/authenticateFirebase.js";

const router = express.Router();

// Test Firestore Connection
router.get("/test", async (req, res) => {
  try {
    const snapshot = await db.collection("parameters").limit(1).get();
    if (snapshot.empty) {
      return res.json({
        message: "Connected to Firestore, but no parameters found.",
      });
    }

    const parameters = [];
    snapshot.forEach((doc) => {
      parameters.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      message: "Successfully connected to Firestore.",
      data: parameters,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to connect to Firestore.",
      details: error.message,
    });
  }
});

router.post("/test", authenticateFirebase, async (req, res) => {
  try {
    const { parameterKey, value } = req.body;

    if (!parameterKey || !value) {
      return res
        .status(400)
        .json({ error: "parameterKey and value are required" });
    }

    const docRef = await db.collection("parameters").add({
      parameterKey,
      defaultValue: value,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "Parameter added", id: docRef.id });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to add parameter.", details: error.message });
  }
});

export default router;
