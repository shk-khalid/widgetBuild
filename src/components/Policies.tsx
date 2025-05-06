import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { Search, FileText, Calendar, ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';

interface Policy {
  id: string;
  policyNumber: string;
  productName: string;
  startDate: string;
  endDate: string;
  coverageType: 'shipping' | 'product' | 'both';
  premiumAmount: number;
  currencyCode: string;
  status: 'active' | 'expired' | 'cancelled';
  termsUrl?: string;
}

// Constants for pagination
const PAGE_SIZE_OPTIONS = [6, 9, 12, 24];
const DEFAULT_PAGE_SIZE = 9;

// Integrated Policy Service
const policyService = {
  getPolicies: async (merchantId: string): Promise<Policy[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    return Array.from({ length: 15 }, (_, i) => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 6));

      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);

      const statuses = ['active', 'expired', 'cancelled'] as const;
      const coverageTypes = ['shipping', 'product', 'both'] as const;

      return {
        id: `policy-${i + 1}`,
        policyNumber: `POL-${Math.floor(10000 + Math.random() * 90000)}`,
        productName: [
          'Mobile Protection Plan',
          'Extended Warranty',
          'Accidental Damage Coverage',
          'Travel Insurance',
          'Home Electronics Protection'
        ][Math.floor(Math.random() * 5)],
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        coverageType: coverageTypes[Math.floor(Math.random() * coverageTypes.length)],
        premiumAmount: parseFloat((Math.random() * 100 + 20).toFixed(2)),
        currencyCode: 'USD',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        termsUrl: Math.random() > 0.5 ? 'https://example.com/terms' : undefined
      };
    });
  }
};

const PolicyCard: React.FC<{ policy: Policy }> = ({ policy }) => {
  return (
    <div className="tw-bg-white tw-rounded-xl tw-shadow-sm hover:tw-shadow-md tw-transition-shadow tw-duration-200 tw-p-6">
      <div className="tw-flex tw-justify-between tw-items-start tw-mb-4">
        <div className="tw-flex tw-items-center tw-space-x-3">
          <div className="tw-p-2 tw-bg-protega-50 tw-rounded-lg">
            <FileText className="tw-h-5 tw-w-5 tw-text-protega-600" />
          </div>
          <span className="tw-text-sm tw-font-semibold tw-text-gray-900">{policy.policyNumber}</span>
        </div>
        <span className={`tw-text-xs tw-px-2 tw-py-1 tw-rounded-full ${policy.status === 'active' ? 'tw-bg-green-100 tw-text-green-800' : policy.status === 'expired' ? 'tw-bg-yellow-100 tw-text-yellow-800' : 'tw-bg-red-100 tw-text-red-800'}`}>
          {policy.status}
        </span>
      </div>

      <h3 className="tw-text-lg tw-font-medium tw-text-gray-900 tw-mb-1">{policy.productName}</h3>
      <p className="tw-text-sm tw-text-gray-600 tw-mb-2 tw-capitalize">Coverage: {policy.coverageType}</p>

      <div className="tw-flex tw-items-center tw-text-sm tw-text-gray-600 tw-bg-gray-50 tw-rounded-lg tw-p-2 tw-mb-2">
        <Calendar className="tw-h-4 tw-w-4 tw-text-gray-400 tw-mr-2" />
        <span>{policy.startDate} - {policy.endDate}</span>
      </div>

      <div className="tw-text-sm tw-text-gray-700 tw-mb-1">
        Premium: <strong>{policy.currencyCode} {policy.premiumAmount}</strong>
      </div>

      {policy.termsUrl && (
        <a href={policy.termsUrl} target="_blank" rel="noopener noreferrer" className="tw-text-sm tw-text-blue-600 tw-underline tw-mt-1 tw-inline-block">
          Terms & Conditions
        </a>
      )}
    </div>
  );
};

