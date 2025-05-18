import vision from "@google-cloud/vision";
import { Request, Response } from "express";
import { config } from "dotenv";
import { parseBackText, parseFrontText } from "../utils/extractDetails";
import { isValidAadhaarOCRText } from "../utils/isValidAadhaarOCRText";
config();

const client = new vision.ImageAnnotatorClient();
async function performOCR(imageBuffer: Buffer) {
  const [result] = await client.documentTextDetection({
    image: { content: imageBuffer },
  });
  return result.fullTextAnnotation?.text;
}

export const proccessAdharDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files || !files["frontImage"] || !files["backImage"]) {
      res.status(400).json({ message: "Missing front or back image" });
    }
    const frontImage = files["frontImage"][0].buffer;
    const backImage = files["backImage"][0].buffer;

    const frontText = await performOCR(frontImage);
    const backText = await performOCR(backImage);

    if (!frontText || !backText || !isValidAadhaarOCRText(frontText)) {
      res.status(400).json({ error: "Invalid Aadhaar card image" });
      return;
    }

    const frontFields = parseFrontText(frontText);
    const backFields = parseBackText(backText);

    const result = { ...frontFields, ...backFields };
    res.status(200).json(result);
  } catch (error) {
    console.error("Error performing OCR:", error);
    res.status(500).send("Error performing OCR");
  }
};
