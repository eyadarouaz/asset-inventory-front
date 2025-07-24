'use client';
import { useState } from 'react';
import { forgotPassword } from '@/services/auth';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';
import Link from 'next/link';
import { ChevronLeftIcon } from '@/icons';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      await forgotPassword(email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md mx-auto sm:pt-10 mb-5">
        <Link
          href="/signin"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400"
        >
          <ChevronLeftIcon /> Back to Sign in
        </Link>
      </div>

      <div className="flex flex-col justify-center w-full max-w-md mx-auto">
        <h1 className="text-title-md font-semibold mb-2 dark:text-white">Forgot Password?</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Enter your email and we’ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <Label>Email<span className="text-error-500">*</span></Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            {message && <p className="text-green-600 text-sm">{message}</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button type="submit" size="sm" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
