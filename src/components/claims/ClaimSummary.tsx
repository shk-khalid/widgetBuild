
import React from 'react';
import { Button } from '@/components/ui/button';

interface ClaimSummaryProps {
  claimDetails: Record<string, any>;
  claimType: string;
  files: File[];
  onSubmit: () => void;
  onMakeChanges: () => void;
}

const ClaimSummary: React.FC<ClaimSummaryProps> = ({
  claimDetails,
  claimType,
  files,
  onSubmit,
  onMakeChanges
}) => {
  // Find the claim type label based on its value
  const getClaimTypeLabel = (value: string) => {
    const types = [
      { label: 'Device Protection', value: 'device' },
      { label: 'Lost Shipment', value: 'shipment' },
      { label: 'Travel Delay', value: 'travel' },
      { label: 'Fashion Item Damage', value: 'fashion' },
      { label: 'Cyber Fraud', value: 'cyber' },
      { label: 'Other', value: 'other' }
    ];
    return types.find(t => t.value === value)?.label || value;
  };
  
  return (
    <div>
      <p>I've compiled a summary of your claim:</p>
      <div className="bg-protega-50 p-4 rounded-md mt-3 border border-protega-100">
        <h4 className="font-medium text-protega-800">Claim Summary</h4>
        <ul className="mt-2 space-y-1">
          <li><span className="font-medium">Claim ID:</span> {claimDetails.claimId}</li>
          <li><span className="font-medium">Claim Type:</span> {getClaimTypeLabel(claimType)}</li>
          <li><span className="font-medium">Files Uploaded:</span> {files.length}</li>
          <li><span className="font-medium">Policy ID:</span> {claimDetails.policyId || 'Not specified'}</li>
        </ul>
      </div>
      <p className="mt-3">Is this information correct? Would you like to submit this claim?</p>
      <div className="flex gap-3 mt-3">
        <Button 
          onClick={onSubmit} 
          className="bg-protega-600 hover:bg-protega-700"
        >
          Submit Claim
        </Button>
        <Button 
          variant="outline" 
          className="border-protega-200 text-protega-700"
          onClick={onMakeChanges}
        >
          Make Changes
        </Button>
      </div>
    </div>
  );
};

export default ClaimSummary;
