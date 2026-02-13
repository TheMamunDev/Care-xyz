import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-secondary/20 px-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative bg-white p-6 rounded-full shadow-xl border-4 border-white">
          <HelpCircle className="h-20 w-20 text-primary" />
        </div>
      </div>

      <h1 className="text-8xl font-black text-gray-900 tracking-tighter mb-2">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        Oops! We can't find that page.
      </h2>
      <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
        It seems like the page you are looking for has wandered off. Don't
        worry, we can help you get back to safety.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link href="/">
          <Button
            size="lg"
            className="w-full sm:w-auto font-bold gap-2 shadow-lg hover:shadow-primary/20 transition-all"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Button>
        </Link>
        <Link href="/services">
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto font-medium gap-2 bg-white hover:bg-gray-50"
          >
            Browse Services
          </Button>
        </Link>
      </div>

      <div className="mt-12 text-sm text-gray-500">
        Need urgent help?{' '}
        <Link
          href="/contact"
          className="text-primary hover:underline font-semibold"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
