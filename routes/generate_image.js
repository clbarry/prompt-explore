import express from "express";

const router = express.Router();

router.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt required" });

  const token = process.env.HF_TOKEN;
  if (!token) return res.status(500).json({ error: "HF_TOKEN not set" });

  try {
    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      },
    );

    if (!hfRes.ok) {
      const msg = await hfRes.text();
      return res.status(hfRes.status).json({ error: msg });
    }

    const buffer = await hfRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    res.json({ image: `data:image/jpeg;base64,${base64}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
