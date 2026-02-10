'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ISlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
}

const SLIDES: ISlide[] = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070&auto=format&fit=crop',
    title: 'Compassionate Care for Your Loved Ones',
    subtitle:
      'Professional babysitting and elderly care services that feel like family.',
    cta: 'Find a Caretaker',
    link: '/services',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=2070&auto=format&fit=crop',
    title: 'Aging with Dignity and Comfort',
    subtitle:
      'Verified caregivers to support your elderly family members at home.',
    cta: 'Explore Elderly Care',
    link: '/services/elderly-care',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2066&auto=format&fit=crop',
    title: 'Safe Hands for Your Little Ones',
    subtitle:
      'Experienced babysitters you can trust, available whenever you need them.',
    cta: 'Book a Babysitter',
    link: '/services/baby-care',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const nextSlide = () => {
    setCurrent(prev => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent(prev => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 w-full h-full"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${SLIDES[current].image})` }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 container mx-auto h-full flex items-center px-4 md:px-8">
        <div className="max-w-2xl text-white space-y-6">
          <motion.h1
            key={`title-${current}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold leading-tight"
          >
            {SLIDES[current].title}
          </motion.h1>

          <motion.p
            key={`sub-${current}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg md:text-xl text-gray-200 font-medium"
          >
            {SLIDES[current].subtitle}
          </motion.p>

          <motion.div
            key={`btn-${current}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link href={SLIDES[current].link}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105"
              >
                {SLIDES[current].cta}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Slider Controls (Arrows) */}
      <div className="absolute bottom-8 right-8 flex gap-4 z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-full backdrop-blur-sm"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-full backdrop-blur-sm"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === current ? 'w-8 bg-primary' : 'w-2.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
