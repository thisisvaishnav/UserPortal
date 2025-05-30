import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] p-8">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-3xl font-semibold text-foreground">Page Not Found</h2>
        <p className="text-lg text-muted-foreground max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button 
            size="lg"
            tabIndex={0}
            aria-label="Go back to home page"
          >
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
} 