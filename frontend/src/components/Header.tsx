'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const { isLoggedIn, username, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-foreground">
            Auth App
          </Link>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, <span className="font-semibold text-foreground">{username}</span>
                </span>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  tabIndex={0}
                  aria-label="Logout from account"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button 
                    variant="ghost"
                    tabIndex={0}
                    aria-label="Navigate to login page"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    tabIndex={0}
                    aria-label="Navigate to signup page"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 