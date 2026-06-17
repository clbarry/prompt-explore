import express from "express";
import promptsRouter from "./routes/prompts.js";
import rateRouter from "./routes/rate.js"

console.log("Init backend...");

const app = express();
const PORT = process.env.PORT || 3300;

app.use(express.json()); 
app.use(express.static("frontend"));

app.use("/api", promptsRouter);
app.use("/api", rateRouter);

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
