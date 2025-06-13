'use client';

import { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-red-100 p-3 rounded-full">
                                <AlertTriangle className="h-8 w-8 text-red-600" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Something went wrong!
                        </h1>

                        <p className="text-gray-600 mb-6">
                            We encountered an unexpected error. This has been logged and we'll look into it.
                        </p>

                        <div className="space-y-3">
                            <Button
                                onClick={reset}
                                className="w-full"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Try Again
                            </Button>

                            <Link href="/">
                                <Button variant="outline" className="w-full">
                                    <Home className="h-4 w-4 mr-2" />
                                    Go Home
                                </Button>
                            </Link>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                    Technical Details (Development)
                                </summary>
                                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                                    {error?.message || 'Unknown error'}
                                    {error?.stack && '\n\n' + error.stack}
                                </pre>
                            </details>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
