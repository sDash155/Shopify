import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import AnalyticsGrid from './components/AnalyticsGrid';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import MarketingSection from './components/MarketingSection';
import LiveView from './components/LiveView';
import DataSection from './components/DataSection';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  const [isLiveViewOpen, setIsLiveViewOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <AnalyticsGrid />
        <Features />
        <Testimonials />
        <MarketingSection />
        <LiveView isOpen={isLiveViewOpen} setIsOpen={setIsLiveViewOpen} />
        <DataSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
