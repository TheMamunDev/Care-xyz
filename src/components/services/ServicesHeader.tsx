'use client';
import { Badge } from '../ui/badge';

import { motion } from 'framer-motion';
const ServicesHeader = () => {
  return (
    <section className="relative py-20 bg-secondary/20 overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50" />

      <div className="container px-4 md:px-8 relative z-10 text-center max-w-3xl mx-auto space-y-6">
        <Badge
          variant="outline"
          className="border-primary text-primary px-4 py-1 text-sm uppercase tracking-widest"
        >
          Our Expertise
        </Badge>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight"
        >
          Comprehensive Care for Every Stage of Life
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 leading-relaxed"
        >
          We don't just provide services; we provide peace of mind. Choose the
          specialized care that fits your family's unique needs.
        </motion.p>
      </div>
    </section>
  );
};

export default ServicesHeader;
