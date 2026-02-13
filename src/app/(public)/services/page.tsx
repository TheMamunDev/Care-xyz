import {
  ArrowRight,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';

import CTA from '@/components/home/CTA/CTA';
import FAQ from '@/components/home/FAQ/FAQ';
import ServicesCard from '@/components/services/ServicesCard';
import ServicesHeader from '@/components/services/ServicesHeader';
import connectDB from '@/lib/db';
import { IService } from '@/app/types/IService';
import Services from '@/models/Service';

export default async function ServicesPage() {
  await connectDB();
  const service: IService[] = await Services.find().lean();
  const formattedServices = service.map(service => ({
    ...service,
    _id: service._id.toString(),
  }));
  return (
    <div className="min-h-screen bg-white">
      <ServicesHeader></ServicesHeader>

      <section className="py-20 container px-4 md:px-8 mx-auto space-y-32">
        <ServicesCard formattedServices={formattedServices}></ServicesCard>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container px-4 md:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Simple Booking Process
            </h2>
            <p className="text-gray-600 mt-2">
              Get the help you need in 3 easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10" />

            {[
              {
                icon: Users,
                title: 'Select Service',
                desc: 'Choose the type of care you need.',
              },
              {
                icon: CheckCircle2,
                title: 'Customize',
                desc: 'Set duration and location.',
              },
              {
                icon: ShieldCheck,
                title: 'Relax',
                desc: 'We handle the rest safely.',
              },
            ].map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center bg-white md:bg-transparent p-6 rounded-xl shadow-sm md:shadow-none"
              >
                <div className="h-24 w-24 bg-white rounded-full border-4 border-gray-100 flex items-center justify-center mb-6 shadow-sm">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ></FAQ>
      <CTA></CTA>
    </div>
  );
}
