import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const footerLinks = {
    shopify: [
      { name: 'About', href: '#' },
      { name: 'Investors', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Affiliates', href: '#' },
      { name: 'Legal', href: '#' },
      { name: 'Service status', href: '#' },
    ],
    support: [
      { name: 'Merchant Support', href: '#' },
      { name: 'Shopify Help Center', href: '#' },
      { name: 'Hire a Partner', href: '#' },
      { name: 'Shopify Academy', href: '#' },
      { name: 'Shopify Community', href: '#' },
    ],
    developers: [
      { name: 'Shopify.dev', href: '#' },
      { name: 'API Documentation', href: '#' },
      { name: 'Dev Degree', href: '#' },
    ],
    products: [
      { name: 'Shopify Plus', href: '#' },
      { name: 'Shopify for Enterprise', href: '#' },
    ],
    impact: [
      { name: 'Sustainability', href: '#' },
      { name: 'Build Black', href: '#' },
      { name: 'Accessibility', href: '#' },
    ],
    solutions: [
      { name: 'Online Store Builder', href: '#' },
      { name: 'Website Builder', href: '#' },
      { name: 'Ecommerce Website', href: '#' },
    ],
  };

  const regions = [
    { name: 'Argentina', languages: ['Español', 'English'] },
    { name: 'Australia', languages: ['English'] },
    { name: 'Canada', languages: ['English', 'Français'] },
    { name: 'Germany', languages: ['Deutsch', 'English'] },
    { name: 'India', languages: ['Hindi', 'English'] },
    { name: 'UK', languages: ['English'] },
    { name: 'USA', languages: ['English', 'Español (Intl.)', '简体中文'] },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Shopify */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Shopify</h3>
            <ul className="space-y-3">
              {footerLinks.shopify.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Developers</h3>
            <ul className="space-y-3">
              {footerLinks.developers.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Products</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Global Impact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Global Impact</h3>
            <ul className="space-y-3">
              {footerLinks.impact.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Solutions</h3>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Language/Region Selector */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                India | English
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </button>
              
              {isLanguageOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Choose a region & language</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {regions.map((region) => (
                      <div key={region.name} className="text-sm">
                        <div className="font-medium text-gray-900">{region.name}</div>
                        <div className="text-gray-600">
                          {region.languages.join('|')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">Terms of service</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy policy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Sitemap</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy Choices</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