const Policies: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const fetchedPolicies = await policyService.getPolicies('merchant-123');
        setPolicies(fetchedPolicies);
        setFilteredPolicies(fetchedPolicies);
      } catch (error) {
        console.error('Failed to fetch policies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  useEffect(() => {
    let result = [...policies]; // Create a copy to avoid mutating the original
    const newActiveFilters: string[] = [];

    // Apply filters
    if (statusFilter !== 'all') {
      result = result.filter(policy => policy.status === statusFilter);
      newActiveFilters.push(`Status: ${statusFilter}`);
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(
        policy =>
          policy.policyNumber.toLowerCase().includes(lowercasedTerm) ||
          policy.productName.toLowerCase().includes(lowercasedTerm)
      );
      newActiveFilters.push(`Search: ${searchTerm}`);
    }

    setFilteredPolicies(result);
    setActiveFilters(newActiveFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, [policies, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredPolicies.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPolicies = filteredPolicies.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="tw-min-h-screen tw-bg-gray-50"
    >
      <Header isStorefront={false} />

      <div className="tw-bg-white tw-border-b tw-border-gray-200">
        <div className="tw-container tw-mx-auto tw-px-4 tw-py-8">
          <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center md:tw-justify-between">
            <div>
              <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900">Insurance Policies</h1>
              <p className="tw-text-gray-600 tw-mt-1">View and manage all insurance policies</p>
            </div>
            
            <div className="tw-mt-4 md:tw-mt-0">
              <button className="tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-border tw-border-transparent tw-rounded-md tw-shadow-sm tw-text-sm tw-font-medium tw-text-white tw-bg-protega-600 hover:tw-bg-protega-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-protega-500">
                <Plus className="tw-h-4 tw-w-4 tw-mr-2" />
                New Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="tw-container tw-mx-auto tw-px-4 tw-py-8">
        <div className="tw-bg-white tw-rounded-xl tw-shadow-sm">
          <div className="tw-p-6 tw-border-b tw-border-gray-200">
            <div className="tw-flex tw-flex-col md:tw-flex-row tw-space-y-3 md:tw-space-y-0 md:tw-space-x-4 md:tw-items-center">
              <div className="tw-relative tw-flex-1">
                <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                  <Search className="tw-h-5 tw-w-5 tw-text-gray-400" />
                </div>
                <input
                  type="text"
                  className="tw-block tw-w-full tw-pl-10 tw-pr-3 tw-py-2.5 tw-border tw-border-gray-200 tw-rounded-lg tw-bg-gray-50 tw-text-gray-900 tw-placeholder-gray-500 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-protega-600/20 focus:tw-border-protega-600"
                  placeholder="Search policies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="tw-flex-shrink-0">
                <div className="tw-relative tw-inline-block tw-text-left">
                  <div className="tw-flex tw-items-center">
                    <select
                      className="tw-block tw-w-full tw-py-2.5 tw-px-3 tw-border tw-border-gray-300 tw-bg-white tw-rounded-md tw-shadow-sm focus:tw-outline-none focus:tw-ring-protega-500 focus:tw-border-protega-500 tw-text-sm tw-appearance-none tw-pr-8"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <div className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-px-2 tw-text-gray-700">
                      <svg className="tw-fill-current tw-h-4 tw-w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Active filters */}
            {activeFilters.length > 0 && (
              <div className="tw-mt-4 tw-flex tw-flex-wrap tw-gap-2">
                {activeFilters.map((filter, index) => {
                  const [key, value] = filter.split(': ');
                  return (
                    <div 
                      key={index}
                      className="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-bg-gray-100 tw-text-gray-800 hover:tw-bg-gray-200 tw-transition-colors tw-duration-200 tw-group"
                    >
                      <span className="tw-font-medium tw-text-gray-600 tw-mr-1">{key}:</span>
                      <span>{value}</span>
                      {key === 'Status' && (
                        <button 
                          onClick={() => setStatusFilter('all')}
                          className="tw-ml-1.5 tw-text-gray-500 hover:tw-text-red-500 tw-transition-colors"
                          title="Remove filter"
                        >
                          <X className="tw-h-3 tw-w-3" />
                        </button>
                      )}
                      {key === 'Search' && (
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="tw-ml-1.5 tw-text-gray-500 hover:tw-text-red-500 tw-transition-colors"
                          title="Remove filter"
                        >
                          <X className="tw-h-3 tw-w-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
                
                <button
                  onClick={resetFilters}
                  className="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-bg-rose-50 tw-text-rose-700 hover:tw-bg-rose-100 tw-transition-colors tw-duration-200"
                >
                  <X className="tw-h-3 tw-w-3 tw-mr-1" />
                  Clear All
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="tw-p-6">
              <div className="tw-animate-pulse tw-space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="tw-h-32 tw-bg-gray-100 tw-rounded-xl"></div>
                ))}
              </div>
            </div>
          ) : filteredPolicies.length === 0 ? (
            <div className="tw-p-12 tw-text-center">
              <div className="tw-mx-auto tw-w-12 tw-h-12 tw-rounded-full tw-bg-gray-100 tw-flex tw-items-center tw-justify-center tw-mb-4">
                <FileText className="tw-h-6 tw-w-6 tw-text-gray-400" />
              </div>
              <h3 className="tw-text-lg tw-font-medium tw-text-gray-900">No policies found</h3>
              <p className="tw-mt-2 tw-text-sm tw-text-gray-500 tw-max-w-sm tw-mx-auto">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter to find what you\'re looking for.'
                  : 'Get started by creating a new policy.'}
              </p>
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={resetFilters}
                  className="tw-mt-4 tw-inline-flex tw-items-center tw-px-3 tw-py-2 tw-border tw-border-transparent tw-text-sm tw-leading-4 tw-font-medium tw-rounded-md tw-text-protega-700 tw-bg-protega-100 hover:tw-bg-protega-200 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-protega-500"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="tw-p-6 tw-grid tw-gap-4 tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3">
              {paginatedPolicies.map(policy => (
                <PolicyCard key={policy.id} policy={policy} />
              ))}
            </div>
          )}

          {filteredPolicies.length > 0 && (
            <div className="tw-px-6 tw-py-4 tw-bg-gray-50 tw-border-t tw-border-gray-100 tw-rounded-b-xl">
              <div className="tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-items-center tw-gap-4">
                <div className="tw-text-sm tw-text-gray-600">
                  Showing <span className="tw-font-medium tw-text-gray-900">{startIndex + 1}</span> to{' '}
                  <span className="tw-font-medium tw-text-gray-900">
                    {Math.min(startIndex + pageSize, filteredPolicies.length)}
                  </span>{' '}
                  of <span className="tw-font-medium tw-text-gray-900">{filteredPolicies.length}</span> policies
                </div>
                
                <div className="tw-flex tw-items-center tw-gap-4">
                  <div className="tw-flex tw-items-center tw-gap-2">
                    <span className="tw-text-sm tw-text-gray-500">Show</span>
                    <select
                      value={pageSize}
                      onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                      className="tw-border tw-border-gray-200 tw-rounded-md tw-text-sm tw-py-1 tw-px-2"
                    >
                      {PAGE_SIZE_OPTIONS.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  
                  {totalPages > 1 && (
                    <nav className="tw-isolate tw-inline-flex tw--space-x-px tw-rounded-md tw-shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`tw-relative tw-inline-flex tw-items-center tw-rounded-l-md tw-px-2 tw-py-2 tw-text-gray-400 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50 focus:tw-z-20 focus:tw-outline-offset-0 ${
                          currentPage === 1 ? 'tw-cursor-not-allowed' : 'hover:tw-text-gray-700'
                        }`}
                      >
                        <span className="tw-sr-only">Previous</span>
                        <ChevronLeft className="tw-h-5 tw-w-5" aria-hidden="true" />
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold ${
                              pageNumber === currentPage
                                ? 'tw-z-10 tw-bg-protega-600 tw-text-white focus:tw-z-20 focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-protega-600'
                                : 'tw-text-gray-900 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50 focus:tw-z-20 focus:tw-outline-offset-0'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`tw-relative tw-inline-flex tw-items-center tw-rounded-r-md tw-px-2 tw-py-2 tw-text-gray-400 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50 focus:tw-z-20 focus:tw-outline-offset-0 ${
                          currentPage === totalPages ? 'tw-cursor-not-allowed' : 'hover:tw-text-gray-700'
                        }`}
                      >
                        <span className="tw-sr-only">Next</span>
                        <ChevronRight className="tw-h-5 tw-w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default Policies;
