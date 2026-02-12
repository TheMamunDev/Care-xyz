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

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  bg?: string;
  color?: string;
}

const ServicesCard = ({
  formattedServices,
}: {
  formattedServices: Service[];
}) => {
  return (
    <>
      {formattedServices.map((service, index) => (
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
                {/* <service.icon className="h-6 w-6" /> */}
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
    </>
  );
};

export default ServicesCard;
