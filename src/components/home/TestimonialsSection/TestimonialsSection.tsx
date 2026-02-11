'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote, Users, Clock, ShieldCheck, Heart } from 'lucide-react';

const metrics = [
  {
    id: 1,
    value: '5,000+',
    label: 'Happy Families',
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  {
    id: 2,
    value: '120,000+',
    label: 'Hours of Care',
    icon: Clock,
    color: 'text-primary',
    bg: 'bg-orange-100',
  },
  {
    id: 3,
    value: '100%',
    label: 'Verified Carers',
    icon: ShieldCheck,
    color: 'text-green-600',
    bg: 'bg-green-100',
  },
  {
    id: 4,
    value: '4.9/5',
    label: 'User Rating',
    icon: Heart,
    color: 'text-rose-600',
    bg: 'bg-rose-100',
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Mother of two',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    content:
      'I was so nervous leaving my 6-month-old for the first time, but the sitter from Care.xyz was an angel. She sent me updates every hour!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Ahmed Rahman',
    role: 'Son of elderly patient',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    content:
      'Finding reliable care for my father in Dhaka was a nightmare until I found this platform. The nurse is professional, kind, and punctual.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Working Mom',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    content:
      'The booking process is so smooth. I needed a last-minute sitter for a work emergency, and within 30 minutes, I had a confirmed booking.',
    rating: 4,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-secondary/20 overflow-hidden">
      <div className="container px-4 md:px-8 mx-auto space-y-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center space-y-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`p-4 rounded-full ${metric.bg} ${metric.color} mb-2`}
              >
                <metric.icon className="h-8 w-8" />
              </div>
              <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {metric.value}
              </h3>
              <p className="text-gray-600 font-medium uppercase tracking-wide text-sm">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
        <div className="text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by Families Everywhere
            </h2>
            <p className="text-lg text-gray-600">
              Don't just take our word for it. Here is what our community has to
              say about their care experiences.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-lg bg-white relative">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={item.avatar} alt={item.name} />
                    <AvatarFallback>{item.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.role}</p>
                  </div>
                  <Quote className="ml-auto h-8 w-8 text-primary/20 rotate-180" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < item.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 italic leading-relaxed">
                    "{item.content}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
