import axios, { AxiosError } from "axios";
import { toast } from "sonner";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const useProcessAdhaar = async (front: File, back: File) => {
  try {
    const formData = new FormData();
    formData.append("frontImage", front);
    formData.append("backImage", back);
    const response = await axios.post(
      `${SERVER_URL}/process-aadhaar`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (response.status === 200) {
      toast.success("Data processed");
      return response.data;
    }
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    if (err.response && err.response.data?.error) {
      toast.error(`Error: ${err.response.data.error}`);
    } else if (err.message) {
      toast.error(`Error: ${err.message}`);
    } else {
      toast.error("An unknown error occurred");
    }

    console.error("Error fetching data: ", err);
  }
};

export default useProcessAdhaar;
