import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const Hero = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4"
          >
            ANALYTICS AND REPORTING
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight"
          >
            Make smart business<br />
            decisions, quickly
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl mb-10 text-gray-600 max-w-3xl mx-auto"
          >
            Real-time and reliable data about your store, no set-up required
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-black text-white hover:bg-gray-800 font-semibold py-4 px-6 rounded-full text-lg transition-all duration-200 inline-flex items-center group hover:pr-10 relative"
            onClick={() => {
              document.getElementById('analytics-grid').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
          >
            View your analytics
            <ArrowRightIcon className="absolute right-3 h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-200" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
