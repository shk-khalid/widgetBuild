import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Calendar, FileText, Package, Truck } from 'lucide-react';
import Header from '../../components/Header';
import { Claim, mockClaims } from '../../mockData/claims';

const ClaimDetail: React.FC = () => {
  const { claimId } = useParams<{ claimId: string }>();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaimDetails = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        const foundClaim = mockClaims.find(c => c.id === claimId);
        if (!foundClaim) throw new Error('Claim not found');
        setClaim(foundClaim);
      } catch (err) {
        setError('Failed to load claim details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClaimDetails();
  }, [claimId]);

  const getStatusBadgeClass = (status: Claim['status']) => {
    switch (status) {
      case 'pending':
        return 'tw-bg-amber-50 tw-text-amber-700 tw-ring-1 tw-ring-amber-600/20';
      case 'approved':
        return 'tw-bg-emerald-50 tw-text-emerald-700 tw-ring-1 tw-ring-emerald-600/20';
      case 'rejected':
        return 'tw-bg-rose-50 tw-text-rose-700 tw-ring-1 tw-ring-rose-600/20';
      default:
        return 'tw-bg-gray-100 tw-text-gray-800';
    }    
  };

  const getClaimTypeIcon = (type: Claim['type']) => {
    switch (type) {
      case 'shipping':
        return <Truck className="tw-h-5 tw-w-5" />;
      case 'product':
        return <Package className="tw-h-5 tw-w-5" />;
      case 'both':
        return <FileText className="tw-h-5 tw-w-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="tw-min-h-screen tw-bg-gray-50/50"
    >
      <Header isStorefront={false} />
      
      <main className="tw-container tw-mx-auto tw-px-4 tw-py-8">
        <div className="tw-max-w-4xl tw-mx-auto">
          <Link
            to="/merchant/claims"
            className="tw-inline-flex tw-items-center tw-gap-2 tw-text-gray-600 hover:tw-text-gray-900 tw-mb-6"
          >
            <ArrowLeft className="tw-h-4 tw-w-4" />
            <span>Back to Claims</span>
          </Link>

          {error && (
            <div className="tw-mb-6 tw-p-4 tw-bg-rose-50 tw-border tw-border-rose-200 tw-rounded-lg tw-flex tw-items-center tw-text-rose-700">
              <AlertCircle className="tw-h-5 tw-w-5 tw-mr-2 tw-flex-shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 tw-p-6">
              <div className="tw-animate-pulse tw-space-y-4">
                <div className="tw-h-8 tw-bg-gray-100 tw-rounded tw-w-1/3" />
                <div className="tw-h-4 tw-bg-gray-100 tw-rounded tw-w-1/4" />
                <div className="tw-h-32 tw-bg-gray-100 tw-rounded" />
              </div>
            </div>
          ) : claim ? (
            <div className="tw-space-y-6">
              <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 tw-p-6">
                <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-items-start tw-gap-6">
                  <div className="tw-flex-1">
                    <div className="tw-flex tw-items-center tw-gap-3 tw-mb-4">
                      <h1 className="tw-text-2xl tw-font-bold tw-text-gray-900">
                        Claim #{claim.id}
                      </h1>
                      <span className={`tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-sm tw-font-medium ${getStatusBadgeClass(claim.status)}`}>
                        {claim.status === 'pending' ? 'Awaiting review...' : claim.status}
                      </span>
                    </div>
                    
                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
                      <div className="tw-space-y-4">
                        <div>
                          <div className="tw-text-sm tw-font-medium tw-text-gray-500">Policy ID</div>
                          <div className="tw-mt-1 tw-text-gray-900">{claim.policyId}</div>
                        </div>
                        
                        <div>
                          <div className="tw-text-sm tw-font-medium tw-text-gray-500">Created At</div>
                          <div className="tw-mt-1 tw-flex tw-items-center tw-gap-2 tw-text-gray-900">
                            <Calendar className="tw-h-4 tw-w-4 tw-text-gray-400" />
                            {new Date(claim.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="tw-space-y-4">
                        <div>
                          <div className="tw-text-sm tw-font-medium tw-text-gray-500">Type</div>
                          <div className="tw-mt-1 tw-flex tw-items-center tw-gap-2 tw-text-gray-900">
                            {getClaimTypeIcon(claim.type)}
                            <span className="tw-capitalize">{claim.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 tw-p-6">
                <h2 className="tw-text-lg tw-font-semibold tw-text-gray-900 tw-mb-4">Description</h2>
                <p className="tw-text-gray-700 tw-whitespace-pre-wrap">{claim.description}</p>
              </div>

              {claim.evidence.length > 0 && (
                <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 tw-p-6">
                  <h2 className="tw-text-lg tw-font-semibold tw-text-gray-900 tw-mb-4">Evidence</h2>
                  <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                    {claim.evidence.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tw-block tw-group"
                      >
                        <div className="tw-relative tw-aspect-video tw-rounded-lg tw-overflow-hidden">
                          <img
                            src={url}
                            alt={`Evidence ${index + 1}`}
                            className="tw-w-full tw-h-full tw-tw-object-cover tw-transition-transform group-hover:tw-scale-105"
                          />
                          <div className="tw-absolute tw-inset-0 tw-bg-black/0 group-hover:tw-bg-black/10 tw-transition-colors" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 tw-p-6 tw-text-center">
              <p className="tw-text-gray-500">Claim not found</p>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default ClaimDetail;