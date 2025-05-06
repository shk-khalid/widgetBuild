
import React from 'react';
import { Bot } from 'lucide-react';

interface ChatHeaderProps {
  title?: string;
  centered?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  title = "Protega Claims Assistant",
  centered = false
}) => {
  return (
    <div className={`bg-protega-600 text-white p-4 flex items-center ${centered ? 'justify-center' : 'justify-between'} flex-shrink-0`}>
      <div className="flex items-center">
        <Bot size={20} className="mr-2" />
        <h3 className="font-medium">{title}</h3>
      </div>
    </div>
  );
};

export default ChatHeader;
