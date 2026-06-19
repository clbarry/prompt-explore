import express from "express";
import promptDB from "../db/promptDB.js";

const router = express.Router();

/* Load a prompt from Recently Deleted */
router.get("/recently-deleted", async (req, res) => {
  console.log("Received request for /api/recently-deleted");

  try {
    const prompt = await promptDB.getRecentlyDeletedById(id);
    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }
    res.json(prompt);
  } catch (error) {
    console.error("Error fetching recently deleted prompt:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
