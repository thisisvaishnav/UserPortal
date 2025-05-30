'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { isLoggedIn, username } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-bold text-foreground">
          Welcome to Auth App
        </h1>
        
        {isLoggedIn ? (
          <>
            <p className="text-xl text-muted-foreground">
              Hello, <span className="font-semibold text-foreground">{username}</span>! 
              You&apos;re successfully logged in.
            </p>
            <p className="text-lg text-muted-foreground">
              This is a secure area of the application. Explore the features available to authenticated users.
            </p>
          </>
        ) : (
          <>
            <p className="text-xl text-muted-foreground">
              Experience our modern authentication system built with Next.js, TypeScript, and Tailwind CSS.
            </p>
            <p className="text-lg text-muted-foreground">
              Get started by creating an account or logging in to access exclusive features.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" tabIndex={0} aria-label="Get started with signup">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="lg"
                  tabIndex={0}
                  aria-label="Login to existing account"
                >
                  Login
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
