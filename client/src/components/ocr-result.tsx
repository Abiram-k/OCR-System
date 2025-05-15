import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Check } from "lucide-react"

interface OcrResultsProps {
  results: {
    name: string
    dob: string
    gender: string
    aadhaarNumber: string
    address: string
    fatherName: string
    issueDate: string
  }
  frontImage: string
  backImage: string
}

export default function OcrResults({ results, frontImage, backImage }: OcrResultsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center">
        <Check className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
        <p className="text-green-800 dark:text-green-400">OCR processing completed successfully</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative h-48 w-full">
          <img
            src={frontImage || "/placeholder.svg"}
            alt="Front side of Aadhaar card"
            // fill
            className="object-contain rounded-lg border"
          />
        </div>
        <div className="relative h-48 w-full">
          <img
            src={backImage || "/placeholder.svg"}
            alt="Back side of Aadhaar card"
            // fill
            className="object-contain rounded-lg border"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Extracted Information</CardTitle>
          <CardDescription>Information extracted from your Aadhaar card</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Name" value={results.name} />
              <InfoItem label="Date of Birth" value={results.dob} />
              <InfoItem label="Gender" value={results.gender} />
              <InfoItem label="Aadhaar Number" value={results.aadhaarNumber} />
              <InfoItem label="Father's Name" value={results.fatherName} />
              <InfoItem label="Issue Date" value={results.issueDate} />
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Address</h3>
              <p className="text-sm p-3 bg-muted rounded-md">{results.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium">{label}</h3>
      <p className="text-sm p-3 bg-muted rounded-md">{value}</p>
    </div>
  )
}
