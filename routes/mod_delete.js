import express from "express";
import promptDB from "../db/promptDB.js";

const router = express.Router();

router.delete("/mod_delete", async (req, res) => {
  const { promptId } = req.body;

  if (!promptId) {
    return res.status(400).json({ error: "Missing promptId" });
  }

  try {
    const result = await promptDB.deleteRecentlyDeletedById(promptId);
    if (!result.deleted) {
      return res.status(404).json({ error: "Prompt not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Delete failed:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;