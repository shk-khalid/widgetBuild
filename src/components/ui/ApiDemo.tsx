
import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

const ApiDemo = () => {
  const [activeTab, setActiveTab] = useState<'request' | 'response'>('request');
  const [copied, setCopied] = useState(false);

  const requestCode = `POST /api/v1/recommendations
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "customer_id": "cus_1234567890",
  "purchase_data": {
    "items": [
      {
        "product_id": "prod_123",
        "name": "iPhone 13",
        "price": 79900,
        "category": "electronics"
      }
    ],
    "total_amount": 79900,
    "currency": "INR"
  },
  "platform": "shopify",
  "region": "IN"
}`;

  const responseCode = `{
  "success": true,
  "recommendations": [
    {
      "id": "ins_123",
      "name": "Screen Protection",
      "description": "Covers accidental damage to screen for 1 year",
      "price": 1299,
      "currency": "INR",
      "coverage_period": "1 year",
      "confidence_score": 0.92
    },
    {
      "id": "ins_124",
      "name": "Extended Warranty",
      "description": "Extends manufacturer warranty by 1 year",
      "price": 3999,
      "currency": "INR",
      "coverage_period": "1 year",
      "confidence_score": 0.85
    }
  ]
}`;

  const copyToClipboard = () => {
    const textToCopy = activeTab === 'request' ? requestCode : responseCode;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex bg-protego-50 border-b border-protego-100">
        <button 
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'request' 
              ? 'bg-white text-protego-800 border-r border-protego-100' 
              : 'text-protego-600 hover:text-protego-800 hover:bg-white/50'
          }`}
          onClick={() => setActiveTab('request')}
        >
          Request
        </button>
        <button 
          className={`px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'response' 
              ? 'bg-white text-protego-800' 
              : 'text-protego-600 hover:text-protego-800 hover:bg-white/50'
          }`}
          onClick={() => setActiveTab('response')}
        >
          Response
        </button>
        <div className="ml-auto px-4 py-2">
          <button 
            className="text-protego-600 hover:text-protego-800 p-1 rounded transition-colors"
            onClick={copyToClipboard}
            aria-label="Copy to clipboard"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>
      <pre className="p-4 text-xs sm:text-sm overflow-x-auto bg-white text-gray-800 font-mono">
        {activeTab === 'request' ? requestCode : responseCode}
      </pre>
    </div>
  );
};

export default ApiDemo;
