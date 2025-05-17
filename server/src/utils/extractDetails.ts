// function normalizeOCRText(text: string): string {
//   return text
//     .toLowerCase()
//     .replace(/[\r\n]+/g, " ")
//     .replace(/\s+/g, " ")
//     .replace(/[^a-z0-9\s:\/\-\.,]/g, "")
//     .trim();
// }

// function extractValueAfterKeyword(text: string, keyword: string): string {
//   const index = text.indexOf(keyword.toLowerCase());
//   if (index === -1) return "";

//   const substr = text.substring(index + keyword.length).trim();

//   const value = substr.split(" ").slice(0, 6).join(" ");

//   return value.replace(/^[:\-\s]+/, "").trim();
// }

// function extractAadhaarNumber(text: string): string {
//   const match = text.match(/\b(\d{4}\s?\d{4}\s?\d{4})\b/);
//   return match ? match[1].replace(/\s/g, "") : "";
// }

// export function extractFrontDetails(rawText: string) {
//   const text = normalizeOCRText(rawText);

//   const aadhaarNumber = extractAadhaarNumber(text);

//   const gender = text.includes("male")
//     ? "Male"
//     : text.includes("female")
//     ? "Female"
//     : "";

//   const dob =
//     extractValueAfterKeyword(text, "dob") ||
//     extractValueAfterKeyword(text, "year of birth");

//   const fatherOrHusbandName =
//     extractValueAfterKeyword(text, "s/o") ||
//     extractValueAfterKeyword(text, "d/o") ||
//     extractValueAfterKeyword(text, "w/o") ||
//     extractValueAfterKeyword(text, "son of") ||
//     extractValueAfterKeyword(text, "daughter of") ||
//     extractValueAfterKeyword(text, "wife of") ||
//     "";

//   const nameCandidates = text.split(" ");
//   const genderIndex = nameCandidates.findIndex(
//     (w) => w === "male" || w === "female"
//   );
//   const name =
//     genderIndex > 1
//       ? nameCandidates.slice(genderIndex - 2, genderIndex).join(" ")
//       : "";

//   return { aadhaarNumber, name, gender, dob, fatherOrHusbandName, rawText };
// }

// export function extractBackDetails(rawText: string) {
//   const text = normalizeOCRText(rawText);

//   const careOf = extractValueAfterKeyword(text, "c/o");
//   const house = extractValueAfterKeyword(text, "house");
//   const street = extractValueAfterKeyword(text, "street");
//   const landmark = extractValueAfterKeyword(text, "landmark");
//   const locality = extractValueAfterKeyword(text, "locality");
//   const vtc = extractValueAfterKeyword(text, "village/town/city");
//   const po = extractValueAfterKeyword(text, "post office");
//   const district = extractValueAfterKeyword(text, "district");
//   const state = extractValueAfterKeyword(text, "state");
//   const pinCode =
//     extractValueAfterKeyword(text, "pin") ||
//     extractValueAfterKeyword(text, "pincode");

//   const address = {
//     careOf,
//     house,
//     street,
//     landmark,
//     locality,
//     vtc,
//     po,
//     district,
//     state,
//     pinCode,
//   };

//   return { address, rawText };
// }



function normalizeOCRText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s:\/\-\.,]/g, "")
    .trim();
}


function extractValueAfterKeyword(text: string, keywords: string[]): string {
  for (const keyword of keywords) {
    const index = text.indexOf(keyword.toLowerCase());
    if (index !== -1) {
      const substr = text.substring(index + keyword.length).trim();
      const value = substr.split(" ").slice(0, 8).join(" "); // Increased word limit for address fields
      return value.replace(/^[:\-\s]+/, "").trim();
    }
  }
  return "";
}

function extractAadhaarNumber(text: string): string {
  const match = text.match(/\b(\d{4}\s?\d{4}\s?\d{4})\b/);
  return match ? match[1].replace(/\s/g, "") : "";
}

export function extractFrontDetails(rawText: string) {
  const text = normalizeOCRText(rawText);

  const aadhaarNumber = extractAadhaarNumber(text);

  const gender = text.includes("male")
    ? "Male"
    : text.includes("female")
    ? "Female"
    : text.includes("transgender")
    ? "Transgender"
    : "";

  const dob = extractValueAfterKeyword(text, [
    "dob",
    "date of birth",
    "year of birth",
  ]);

  const fatherOrHusbandName = extractValueAfterKeyword(text, [
    "s/o",
    "d/o",
    "w/o",
    "son of",
    "daughter of",
    "wife of",
    "c/o",
  ]);

  const nameMatch = text.match(/(?:name\s*[:\-\s]*)([a-z\s]{2,40})|([a-z\s]{2,40})\s*(male|female|transgender)/i);
  const name = nameMatch
    ? (nameMatch[1] || nameMatch[2]).trim()
    : extractValueAfterKeyword(text, ["name", "naam"]);

  return { aadhaarNumber, name, gender, dob, fatherOrHusbandName, rawText };
}

export function extractBackDetails(rawText: string) {
  const text = normalizeOCRText(rawText);

  const careOf = extractValueAfterKeyword(text, ["c/o", "care of", "s/o"]);
  const house = extractValueAfterKeyword(text, [
    "house",
    "h.no",
    "house no",
    "flat",
    "no",
  ]);
  const street = extractValueAfterKeyword(text, ["street", "road", "rd", "lane"]);
  const landmark = extractValueAfterKeyword(text, ["landmark", "near", "opposite", "beside"]);
  const locality = extractValueAfterKeyword(text, ["locality", "area", "colony", "nagar"]);
  const vtc = extractValueAfterKeyword(text, [
    "village/town/city",
    "village",
    "town",
    "city",
    "vtc",
  ]);
  const po = extractValueAfterKeyword(text, [
    "post office",
    "po",
    "post",
    "p.o",
  ]);
  const district = extractValueAfterKeyword(text, ["district", "dist"]);
  const state = extractValueAfterKeyword(text, ["state", "st", "maharashtra"]);
  const pincode = extractValueAfterKeyword(text, [
    "pin",
    "pincode",
    "postal code",
    "zip",
  ]);

  // Combine address components into a single string, filtering out empty values
  const addressComponents = [
    careOf,
    house,
    street,
    landmark,
    locality,
    vtc,
    po,
    district,
    state,
    pincode,
  ].filter((component) => component); // Remove empty components

  // Join with commas and ensure no double commas
  const address = addressComponents.join(", ").replace(/,\s*,/g, ",").trim();

  return { address, rawText };
}