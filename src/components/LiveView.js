import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlobeAltIcon, EyeIcon } from '@heroicons/react/24/outline';

const LiveView = ({ isOpen, setIsOpen }) => {
  const [liveMetrics, setLiveMetrics] = useState({
    visitors: 1247,
    sales: 89234,
    orders: 156
  });

  const [transactions, setTransactions] = useState([
    { id: 1, customer: "Sarah M.", amount: 89.99, location: "New York, US", time: "2 min ago" },
    { id: 2, customer: "Mike R.", amount: 156.50, location: "Toronto, CA", time: "1 min ago" },
    { id: 3, customer: "Emma L.", amount: 234.00, location: "London, UK", time: "Just now" },
  ]);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setLiveMetrics(prev => ({
          visitors: prev.visitors + Math.floor(Math.random() * 10),
          sales: prev.sales + Math.floor(Math.random() * 1000),
          orders: prev.orders + Math.floor(Math.random() * 3)
        }));

        // Add new transaction
        const newTransaction = {
          id: Date.now(),
          customer: `Customer ${Math.floor(Math.random() * 1000)}`,
          amount: Math.floor(Math.random() * 200) + 50,
          location: ["New York, US", "Toronto, CA", "London, UK", "Sydney, AU", "Berlin, DE"][Math.floor(Math.random() * 5)],
          time: "Just now"
        };

        setTransactions(prev => [newTransaction, ...prev.slice(0, 2)]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={() => setIsOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-shopify-green to-shopify-green-dark text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GlobeAltIcon className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Live view</h2>
                <p className="text-green-100">Watch every sale roll in</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-green-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Metrics */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live metrics</h3>
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  key={liveMetrics.visitors}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="bg-gray-50 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-bold text-shopify-green">{liveMetrics.visitors.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Visitors right now</div>
                </motion.div>
                <motion.div
                  key={liveMetrics.sales}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="bg-gray-50 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-bold text-shopify-green">${liveMetrics.sales.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total sales</div>
                </motion.div>
                <motion.div
                  key={liveMetrics.orders}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="bg-gray-50 rounded-lg p-4 text-center"
                >
                  <div className="text-2xl font-bold text-shopify-green">{liveMetrics.orders}</div>
                  <div className="text-sm text-gray-600">Top transactions</div>
                </motion.div>
              </div>

              {/* Globe Visualization */}
              <div className="mt-6 bg-gray-50 rounded-lg p-6 text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <GlobeAltIcon className="w-16 h-16 text-white" />
                </div>
                <p className="text-gray-600">Real-time global activity visualization</p>
              </div>
            </div>

            {/* Live Transactions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live transactions</h3>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{transaction.customer}</div>
                        <div className="text-sm text-gray-600">{transaction.location}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-shopify-green">${transaction.amount}</div>
                        <div className="text-xs text-gray-500">{transaction.time}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LiveView;
