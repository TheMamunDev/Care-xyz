import connectDB from '@/lib/db';
import Services from '@/models/Service';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const res = await Services.find();
    return NextResponse.json(res);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
