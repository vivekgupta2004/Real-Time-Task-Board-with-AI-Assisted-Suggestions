'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { signupSchema, SignupFormData } from '@/utils/auth.validation';
import { signupApi } from '@/services/auth.service';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export const SignupForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const response = await signupApi(data);
      toast.success(response.message || 'Registration successful!');
      router.push('/login');
    } catch (error: any) {
      const errorMsg = error.message || error.errors?.[0]?.message || 'Registration failed';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-sm text-gray-500 mt-1">Get started with Real-Time Task Board</p>
      </div>

      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        disabled={isLoading}
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="you@gmail.com"
        disabled={isLoading}
        {...register('email')}
        error={errors.email?.message}
      />

      <div>
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
          {...register('password')}
          error={errors.password?.message}
        />
        <p className="text-[11px] text-gray-500 mt-1">
          Must be at least 8 chars with uppercase, lowercase, number & special char.
        </p>
      </div>

      <Button type="submit" isLoading={isLoading} disabled={isLoading} className="w-full mt-2">
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;

