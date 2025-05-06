import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { LineChart, ArrowRight, BarChart, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Merchant: React.FC = () => {
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
        <div className="tw-container tw-mx-auto tw-px-4 tw-py-6">
          <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center md:tw-justify-between">
            <div>
              <h1 className="tw-text-2xl tw-font-bold tw-text-gray-800">Merchant Dashboard</h1>
              <p className="tw-text-gray-600">Welcome back! Here's your business at a glance</p>
            </div>
            <div className="tw-mt-4 md:tw-mt-0 tw-flex tw-space-x-3">
              <Link
                to="/merchant/policies"
                className="tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-border tw-border-transparent tw-text-sm tw-font-medium tw-rounded-md tw-shadow-sm tw-text-white tw-bg-protega-600 hover:tw-bg-protega-700"
              >
                <FileText className="tw-mr-2 tw-h-4 tw-w-4" />
                View Policies
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="tw-container tw-mx-auto tw-px-4 tw-py-8">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6 tw-mb-8">
          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-p-6">
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
              <h3 className="tw-text-lg tw-font-medium tw-text-gray-700">Total Revenue</h3>
              <LineChart className="tw-text-protega-600" size={24} />
            </div>
            <p className="tw-text-3xl tw-font-bold tw-text-gray-900">₹187,429</p>
            <div className="tw-mt-2 tw-flex tw-items-center tw-text-sm">
              <span className="tw-text-green-500 tw-font-medium">+12.5%</span>
              <span className="tw-text-gray-500 tw-ml-2">from last month</span>
            </div>
          </div>

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-p-6">
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
              <h3 className="tw-text-lg tw-font-medium tw-text-gray-700">Active Customers</h3>
              <BarChart className="tw-text-protega-600" size={24} />
            </div>
            <p className="tw-text-3xl tw-font-bold tw-text-gray-900">2,413</p>
            <div className="tw-mt-2 tw-flex tw-items-center tw-text-sm">
              <span className="tw-text-green-500 tw-font-medium">+7.2%</span>
              <span className="tw-text-gray-500 tw-ml-2">from last month</span>
            </div>
          </div>

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-p-6">
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
              <h3 className="tw-text-lg tw-font-medium tw-text-gray-700">Conversion Rate</h3>
              <BarChart className="tw-text-protega-600" size={24} />
            </div>
            <p className="tw-text-3xl tw-font-bold tw-text-gray-900">3.8%</p>
            <div className="tw-mt-2 tw-flex tw-items-center tw-text-sm">
              <span className="tw-text-red-500 tw-font-medium">-0.5%</span>
              <span className="tw-text-gray-500 tw-ml-2">from last month</span>
            </div>
          </div>
        </div>

        <div className="tw-bg-white tw-rounded-lg tw-shadow">
          <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200">
            <h2 className="tw-text-xl tw-font-semibold tw-text-gray-800">Recent Transactions</h2>
          </div>
          <div className="tw-px-6 tw-py-4">
            <div className="tw-overflow-x-auto">
              <table className="tw-min-w-full tw-divide-y tw-divide-gray-200">
                <thead>
                  <tr>
                    <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Customer</th>
                    <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Amount</th>
                    <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Status</th>
                    <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Date</th>
                    <th className="tw-px-4 tw-py-3 tw-text-right tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="tw-divide-y tw-divide-gray-200">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item} className="hover:tw-bg-gray-50">
                      <td className="tw-px-4 tw-py-4 tw-whitespace-nowrap">
                        <div className="tw-flex tw-items-center">
                          <div className="tw-w-8 tw-h-8 tw-bg-protega-600 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-white tw-font-medium">
                            {String.fromCharCode(64 + item)}
                          </div>
                          <div className="tw-ml-4">
                            <div className="tw-text-sm tw-font-medium tw-text-gray-900">Customer {item}</div>
                            <div className="tw-text-sm tw-text-gray-500">customer{item}@example.com</div>
                          </div>
                        </div>
                      </td>
                      <td className="tw-px-4 tw-py-4 tw-whitespace-nowrap">
                        <div className="tw-text-sm tw-text-gray-900">₹{(499 * item).toLocaleString()}</div>
                      </td>
                      <td className="tw-px-4 tw-py-4 tw-whitespace-nowrap">
                        <span className={`tw-px-2 tw-inline-flex tw-text-xs tw-leading-5 tw-font-semibold tw-rounded-full ${item % 3 === 0
                            ? 'tw-bg-yellow-100 tw-text-yellow-800'
                            : item % 2 === 0
                              ? 'tw-bg-green-100 tw-text-green-800'
                              : 'tw-bg-gray-100 tw-text-gray-800'
                          }`}>
                          {item % 3 === 0 ? 'Pending' : item % 2 === 0 ? 'Completed' : 'Processing'}
                        </span>
                      </td>
                      <td className="tw-px-4 tw-py-4 tw-whitespace-nowrap tw-text-sm tw-text-gray-500">
                        {new Date(2023, 10, item).toLocaleDateString()}
                      </td>
                      <td className="tw-px-4 tw-py-4 tw-whitespace-nowrap tw-text-right tw-text-sm tw-font-medium">
                        <button className="tw-text-protega-600 hover:tw-text-protega-800 tw-flex tw-items-center tw-space-x-1 tw-ml-auto">
                          <span>View</span>
                          <ArrowRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default Merchant;