import express from 'express';
import listingsRouter from './routes/listings.js';

console.log("Init backend...");

const app = express();
const PORT = process.env.PORT || 3300;

app.use(express.static("frontend"));

app.use("/api", listingsRouter);

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})