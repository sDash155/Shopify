import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const MarketingSection = () => {
  const marketingData = [
    { month: 'Jan', attributed: 15000, organic: 8000 },
    { month: 'Feb', attributed: 18000, organic: 9000 },
    { month: 'Mar', attributed: 22000, organic: 11000 },
    { month: 'Apr', attributed: 25000, organic: 12000 },
    { month: 'May', attributed: 28000, organic: 14000 },
    { month: 'Jun', attributed: 32000, organic: 16000 },
  ];

  const channels = [
    { channel: 'Google', spend: 45000, revenue: 180000, roas: 4.0 },
    { channel: 'Facebook', spend: 35000, revenue: 140000, roas: 4.0 },
    { channel: 'TikTok', spend: 25000, revenue: 100000, roas: 4.0 },
    { channel: 'Instagram', spend: 20000, revenue: 80000, roas: 4.0 },
    { channel: 'Email', spend: 5000, revenue: 20000, roas: 4.0 },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            Marketing measurement
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Get a centralized and unbiased view of your marketing investments with attribution, customer acquisition cost, and return on ad spend reporting across channels like email, social, and ads.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Marketing Attribution Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="chart-container"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales attributed to marketing</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attributed" stroke="#008060" strokeWidth={3} name="Attributed Sales" />
                <Line type="monotone" dataKey="organic" stroke="#5C6AC4" strokeWidth={3} name="Organic Sales" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Marketing Channels */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top marketing channels</h3>
            {channels.map((channel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-shopify-green"></div>
                  <span className="font-medium text-gray-900">{channel.channel}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">${channel.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">ROAS: {channel.roas}x</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MarketingSection;
