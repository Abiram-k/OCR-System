"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ImageUploader from "@/components/image-uploader";
import OcrResults from "@/components/ocr-result";
import useProcessAdhaar from "@/utils/useProcessAdhaar";
import { toast } from "sonner";

export default function Home() {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [backImageFile, setBackImageFile] = useState<File | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResults, setOcrResults] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("upload");

  const handleFrontImageUpload = (imageUrl: string, file: File | null) => {
    setFrontImage(imageUrl);
    setFrontImageFile(file);
  };

  const handleBackImageUpload = (imageUrl: string, file: File | null) => {
    setBackImage(imageUrl);
    setBackImageFile(file);
  };

  const processOcr = async () => {
    try {
      setIsProcessing(true);
      if (!frontImage || !backImage || !frontImageFile || !backImageFile) {
        toast.warning("Upload image before processing...");
        return;
      }
      const result = await useProcessAdhaar(frontImageFile, backImageFile);
      console.log("Result after processing: ",result)
      setOcrResults(result);
      setActiveTab("results");
    } catch (error) {
      console.log("Error while proccessing: ", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const canProcess = frontImage && backImage;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="w-full max-w-4xl">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Aadhaar Card OCR
            </CardTitle>
            <CardDescription className="text-center">
              Upload front and back sides of your Aadhaar card for information
              extraction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload Images</TabsTrigger>
                <TabsTrigger value="results" disabled={!ocrResults}>
                  Results
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUploader
                    title="Front Side"
                    description="Upload front side of Aadhaar card"
                    onImageUpload={handleFrontImageUpload}
                    currentImage={frontImage}
                  />

                  <ImageUploader
                    title="Back Side"
                    description="Upload back side of Aadhaar card"
                    onImageUpload={handleBackImageUpload}
                    currentImage={backImage}
                  />
                </div>

                {(frontImage || backImage) && (
                  <div className="flex flex-col items-center mt-8 space-y-4">
                    {!canProcess && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Missing images</AlertTitle>
                        <AlertDescription>
                          Please upload both front and back sides of the Aadhaar
                          card.
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={processOcr}
                      disabled={!canProcess || isProcessing}
                      className="w-full max-w-xs"
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Extract Information
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="results" className="space-y-6 mt-6">
                {ocrResults && (
                  <OcrResults
                    results={ocrResults}
                    frontImage={frontImage!}
                    backImage={backImage!}
                  />
                )}

                <Button
                  variant="outline"
                  onClick={() => setActiveTab("upload")}
                  className="w-full"
                >
                  Back to Upload
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
