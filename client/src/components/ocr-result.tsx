import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatLabel } from "@/utils/formatLabel";
import { Check } from "lucide-react";

interface OcrResultsProps {
  darkMode: boolean;
  results: any;
  frontImage: string;
  backImage: string;
}

export default function OcrResults({
  darkMode,
  results,
  frontImage,
  backImage,
}: OcrResultsProps) {
  return (
    <div className="space-y-6">
      <div
        className={`bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center ${
          darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
        }`}
      >
        <Check className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
        <p className="text-green-800 dark:text-green-400">
          OCR processing completed successfully
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative h-48 w-full overflow-hidden rounded-lg border">
          <img
            src={frontImage || "/placeholder.svg"}
            alt="Front side of Aadhaar card"
            className="object-contain h-full w-full"
          />
        </div>
        <div className="relative h-48 w-full overflow-hidden rounded-lg border">
          <img
            src={backImage || "/placeholder.svg"}
            alt="Back side of Aadhaar card"
            className="object-contain h-full w-full"
          />
        </div>
      </div>

      <Card className="bg-gray-800 text-gray-100 border-gray-800 ">
        <CardHeader>
          <CardTitle>Extracted Information</CardTitle>
          <CardDescription>
            Information extracted from your Aadhaar card
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
              {Object.entries(results)
                .filter(([key]) => key !== "address")
                .map(([key, value]) => (
                  <InfoItem
                    key={key}
                    label={formatLabel(key)}
                    value={
                      value !== undefined && value !== null
                        ? String(value)
                        : "N/A"
                    }
                  />
                ))}
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2 text-white">Address</h3>
              <p className="text-sm p-3 rounded-md bg-gray-300 text-black">
                {results.address || ""}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium text-white">{label}</h3>
      <p className="text-sm p-3  rounded-md bg-gray-300 text-black">{value}</p>
    </div>
  );
}
