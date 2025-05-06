
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShoppingBag, Smartphone, Plane, Package, CreditCard, Award } from 'lucide-react';

interface CaseStudiesProps {
  showAll?: boolean;
}

const caseStudies = [
  {
    id: 1,
    title: 'Elevated Luxury D2C Conversion',
    industry: 'Fashion & Luxury',
    logo: 'LR',
    icon: ShoppingBag,
    problem: 'High-end fashion retailer faced cart abandonment and customer anxiety over expensive purchases.',
    solution: 'Integrated Protega.ai to offer luxury item protection, damage coverage, and extended warranties.',
    results: [
      'Increased AOV by 22%',
      '15% reduction in returns',
      '28% increase in customer satisfaction'
    ],
    quote: "Protega.ai's luxury protection plans gave our customers the confidence to complete high-value purchases online."
  },
  {
    id: 2,
    title: 'Mobile Device Sales Transformation',
    industry: 'Electronics Retail',
    logo: 'TR',
    icon: Smartphone,
    problem: 'Electronics retailer struggled with thin margins and lacked recurring revenue streams.',
    solution: 'Implemented AI-driven device protection plans based on product value and customer profiles.',
    results: [
      '34% attachment rate for device protection',
      '₹1.2Cr additional monthly revenue',
      '26% increase in repeat purchases'
    ],
    quote: "The personalized protection plans have become our highest-margin product, transforming our business model."
  },
  {
    id: 3,
    title: 'Travel Booking Conversion Boost',
    industry: 'Online Travel Agency',
    logo: 'TB',
    icon: Plane,
    problem: 'Travel OTA wanted to increase conversions and provide peace of mind to travelers.',
    solution: 'Embedded travel insurance with customized coverage based on destination, duration, and activities.',
    results: [
      '41% of customers added travel insurance',
      '19% increase in booking completion',
      '54% reduction in cancellation-related disputes'
    ],
    quote: "The seamless integration of custom travel protection at checkout has been a game-changer for our business."
  },
  {
    id: 4,
    title: 'Shipping Protection Revenue Stream',
    industry: 'E-commerce Marketplace',
    logo: 'EM',
    icon: Package,
    problem: 'Marketplace struggled with shipping damages and customer dissatisfaction.',
    solution: 'Implemented shipping protection across all sellers with automated claims processing.',
    results: [
      '₹45 Lakh monthly additional revenue',
      '72% faster claim resolution',
      '47% reduction in customer support tickets'
    ],
    quote: "Protega.ai's shipping protection has transformed a pain point into a profit center while improving the customer experience."
  },
  {
    id: 5,
    title: 'Fintech Fraud Protection Bundle',
    industry: 'Digital Banking',
    logo: 'DB',
    icon: CreditCard,
    problem: 'Digital bank needed to address customer concerns about online transaction security.',
    solution: 'Embedded cyber insurance, card protection, and digital wallet coverage into account plans.',
    results: [
      '37% increase in premium account sign-ups',
      '28% reduced customer churn',
      '₹2.4Cr additional annual revenue'
    ],
    quote: "Our customers feel more secure knowing they're protected against digital fraud and identity theft."
  },
  {
    id: 6,
    title: 'Premium Product Warranty Program',
    industry: 'Home Appliances',
    logo: 'HA',
    icon: Award,
    problem: 'Appliance retailer faced pressure from manufacturers and wanted to build customer loyalty.',
    solution: 'Created a branded warranty program powered by Protega.ai\'s intelligent pricing engine.',
    results: [
      '44% warranty attachment rate',
      '32% increase in customer lifetime value',
      '3.2x ROI on implementation costs'
    ],
    quote: "Our warranty program has become a key differentiator in a highly competitive market while driving significant revenue."
  }
];

const CaseStudies: React.FC<CaseStudiesProps> = ({ showAll = false }) => {
  const [activeId, setActiveId] = useState<number>(1);
  
  const activeCase = caseStudies.find(cs => cs.id === activeId) || caseStudies[0];
  
  // Display either a grid of all case studies or the interactive viewer
  if (showAll) {
    return (
      <div className="space-y-8">
        {caseStudies.map((study) => (
          <motion.div
            key={study.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: study.id * 0.1 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-protega-600 flex items-center justify-center text-white font-bold mr-4">
                  {study.logo}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-protega-800">{study.title}</h3>
                  <p className="text-sm text-gray-500">{study.industry}</p>
                </div>
              </div>
              <study.icon className="w-8 h-8 text-protega-600" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-lg font-medium mb-2 text-protega-700">Challenge</h4>
                <p className="text-sm text-gray-600">{study.problem}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-2 text-protega-700">Solution</h4>
                <p className="text-sm text-gray-600">{study.solution}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3 text-protega-700">Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {study.results.map((result, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-protega-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{result}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <blockquote className="italic text-gray-600 text-sm">
                "{study.quote}"
              </blockquote>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }
  
  // Original interactive case study viewer
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4 text-protega-800">Case Studies</h3>
          <div className="space-y-2">
            {caseStudies.map((study) => (
              <button
                key={study.id}
                onClick={() => setActiveId(study.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeId === study.id 
                    ? 'bg-protega-100 text-protega-800' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <study.icon className="w-5 h-5 mr-3 text-protega-600" />
                  <div>
                    <h4 className="font-medium text-sm">{study.title}</h4>
                    <p className="text-xs text-gray-500">{study.industry}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-protega-600 flex items-center justify-center text-white font-bold mr-4">
                  {activeCase.logo}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-protega-800">{activeCase.title}</h3>
                  <p className="text-sm text-gray-500">{activeCase.industry}</p>
                </div>
              </div>
              <activeCase.icon className="w-8 h-8 text-protega-600" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-lg font-medium mb-2 text-protega-700">Challenge</h4>
                <p className="text-sm text-gray-600">{activeCase.problem}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-2 text-protega-700">Solution</h4>
                <p className="text-sm text-gray-600">{activeCase.solution}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3 text-protega-700">Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeCase.results.map((result, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-protega-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{result}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <blockquote className="italic text-gray-600 text-sm">
                "{activeCase.quote}"
              </blockquote>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CaseStudies;
