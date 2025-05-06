
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { FileText, Plus, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import ClaimsChat from './ClaimsChat';
import EnhancedClaimsChat from './EnhancedClaimsChat';
import { ClaimType, ClaimStatus, CustomerData } from '@/types/claims';

interface ClaimsSectionProps {
  customerData: CustomerData;
  setActiveTab: (tab: string) => void;
}

const ClaimsSection: React.FC<ClaimsSectionProps> = ({ customerData, setActiveTab }) => {
  const [selectedClaimType, setSelectedClaimType] = useState<ClaimType | null>(null);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('');
  const [isEnhancedUI, setIsEnhancedUI] = useState(false);

  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'under_review':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Under Review
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'received':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 flex items-center">
            <FileText className="w-3 h-3 mr-1" />
            Received
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const handleNewClaim = (policyId?: string, claimType?: ClaimType) => {
    if (policyId) {
      setSelectedPolicyId(policyId);
    }
    
    if (claimType) {
      setSelectedClaimType(claimType);
    }
    
    setShowClaimDialog(true);
  };

  const handleClaimComplete = (claimData: any) => {
    console.log('Claim submitted:', claimData);
    setShowClaimDialog(false);
    // In a real application, we would refresh the claims data here
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Claims</CardTitle>
            <CardDescription>Track and manage your insurance claims</CardDescription>
          </div>
          <Button onClick={() => handleNewClaim()} className="bg-protega-600 hover:bg-protega-700">
            <Plus className="w-4 h-4 mr-2" /> File New Claim
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Claims</TabsTrigger>
              <TabsTrigger value="product">Product Claims</TabsTrigger>
              <TabsTrigger value="shipping">Shipping Claims</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.claims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-medium">{claim.id}</TableCell>
                        <TableCell>{new Date(claim.date).toLocaleDateString()}</TableCell>
                        <TableCell>{claim.claimType}</TableCell>
                        <TableCell>{claim.product}</TableCell>
                        <TableCell>{claim.amount}</TableCell>
                        <TableCell>{getStatusBadge(claim.status)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {customerData.claims.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          No claims found. Click "File New Claim" to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="product">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.claims.filter(claim => claim.type === "product").map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-medium">{claim.id}</TableCell>
                        <TableCell>{new Date(claim.date).toLocaleDateString()}</TableCell>
                        <TableCell>{claim.claimType}</TableCell>
                        <TableCell>{claim.product}</TableCell>
                        <TableCell>{claim.amount}</TableCell>
                        <TableCell>{getStatusBadge(claim.status)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {customerData.claims.filter(claim => claim.type === "product").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          No product claims found. Click "File New Claim" to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerData.claims.filter(claim => claim.type === "shipping").map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-medium">{claim.id}</TableCell>
                        <TableCell>{new Date(claim.date).toLocaleDateString()}</TableCell>
                        <TableCell>{claim.claimType}</TableCell>
                        <TableCell>{claim.product}</TableCell>
                        <TableCell>{claim.amount}</TableCell>
                        <TableCell>{getStatusBadge(claim.status)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {customerData.claims.filter(claim => claim.type === "shipping").length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          No shipping claims found. Click "File New Claim" to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File a New Claim</CardTitle>
          <CardDescription>Choose the type of claim you want to file</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleNewClaim(undefined, "product")}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Product Protection Claim</h3>
                  <p className="text-sm text-gray-500">For damaged or defective protected products</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleNewClaim(undefined, "shipping")}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Shipping Protection Claim</h3>
                  <p className="text-sm text-gray-500">For lost, stolen or damaged packages</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => setIsEnhancedUI(!isEnhancedUI)}
        >
          {isEnhancedUI ? "Switch to Standard UI" : "Try Enhanced UI"}
        </Button>
      </div>

      {showClaimDialog && (
        <Card>
          <CardHeader>
            <CardTitle>File a New Claim</CardTitle>
            <CardDescription>
              Please provide the details for your {selectedClaimType === "product" ? "product protection" : "shipping protection"} claim
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEnhancedUI ? (
              <EnhancedClaimsChat 
                policyId={selectedPolicyId} 
                onComplete={handleClaimComplete}
              />
            ) : (
              <ClaimsChat 
                policyId={selectedPolicyId} 
                claimType={selectedClaimType || undefined} 
                onComplete={handleClaimComplete} 
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClaimsSection;
