const aadhaarMarkers = [
  "Government of India",
  "भारत सरकार",
  "Unique Identification Authority of India",
  "भारतीय विशिष्ट ओळख प्राधिकरण",
  "DOB",
  "Date of Birth",
  "जन्म तारीख",
  "Male",
  "Female",
  "पुरुष",
  "महिला",
  /\d{4}\s\d{4}\s\d{4}/,
];

export const isValidAadhaarOCRText = (text: string): boolean => {
  const markersFound = aadhaarMarkers.some((marker) => {
    if (typeof marker === "string") {
      return text.includes(marker);
    } else {
      return marker.test(text);
    }
  });
  return markersFound;
};