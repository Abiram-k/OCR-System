import axios from "axios";
import { toast } from "sonner";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const useProcessAdhaar = async (front: File, back: File) => {
  try {
    console.log("From process hook: ", front, back);
    const formData = new FormData();
    formData.append("frontImage", front);
    formData.append("backImage", back);
    console.log(SERVER_URL);
    const respose = await axios.post(
      `${SERVER_URL}/process-aadhaar`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    toast.success("Data processed");
    return respose.data;
  } catch (error) {
    console.log("Error fetching data: ", error);
    toast.error("Failed to process data");
  }
};

export default useProcessAdhaar;
