
import React, { KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, Send } from 'lucide-react';

interface ChatInputProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  onSendMessage: () => void;
  onFileUpload?: () => void;
  extraActions?: React.ReactNode;
}

const ChatInput: React.FC<ChatInputProps> = ({
  currentMessage,
  setCurrentMessage,
  onSendMessage,
  onFileUpload,
  extraActions
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentMessage.trim()) {
        onSendMessage();
      }
    }
  };

  return (
    <div className="border-t border-gray-200 p-3">
      <div className="flex items-end gap-2">
        <textarea
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-grow resize-none rounded-lg border border-gray-300 p-2 h-10 min-h-[40px] max-h-[120px] focus:outline-none focus:ring-1 focus:ring-protega-500"
          rows={1}
        />
        
        <div className="flex items-center">
          {extraActions}
          
          {onFileUpload && (
            <Button 
              variant="ghost"
              className="text-protega-600 hover:text-protega-700"
              onClick={onFileUpload}
            >
              <Paperclip className="h-5 w-5" />
              <span className="sr-only">Attach file</span>
            </Button>
          )}
          
          <Button 
            className={`bg-protega-600 hover:bg-protega-700 ml-1 ${!currentMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onSendMessage}
            disabled={!currentMessage.trim()}
          >
            <Send className="h-4 w-4 mr-1" />
            <span className="sr-only md:not-sr-only md:inline-block">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
