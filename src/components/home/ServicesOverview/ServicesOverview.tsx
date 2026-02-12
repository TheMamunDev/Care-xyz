// const services = [
//   {
//     id: 'baby-care',
//     title: 'Baby Care',
//     description:
//       'Experienced babysitters to look after your little ones with love and safety.',
//     image:
//       'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2070&auto=format&fit=crop',
//     icon: Baby,
//     color: 'text-blue-500',
//     bg: 'bg-blue-50',
//   },
//   {
//     id: 'elderly-care',
//     title: 'Elderly Care',
//     description:
//       'Compassionate caregivers to support your aging parents with daily needs and companionship.',
//     image:
//       'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop',
//     icon: UserCheck,
//     color: 'text-orange-500',
//     bg: 'bg-orange-50',
//   },
//   {
//     id: 'sick-care',
//     title: 'Sick People Service',
//     description:
//       'Professional nursing assistance for family members recovering from illness or surgery.',
//     image:
//       'https://images.unsplash.com/photo-1584515933487-9bdbb7043172?q=80&w=2070&auto=format&fit=crop',
//     icon: HeartPulse,
//     color: 'text-rose-500',
//     bg: 'bg-rose-50',
//   },
// ];

import connectDB from '@/lib/db';
import Services from '@/models/Service';
import ServicesCard from './ServicesCard';

export interface IService extends Document {
  _id: string;
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  pricePerHour: number;
  rating: number;
  reviews: number;
  image: string;
  icon: any;
  createdAt: Date;
  updatedAt: Date;
}

export default async function ServiceOverview() {
  await connectDB();
  const service: IService[] = await Services.find().lean();
  const formattedServices = service.map(service => ({
    ...service,
    _id: service._id.toString(),
  }));

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
          <ServicesCard formattedServices={formattedServices}></ServicesCard>
        </div>
      </div>
    </section>
  );
}
