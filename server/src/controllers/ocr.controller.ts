// import { NextFunction, Request, Response } from "express";
// import { createWorker } from "tesseract.js";
// import {
//   extractBackDetails,
//   extractFrontDetails,
// } from "../utils/extractDetails";

// const worker = await createWorker("eng");
// export const proccessAdharDetails = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };

//     const front = files?.["frontImage"]?.[0];
//     const back = files?.["backImage"]?.[0];

//     if (!front || !back) {
//       res
//         .status(400)
//         .json({ error: "Both front and back images are required" });
//       return;
//     }

//     const frontResult = await worker.recognize(front.buffer);
//     const frontData = extractFrontDetails(frontResult.data.text);

//     const backResult = await worker.recognize(back.buffer);
//     const backData = extractBackDetails(backResult.data.text);

//     const finalResult = {
//       aadhaarNumber: frontData.aadhaarNumber || "",
//       name: frontData.name || "",
//       dob: frontData.dob || "N/A",
//       gender: frontData.gender || "N/A",
//       fatherOrHusbandName: frontData.fatherOrHusbandName || "",
//       address: backData.address || "",
//     };

//     res.status(200).json(finalResult);
//   } catch (error) {
//     console.error("Error processing Aadhaar:", error);
//     res.status(500).json({ error: "Failed to process Aadhaar card" });
//   }
// };

import vision from "@google-cloud/vision";
import { Request, Response } from "express";
import { config } from "dotenv";
config();

const client = new vision.ImageAnnotatorClient();
async function performOCR(imageBuffer: Buffer) {
  const [result] = await client.documentTextDetection({
    image: { content: imageBuffer },
  });
  return result.fullTextAnnotation?.text;
}
function parseFrontText(text: string) {
  const fields: any = {};
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // Try to find name from the first 2 lines with Devanagari + English pattern
  if (lines.length >= 2) {
    const devnagariName = lines[0];
    const englishName = lines[1];
    if (
      /^[\u0900-\u097F\s]+$/.test(devnagariName) &&
      /^[A-Za-z\s]+$/.test(englishName)
    ) {
      fields.nameHindi = devnagariName;
      fields.name = englishName;
    }
  }

  for (const line of lines) {
    if (/DOB|जन्म|जन्म तारीख/.test(line)) {
      const match = line.match(/(\d{2}\/\d{2}\/\d{4})/);
      if (match) fields.dob = match[1];
    }

    if (/Male|Female|पुरुष|महिला/.test(line)) {
      if (/Male|पुरुष/.test(line)) fields.gender = "Male";
      else if (/Female|महिला/.test(line)) fields.gender = "Female";
    }

    if (/^\d{4}\s\d{4}\s\d{4}$/.test(line)) {
      fields.aadhaarNumber = line;
    }
  }

  return fields;
}

function parseBackText(text: string) {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  let addressLines: string[] = [];

  let foundEnglishAddress = false;

  for (const line of lines) {
    // Start capturing after 'Address' or 'पत्ता'
    if (/Address|पत्ता/.test(line)) {
      foundEnglishAddress = true;
      continue;
    }

    // Once Address: is found, collect until next Aadhaar number or unrelated content
    if (foundEnglishAddress) {
      if (/^\d{4}\s\d{4}\s\d{4}$/.test(line)) break; // Stop at Aadhaar number again
      addressLines.push(line);
    }
  }

  return { address: addressLines.join(" ") };
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

    if (!frontText || !backText) {
      console.log("No front or back text: ", frontText, backText);
      return;
    }
    console.log(frontText, "Back Text: ", backText);

    const frontFields = parseFrontText(frontText);
    const backFields = parseBackText(backText);

    const result = { ...frontFields, ...backFields };
    console.log("Result: ", result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error performing OCR:", error);
    res.status(500).send("Error performing OCR");
  }
};
