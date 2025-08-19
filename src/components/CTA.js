import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const CTA = () => {
  return (
    <section className="py-20 bg-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Start measuring with Shopify today
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl mb-8 text-gray-300"
        >
          Try Shopify for free, and explore all the tools and services you need to start, run, and grow your business.
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white text-black hover:bg-gray-50 font-semibold py-4 px-8 rounded-full text-lg transition-colors duration-200 inline-flex items-center"
        >
          Start free trial
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </motion.button>
      </div>
    </section>
  );
};

export default CTA;
