'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Star, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

const ReviewForm = ({
  serviceId,
  onSuccess,
  bookingId,
}: {
  serviceId: string;
  onSuccess?: () => void;
  bookingId: string;
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isHovering, setIsHovering] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a star rating.');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`/api/services/${serviceId}/reviews`, {
        rating,
        comment,
        bookingId,
      });
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(0);
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message;

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {session ? (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h4 className="font-semibold mb-4 text-lg">Write a Review</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`transition-all duration-200 hover:scale-110 p-1 ${
                      star <= (isHovering || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-200'
                    }`}
                    onMouseEnter={() => setIsHovering(star)}
                    onMouseLeave={() => setIsHovering(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </button>
                ))}
                <span className="ml-3 text-sm text-gray-500 self-center font-medium">
                  {rating > 0
                    ? ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][
                        rating - 1
                      ]
                    : 'Select'}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Experience
              </label>
              <Textarea
                placeholder="Share details of your own experience with this service..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button disabled={isLoading || rating === 0} className="px-8">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post Review
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg text-center">
          <p className="text-blue-800 mb-3">Want to share your experience?</p>
          <Link href="/login">
            <Button
              variant="outline"
              className="bg-white hover:bg-blue-50 text-blue-700 border-blue-200"
            >
              Log in to write a review
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
