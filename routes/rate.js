import express from "express";
import promptDB from "../db/promptDB.js";

const router = express.Router();

router.post("/rate", async (req, res) => {
  const { promptId, rating } = req.body;

  if (!promptId || ![1, 2, 3, 4, 5].includes(rating)) {
    return res.status(400).json({ error: "Invalid promptId or rating" });
  }

  try {
    await promptDB.addRating(promptId, rating);
    res.json({ success: true });
  } catch (error) {
    console.error("Rate failed:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;