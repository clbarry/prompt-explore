import express from "express";
import promptDB from "../db/promptDB.js";

const router = express.Router();

/* Load a prompt from Recently Deleted */
router.get("/recently-deleted", async (req, res) => {
  console.log("Received request for /api/recently-deleted");

  try {
    const { promptId, after } = req.query;

    let prompt;
    if (after) {
      prompt = await promptDB.getNextRecentlyDeleted(after);
    } else if (promptId) {
      prompt = await promptDB.getRecentlyDeletedById(promptId);
    } else {
      prompt = await promptDB.getFirstRecentlyDeleted();
    }

    if (!prompt) {
      return res.status(404).json({ error: "No more prompts in the review queue." });
    }
    res.json(prompt);
  } catch (error) {
    console.error("Error fetching recently deleted prompt:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
