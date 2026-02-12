import connectDB from '@/lib/db';
import Services from '@/models/Service';
import { NextResponse } from 'next/server';

export default async function GET(req: Request) {
  try {
    await connectDB();
    const res = await Services.find();
    return NextResponse.json(res);
  } catch (err) {
    console.log(err);
  }
}
