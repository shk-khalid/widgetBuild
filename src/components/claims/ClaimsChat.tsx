import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, Paperclip, Camera, Bot, Send, FileText, XCircle, CheckCircle, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { ClaimType } from '@/types/claims';
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const uuidv4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

interface ClaimsChatProps {
  policyId?: string;
  claimType?: ClaimType;
  onComplete: (data: any) => void;
}

type ChatMessage = {
  id: string;
  type: 'system' | 'user' | 'bot';
  content: string | React.ReactNode;
  timestamp: Date;
  isLoading?: boolean;
};

type UploadedFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
};

const ClaimsChat: React.FC<ClaimsChatProps> = ({ policyId, claimType, onComplete }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [processingFile, setProcessingFile] = useState(false);
  const [selectedClaimType, setSelectedClaimType] = useState<ClaimType | undefined>(claimType);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [claimData, setClaimData] = useState<any>({
    policyId: policyId || '',
    claimType: claimType || '',
    claimId: `CLM-${uuidv4().substring(0, 8)}`,
    status: 'draft',
  });
  
  const [ocrText, setOcrText] = useState<string>('');
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [showOcrPreview, setShowOcrPreview] = useState(false);
  const [extractedFields, setExtractedFields] = useState({
    name: '',
    email: '',
    phone: '',
    productName: '',
    purchaseDate: '',
    reason: ''
  });
  const [claimReasons, setClaimReasons] = useState<{[key in ClaimType]: string[]}>({
    shipping: ['Lost Package', 'Damaged in Transit', 'Wrong Delivery', 'Delayed Shipment', 'Other'],
    product: ['Hardware Failure', 'Screen Damage', 'Battery Issue', 'Water Damage', 'Other']
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    initializeChat();
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const initializeChat = async () => {
    const initialMessages: ChatMessage[] = [
      {
        id: '1',
        type: 'bot',
        content: 'Hello! I\'m your Protega AI Claims Assistant. I\'ll help you file a claim quickly and easily.',
        timestamp: new Date(),
      }
    ];
    
    setMessages(initialMessages);
    
    setTimeout(() => {
      if (selectedClaimType) {
        sendBotMessage(`I'll help you file a ${selectedClaimType === "shipping" ? "shipping protection" : "product protection"} claim. First, please upload an image of your invoice, damaged item, or shipping label.`);
        setCurrentStep(3);
      } else {
        sendBotMessage('To get started, please select the type of claim you want to file:');
        setCurrentStep(1);
      }
    }, 1000);
  };
  
  const sendUserMessage = (message: string | React.ReactNode) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };
  
  const sendBotMessage = (message: string | React.ReactNode, delay = 500) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: message,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, delay);
  };
  
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendUserMessage(inputValue);
      
      const userInput = inputValue.trim();
      processUserInput(userInput);
      
      setInputValue('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const processImageWithOCR = async (file: File): Promise<string> => {
  try {
    setIsOcrLoading(true);
    setOcrError(null);

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        if (!event.target || typeof event.target.result !== 'string') {
          reject('Failed to read file');
          return;
        }

        const base64Image = event.target.result;
        console.log("Prepared base64 (preview):", base64Image.substring(0, 100));
        console.log("Calling Supabase Edge Function at: https://gogkxnaluennuwgzebyz.supabase.co/functions/v1/unified-analysis");

        try {
          const response = await fetch('https://gogkxnaluennuwgzebyz.supabase.co/functions/v1/unified-analysis', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageBase64: base64Image }),
          });

          console.log("Got response:", response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error text:", errorText);
            throw new Error(`OCR failed with status: ${response.status}`);
          }

          const data = await response.json();
          console.log("OCR result:", data);

          if (!data.success) {
            resolve(data.text || 'Analysis failed or image unclear.');
            return;
          }

          if (data.mode === 'ocr') {
            resolve(data.text || 'No text detected in the image.');
          } else if (data.mode === 'damage') {
            const damageSummary = data.damages.map(d => `• ${d.type} (${d.severity})`).join('\n');
            resolve(`Detected possible damage:\n${damageSummary}`);
          } else {
            resolve('No clear result found.');
          }

        } catch (error) {
          console.error('OCR processing error:', error);
          reject(error instanceof Error ? error.message : 'OCR processing failed');
        }
      };

      reader.onerror = () => {
        reject('Error reading file');
      };

      reader.readAsDataURL(file);
    });

  } catch (error) {
    console.error('Error in processImageWithOCR:', error);
    throw error;
  } finally {
    setIsOcrLoading(false);
  }
};
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    setProcessingFile(true);
    
    try {
      if (files.length > 0) {
        try {
          sendUserMessage(
            <div className="flex flex-col space-y-2">
              <p>I've uploaded {files.length} file(s) for OCR processing:</p>
              {files.map((file, index) => (
                <span key={index} className="text-sm text-gray-600">{file.name}</span>
              ))}
            </div>
          );
          
          sendBotMessage(
            <div className="flex flex-col space-y-2">
              <p>I'm analyzing your document with AI...</p>
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-500">This may take a few seconds</span>
              </div>
            </div>
          );
          
          const extractedText = await processImageWithOCR(files[0]);
          setOcrText(extractedText);
          
          if (extractedText.includes("No text could be detected") || 
              extractedText.includes("blank") || 
              extractedText.includes("too dark") ||
              extractedText.includes("Invalid image")) {
            
            sendBotMessage(
              <div className="space-y-3">
                <p className="text-amber-600 font-medium">{extractedText}</p>
                <p>Please try uploading a clearer image with readable text. Good images include:</p>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  <li>Clear photos of receipts or invoices</li>
                  <li>Shipping labels with tracking information</li>
                  <li>Clear photos of the damaged product</li>
                </ul>
                <div className="flex space-x-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    Try Again
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => moveToNextStep(4)}
                  >
                    Continue Manually
                  </Button>
                </div>
              </div>
            );
            
            setExtractedFields({
              name: '',
              email: '',
              phone: '',
              productName: '',
              purchaseDate: '',
              reason: ''
            });
            
            const newFiles: UploadedFile[] = files.map(file => ({
              id: Date.now().toString() + Math.random().toString(36).substring(7),
              name: file.name,
              type: file.type,
              size: file.size,
              url: URL.createObjectURL(file)
            }));
            
            setUploadedFiles(prev => [...prev, ...newFiles]);
            return;
          }
          
          const extractedInfo = {
            name: extractNameFromText(extractedText) || '',
            email: extractEmailFromText(extractedText) || '',
            phone: extractPhoneFromText(extractedText) || '',
            productName: extractProductFromText(extractedText) || '',
            purchaseDate: extractDateFromText(extractedText) || '',
            reason: ''
          };
          
          setExtractedFields(extractedInfo);
          
          const suggestedType = determineClaimTypeFromText(extractedText);
          if (suggestedType && !selectedClaimType) {
            setSelectedClaimType(suggestedType);
            setClaimData(prev => ({ ...prev, claimType: suggestedType }));
          }
          
          const newFiles: UploadedFile[] = files.map(file => ({
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file)
          }));
          
          setUploadedFiles(prev => [...prev, ...newFiles]);
          
          setShowOcrPreview(true);
          
          if (extractedInfo.productName || extractedInfo.purchaseDate || suggestedType) {
            sendBotMessage(
              <div className="space-y-3">
                <p>I've analyzed your document and extracted the following information:</p>
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-green-700 font-medium">AI-Extracted Information</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs"
                      onClick={() => setShowOcrPreview(true)}
                    >
                      View Details
                    </Button>
                  </div>
                  {extractedInfo.productName && (
                    <p className="text-sm"><span className="font-medium">Product:</span> {extractedInfo.productName}</p>
                  )}
                  {extractedInfo.purchaseDate && (
                    <p className="text-sm"><span className="font-medium">Date:</span> {extractedInfo.purchaseDate}</p>
                  )}
                  {(suggestedType && !selectedClaimType) && (
                    <p className="text-sm mt-1 text-green-700">
                      <span className="font-medium">Suggested claim type:</span> {suggestedType === 'shipping' ? 'Shipping Protection' : 'Product Protection'}
                    </p>
                  )}
                </div>
                <p>Would you like to continue with these details?</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => moveToNextStep(4)}
                  >
                    Continue
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOcrText('');
                      setExtractedFields({
                        name: '',
                        email: '',
                        phone: '',
                        productName: '',
                        purchaseDate: '',
                        reason: ''
                      });
                      sendBotMessage("Let's try again. Please upload another document.");
                    }}
                  >
                    Try Another Document
                  </Button>
                </div>
              </div>,
              1000
            );
          } else {
            sendBotMessage(
              <div className="space-y-3">
                <p>I couldn't extract specific information from your document. Let's continue with manual entry.</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => moveToNextStep(4)}
                  >
                    Continue Manually
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                      sendBotMessage("Let's try again. Please upload another document with clearer text.");
                    }}
                  >
                    Try Another Document
                  </Button>
                </div>
              </div>
            );
          }
        } catch (error) {
          console.error('OCR processing error:', error);
          setOcrError(error instanceof Error ? error.message : 'OCR processing failed');
          
          sendBotMessage(
            <div className="space-y-2">
              <p className="text-red-600">I couldn't process the image properly. Would you like to:</p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                    sendBotMessage("Let's try again. Please upload another document.");
                  }}
                >
                  Try Again
                </Button>
                <Button
                  size="sm"
                  onClick={() => moveToNextStep(4)}
                >
                  Continue Manually
                </Button>
              </div>
            </div>
          );
        }
      }
      
    } catch (error) {
      console.error('Error handling file upload:', error);
      sendBotMessage("Sorry, there was an error processing your file. Please try again or continue without OCR.");
    } finally {
      setProcessingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const extractNameFromText = (text: string): string | null => {
    const nameMatch = text.match(/([A-Z][a-z]+ [A-Z][a-z]+)/);
    return nameMatch ? nameMatch[0] : null;
  };
  
  const extractEmailFromText = (text: string): string | null => {
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return emailMatch ? emailMatch[0] : null;
  };
  
  const extractPhoneFromText = (text: string): string | null => {
    const phoneMatch = text.match(/(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    return phoneMatch ? phoneMatch[0] : null;
  };
  
  const extractProductFromText = (text: string): string | null => {
    const productLines = text.split('\n')
      .filter(line => 
        line.includes('product') || 
        line.includes('item') || 
        line.includes('model') ||
        (line.length > 10 && /[A-Z0-9]/.test(line))
      );
    
    return productLines.length > 0 ? productLines[0].trim() : null;
  };
  
  const extractDateFromText = (text: string): string | null => {
    const dateMatch = text.match(/\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/);
    return dateMatch ? dateMatch[0] : null;
  };
  
  const determineClaimTypeFromText = (text: string): ClaimType | null => {
    const lowerText = text.toLowerCase();
    
    if (
      lowerText.includes('shipping') || 
      lowerText.includes('delivery') || 
      lowerText.includes('courier') || 
      lowerText.includes('package') ||
      lowerText.includes('tracking') ||
      lowerText.includes('shipment')
    ) {
      return 'shipping';
    }
    
    if (
      lowerText.includes('damage') || 
      lowerText.includes('broken') || 
      lowerText.includes('defect') || 
      lowerText.includes('warranty') ||
      lowerText.includes('repair') ||
      lowerText.includes('faulty')
    ) {
      return 'product';
    }
    
    return null;
  };
  
  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };
  
  const processUserInput = (input: string) => {
    if (currentStep === 2 && !policyId) {
      setClaimData(prev => ({ ...prev, policyId: input }));
    } else if (currentStep === 4 && selectedClaimType === "shipping") {
      setClaimData(prev => ({ ...prev, issueType: input }));
    } else if (currentStep === 4 && selectedClaimType === "product") {
      setClaimData(prev => ({ ...prev, damageDescription: input }));
    } else if (currentStep === 5 && selectedClaimType === "shipping") {
      setClaimData(prev => ({ ...prev, description: input }));
    } else if (currentStep === 5 && selectedClaimType === "product") {
      setClaimData(prev => ({ ...prev, productCategory: input }));
    } else if (currentStep === 6 && selectedClaimType === "product") {
      setClaimData(prev => ({ ...prev, serialNumber: input }));
    } else if (currentStep === 7) {
      setClaimData(prev => ({ ...prev, additionalInfo: input }));
    }
    
    setTimeout(() => {
      moveToNextStep();
    }, 1000);
  };
  
  const handleClaimTypeSelection = (type: ClaimType) => {
    setSelectedClaimType(type);
    setClaimData(prev => ({ ...prev, claimType: type }));
    
    sendUserMessage(`I want to file a ${type === "shipping" ? "shipping protection" : "product protection"} claim`);
    
    sendBotMessage(`Great! I'll help you file a ${type === "shipping" ? "shipping protection" : "product protection"} claim.`);
    
    setTimeout(() => {
      sendBotMessage(
        <div>
          <p>Please upload an image of your {type === "shipping" ? "shipping label or delivery confirmation" : "product and damage or invoice"}. I'll use AI to extract information automatically.</p>
          <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, PDF</p>
        </div>
      );
      moveToNextStep(3);
    }, 1500);
  };
  
  const moveToNextStep = (specificStep?: number) => {
    const nextStep = specificStep !== undefined ? specificStep : currentStep + 1;
    setCurrentStep(nextStep);
    
    if (nextStep === 3) {
      if (selectedClaimType === "shipping") {
        sendBotMessage(
          <div>
            <p>Please upload your order invoice or delivery confirmation. Our AI will extract the details automatically.</p>
            <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, JPG, PNG</p>
          </div>
        );
      } else {
        sendBotMessage(
          <div>
            <p>Please upload at least 2 photos of the damaged product. Our AI will analyze them to help with your claim.</p>
            <p className="text-xs text-gray-500 mt-1">Accepted formats: JPG, PNG, WEBP</p>
          </div>
        );
      }
    } else if (nextStep === 4) {
      sendBotMessage(
        <div className="space-y-4">
          <p>Please complete or correct your claim details below:</p>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="claimType">Claim Type</Label>
              <Select 
                value={selectedClaimType} 
                onValueChange={(value: ClaimType) => {
                  setSelectedClaimType(value);
                  setClaimData(prev => ({ ...prev, claimType: value }));
                }}
              >
                <SelectTrigger id="claimType">
                  <SelectValue placeholder="Select claim type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shipping">Shipping Protection</SelectItem>
                  <SelectItem value="product">Product Protection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                value={extractedFields.name} 
                onChange={(e) => setExtractedFields(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your full name"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={extractedFields.email} 
                onChange={(e) => setExtractedFields(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Your email address"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={extractedFields.phone} 
                onChange={(e) => setExtractedFields(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Your phone number"
              />
            </div>
            
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input 
                id="productName" 
                value={extractedFields.productName} 
                onChange={(e) => setExtractedFields(prev => ({ ...prev, productName: e.target.value }))}
                placeholder="Product name"
              />
            </div>
            
            <div>
              <Label htmlFor="purchaseDate">Date of Purchase/Shipment</Label>
              <Input 
                id="purchaseDate" 
                value={extractedFields.purchaseDate} 
                onChange={(e) => setExtractedFields(prev => ({ ...prev, purchaseDate: e.target.value }))}
                placeholder="DD/MM/YYYY"
              />
            </div>
            
            <div>
              <Label htmlFor="reason">Reason for Claim</Label>
              <Select 
                value={extractedFields.reason} 
                onValueChange={(value) => setExtractedFields(prev => ({ ...prev, reason: value }))}
              >
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  {selectedClaimType && claimReasons[selectedClaimType].map(reason => (
                    <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="additionalDetails">Additional Details</Label>
              <Textarea 
                id="additionalDetails" 
                rows={4}
                placeholder="Please provide any additional details that might help with your claim"
                onChange={(e) => setClaimData(prev => ({ ...prev, additionalDetails: e.target.value }))}
              />
            </div>
            
            <Button
              onClick={() => {
                setClaimData(prev => ({ 
                  ...prev, 
                  name: extractedFields.name,
                  email: extractedFields.email,
                  phone: extractedFields.phone,
                  productName: extractedFields.productName,
                  purchaseDate: extractedFields.purchaseDate,
                  reason: extractedFields.reason
                }));
                moveToNextStep(8);
              }}
            >
              Submit Claim
            </Button>
          </div>
        </div>
      );
    } else if (nextStep === 8) {
      const fileUrls = uploadedFiles.map(file => file.url);
      setClaimData(prev => ({ ...prev, uploadedFiles: fileUrls }));
      
      const summaryContent = (
        <div className="space-y-4">
          <p className="font-medium">Here's a summary of your claim:</p>
          
          <div className="bg-gray-50 rounded-md p-3 space-y-3">
            <div>
              <p className="text-xs text-gray-500">Claim ID</p>
              <p className="text-sm font-medium">{claimData.claimId}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Claim Type</p>
              <p className="text-sm font-medium">{selectedClaimType === "shipping" ? "Shipping Protection" : "Product Protection"}</p>
            </div>
            
            {extractedFields.name && (
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="text-sm">{extractedFields.name}</p>
              </div>
            )}
            
            {extractedFields.productName && (
              <div>
                <p className="text-xs text-gray-500">Product</p>
                <p className="text-sm">{extractedFields.productName}</p>
              </div>
            )}
            
            {extractedFields.reason && (
              <div>
                <p className="text-xs text-gray-500">Reason</p>
                <p className="text-sm">{extractedFields.reason}</p>
              </div>
            )}
            
            <div>
              <p className="text-xs text-gray-500">Uploaded Files</p>
              <p className="text-sm">{uploadedFiles.length} file(s)</p>
            </div>
          </div>
          
          <p>Is this information correct? If so, click the button below to submit your claim.</p>
        </div>
      );
      
      sendBotMessage(summaryContent);
      
      setTimeout(() => {
        const confirmButton = (
          <Button 
            className="mt-2" 
            onClick={async () => {
            sendBotMessage(
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Submitting your claim...</span>
              </div>
            );
            
            const saved = await saveClaimToDatabase();
            
            if (saved) {
              const completedClaimData = {
                ...claimData,
                name: extractedFields.name,
                email: extractedFields.email,
                phone: extractedFields.phone,
                productName: extractedFields.productName,
                purchaseDate: extractedFields.purchaseDate,
                reason: extractedFields.reason,
                status: 'received'
              };
              
              onComplete(completedClaimData);
              
              sendBotMessage(
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Your claim has been submitted successfully!</span>
                  </div>
                  <p>Claim ID: <span className="font-medium">{claimData.claimId}</span></p>
                  <p className="text-sm text-gray-600">We'll send you updates about your claim status via email. You can also check the status in your dashboard.</p>
                </div>
              );
            } else {
              sendBotMessage(
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-amber-600">
                    <span className="font-medium">There was an issue submitting your claim.</span>
                  </div>
                  <p className="text-sm text-gray-600">Don't worry, we've saved your information. Please try again or contact customer support for assistance.</p>
                  <Button 
                    onClick={() => finalizeClaimSubmission()}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              );
            }
          }}
          >
            Submit Claim
          </Button>
        );
        
        sendBotMessage(confirmButton);
      }, 1000);
    }
  };
  
  const saveClaimToDatabase = async () => {
    try {
      const claimForStorage = {
        id: claimData.claimId,
        user_email: extractedFields.email,
        user_name: extractedFields.name,
        user_phone: extractedFields.phone,
        claim_type: selectedClaimType,
        product_name: extractedFields.productName,
        purchase_date: extractedFields.purchaseDate,
        reason: extractedFields.reason,
        additional_details: claimData.additionalDetails || '',
        ocr_text: ocrText,
        policy_id: policyId || claimData.policyId,
        status: 'received',
        submitted_at: new Date().toISOString(),
        files: uploadedFiles.map(file => file.url),
      };
      
      const { error } = await supabase
        .from('claims')
        .insert([claimForStorage]);
      
      if (error) {
        console.error('Error saving claim:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in saveClaimToDatabase:', error);
      return false;
    }
  };
  
  const finalizeClaimSubmission = () => {
    const fileUrls = uploadedFiles.map(file => file.url);
    setClaimData(prev => ({ ...prev, uploadedFiles: fileUrls }));
    
    const summaryContent = (
      <div className="space-y-4">
        <p className="font-medium">Here's a summary of your claim:</p>
        
        <div className="bg-gray-50 rounded-md p-3 space-y-3">
          <div>
            <p className="text-xs text-gray-500">Claim ID</p>
            <p className="text-sm font-medium">{claimData.claimId}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500">Claim Type</p>
            <p className="text-sm font-medium">{selectedClaimType === "shipping" ? "Shipping Protection" : "Product Protection"}</p>
          </div>
          
          {extractedFields.name && (
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="text-sm">{extractedFields.name}</p>
            </div>
          )}
          
          {extractedFields.productName && (
            <div>
              <p className="text-xs text-gray-500">Product</p>
              <p className="text-sm">{extractedFields.productName}</p>
            </div>
          )}
          
          {extractedFields.reason && (
            <div>
              <p className="text-xs text-gray-500">Reason</p>
              <p className="text-sm">{extractedFields.reason}</p>
            </div>
          )}
          
          <div>
            <p className="text-xs text-gray-500">Uploaded Files</p>
            <p className="text-sm">{uploadedFiles.length} file(s)</p>
          </div>
        </div>
        
        <p>Is this information correct? If so, click the button below to submit your claim.</p>
      </div>
    );
    
    sendBotMessage(summaryContent);
    
    setTimeout(() => {
      const confirmButton = (
        <Button 
          className="mt-2" 
          onClick={async () => {
            sendBotMessage(
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Submitting your claim...</span>
              </div>
            );
            
            const saved = await saveClaimToDatabase();
            
            if (saved) {
              const completedClaimData = {
                ...claimData,
                name: extractedFields.name,
                email: extractedFields.email,
                phone: extractedFields.phone,
                productName: extractedFields.productName,
                purchaseDate: extractedFields.purchaseDate,
                reason: extractedFields.reason,
                status: 'received'
              };
              
              onComplete(completedClaimData);
              
              sendBotMessage(
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Your claim has been submitted successfully!</span>
                  </div>
                  <p>Claim ID: <span className="font-medium">{claimData.claimId}</span></p>
                  <p className="text-sm text-gray-600">We'll send you updates about your claim status via email. You can also check the status in your dashboard.</p>
                </div>
              );
            } else {
              sendBotMessage(
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-amber-600">
                    <span className="font-medium">There was an issue submitting your claim.</span>
                  </div>
                  <p className="text-sm text-gray-600">Don't worry, we've saved your information. Please try again or contact customer support for assistance.</p>
                  <Button 
                    onClick={() => finalizeClaimSubmission()}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              );
            }
          }}
        >
          Submit Claim
        </Button>
      );
      
      sendBotMessage(confirmButton);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col bg-white border rounded-lg overflow-hidden h-[70vh]">
      <div className="p-4 border-b bg-gray-50 flex items-center space-x-2">
        <Bot className="h-5 w-5 text-protega-600" />
        <div>
          <h3 className="font-medium text-sm">AI Claims Assistant</h3>
          <p className="text-xs text-gray-500">Let me help you file your claim</p>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-protega-600 text-white' 
                    : message.type === 'system'
                    ? 'bg-gray-100 text-gray-700 italic text-sm'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {message.type !== 'user' && (
                  <div className="flex items-center mb-2">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src="/lovable-uploads/a80d6a3a-ef68-42cf-93c8-50834c3e9997.png" />
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">Protega AI</span>
                  </div>
                )}
                <div>{message.content}</div>
                <div className="text-xs opacity-70 mt-1 text-right">
                  {format(message.timestamp, 'p')}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-700">
                <div className="flex items-center mb-2">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src="/lovable-uploads/a80d6a3a-ef68-42cf-93c8-50834c3e9997.png" />
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">Protega AI</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 1 && !selectedClaimType && (
            <div className="flex justify-start">
              <div className="max-w-[80%] w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <Card 
                    className="cursor-pointer hover:border-protega-600 transition-colors"
                    onClick={() => handleClaimTypeSelection("shipping")}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <Upload className="h-8 w-8 text-blue-600 mb-2" />
                      <h3 className="font-medium">Shipping Protection</h3>
                      <p className="text-xs text-gray-500 mt-1">For lost, damaged, or stolen packages</p>
                    </CardContent>
                  </Card>
                  
                  <Card 
                    className="cursor-pointer hover:border-protega-600 transition-colors"
                    onClick={() => handleClaimTypeSelection("product")}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <Shield className="h-8 w-8 text-green-600 mb-2" />
                      <h3 className="font-medium">Product Protection</h3>
                      <p className="text-xs text-gray-500 mt-1">For damaged or defective products</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="flex justify-start">
              <div className="max-w-[80%] w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={selectedClaimType === "shipping" ? ".pdf,.jpg,.jpeg,.png" : ".jpg,.jpeg,.png,.webp"}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={processingFile || isOcrLoading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {(processingFile || isOcrLoading) ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Paperclip className="h-4 w-4 mr-2" />
                      {selectedClaimType === "shipping" 
                        ? "Upload Invoice or Confirmation" 
                        : "Upload Product Photos"}
                    </>
                  )}
                </Button>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map(file => (
                      <div key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                        <div className="flex items-center">
                          {file.type.includes('image') ? (
                            <Camera className="h-4 w-4 mr-2 text-gray-500" />
                          ) : (
                            <FileText className="h-4 w-4 mr-2 text-gray-500" />
                          )}
                          <span className="truncate max-w-[150px]">{file.name}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0" 
                          onClick={() => removeFile(file.id)}
                        >
                          <XCircle className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isTyping || processingFile || currentStep === 1 || currentStep === 3 || isOcrLoading}
          />
          <Button
            type="submit"
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping || processingFile || currentStep === 1 || currentStep === 3 || isOcrLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Dialog open={showOcrPreview} onOpenChange={setShowOcrPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI-Extracted Details (editable)</DialogTitle>
            <DialogDescription>
              Review and edit the information extracted from your document
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="ocrText">Extracted Text</Label>
              <Textarea
                id="ocrText"
                className="font-mono text-xs h-48"
                value={ocrText}
                onChange={(e) => setOcrText(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={extractedFields.name}
                  onChange={(e) => setExtractedFields(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={extractedFields.email}
                  onChange={(e) => setExtractedFields(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={extractedFields.phone}
                  onChange={(e) => setExtractedFields(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={extractedFields.productName}
                  onChange={(e) => setExtractedFields(prev => ({ ...prev, productName: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="purchaseDate">Purchase/Shipment Date</Label>
                <Input
                  id="purchaseDate"
                  value={extractedFields.purchaseDate}
                  onChange={(e) => setExtractedFields(prev => ({ ...prev, purchaseDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowOcrPreview(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowOcrPreview(false);
                moveToNextStep(4);
              }}>
                Save & Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClaimsChat;
