
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Paperclip, Check, Camera } from 'lucide-react';
import { Option } from '@/components/claims/ChatMessage';
import { 
  formatExtractedDataSummary 
} from '@/lib/ocrExtraction';
import { 
  formatDamageAnalysisSummary,
  getDamageRecommendation 
} from '@/lib/damageAnalysis';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string | React.ReactNode;
  timestamp: Date;
  isLoading?: boolean;
  options?: Option[];
}

interface UseClaimChatProps {
  policyId?: string;
  onComplete?: (claimData: any) => void;
}

export const useClaimChat = ({ policyId, onComplete }: UseClaimChatProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [claimType, setClaimType] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [claimDetails, setClaimDetails] = useState<Record<string, any>>({
    policyId: policyId || '',
    claimId: `CLM-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
    claimType: '',
    status: 'draft',
    timestamp: new Date(),
    extractedData: {},
    damageAnalysis: {}
  });

  const insuranceTypes = [
    { label: 'Device Protection', value: 'device' },
    { label: 'Lost Shipment', value: 'shipment' },
    { label: 'Travel Delay', value: 'travel' },
    { label: 'Fashion Item Damage', value: 'fashion' },
    { label: 'Cyber Fraud', value: 'cyber' },
    { label: 'Other', value: 'other' }
  ];

  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: 'init',
      sender: 'bot',
      content: 'Hi there! I\'m your Protega Claims Assistant. How can I help you today?',
      timestamp: new Date(),
      options: [
        { label: 'File a new claim', value: 'new_claim' },
        { label: 'Check claim status', value: 'check_status' },
        { label: 'Get help with existing claim', value: 'help' }
      ]
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const addBotResponse = (content: string | React.ReactNode, options?: Option[]) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          content,
          timestamp: new Date(),
          options
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const addUserMessage = (content: string | React.ReactNode) => {
    if (typeof content === 'string' && !content.trim()) return;
    
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        content,
        timestamp: new Date()
      }
    ]);
    
    if (typeof content === 'string') {
      setCurrentMessage('');
    }
  };

  const handleFileUpload = (files: File[], analysisType: 'ocr' | 'damage') => {
    setUploadedFiles(prev => [...prev, ...files]);
    
    addUserMessage(
      <div className="flex flex-col">
        <span>I've uploaded {analysisType === 'ocr' ? 'invoice/receipt' : 'damage photo'}:</span>
        <ul className="list-disc pl-5 mt-1">
          {files.map((file, index) => (
            <li key={index} className="text-sm">
              {file.name}
            </li>
          ))}
        </ul>
      </div>
    );
    
    setMessages(prev => [
      ...prev,
      {
        id: `bot-processing-${Date.now()}`,
        sender: 'bot',
        content: (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-protega-600 border-t-transparent"></div>
            <span>Processing your {analysisType === 'ocr' ? 'invoice' : 'damage photo'}...</span>
          </div>
        ),
        timestamp: new Date(),
        isLoading: true
      }
    ]);
  };

  const handleFileResponse = (response: any, analysisType: 'ocr' | 'damage') => {
    setMessages(prev => prev.filter(msg => !msg.isLoading));
    
    if (response.error) {
      toast({
        title: `Error processing image`,
        description: response.error.message || "An error occurred processing your image",
        variant: "destructive"
      });
      
      addBotResponse(
        <div>
          <p className="text-amber-600 font-medium">Error processing your image:</p>
          <p className="mt-2">{response.error.message || "Unknown error occurred"}</p>
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            className="mt-3 bg-protega-600 hover:bg-protega-700"
          >
            Upload a Different Image
          </Button>
        </div>
      );
      return;
    }
    
    if (response.data) {
      const data = response.data;
      
      // Auto-detected analysis type
      const detectedAnalysisType = data.analysisType || analysisType;
      
      if (detectedAnalysisType === 'ocr') {
        // Handle OCR response
        const { text, confidence, success, extractedFields } = data;
        
        if (extractedFields) {
          setClaimDetails(prev => ({
            ...prev,
            extractedData: extractedFields,
            invoiceNumber: extractedFields.invoiceNumber || prev.invoiceNumber,
            customerName: extractedFields.customerName || prev.customerName,
            productName: extractedFields.productName || prev.productName,
            purchaseDate: extractedFields.date || prev.purchaseDate,
            amount: extractedFields.amount || prev.amount
          }));
        }
        
        if (!success || confidence < 0.3) {
          addBotResponse(
            <div>
              <p className="text-amber-600 font-medium">I couldn't process this invoice properly.</p>
              <p className="mt-2">{text}</p>
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="mt-3 bg-protega-600 hover:bg-protega-700"
              >
                Upload a Different Image
              </Button>
            </div>
          );
        } else {
          const formattedExtractedData = extractedFields ? 
            formatExtractedDataSummary(extractedFields) : 
            "No structured data could be extracted.";
          
          const nextStepContent = currentStep === 3 ? (
            <div className="mt-3">
              <p>Now, please upload photos of the damaged product.</p>
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="mt-3 flex items-center gap-2 bg-protega-600 hover:bg-protega-700"
              >
                <Camera size={16} />
                Upload Damage Photos
              </Button>
            </div>
          ) : null;
          
          addBotResponse(
            <div>
              <p>I've processed your invoice and extracted the following information:</p>
              {extractedFields && Object.keys(extractedFields).length > 0 ? (
                <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                  <h4 className="font-medium text-sm mb-2">Extracted details:</h4>
                  <pre className="text-sm whitespace-pre-line">{formattedExtractedData}</pre>
                </div>
              ) : null}
              <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                <h4 className="font-medium text-sm mb-2">Full OCR text:</h4>
                <p className="text-sm whitespace-pre-line">{text}</p>
              </div>
              {nextStepContent}
              {currentStep === 3 && !nextStepContent && (
                <Button onClick={moveToNextStep} className="mt-3 bg-protega-600 hover:bg-protega-700">
                  Continue
                </Button>
              )}
            </div>
          );
          
          if (currentStep === 3 && nextStepContent) {
            setCurrentStep(4);
          }
        }
      } else {
        // Handle damage analysis response
        const { damages, confidence, success } = data;
        
        setClaimDetails(prev => ({
          ...prev,
          damageAnalysis: data
        }));
        
        if (!success || confidence < 0.3) {
          addBotResponse(
            <div>
              <p className="text-amber-600 font-medium">I couldn't analyze the damage properly.</p>
              <p className="mt-2">Please upload a clearer image of the damaged area.</p>
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="mt-3 bg-protega-600 hover:bg-protega-700"
              >
                Upload a Different Photo
              </Button>
            </div>
          );
        } else {
          const formattedDamageAnalysis = damages ? 
            formatDamageAnalysisSummary(data) : 
            "No damage analysis could be generated.";
          
          const recommendation = getDamageRecommendation(data);
          
          addBotResponse(
            <div>
              <p>I've analyzed your damage photos and identified the following:</p>
              {damages && damages.length > 0 ? (
                <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                  <h4 className="font-medium text-sm mb-2">Damage analysis:</h4>
                  <pre className="text-sm whitespace-pre-line">{formattedDamageAnalysis}</pre>
                </div>
              ) : null}
              
              <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                <h4 className="font-medium text-sm mb-1 text-blue-800">Recommendation:</h4>
                <p className="text-sm text-blue-700">{recommendation}</p>
              </div>
              
              {currentStep === 4 && (
                <Button onClick={moveToNextStep} className="mt-3 bg-protega-600 hover:bg-protega-700">
                  Continue
                </Button>
              )}
            </div>
          );
        }
      }
    } else {
      addBotResponse(
        <div>
          <p>Thanks for uploading those files. I've received them and they will be processed as part of your claim.</p>
          {currentStep === (analysisType === 'ocr' ? 3 : 4) && (
            <Button 
              onClick={moveToNextStep} 
              className="mt-3 bg-protega-600 hover:bg-protega-700"
            >
              Continue
            </Button>
          )}
        </div>
      );
    }
  };

  const handleOptionSelect = (option: Option) => {
    addUserMessage(option.label);
    processOption(option);
  };

  const processOption = (option: Option) => {
    if (currentStep === 0) {
      if (option.value === 'new_claim') {
        setCurrentStep(1);
        addBotResponse(
          <div>
            <p>I'd be happy to help you file a new claim. First, let me know what type of insurance claim you're filing:</p>
          </div>,
          insuranceTypes
        );
      } else if (option.value === 'check_status') {
        addBotResponse(
          <div>
            <p>To check the status of your claim, please enter your claim ID or policy number:</p>
          </div>
        );
      } else if (option.value === 'help') {
        addBotResponse(
          <div>
            <p>I'll do my best to help with your existing claim. Please provide your claim ID and describe what you need help with:</p>
          </div>
        );
      }
    } else if (currentStep === 1) {
      setClaimType(option.value);
      setClaimDetails(prev => ({ ...prev, claimType: option.value }));
      setCurrentStep(2);
      
      if (option.value === 'device') {
        addBotResponse(
          <div>
            <p>I understand you're filing a claim for device protection. Please tell me:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>What happened to your device?</li>
              <li>When did the incident occur?</li>
            </ol>
          </div>
        );
      } else if (option.value === 'shipment') {
        addBotResponse(
          <div>
            <p>I'm sorry to hear about your lost shipment. Please provide:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Order number</li>
              <li>Date of purchase</li>
              <li>Shipping carrier (if known)</li>
            </ol>
          </div>
        );
      } else if (option.value === 'travel') {
        addBotResponse(
          <div>
            <p>For your travel delay claim, I'll need the following:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Booking reference/ticket number</li>
              <li>Original travel date and time</li>
              <li>Length of delay</li>
            </ol>
          </div>
        );
      } else {
        addBotResponse(
          <div>
            <p>Please describe the incident that led to this claim, including when it happened and any relevant details:</p>
          </div>
        );
      }
    }
  };

  const moveToNextStep = () => {
    if (currentStep === 2) {
      setCurrentStep(3);
      addBotResponse(
        <div>
          <p>Thank you for those details. Now, please upload your invoice or receipt showing the purchase of the item:</p>
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            className="mt-3 flex items-center gap-2 bg-protega-600 hover:bg-protega-700"
          >
            <Paperclip size={16} />
            Upload Invoice
          </Button>
        </div>
      );
    } else if (currentStep === 3) {
      setCurrentStep(4);
      addBotResponse(
        <div>
          <p>Now, please upload photos of the damaged product:</p>
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            className="mt-3 flex items-center gap-2 bg-protega-600 hover:bg-protega-700"
          >
            <Camera size={16} />
            Upload Damage Photos
          </Button>
        </div>
      );
    } else if (currentStep === 4) {
      setCurrentStep(5);
      addBotResponse(
        <div>
          <p>I've compiled a summary of your claim:</p>
          <div className="bg-protega-50 p-4 rounded-md mt-3 border border-protega-100">
            <h4 className="font-medium text-protega-800">Claim Summary</h4>
            <ul className="mt-2 space-y-1">
              <li><span className="font-medium">Claim ID:</span> {claimDetails.claimId}</li>
              <li><span className="font-medium">Claim Type:</span> {insuranceTypes.find(t => t.value === claimType)?.label}</li>
              {claimDetails.extractedData.invoiceNumber && (
                <li><span className="font-medium">Invoice:</span> {claimDetails.extractedData.invoiceNumber}</li>
              )}
              {claimDetails.extractedData.productName && (
                <li><span className="font-medium">Product:</span> {claimDetails.extractedData.productName}</li>
              )}
              {claimDetails.extractedData.date && (
                <li><span className="font-medium">Purchase Date:</span> {claimDetails.extractedData.date}</li>
              )}
              {claimDetails.extractedData.amount && (
                <li><span className="font-medium">Amount:</span> {claimDetails.extractedData.amount}</li>
              )}
              <li><span className="font-medium">Files Uploaded:</span> {uploadedFiles.length}</li>
              <li><span className="font-medium">Policy ID:</span> {claimDetails.policyId || 'Not specified'}</li>
            </ul>
            
            {claimDetails.damageAnalysis && claimDetails.damageAnalysis.damages && claimDetails.damageAnalysis.damages.length > 0 && (
              <div className="mt-3 pt-3 border-t border-protega-200">
                <h4 className="font-medium text-protega-800">Damage Assessment</h4>
                <ul className="mt-1 space-y-1">
                  {claimDetails.damageAnalysis.damages.slice(0, 3).map((damage: any, index: number) => (
                    <li key={index}>
                      <span className="font-medium">{damage.type}:</span> {damage.severity} severity
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <p className="mt-3">Is this information correct? Would you like to submit this claim?</p>
          <div className="flex gap-3 mt-3">
            <Button 
              onClick={handleSubmitClaim} 
              className="bg-protega-600 hover:bg-protega-700"
            >
              Submit Claim
            </Button>
            <Button 
              variant="outline" 
              className="border-protega-200 text-protega-700"
              onClick={() => addBotResponse("What would you like to change about your claim?")}
            >
              Make Changes
            </Button>
          </div>
        </div>
      );
    }
  };

  const handleSubmitClaim = () => {
    setClaimDetails(prev => ({ ...prev, status: 'submitted' }));
    addBotResponse(
      <div>
        <div className="bg-green-50 p-4 rounded-md border border-green-200 flex items-start gap-3">
          <div className="mt-1">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-medium text-green-800">Claim Successfully Submitted</h4>
            <p className="text-green-700 text-sm mt-1">
              Your claim has been successfully submitted and is now being processed.
            </p>
          </div>
        </div>
        <p className="mt-4">Your claim ID is <span className="font-medium">{claimDetails.claimId}</span>. You can use this to check the status of your claim at any time.</p>
        <p className="mt-2">We'll also send you email updates as your claim progresses. Is there anything else you need help with today?</p>
        <div className="mt-4 flex gap-3">
          <Button 
            variant="outline" 
            className="border-protega-200 text-protega-700"
            onClick={() => {
              setMessages([{
                id: 'init-new',
                sender: 'bot',
                content: 'How else can I assist you today?',
                timestamp: new Date(),
                options: [
                  { label: 'File another claim', value: 'new_claim' },
                  { label: 'Check claim status', value: 'check_status' },
                  { label: 'I\'m all done', value: 'done' }
                ]
              }]);
              setCurrentStep(0);
              setUploadedFiles([]);
            }}
          >
            Start Over
          </Button>
          <Button 
            variant="ghost" 
            className="text-protega-700"
            onClick={() => {
              if (onComplete) {
                onComplete(claimDetails);
              }
            }}
          >
            Done
          </Button>
        </div>
      </div>
    );
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    addUserMessage(currentMessage);
    
    if (currentStep === 2) {
      setClaimDetails(prev => ({ ...prev, description: currentMessage }));
      moveToNextStep();
    } else {
      addBotResponse(
        <div>
          <p>Thank you for that information. Is there anything else you'd like to add?</p>
        </div>
      );
    }
  };

  return {
    messages,
    currentMessage,
    setCurrentMessage,
    isTyping,
    claimType,
    claimDetails,
    uploadedFiles,
    currentStep,
    messagesEndRef,
    fileInputRef,
    addBotResponse,
    addUserMessage,
    handleFileUpload,
    handleFileResponse,
    handleOptionSelect,
    handleSendMessage,
    moveToNextStep,
    handleSubmitClaim
  };
};
