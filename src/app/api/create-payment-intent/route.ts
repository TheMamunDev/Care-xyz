import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const SERVICES_INFO: Record<string, number> = {
  'baby-care': 500,
  'elderly-care': 600,
  'sick-care': 800,
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { serviceId, duration } = await req.json();

    const pricePerHour = SERVICES_INFO[serviceId];
    if (!pricePerHour) throw new Error('Invalid Service');

    const amount = pricePerHour * duration;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'bdt',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: session.user.id,
        serviceId,
        duration,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
