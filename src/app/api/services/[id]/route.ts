import connectDB from '@/lib/db';
import Services from '@/models/Service';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    let service;
    if (!service) {
      service = await Services.findOne({ id: id });
    }

    if (!service) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(service);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
