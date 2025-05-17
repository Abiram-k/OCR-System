import express from "express";
import cors from "cors";
import ocrRoutes from "./routes/ocr.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Hello from OCR backend!" });
});
app.use("/api", ocrRoutes);

export default app;
