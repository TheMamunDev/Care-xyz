import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  ShieldCheck,
  Star,
  Clock,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import connectDB from '@/lib/db';
import Services from '@/models/Service';

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;

  await connectDB();

  const service = await Services.findOne({ id: serviceId });

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-secondary/20 pb-20">
      <div className="relative h-[400px] w-full">
        <Image
          src={service.image}
          alt={service.title}
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white container mx-auto">
          <Badge className="bg-primary hover:bg-primary/90 text-white mb-4 px-3 py-1 text-sm uppercase tracking-wider">
            Premium Service
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {service.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-medium max-w-2xl">
            {service.tagline}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Service
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                {service.description}
              </p>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {service.longDescription}
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                What's Included
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                  >
                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-blue-50 p-8 rounded-2xl border border-blue-100 flex items-start gap-4">
              <ShieldCheck className="h-12 w-12 text-blue-600 shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  Our Safety Promise
                </h3>
                <p className="text-blue-700 leading-relaxed">
                  Every caregiver on Care.xyz undergoes a strict background
                  check, NID verification, and in-person interview. We
                  prioritize your family's safety above all else.
                </p>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="">
              <Card className="border-none shadow-xl overflow-hidden">
                <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                        Starting from
                      </p>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-4xl font-bold text-primary">
                          ৳{service.pricePerHour}
                        </span>
                        <span className="text-gray-500 font-medium">
                          / hour
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded text-yellow-700 font-bold text-sm">
                        <Star className="h-3 w-3 fill-yellow-700" />
                        {service.rating}
                      </div>
                      <span className="text-xs text-gray-400 mt-1">
                        {service.reviews} reviews
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">Minimum 2 hours duration</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-sm">
                        Available in All Major Cities
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <p className="text-xs text-gray-500 text-center">
                    No payment required until job is completed.
                  </p>
                </CardContent>

                <CardFooter className="pb-6 px-6">
                  <Link href={`/booking/${service.id}`} className="w-full">
                    <Button
                      size="lg"
                      className="w-full text-lg h-12 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                    >
                      Book Service Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">Need help deciding?</p>
                <Link
                  href="/contact"
                  className="text-primary font-medium hover:underline text-sm"
                >
                  Talk to our support team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
