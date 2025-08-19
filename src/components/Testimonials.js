import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon, UserIcon } from '@heroicons/react/24/solid';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "By using Shopify's analytics and reporting to identify best sellers and sales trends, we were able to grow our revenue year over year by 50% at Christmas.",
      author: "Sourav Dash",
      title: "Founder",
      company: "EventPulse"
    },
    {
      quote: "Creating custom dashboards lets us focus on our core product performance without needing to export and clean the data. It allows us to stay nimble and reactive.",
      author: "Ankur",
      title: "Hiring Manager",
      company: "Tenovia Solutions"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200"
            >
              <div className="flex items-start space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              
              <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
                             <div className="flex items-center">
                 <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                   <UserIcon className="w-6 h-6 text-gray-600" />
                 </div>
                 <div>
                   <div className="font-semibold text-gray-900">
                     {testimonial.author}
                   </div>
                   <div className="text-sm text-gray-600">
                     {testimonial.title}, {testimonial.company}
                   </div>
                 </div>
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
