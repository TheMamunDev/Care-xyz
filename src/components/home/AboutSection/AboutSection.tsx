'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShieldCheck, HeartHandshake, Clock, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface IFeature {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

const features: IFeature[] = [
  {
    icon: ShieldCheck,
    title: 'Verified & Secure',
    description:
      'Every caregiver undergoes a strict background check and identity verification process.',
  },
  {
    icon: HeartHandshake,
    title: 'Compassionate Care',
    description:
      'We prioritize caregivers who treat your family with the same love and respect as their own.',
  },
  {
    icon: Clock,
    title: 'Flexible Booking',
    description:
      'Book care for a few hours or a few weeks. We adapt to your schedule, not the other way around.',
  },
  {
    icon: Users,
    title: 'Accessible for All',
    description:
      "Whether it's for a child, an elderly parent, or a sick relative, we have the right professional.",
  },
];

export default function AboutSection() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary font-medium rounded-full text-sm">
              Our Mission
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              Making Caregiving{' '}
              <span className="text-primary">Easy, Secure, & Accessible</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At <span className="font-semibold text-gray-800">Care.xyz</span>,
              we understand that finding the right person to care for your loved
              ones is one of the hardest decisions you make.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our platform bridges the gap between families in need and
              professional caregivers. We are not just a booking site; we are a
              community dedicated to ensuring that your children, elderly
              parents, and sick family members receive the dignity and attention
              they deserve.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=1976&auto=format&fit=crop"
                alt="Caregiver holding hands with elderly person"
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl hidden md:block border border-gray-100 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">100% Verified</p>
                  <p className="text-sm text-gray-500">Trusted Professionals</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-none shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="mx-auto h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
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
