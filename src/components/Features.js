import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  MagnifyingGlassIcon, 
  ClockIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const Features = () => {
  const features = [
    {
      icon: ChartBarIcon,
      title: "Pre-built reports for commerce",
      description: "Access Shopify-built reports that are designed for commerce insights. Immediately understand your store's performance with no additional work required, so you can respond faster and make optimizations.",
      cta: "See reports",
      color: "text-shopify-green"
    },
    {
      icon: MagnifyingGlassIcon,
      title: "Deeper data exploration",
      description: "Modify pre-built reports or create your own from scratch to answer questions specific to your business. Layer on additional metrics and dimensions to drill down deeper into your reporting.",
      cta: "Start exploring",
      color: "text-shopify-blue"
    },
    {
      icon: ClockIcon,
      title: "Real-time monitoring",
      description: "Never miss a change in your store's performance with real-time data updates in your dashboard and across all reports. Drag, drop, and tailor your dashboard to see your most critical metrics at a glance.",
      cta: "View your dashboard",
      color: "text-purple-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
            Fast, flexible, and relevant reporting
          </motion.h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              <button className="inline-flex items-center text-shopify-green hover:text-shopify-green-dark font-medium transition-colors duration-200">
                {feature.cta}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
