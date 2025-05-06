
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IndustryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const IndustryCard: React.FC<IndustryCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="glass-card p-6 flex flex-col transition-all duration-300 hover:shadow-glow group">
      <div className="bg-gradient-to-r from-protego-100 to-white p-3 rounded-lg mb-4 group-hover:bg-gradient-to-r group-hover:from-protego-200 group-hover:to-protego-100 transition-all duration-300">
        <Icon className="h-6 w-6 text-protego-700" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-protego-800">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <div className="mt-4">
        <a href="#" className="text-sm font-medium text-protego-600 hover:text-protego-700 transition-colors inline-flex items-center">
          Learn more
          <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default IndustryCard;
