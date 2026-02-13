'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const CTA = () => {
  const { data: session } = useSession();
  return (
    <section className="py-20 bg-primary text-primary-foreground text-center">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to find the perfect care?
        </h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of families who trust Care.xyz for their loved ones.
          Secure, reliable, and always there when you need us.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {session ? (
            <Link href="/services">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto text-primary font-bold"
              >
                View Services
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto text-primary font-bold"
              >
                Create Free Account
              </Button>
            </Link>
          )}
          <Link href="/contact">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto  hover:bg-white/10 hover:text-white"
            >
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;
