import vision from "@google-cloud/vision";
import { Request, Response } from "express";
import { config } from "dotenv";
import { parseBackText, parseFrontText } from "../utils/extractDetails.js";
import { isValidAadhaarOCRText } from "../utils/isValidAadhaarOCRText.js";
import fs from "fs";
config();
const path = "./src/config/adhaar-ocr-460118-cbcdd2cbb768.json";

// const raw = fs.readFileSync("./src/config/adhaar-ocr-460118-cbcdd2cbb768.json", "utf8");
// const escaped = JSON.stringify(JSON.parse(raw));
// console.log(escaped);

const jsonEscapedString = process.env.GOOGLE_APPLICATION_CREDENTIALS!;
const jsonParsed = JSON.parse(jsonEscapedString); // Now it's a real object
fs.writeFileSync(path, JSON.stringify(jsonParsed)); 

// fs.writeFileSync(path, process.env.GOOGLE_APPLICATION_CREDENTIALS!); 

const client = new vision.ImageAnnotatorClient({
  keyFilename: path,
});
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
