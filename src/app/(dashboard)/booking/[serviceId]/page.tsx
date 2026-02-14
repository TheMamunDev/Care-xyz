'use client';

import { useState, useEffect } from 'react';
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

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CheckoutForm from '@/components/payment/ChekoutForm';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const bookingSchema = z.object({
  date: z.date(),
  duration: z
    .number()
    .min(1, 'Minimum 1 hour required')
    .max(24, 'Max 24 hours per booking'),
  division: z.string().min(1, 'Division is required'),
  district: z.string().min(1, 'District is required'),
  address: z.string().min(5, 'Full address is required'),

  paymentPreference: z.enum(['pay-now', 'pay-later'], {
    error: 'Please select a payment method',
  }),
});

type BookingFormValues = z.infer<typeof bookingSchema>;
type BookingFormOutput = z.output<typeof bookingSchema>;
export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [service, setService] = useState<any>(null);
  const [isServiceLoading, setIsServiceLoading] = useState(true);

  const [clientSecret, setClientSecret] = useState('');
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const serviceId = params.serviceId as string;

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`/api/services/${serviceId}`);
        if (res.ok) {
          const data = await res.json();
          setService(data);
        } else {
          toast.error('Service not found');
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch service details');
      } finally {
        setIsServiceLoading(false);
      }
    };

    if (serviceId) fetchService();
  }, [serviceId]);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      duration: 1,
      paymentPreference: 'pay-later',
    },
  });

  const durationValue = form.watch('duration');
  const paymentPreference = form.watch('paymentPreference');
  const totalCost = (Number(durationValue) || 0) * (service?.pricePerHour || 0);

  async function saveBookingToDb(
    data: BookingFormValues,
    paymentStatus: 'Paid' | 'Unpaid',
    transactionId?: string,
  ) {
    try {
      const payload = {
        serviceId: params.serviceId,
        serviceName: service.title,
        date: data.date,
        duration: data.duration,
        email: session?.user?.email,
        paymentPreference: data.paymentPreference,
        paymentStatus: paymentStatus,
        transactionId: transactionId || null,
        location: {
          division: data.division,
          district: data.district,
          address: data.address,
        },
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to book');

      toast.success(
        paymentStatus === 'Paid'
          ? 'Payment successful! Booking confirmed.'
          : 'Your booking has been confirmed.',
      );

      setPaymentModalOpen(false);
      router.push('/my-bookings');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data: BookingFormValues) {
    if (data.paymentPreference === 'pay-later') {
      setIsLoading(true);
      await saveBookingToDb(data, 'Unpaid');
    } else {
      setIsLoading(true);
      try {
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId: params.serviceId,
            duration: data.duration,
          }),
        });

        const { clientSecret } = await res.json();

        if (!clientSecret) throw new Error('Failed to initialize payment');

        setClientSecret(clientSecret);
        setPaymentModalOpen(true);
      } catch (err) {
        toast.error('Could not initiate payment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  }

  if (isServiceLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!service)
    return <div className="p-10 text-center">Service Not Found</div>;

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Book {service.title}</CardTitle>
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
                  {/* Date Field */}
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

                  {/* Duration Field */}
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (Hours)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            max="24"
                            value={field.value ?? ''}
                            onChange={e =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Location Details
                  </h3>

                  {/* Location Fields */}
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

                  {/* Payment Preference */}
                  <FormField
                    control={form.control}
                    name="paymentPreference"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="pay-later"
                                value="pay-later"
                                checked={field.value === 'pay-later'}
                                onChange={field.onChange}
                                className="accent-primary h-4 w-4"
                              />
                              <label
                                htmlFor="pay-later"
                                className="text-sm font-medium"
                              >
                                Pay Later (Cash on Delivery)
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="pay-now"
                                value="pay-now"
                                checked={field.value === 'pay-now'}
                                onChange={field.onChange}
                                className="accent-primary h-4 w-4"
                              />
                              <label
                                htmlFor="pay-now"
                                className="text-sm font-medium"
                              >
                                Pay Now (Stripe Secure)
                              </label>
                            </div>
                          </div>
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
                    {paymentPreference === 'pay-now'
                      ? 'Proceed to Payment'
                      : 'Confirm Booking'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card className="bg-slate-50 border-slate-200 sticky top-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{service.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">
                  ৳{service.pricePerHour} / hr
                </span>
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
                  {paymentPreference === 'pay-now'
                    ? '* Note: You will be redirected to a secure popup to complete payment via Stripe.'
                    : '* Note: Payment will be collected after the service is completed.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* STRIPE PAYMENT MODAL */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                  onSuccess={transactionId => {
                    saveBookingToDb(form.getValues(), 'Paid', transactionId);
                  }}
                />
              </Elements>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
