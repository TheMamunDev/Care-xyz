'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IService } from '@/app/types/IService';

const ServicesCard = ({
  formattedServices,
}: {
  formattedServices: IService[];
}) => {
  return (
    <>
      {formattedServices.map((service, index) => (
        <div
          key={service.id}
          className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
        >
          <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative group">
              <div
                className={`absolute -inset-4 rounded-[2rem] opacity-30 blur-2xl transition duration-500 group-hover:opacity-50 `}
              />

              <div className="relative h-[400px] lg:h-[500px] w-full rounded-[2rem] overflow-hidden shadow-2xl">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div
                            key={i}
                            className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500"
                          >
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-600 ml-2">
                        500+ Carers
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                      <Star className="h-4 w-4 fill-current" /> 4.9
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${service.color} ${service.accent}`}
            >
              <Heart className="h-4 w-4 fill-current" />
              {service.subtitle}
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              {service.title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {service.description}
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className={`h-5 w-5 ${service.accent}`} />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="pt-6">
              <Link href={`/service/${service.id}`}>
                <Button
                  size="lg"
                  className="rounded-full text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all"
                >
                  View Details & Book
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      ))}
    </>
  );
};

export default ServicesCard;
