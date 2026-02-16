import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Service from '@/models/Service';
import { z } from 'zod';

const serviceSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().min(0),
  image: z.string().url(),
  features: z.array(z.string()),
  longDescription: z.string().min(10),
  tagLine: z.string().min(5),
  isActive: z.boolean().optional(),
});

export async function GET(req: Request) {
  try {
    await connectDB();
    const services = await Service.find({}).sort({ createdAt: -1 });
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching services' },
      { status: 500 },
    );
  }
}

// POST: Create New Service
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
    const existing = await Service.findOne({ id: slug });
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
      isActive: true,
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

// PATCH: Update Existing Service
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { _id, ...data } = body;

    if (!_id) {
      return NextResponse.json(
        { message: 'Service ID is required' },
        { status: 400 },
      );
    }

    const validation = serviceSchema.safeParse(data);
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
      isActive,
    } = validation.data;

    await connectDB();
    const updatedService = await Service.findByIdAndUpdate(
      _id,
      {
        title,
        description,
        longDescription,
        pricePerHour: price,
        image,
        tagline: tagLine,
        features,
        isActive,
      },
      { new: true },
    );

    if (!updatedService) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedService);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}

// DELETE: Remove Service
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'ID required' }, { status: 400 });
    }

    await connectDB();
    const deleted = await Service.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
  }
}
