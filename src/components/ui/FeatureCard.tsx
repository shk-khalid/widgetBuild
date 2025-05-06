
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="glass-card p-6 flex flex-col items-start transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="bg-gradient-to-r from-protega-600 to-protega-400 p-3 rounded-lg mb-4">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-protega-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
