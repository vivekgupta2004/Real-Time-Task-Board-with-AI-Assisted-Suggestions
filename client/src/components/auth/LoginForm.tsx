'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { loginSchema, LoginFormData } from '@/utils/auth.validation';
import { loginApi } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export const LoginForm = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await loginApi(data);
      if (response.user && response.accessToken && response.refreshToken) {
        setAuth(response.user, response.accessToken, response.refreshToken);
      }
      toast.success(response.message || 'Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMsg = error.message || error.errors?.[0]?.message || 'Invalid credentials';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-100"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
      </div>

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
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Don&apos;t have an account?{' '}
        <a href="/signup" className="text-indigo-600 font-medium hover:underline">
          Sign up
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
