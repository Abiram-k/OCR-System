export const parseFrontText = (text) => {
    const fields = {};
    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/Government of India/.test(line))
            continue;
        if (/^[A-Za-z\s]{3,}$/.test(line) && !fields.name) {
            const nextLine = lines[i + 1] || "";
            if (/DOB|Date|जन्म/.test(nextLine)) {
                fields.name = line;
            }
        }
        const hasHindi = lines.some((l) => /[\u0900-\u097F]/.test(l));
        const hasEnglish = lines.some((l) => /[A-Za-z]/.test(l));
        fields.language =
            hasHindi && hasEnglish
                ? "Hindi + English"
                : hasEnglish
                    ? "English"
                    : "Hindi";
        if (!fields.issueDate &&
            /(Issued|Printed|प्रिंट).*(\d{2}\/\d{2}\/\d{4})/.test(line)) {
            const match = line.match(/(\d{2}\/\d{2}\/\d{4})/);
            if (match) {
                fields.issueDate = match[1];
            }
        }
        if (!fields.dob && /DOB|Date|जन्म/.test(line)) {
            const match = line.match(/(\d{2}\/\d{2}\/\d{4})/);
            if (match) {
                fields.dob = match[1];
            }
        }
        if (!fields.gender && /(Male|Female|पुरुष|महिला)/i.test(line)) {
            if (/Male|पुरुष/i.test(line))
                fields.gender = "Male";
            if (/Female|महिला/i.test(line))
                fields.gender = "Female";
        }
        if (!fields.aadhaarNumber && /^\d{4}\s\d{4}\s\d{4}$/.test(line)) {
            fields.aadhaarNumber = line;
        }
    }
    return fields;
};
export const parseBackText = (text) => {
    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    const addressLines = [];
    let isEnglishBlock = false;
    let fatherName;
    let issueAuthority;
    for (const line of lines) {
        const fatherMatch = line.match(/S\/O\s*:\s*(.*)/i);
        if (fatherMatch) {
            fatherName = fatherMatch[1].split(",")[0].trim();
        }
        if (line.includes("Address:")) {
            isEnglishBlock = true;
            continue;
        }
        if (/Unique Identification Authority of India/i.test(line)) {
            issueAuthority = "Unique Identification Authority of India";
        }
        if (isEnglishBlock) {
            if (/^\d{4}\s\d{4}\s\d{4}$/.test(line) ||
                line.includes("@") ||
                line.includes("www"))
                break;
            if (/^[A-Za-z0-9\s,.-]+$/.test(line)) {
                addressLines.push(line);
            }
        }
    }
    const address = addressLines.join(" ");
    const pincodeMatch = address.match(/\b\d{6}\b/);
    const pincode = pincodeMatch ? pincodeMatch[0] : undefined;
    return {
        address,
        pincode,
        fatherName,
        issueAuthority,
    };
};
