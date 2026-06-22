import express from "express";
import promptDB from "../db/promptDB.js";

const router = express.Router();

router.post("/mod_approve", async (req, res) => {
  const { promptId, use, prompt, contributor } = req.body;

  if (!promptId || !use || !prompt || !contributor) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const saveResult = await promptDB.updateRecentlyDeletedById(promptId, {
      use,
      prompt,
      contributor,
    });

    if (saveResult.matchedCount === 0) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    const approveResult = await promptDB.approveRecentlyDeletedById(promptId);
    if (!approveResult.approved) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Approve failed:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
