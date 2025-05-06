
export type ClaimType = 'shipping' | 'product';

export type ClaimStatus = 'received' | 'under_review' | 'approved' | 'rejected' | 'pending';

export interface Claim {
  id: string;
  policyId: string;
  product: string;
  type: ClaimType;
  claimType: string;
  amount: string;
  date: string;
  status: ClaimStatus;
  details: {
    productCategory?: string;
    purchaseDate?: string;
    damageDate?: string;
    issueType?: string;
    serialNumber?: string;
    aiConfidence?: number;
    recommendedAction?: string;
    uploadedFiles?: string[];
    orderNumber?: string;
    trackingNumber?: string;
    courierPartner?: string;
  };
}

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  activePolicies: {
    id: string;
    name: string;
    product: string;
    premium: string;
    startDate: string;
    endDate: string;
    status: string;
    type: ClaimType;
  }[];
  claims: Claim[];
  recentOrders: {
    id: string;
    date: string;
    items: string[];
    amount: string;
    insurance: string;
  }[];
}
