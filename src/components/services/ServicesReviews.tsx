'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Star, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Link from 'next/link';

interface Review {
  _id: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Distribution {
  star: number;
  count: number;
  percentage: number;
}

export default function ServiceReviews({
  serviceId,
  service,
}: {
  serviceId: string;
  service: any;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [averageRating, setAverageRating] = useState(service.rating);
  const [totalReviews, setTotalReviews] = useState(service.reviews);
  const [distribution, setDistribution] = useState<Distribution[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    const fetchReviews = async () => {
      const res = await axios.get(`/api/services/${serviceId}/reviews`);
      setReviews(res.data.latestReviews);
      setDistribution(res.data.distribution);
    };
    fetchReviews();
  }, [serviceId]);

  return (
    <div className="space-y-10 py-10" id="reviews">
      <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
        <div className="text-center md:text-left space-y-2 flex flex-col justify-center">
          <div className="text-5xl font-bold text-gray-900">
            {Number(averageRating).toFixed(1)}
          </div>
          <div className="flex justify-center md:justify-start gap-1 text-yellow-400">
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                className={`h-5 w-5 ${i <= Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {totalReviews} verified ratings
          </p>
        </div>
        <div className="md:col-span-2 space-y-3">
          {distribution.map(item => (
            <div key={item.star} className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 w-12">
                <span className="font-bold">{item.star}</span>
                <Star className="h-3 w-3 text-gray-400" />
              </div>
              <Progress value={item.percentage} className="h-2 flex-1" />
              <span className="w-8 text-right text-gray-500">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <h4 className="font-bold text-xl text-gray-900">Recent Reviews</h4>

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-500">No reviews yet.</p>
            <p className="text-gray-400 text-sm">
              Be the first to share your experience!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 bg-white border rounded-xl shadow-sm"
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={review.userImage} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h5 className="font-bold text-gray-900">
                        {review.userName}
                      </h5>
                      <p className="text-xs text-gray-400">
                        {review.createdAt
                          ? format(new Date(review.createdAt), 'MMMM d, yyyy')
                          : 'Recent'}
                      </p>
                    </div>
                    <div className="flex text-yellow-400 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
