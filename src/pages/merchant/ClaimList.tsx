import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, Filter, Search, ChevronLeft, ChevronRight, Clock, Calendar, X } from 'lucide-react';
import Header from '../../components/Header';
import { Claim, mockClaims } from '../../mockData/claims.ts';

// Claims per page
const PAGE_SIZE = 5;

const ClaimsList: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchClaims = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setClaims(mockClaims);
      } catch (err) {
        setError('Failed to load claims. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

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


  const getDateRangeFilter = (dateRange: string, createdAt: string) => {
    const claimDate = new Date(createdAt);
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    const daysDiff = Math.round(Math.abs((today.getTime() - claimDate.getTime()) / oneDay));

    switch (dateRange) {
      case 'today':
        return daysDiff < 1;
      case 'week':
        return daysDiff < 7;
      case 'month':
        return daysDiff < 30;
      default:
        return true;
    }
  };

  useEffect(() => {
    // Create active filters array
    const newActiveFilters: string[] = [];

    if (filters.status !== 'all') {
      newActiveFilters.push(`Status: ${filters.status}`);
    }

    if (filters.type !== 'all') {
      newActiveFilters.push(`Type: ${filters.type}`);
    }

    if (filters.dateRange !== 'all') {
      const dateRangeText = filters.dateRange === 'today'
        ? 'Today'
        : filters.dateRange === 'week'
          ? 'Last 7 Days'
          : 'Last 30 Days';
      newActiveFilters.push(`Date: ${dateRangeText}`);
    }

    if (searchTerm) {
      newActiveFilters.push(`Search: ${searchTerm}`);
    }

    setActiveFilters(newActiveFilters);
  }, [filters, searchTerm]);

  const filteredClaims = claims.filter(claim => {
    // Search filter
    const matchesSearch =
      claim.policyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = filters.status === 'all' || claim.status === filters.status;

    // Type filter
    const matchesType = filters.type === 'all' || claim.type === filters.type;

    // Date range filter
    const matchesDateRange = filters.dateRange === 'all' || getDateRangeFilter(filters.dateRange, claim.createdAt);

    return matchesSearch && matchesStatus && matchesType && matchesDateRange;
  });

  // Pagination
  const totalPages = Math.ceil(filteredClaims.length / PAGE_SIZE);
  const paginatedClaims = filteredClaims.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top on page change
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filters, searchTerm]);

  // Function to remove individual filter
  const removeFilter = (filterType: string) => {
    switch (filterType) {
      case 'Status':
        setFilters(prev => ({ ...prev, status: 'all' }));
        break;
      case 'Type':
        setFilters(prev => ({ ...prev, type: 'all' }));
        break;
      case 'Date':
        setFilters(prev => ({ ...prev, dateRange: 'all' }));
        break;
      case 'Search':
        setSearchTerm('');
        break;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="tw-min-h-screen tw-bg-gray-50"
    >
      <Header isStorefront={false} />

      <main className="tw-container tw-mx-auto tw-px-4 tw-py-8">
        <div className="tw-max-w-7xl tw-mx-auto">
          <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center md:tw-justify-between tw-gap-4 tw-mb-8">
            <div>
              <h1 className="tw-text-2xl tw-font-bold tw-text-gray-900">Claims Management</h1>
              <p className="tw-text-gray-600 tw-mt-1">Track and manage customer claims</p>
            </div>

            <div className="tw-flex tw-items-center tw-gap-4">
              <div className="tw-relative">
                <Search className="tw-absolute tw-left-3 tw-top-1/2 tw--translate-y-1/2 tw-h-4 tw-w-4 tw-text-gray-400" />
                <input
                  type="text"
                  placeholder="Search claims..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="tw-pl-10 tw-pr-4 tw-py-2 tw-border tw-border-gray-200 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-protega-600/20 focus:tw-border-protega-600 tw-w-full md:tw-w-64 tw-bg-white"
                />
              </div>
              <button
                className={`tw-inline-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-border tw-rounded-lg tw-text-gray-700 tw-transition-all tw-duration-200 ${showFilters
                  ? 'tw-bg-protega-50 tw-border-protega-200 tw-text-protega-600 tw-shadow-inner'
                  : 'tw-border-gray-200 hover:tw-bg-gray-50 hover:tw-border-gray-300'
                  }`}

                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="tw-h-4 tw-w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="tw-flex tw-flex-wrap tw-gap-2 tw-mb-4">
              {activeFilters.map((filter, index) => {
                const [key, value] = filter.split(': ');
                return (
                  <div
                    key={index}
                    className="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-bg-gray-100 tw-text-gray-800 hover:tw-bg-gray-200 tw-transition-colors tw-duration-200"
                  >
                    <span className="tw-font-medium tw-text-gray-600 tw-mr-1">{key}:</span>
                    <span>{value}</span>
                    <button
                      onClick={() => removeFilter(key)}
                      className="tw-ml-1.5 tw-text-gray-500 hover:tw-text-red-500 tw-transition-colors"
                      title="Remove filter"
                    >
                      <X className="tw-h-3 tw-w-3" />
                    </button>
                  </div>
                );
              })}

              <button
                onClick={() => {
                  setFilters({
                    status: 'all',
                    type: 'all',
                    dateRange: 'all'
                  });
                  setSearchTerm('');
                }}
                className="tw-inline-flex tw-items-center tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-bg-rose-50 tw-text-rose-700 hover:tw-bg-rose-100 tw-transition-colors tw-duration-200"
              >
                <X className="tw-h-3 tw-w-3 tw-mr-1" />
                Clear All
              </button>
            </div>
          )}

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="tw-bg-white tw-p-6 tw-rounded-lg tw-border tw-border-gray-200 tw-mb-6 tw-shadow-sm"
            >
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6">
                <div>
                  <label htmlFor="statusFilter" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                    Status
                  </label>
                  <div className="tw-relative">
                    <select
                      id="statusFilter"
                      className="tw-w-full tw-border tw-border-gray-200 tw-rounded-lg tw-p-2.5 tw-text-sm tw-appearance-none tw-pr-8 tw-bg-white focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-protega-600/20 focus:tw-border-protega-600"
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <div className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-px-2 tw-text-gray-700">
                      <svg className="tw-fill-current tw-h-4 tw-w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="typeFilter" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                    Claim Type
                  </label>
                  <div className="tw-relative">
                    <select
                      id="typeFilter"
                      className="tw-w-full tw-border tw-border-gray-200 tw-rounded-lg tw-p-2.5 tw-text-sm tw-appearance-none tw-pr-8 tw-bg-white focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-protega-600/20 focus:tw-border-protega-600"
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                      <option value="all">All Types</option>
                      <option value="shipping">Shipping</option>
                      <option value="product">Product</option>
                      <option value="both">Both Issues</option>
                    </select>
                    <div className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-px-2 tw-text-gray-700">
                      <svg className="tw-fill-current tw-h-4 tw-w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="dateFilter" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                    Date Range
                  </label>
                  <div className="tw-relative">
                    <select
                      id="dateFilter"
                      className="tw-w-full tw-border tw-border-gray-200 tw-rounded-lg tw-p-2.5 tw-text-sm tw-appearance-none tw-pr-8 tw-bg-white focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-protega-600/20 focus:tw-border-protega-600"
                      value={filters.dateRange}
                      onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                    </select>
                    <div className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center tw-px-2 tw-text-gray-700">
                      <svg className="tw-fill-current tw-h-4 tw-w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tw-flex tw-justify-end tw-mt-4">
                <button
                  onClick={() => {
                    setFilters({
                      status: 'all',
                      type: 'all',
                      dateRange: 'all'
                    });
                    setSearchTerm('');
                  }}
                  className="tw-text-sm tw-text-protega-600 hover:tw-text-protega-700 tw-font-medium tw-transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </motion.div>
          )}

          {error && (
            <div className="tw-mb-6 tw-p-4 tw-bg-rose-50 tw-border tw-border-rose-200 tw-rounded-lg tw-flex tw-items-center tw-text-rose-700">
              <AlertCircle className="tw-h-5 tw-w-5 tw-mr-2 tw-flex-shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200">
              <div className="tw-animate-pulse tw-space-y-4 tw-p-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="tw-h-16 tw-bg-gray-100 tw-rounded-lg" />
                ))}
              </div>
            </div>
          ) : filteredClaims.length === 0 ? (
            <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 tw-p-8 tw-text-center">
              <div className="tw-w-12 tw-h-12 tw-bg-gray-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4">
                <Clock className="tw-h-6 tw-w-6 tw-text-gray-400" />
              </div>
              <h3 className="tw-text-lg tw-font-medium tw-text-gray-900 tw-mb-1">No claims found</h3>
              <p className="tw-text-gray-500 tw-mb-4">
                {searchTerm || filters.status !== 'all' || filters.type !== 'all' || filters.dateRange !== 'all' ?
                  'Try adjusting your search criteria or filters' :
                  'There are no claims to display at this time'}
              </p>
            </div>
          ) : (
            <div className="tw-space-y-6">
              <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 tw-divide-y tw-divide-gray-200">
                {paginatedClaims.map((claim) => (
                  <div key={claim.id} className="tw-p-6 hover:tw-bg-gray-50/50 tw-transition-colors">
                    <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center tw-gap-4 md:tw-gap-6">
                      <div className="tw-flex-1">
                        <div className="tw-flex tw-items-start tw-gap-4">
                          <div>
                            <h3 className="tw-font-medium tw-text-gray-900">Claim #{claim.id}</h3>
                            <p className="tw-text-sm tw-text-gray-500">Policy: {claim.policyId}</p>
                          </div>
                          <span className={`tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium ${getStatusBadgeClass(claim.status)}`}>
                            {claim.status}
                          </span>
                        </div>
                        <p className="tw-mt-2 tw-text-sm tw-text-gray-600 tw-line-clamp-2">{claim.description}</p>
                      </div>
                      <div className="tw-flex tw-items-center tw-justify-between tw-gap-4">
                        <div className="tw-text-sm tw-text-gray-500">
                          <div className="tw-flex tw-items-center">
                            <Calendar className="tw-h-4 tw-w-4 tw-mr-1 tw-text-gray-400" />
                            {new Date(claim.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <Link
                          to={`/merchant/claims/${claim.id}`}
                          className="tw-inline-flex tw-items-center tw-gap-1 tw-text-sm tw-font-medium tw-text-protega-600 hover:tw-text-protega-700"
                        >
                          View Details
                          <ArrowRight className="tw-h-4 tw-w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="tw-flex tw-items-center tw-justify-between tw-border-t tw-border-gray-200 tw-bg-white tw-px-4 tw-py-3 sm:tw-px-6 tw-rounded-lg tw-shadow-sm">
                  <div className="tw-flex tw-flex-1 tw-justify-between sm:tw-hidden">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`tw-relative tw-inline-flex tw-items-center tw-rounded-md tw-px-4 tw-py-2 tw-text-sm tw-font-medium ${currentPage === 1
                        ? 'tw-text-gray-300 tw-cursor-not-allowed'
                        : 'tw-text-gray-700 hover:tw-bg-gray-50'
                        }`}

                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`tw-relative tw-ml-3 tw-inline-flex tw-items-center tw-rounded-md tw-px-4 tw-py-2 tw-text-sm tw-font-medium ${currentPage === totalPages
                        ? 'tw-text-gray-300 tw-cursor-not-allowed'
                        : 'tw-text-gray-700 hover:tw-bg-gray-50'
                        }`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="tw-hidden sm:tw-flex sm:tw-flex-1 sm:tw-items-center sm:tw-justify-between">
                    <div>
                      <p className="tw-text-sm tw-text-gray-700">
                        Showing <span className="tw-font-medium">{(currentPage - 1) * PAGE_SIZE + 1}</span> to{' '}
                        <span className="tw-font-medium">
                          {Math.min(currentPage * PAGE_SIZE, filteredClaims.length)}
                        </span>{' '}
                        of <span className="tw-font-medium">{filteredClaims.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="tw-isolate tw-inline-flex tw--space-x-px tw-rounded-md tw-shadow-sm" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`tw-relative tw-inline-flex tw-items-center tw-rounded-l-md tw-px-2 tw-py-2 tw-text-gray-400 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50 focus:tw-z-20 focus:tw-outline-offset-0 ${currentPage === 1 ? 'tw-cursor-not-allowed' : 'hover:tw-text-gray-700'
                            }`}
                        >
                          <span className="tw-sr-only">Previous</span>
                          <ChevronLeft className="tw-h-5 tw-w-5" aria-hidden="true" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold ${page === currentPage
                                ? 'tw-z-10 tw-bg-protega-600 tw-text-white focus:tw-z-20 focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-2 focus-visible:tw-outline-protega-600'
                                : 'tw-text-gray-900 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50 focus:tw-z-20 focus:tw-outline-offset-0'
                              }`}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={`tw-relative tw-inline-flex tw-items-center tw-rounded-r-md tw-px-2 tw-py-2 tw-text-gray-400 tw-ring-1 tw-ring-inset tw-ring-gray-300 hover:tw-bg-gray-50 focus:tw-z-20 focus:tw-outline-offset-0 ${currentPage === totalPages ? 'tw-cursor-not-allowed' : 'hover:tw-text-gray-700'
                            }`}
                        >
                          <span className="tw-sr-only">Next</span>
                          <ChevronRight className="tw-h-5 tw-w-5" aria-hidden="true" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default ClaimsList;