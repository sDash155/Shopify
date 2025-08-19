import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const solutions = [
    { name: 'Start your business', description: 'Build your brand' },
    { name: 'Create your website', description: 'Online store editor' },
    { name: 'Customize your store', description: 'Store themes' },
    { name: 'Find business apps', description: 'Shopify app store' },
    { name: 'Own your site domain', description: 'Domains & hosting' },
    { name: 'Explore free business tools', description: 'Tools to run your business' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="/assets/SHOPIFY.png" 
              alt="Shopify" 
              style={{ height: '140px', width: 'auto' }}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Solutions Dropdown */}
            <div className="relative">
                             <button
                 className="flex items-center text-gray-700 hover:text-gray-900 px-4 py-3 text-base font-medium transition-colors"
                 onMouseEnter={() => setActiveDropdown('solutions')}
                 onMouseLeave={() => setActiveDropdown(null)}
               >
                 Solutions
                 <ChevronDownIcon className="ml-1 h-5 w-5" />
               </button>
              
              {activeDropdown === 'solutions' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-80 bg-white shadow-lg border border-gray-200 rounded-lg p-4"
                  onMouseEnter={() => setActiveDropdown('solutions')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="grid grid-cols-1 gap-2">
                    {solutions.map((item, index) => (
                      <a
                        key={index}
                        href="#"
                        className="flex flex-col p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className="text-sm text-gray-500">{item.description}</span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

                         {/* Pricing */}
             <a href="#" className="text-gray-700 hover:text-gray-900 px-4 py-3 text-base font-medium transition-colors">
               Pricing
             </a>

             {/* Resources */}
             <a href="#" className="text-gray-700 hover:text-gray-900 px-4 py-3 text-base font-medium transition-colors">
               Resources
             </a>

             {/* Enterprise */}
             <a href="#" className="text-gray-700 hover:text-gray-900 px-4 py-3 text-base font-medium transition-colors">
               Enterprise
             </a>

             {/* What's new */}
             <a href="#" className="text-gray-700 hover:text-gray-900 px-4 py-3 text-base font-medium transition-colors">
               What's new
             </a>
          </nav>

                     {/* User Actions */}
           <div className="hidden lg:flex items-center space-x-6">
             <a href="#" className="text-gray-700 hover:text-gray-900 px-4 py-3 text-base font-medium transition-colors">
               Log in
             </a>
             <button className="bg-black text-white hover:bg-gray-800 font-medium py-3 px-6 rounded-full text-base transition-colors">
               Start for free
             </button>
           </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 py-4"
          >
            <div className="space-y-2">
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Solutions</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Pricing</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Resources</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Enterprise</a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-gray-900">What's new</a>
              <div className="pt-4 space-y-2">
                <a href="#" className="block px-3 py-2 text-gray-700 hover:text-gray-900">Log in</a>
                <button className="w-full bg-black text-white hover:bg-gray-800 font-medium py-2 px-4 rounded-full text-sm transition-colors">
                  Start for free
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
