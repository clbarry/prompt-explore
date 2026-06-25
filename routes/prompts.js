import express from "express";
import promptDB from "../db/promptDB.js";

const router = express.Router();

router.get("/prompts", async (req, res) => {
  console.log("Received request for /api/prompts");
  const prompts = await promptDB.getPrompts();
  res.json(prompts);
});

export default router;
