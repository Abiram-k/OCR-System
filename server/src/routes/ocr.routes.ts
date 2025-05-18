import { Router } from "express";
import multer from "multer";
import { proccessAdharDetails } from "../controllers/ocr.controller.js";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/process-aadhaar",
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  proccessAdharDetails
);

export default router;
