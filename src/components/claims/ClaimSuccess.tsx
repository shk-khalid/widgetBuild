
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface ClaimSuccessProps {
  claimId: string;
  onStartOver: () => void;
  onDone: () => void;
}

const ClaimSuccess: React.FC<ClaimSuccessProps> = ({ 
  claimId, 
  onStartOver, 
  onDone 
}) => {
  return (
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
      <p className="mt-4">Your claim ID is <span className="font-medium">{claimId}</span>. You can use this to check the status of your claim at any time.</p>
      <p className="mt-2">We'll also send you email updates as your claim progresses. Is there anything else you need help with today?</p>
      <div className="mt-4 flex gap-3">
        <Button 
          variant="outline" 
          className="border-protega-200 text-protega-700"
          onClick={onStartOver}
        >
          Start Over
        </Button>
        <Button 
          variant="ghost" 
          className="text-protega-700"
          onClick={onDone}
        >
          Done
        </Button>
      </div>
    </div>
  );
};

export default ClaimSuccess;
