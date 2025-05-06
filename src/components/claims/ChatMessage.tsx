
import React from 'react';
import { Bot, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Option {
  label: string;
  value: string;
}

interface ChatMessageProps {
  id: string;
  content: string | React.ReactNode;
  timestamp: Date;
  sender: 'user' | 'bot';
  options?: Option[];
  onOptionSelect?: (option: Option) => void;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  sender,
  timestamp,
  options,
  onOptionSelect,
  isLoading
}) => {
  return (
    <div
      className={cn(
        "flex",
        sender === 'user' ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "rounded-lg px-4 py-3 max-w-[80%]",
          sender === 'user' 
            ? "bg-protega-600 text-white"
            : "bg-gray-100"
        )}
      >
        <div className="flex items-start gap-2">
          {sender === 'bot' && (
            <Bot size={18} className="mt-1 text-protega-600 flex-shrink-0" />
          )}
          <div>
            {content}
            
            {options && options.length > 0 && (
              <div className="mt-3 space-y-2">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => onOptionSelect && onOptionSelect(option)}
                    className="block w-full text-left px-3 py-2 rounded bg-white border border-gray-200 hover:bg-protega-50 hover:border-protega-200 transition-colors"
                  >
                    <div className="flex items-center">
                      <ChevronRight size={14} className="mr-2 text-protega-500 flex-shrink-0" />
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-right mt-1">
          <span className={cn(
            "text-xs",
            sender === 'user' ? "text-protega-100" : "text-gray-500"
          )}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
