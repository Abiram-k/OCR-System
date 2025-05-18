import vision from "@google-cloud/vision";
import { config } from "dotenv";
import { parseBackText, parseFrontText } from "../utils/extractDetails.js";
import { isValidAadhaarOCRText } from "../utils/isValidAadhaarOCRText.js";
config();
const client = new vision.ImageAnnotatorClient();
async function performOCR(imageBuffer) {
    const [result] = await client.documentTextDetection({
        image: { content: imageBuffer },
    });
    return result.fullTextAnnotation?.text;
}
export const proccessAdharDetails = async (req, res) => {
    try {
        const files = req.files;
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
    }
    catch (error) {
        console.error("Error performing OCR:", error);
        res.status(500).send("Error performing OCR");
    }
};
