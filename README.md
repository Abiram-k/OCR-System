# Aadhaar OCR System

An intelligent Aadhaar OCR system that extracts user information such as name, gender, DOB, Aadhaar number, address, and more using Google Cloud Vision API. Built with a full-stack MERN architecture.

## 🚀 Features

- Extracts text from both front and back Aadhaar card images
- Parses and validates Aadhaar details like Name, DOB, Gender, Aadhaar Number, Address
- Upload validation for supported formats and file sizes
- Google Cloud Vision API integration
- Type-safe with TypeScript on both frontend and backend
- Error handling with feedback via toast notifications

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, TypeScript
- **OCR**: Google Cloud Vision API
- **DevOps**: Vite


## 🌐 Google Cloud Vision Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or use an existing one.
3. Enable **Cloud Vision API** in the project.
4. Go to **Credentials** > Create Service Account Key:
   - Choose `JSON` and download it.
5. Save the credentials file as `google-credentials.json` in your backend root.
6. Set an environment variable or use it directly in code:

````env
GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json


```bash

git clone https://github.com/Abiram-k/OCR-System.git
cd OCR-System

cd client
npm install
npm run build

cd server
npm install
npm start

````
