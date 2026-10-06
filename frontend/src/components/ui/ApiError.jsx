import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';

/**
 * Reusable error card with retry button.
 * @param {{ error: Error, retry: () => void, className?: string }} props
 */
const ApiError = ({ error, retry, className = '' }) => (
  <Card className={`p-8 border-red-100 bg-red-50/50 rounded-3xl text-center space-y-4 ${className}`}>
    <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
      <AlertCircle size={28} />
    </div>
    <div className="space-y-2">
      <h4 className="text-lg font-bold text-red-900">Something went wrong</h4>
      <p className="text-sm text-red-600/80 max-w-md mx-auto">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
    </div>
    {retry && (
      <Button
        variant="outline"
        onClick={retry}
        className="rounded-2xl border-red-200 text-red-700 hover:bg-red-100 font-bold"
      >
        <RefreshCw size={16} className="mr-2" />
        Try Again
      </Button>
    )}
  </Card>
);

export default ApiError;
