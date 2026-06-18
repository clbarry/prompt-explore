/* https://expressjs.com/en/5x/guide/routing/ */

import express from "express";
import promptDB from "../db/promptDB.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  const { use, prompt, contributor, rating } = req.body;

  if (!use || !prompt || !contributor) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await promptDB.createPrompt({ use, prompt, contributor, rating });
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Create failed:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;