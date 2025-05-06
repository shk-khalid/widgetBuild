
import React, { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { extractClaimDataFromOCR } from '@/lib/ocrExtraction';

interface FileUploadHandlerProps {
  onFileProcessed: (response: any, files: File[], analysisType: 'ocr' | 'damage') => void;
  analysisType?: 'ocr' | 'damage';
  children?: React.ReactNode;
}

const FileUploadHandler: React.FC<FileUploadHandlerProps> = ({ 
  onFileProcessed,
  analysisType = 'ocr',
  children 
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;
    
    setIsProcessing(true);
    const newFiles = Array.from(uploadedFiles);
    
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      try {
        const file = imageFiles[0];
        const reader = new FileReader();
        
        reader.onload = async (e) => {
          if (e.target?.result) {
            const imageBase64 = e.target.result.toString();
            
            try {
              // Use the new unified analysis endpoint
              console.log("Calling unified-analysis endpoint");
              const responseData = await supabase.functions.invoke('unified-analysis', {
                body: { imageBase64 }
              });
              
              console.log("Unified analysis response:", responseData);
              
              if (responseData.error) {
                throw new Error(responseData.error.message || "Image analysis failed");
              }
              
              if (responseData.data) {
                const data = responseData.data;
                let actualAnalysisType: 'ocr' | 'damage' = data.analysisType || analysisType;
                
                // If the detected type doesn't match the requested type, show a toast
                if (analysisType !== actualAnalysisType) {
                  if (actualAnalysisType === 'ocr' && analysisType === 'damage') {
                    toast({
                      title: "This looks like an invoice",
                      description: "This image appears to be a document, not a damage photo. Processing as invoice instead.",
                      variant: "default"
                    });
                  } else if (actualAnalysisType === 'damage' && analysisType === 'ocr') {
                    toast({
                      title: "Analyzing as damage photo",
                      description: "The uploaded image contains little text and appears to be a product photo. Analyzing for damage instead.",
                      variant: "default"
                    });
                  }
                }
                
                // Process the OCR response and extract structured data if it's an OCR request
                if (actualAnalysisType === 'ocr' && data.text) {
                  if (!data.extractedFields) {
                    data.extractedFields = extractClaimDataFromOCR(data.text);
                    console.log("Extracted data from OCR:", data.extractedFields);
                  }
                }
                
                onFileProcessed(responseData, newFiles, actualAnalysisType);
              } else {
                onFileProcessed({ data: { success: true } }, newFiles, analysisType);
              }
            } catch (error) {
              console.error(`Image processing error:`, error);
              toast({
                title: `Error processing image`,
                description: `There was a problem analyzing your image: ${error}. Please try again.`,
                variant: "destructive"
              });
              onFileProcessed({ error: `Error processing image: ${error}` }, newFiles, analysisType);
            } finally {
              setIsProcessing(false);
            }
          }
        };
        
        reader.onerror = () => {
          toast({
            title: "Error reading file",
            description: "There was a problem reading your file. Please try again.",
            variant: "destructive"
          });
          onFileProcessed({ error: "Error reading file" }, newFiles, analysisType);
          setIsProcessing(false);
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("File processing error:", error);
        toast({
          title: "Error processing file",
          description: "There was a problem processing your file. Please try again.",
          variant: "destructive"
        });
        onFileProcessed({ error: "Error processing file" }, newFiles, analysisType);
        setIsProcessing(false);
      }
    } else {
      onFileProcessed({ data: { text: "Non-image file received", success: true } }, newFiles, analysisType);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        className="hidden"
        accept={analysisType === 'ocr' ? "image/*,application/pdf" : "image/*"}
        disabled={isProcessing}
      />
      {children}
    </>
  );
};

export default FileUploadHandler;
