
import React, { useState } from 'react';
import { ClipboardCheck, Plus, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import EnhancedClaimsChat from './EnhancedClaimsChat';

type Claim = {
  id: string;
  policyId: string;
  product: string;
  type: string;
  amount: string;
  date: string;
  status: string;
};

type CustomerData = {
  activePolicies: Array<{
    id: string;
    name: string;
    product: string;
    premium: string;
    startDate: string;
    endDate: string;
    status: string;
  }>;
  claims: Claim[];
};

interface CustomClaimsSectionProps {
  customerData: CustomerData;
  setActiveTab: (tab: string) => void;
}

const CustomClaimsSection: React.FC<CustomClaimsSectionProps> = ({ customerData, setActiveTab }) => {
  const { toast } = useToast();
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [claims, setClaims] = useState<Claim[]>(customerData.claims);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | undefined>(undefined);
  
  const handleClaimSubmitted = (claimData: any) => {
    // Create a new claim from the submitted data
    const newClaim: Claim = {
      id: claimData.claimId,
      policyId: claimData.policyId,
      product: customerData.activePolicies.find(p => p.id === claimData.policyId)?.product || "Unknown Product",
      type: claimData.claimType,
      amount: "Pending",
      date: new Date().toISOString(),
      status: "submitted"
    };
    
    // Add the new claim to the list
    setClaims(prev => [...prev, newClaim]);
    
    // Show success message
    toast({
      title: "Claim submitted successfully",
      description: `Your claim ID is ${claimData.claimId}`,
    });
    
    // Reset the chat interface
    setShowChatInterface(false);
  };
  
  const startNewClaim = (policyId?: string) => {
    setSelectedPolicyId(policyId);
    setShowChatInterface(true);
  };

  return (
    <div className="grid grid-cols-1 gap-6 max-w-full w-full">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Claims Management</CardTitle>
            <button 
              className="flex items-center px-3 py-1.5 text-sm bg-protega-600 text-white rounded-md hover:bg-protega-700 transition-colors"
              onClick={() => startNewClaim()}
            >
              <Plus className="mr-2 h-4 w-4" /> New Claim
            </button>
          </div>
          <CardDescription>Track and manage your insurance claims</CardDescription>
        </CardHeader>
        <CardContent>
          {showChatInterface ? (
            <div className="space-y-4 w-full">
              <button 
                onClick={() => setShowChatInterface(false)}
                className="text-sm text-protega-600 hover:underline mb-2 flex items-center"
              >
                ← Back to Claims
              </button>
              <div className="w-full max-w-full">
                <EnhancedClaimsChat 
                  policyId={selectedPolicyId} 
                  onComplete={handleClaimSubmitted} 
                />
              </div>
            </div>
          ) : (
            <Tabs defaultValue="active">
              <TabsList className="mb-6">
                <TabsTrigger value="active">Active Claims</TabsTrigger>
                <TabsTrigger value="history">Claims History</TabsTrigger>
              </TabsList>
              <TabsContent value="active">
                {claims.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No Active Claims</h3>
                    <p className="text-sm text-gray-500">You don't have any active claims at the moment</p>
                    <button
                      onClick={() => startNewClaim()}
                      className="mt-4 px-4 py-2 bg-protega-600 text-white rounded-md hover:bg-protega-700 transition-colors"
                    >
                      Start New Claim
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {claims.map((claim) => (
                      <div key={claim.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                          <div className="flex items-center">
                            <ClipboardCheck className="h-5 w-5 text-green-600 mr-2" />
                            <h3 className="font-medium">{claim.type}</h3>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            claim.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            claim.status === 'submitted' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                          </span>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Claim ID</p>
                              <p className="text-sm font-medium">{claim.id}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Policy ID</p>
                              <p className="text-sm">{claim.policyId}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Product</p>
                              <p className="text-sm">{claim.product}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Date Filed</p>
                              <p className="text-sm">{new Date(claim.date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Claim Amount</p>
                              <p className="text-sm font-medium">{claim.amount}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              className="px-3 py-1.5 text-xs bg-protega-600 text-white rounded hover:bg-protega-700 transition-colors"
                              onClick={() => {
                                toast({
                                  title: "Chat support",
                                  description: "Opening chat support for your claim",
                                });
                                startNewClaim();
                              }}
                            >
                              Chat Support
                            </button>
                            <button 
                              className="px-3 py-1.5 text-xs border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                              onClick={() => toast({
                                title: "Claim details",
                                description: "Viewing detailed claim information",
                              })}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="history">
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No Claims History</h3>
                  <p className="text-sm text-gray-500">You don't have any previous claims</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomClaimsSection;
