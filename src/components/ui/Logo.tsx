
import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center ${className}`}
    >
      <img 
        src="/lovable-uploads/0492ecb9-b0b1-4fed-805f-28570fbe50ef.png" 
        alt="Protega Logo" 
        className="h-10 w-auto" 
        width="180"
        height="40"
        loading="eager"
      />
    </motion.div>
  );
};

export default Logo;
