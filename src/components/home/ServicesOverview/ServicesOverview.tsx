'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Baby, HeartPulse, UserCheck } from 'lucide-react';

const services = [
  {
    id: 'baby-care',
    title: 'Baby Care',
    description:
      'Experienced babysitters to look after your little ones with love and safety.',
    image:
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop',
    icon: Baby,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    id: 'elderly-care',
    title: 'Elderly Care',
    description:
      'Compassionate caregivers to support your aging parents with daily needs and companionship.',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop',
    icon: UserCheck,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  {
    id: 'sick-care',
    title: 'Sick People Service',
    description:
      'Professional nursing assistance for family members recovering from illness or surgery.',
    image:
      'https://images.unsplash.com/photo-1584515933487-9bdbb7043172?q=80&w=2070&auto=format&fit=crop',
    icon: HeartPulse,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
];

export default function ServiceOverview() {
  return (
    <section className="py-24 bg-white">
      <div className="container px-4 md:px-8 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            Our Care Services
          </h2>
          <p className="text-lg text-gray-600">
            Choose the perfect care plan for your family's needs. We are here to
            help.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full flex flex-col overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-2xl rounded-2xl">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className={`absolute top-4 right-4 p-3 rounded-xl shadow-lg ${service.bg} ${service.color}`}
                  >
                    <service.icon className="h-6 w-6" />
                  </div>
                </div>
                <CardHeader className="space-y-2 pt-6">
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>

                <CardFooter className="mt-auto pb-8 pt-4">
                  <Link href={`/service/${service.id}`} className="w-full">
                    <Button className="w-full gap-2 text-base py-6 bg-gray-900 hover:bg-primary text-white transition-all duration-300 group-hover:shadow-lg">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
