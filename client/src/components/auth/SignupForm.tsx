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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-sm text-gray-500 mt-1">Get started with Real-Time Task Board</p>
      </div>

      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        {...register('email')}
        error={errors.email?.message}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        {...register('password')}
        error={errors.password?.message}
      />

      <Button type="submit" isLoading={isLoading}>
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-indigo-600 font-medium hover:underline">
          Sign in
        </a>
      </p>
    </form>
  );
};

export default SignupForm;
