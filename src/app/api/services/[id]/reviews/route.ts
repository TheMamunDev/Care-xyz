import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Service from '@/models/Service';

import mongoose from 'mongoose';
import Review from '@/models/Reviews';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await connectDB();

    const service = await Service.findOne({
      $or: [{ id: id }, { slug: id }],
    });

    if (!service) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 },
      );
    }
    const latestReviews = await Review.find({ serviceId: service._id })
      .sort({ createdAt: -1 })
      .limit(5);
    const stats = await Review.aggregate([
      { $match: { serviceId: service._id } },
      {
        $group: {
          _id: { $round: ['$rating', 0] },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalReviews = await Review.countDocuments({
      serviceId: service._id,
    });
    const distribution = [5, 4, 3, 2, 1].map(star => {
      const found = stats.find(s => s._id === star);
      const count = found ? found.count : 0;
      const percentage = totalReviews
        ? Number(((count / totalReviews) * 100).toFixed(1))
        : 0;

      return { star, count, percentage };
    });

    return NextResponse.json({
      latestReviews,
      totalReviews,
      distribution,
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching reviews' },
      { status: 500 },
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { rating, comment, bookingId } = await req.json();
    if (!rating || !comment) {
      return NextResponse.json(
        { message: 'Rating and comment required' },
        { status: 400 },
      );
    }
    await connectDB();
    const service = await Service.findOne({ id });
    if (!service) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 },
      );
    }
    const existingReview = await Review.findOne({
      bookingId,
    });
    if (existingReview) {
      return NextResponse.json(
        { message: 'You have already reviewed this service' },
        { status: 400 },
      );
    }
    const newReview = await Review.create({
      serviceId: service._id,
      userId: session.user.id,
      bookingId,
      userName: session.user.name,
      userImage: session.user.image,
      rating: Number(rating),
      comment,
    });
    const stats = await Review.aggregate([
      { $match: { serviceId: service._id } },
      {
        $group: {
          _id: '$serviceId',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      service.rating = stats[0].averageRating.toFixed(2);
      service.reviews = stats[0].totalReviews;
      await service.save();
    }

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
