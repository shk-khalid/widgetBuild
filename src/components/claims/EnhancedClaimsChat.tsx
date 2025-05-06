
import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import FileUploadHandler from './FileUploadHandler';
import { useClaimChat } from '@/hooks/useClaimChat';
import { Button } from '@/components/ui/button';
import { Camera, Upload } from 'lucide-react';

interface EnhancedClaimsChatProps {
  policyId?: string;
  onComplete?: (claimData: any) => void;
  centered?: boolean;
}

const EnhancedClaimsChat: React.FC<EnhancedClaimsChatProps> = ({ 
  policyId, 
  onComplete,
  centered = false
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    currentMessage,
    setCurrentMessage,
    isTyping,
    messagesEndRef,
    fileInputRef,
    handleSendMessage,
    handleOptionSelect,
    handleFileUpload,
    handleFileResponse
  } = useClaimChat({ policyId, onComplete });

  const handleFileProcessed = (response: any, files: File[], analysisType: 'ocr' | 'damage') => {
    console.log(`Processing ${analysisType} response:`, response);
    handleFileUpload(files, analysisType);
    handleFileResponse(response, analysisType);
  };

  return (
    <Card className={`border-protega-100 h-[600px] flex flex-col overflow-hidden ${centered ? 'max-w-xl mx-auto' : 'w-full max-w-full'}`}>
      <ChatHeader centered={centered} />
      
      <CardContent className="p-0 flex-grow flex flex-col overflow-hidden">
        <div 
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto p-4 space-y-4"
        >
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              id={message.id}
              content={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
              options={message.options}
              onOptionSelect={handleOptionSelect}
              isLoading={message.isLoading}
            />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} className="h-0" />
        </div>
        
        {/* Unified file upload handler */}
        <FileUploadHandler
          onFileProcessed={handleFileProcessed}
        >
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,application/pdf"
          />
        </FileUploadHandler>
        
        <ChatInput
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          onSendMessage={handleSendMessage}
          onFileUpload={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
          extraActions={
            <Button 
              variant="ghost"
              className="text-protega-600 hover:text-protega-700"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
            >
              <Camera className="h-5 w-5 mr-1" />
              <span className="sr-only md:not-sr-only md:inline-block">Upload Image</span>
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
};

export default EnhancedClaimsChat;
