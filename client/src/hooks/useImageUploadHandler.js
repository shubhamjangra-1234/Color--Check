import { useImageUpload } from './useImageUpload';
import { useTextExtraction } from './useTextExtraction';
import { imageService } from '../services/api';

export const useImageUploadHandler = (setFirstImage, setExtractedText, setIsAnalyzing) => {
  const { uploadImage } = useImageUpload();
  const { extractText } = useTextExtraction();

  const handleUpload = async (file) => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setIsAnalyzing(true);
    setFirstImage(URL.createObjectURL(file));

    try {
      const uploadResponse = await uploadImage(file);
      const imageUrl = uploadResponse.image;

      // Extract text using Tesseract.js
      const text = await extractText(file);
      setExtractedText(text);

      setFirstImage(`${imageService.baseURL}/Images/${imageUrl}`);
    } catch (error) {
      console.error("Error during upload:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { handleUpload };
};
