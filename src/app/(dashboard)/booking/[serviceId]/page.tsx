'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Loader2,
  MapPin,
  Calculator,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const SERVICES_INFO: Record<string, { name: string; price: number }> = {
  'baby-care': { name: 'Baby Sitting', price: 500 },
  'elderly-care': { name: 'Elderly Care', price: 600 },
  'sick-care': { name: 'Sick Patient Care', price: 800 },
};

const bookingSchema = z.object({
  date: z.date({ required_error: 'A date is required.' }),
  duration: z
    .string()
    .transform(v => Number(v))
    .pipe(
      z
        .number()
        .min(1, 'Minimum 1 hour required')
        .max(24, 'Max 24 hours per booking'),
    ),
  division: z.string().min(1, 'Division is required'),
  district: z.string().min(1, 'District is required'),
  address: z.string().min(5, 'Full address is required'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const serviceId = params.serviceId as string;
  const service = SERVICES_INFO[serviceId];

  if (!service)
    return <div className="p-10 text-center">Service Not Found</div>;

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      duration: 1,
    },
  });

  const durationValue = form.watch('duration');
  const totalCost = (Number(durationValue) || 0) * service.price;

  async function onSubmit(data: BookingFormValues) {
    setIsLoading(true);
    try {
      const payload = {
        serviceId: params.serviceId,
        serviceName: service.name,
        date: data.date,
        duration: data.duration,
        email: session?.user?.email,
        location: {
          division: data.division,
          district: data.district,
          address: data.address,
        },
      };

      console.log(payload);
      return;

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to book');

      toast('Your booking has been confirmed.');

      router.push('/my-bookings');
    } catch (error) {
      toast('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Book {service.name}</CardTitle>
              <CardDescription>
                Fill in the details to schedule your care service
                {session?.user?.email ? ` for ${session.user.email}` : ''}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Service Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={`w-full pl-3 text-left font-normal ${!field.value && 'text-muted-foreground'}`}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={date => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (Hours)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="24" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Location Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="division"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Division</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="dhaka">Dhaka</SelectItem>
                              <SelectItem value="chittagong">
                                Chittagong
                              </SelectItem>
                              <SelectItem value="sylhet">Sylhet</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Gazipur" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="House No, Road No, Area..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full text-lg py-6 mt-4"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Confirm Booking
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card className="bg-slate-50 border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{service.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">৳{service.price} / hr</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{durationValue || 0} hours</span>
              </div>

              <Separator className="bg-slate-300" />

              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Total Cost</span>
                <span className="text-2xl font-bold text-primary">
                  ৳{totalCost}
                </span>
              </div>

              <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 mt-4">
                <p className="text-xs text-yellow-800">
                  * Note: Payment will be collected after the service is
                  completed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
