import express from 'express';
import promptsRouter from './routes/prompts.js';

console.log("Init backend...");

const app = express();
const PORT = process.env.PORT || 3300;

app.use(express.static("frontend"));

app.use("/api", promptsRouter);

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})