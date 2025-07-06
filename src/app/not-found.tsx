'use client';

import { MessageSquareX, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const NotFound = () => {
  const router = useRouter();
    
  const [count, setCount] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [count]);

  useEffect(() => {
    if (count === 0) router.push('/');
  }, [count, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <MessageSquareX className="w-24 h-24 mx-auto text-gray-500 animate-pulse" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <h2 className="text-xl text-gray-400">Message Not Found</h2>
          <p className="text-gray-500">
            The anonymous route you&apos;re looking for seems to have disappeared into the digital void.
            Perhaps it was never here, or maybe it&apos;s been lost in transmission.
          </p>
          <p className="text-gray-500">
            Redirecting to the home page in {count} seconds.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;