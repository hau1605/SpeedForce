import express from "express";
import bodyParser from "body-parser";

import analyzeRoutes from "./routes/analyze.js";
import resultRoutes from "./routes/result.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.send("Test route");
});
app.use("/analyze", analyzeRoutes);
app.use("/result", resultRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
