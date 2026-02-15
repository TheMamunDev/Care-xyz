import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Service from '@/models/Service';
import { z } from 'zod';

const serviceSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(0),
  image: z.string().url(),
  features: z.array(z.string()),
  longDescription: z.string().min(10),
  tagLine: z.string().min(5),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();

    const validation = serviceSchema.safeParse(body);
    if (!validation.success) {
      console.log(validation.error);
      return NextResponse.json(
        { message: 'Invalid data', errors: validation.error },
        { status: 400 },
      );
    }

    const {
      title,
      description,
      price,
      image,
      features,
      longDescription,
      tagLine,
    } = validation.data;

    const slug = title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');

    await connectDB();

    const existing = await Service.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { message: 'Service with this name already exists' },
        { status: 409 },
      );
    }

    const newService = await Service.create({
      title,
      id: slug,
      description,
      longDescription,
      pricePerHour: price,
      image,
      tagline: tagLine,
      features,
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
