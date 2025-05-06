export interface Claim {
  id: string;
  policyId: string;
  type: 'shipping' | 'product' | 'both';
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  evidence: string[];
}

export const mockClaims: Claim[] = [
  {
    id: 'CLM001',
    policyId: 'POL123456',
    type: 'shipping',
    description: 'Package was damaged during transit. The outer box was crushed and contents were affected.',
    status: 'pending',
    createdAt: '2024-02-15T10:30:00Z',
    evidence: [
      'https://images.pexels.com/photos/2874751/pexels-photo-2874751.jpeg',
      'https://images.pexels.com/photos/5025669/pexels-photo-5025669.jpeg'
    ]
  },
  {
    id: 'CLM002',
    policyId: 'POL789012',
    type: 'product',
    description: 'Received defective product. The screen shows vertical lines and doesn\'t function properly.',
    status: 'approved',
    createdAt: '2024-02-14T15:45:00Z',
    evidence: [
      'https://images.pexels.com/photos/1476321/pexels-photo-1476321.jpeg'
    ]
  },
  {
    id: 'CLM003',
    policyId: 'POL345678',
    type: 'both',
    description: 'Late delivery and product doesn\'t match description. Color is different from what was advertised.',
    status: 'rejected',
    createdAt: '2024-02-13T09:15:00Z',
    evidence: [
      'https://images.pexels.com/photos/4439425/pexels-photo-4439425.jpeg',
      'https://images.pexels.com/photos/4439444/pexels-photo-4439444.jpeg'
    ]
  },
  {
    id: 'CLM004',
    policyId: 'POL456789',
    type: 'shipping',
    description: 'Package never arrived at the destination despite tracking showing delivery.',
    status: 'pending',
    createdAt: '2024-02-16T11:20:00Z',
    evidence: [
      'https://images.pexels.com/photos/2553651/pexels-photo-2553651.jpeg'
    ]
  },
  {
    id: 'CLM005',
    policyId: 'POL567890',
    type: 'product',
    description: 'The delivered item is of a different model and brand than what was ordered.',
    status: 'approved',
    createdAt: '2024-02-17T13:00:00Z',
    evidence: [
      'https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg'
    ]
  },
  {
    id: 'CLM006',
    policyId: 'POL678901',
    type: 'both',
    description: 'Received broken item and packaging was severely damaged.',
    status: 'rejected',
    createdAt: '2024-02-18T08:40:00Z',
    evidence: [
      'https://images.pexels.com/photos/4968394/pexels-photo-4968394.jpeg',
      'https://images.pexels.com/photos/4968396/pexels-photo-4968396.jpeg'
    ]
  },
  {
    id: 'CLM007',
    policyId: 'POL789123',
    type: 'shipping',
    description: 'Wrong item delivered and original item is marked as returned.',
    status: 'pending',
    createdAt: '2024-02-19T14:25:00Z',
    evidence: [
      'https://images.pexels.com/photos/5025500/pexels-photo-5025500.jpeg'
    ]
  },
  {
    id: 'CLM008',
    policyId: 'POL890123',
    type: 'product',
    description: 'Product stopped working within 2 days of delivery.',
    status: 'approved',
    createdAt: '2024-02-20T12:10:00Z',
    evidence: [
      'https://images.pexels.com/photos/1051075/pexels-photo-1051075.jpeg'
    ]
  },
  {
    id: 'CLM009',
    policyId: 'POL901234',
    type: 'both',
    description: 'Product packaging was tampered with and item appears used.',
    status: 'rejected',
    createdAt: '2024-02-21T17:35:00Z',
    evidence: [
      'https://images.pexels.com/photos/1054713/pexels-photo-1054713.jpeg',
      'https://images.pexels.com/photos/1054716/pexels-photo-1054716.jpeg'
    ]
  },
  {
    id: 'CLM010',
    policyId: 'POL012345',
    type: 'shipping',
    description: 'Delay in delivery caused the product to miss a critical deadline.',
    status: 'approved',
    createdAt: '2024-02-22T09:50:00Z',
    evidence: [
      'https://images.pexels.com/photos/5025653/pexels-photo-5025653.jpeg'
    ]
  }
];
