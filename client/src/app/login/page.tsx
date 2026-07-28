import LoginForm from '@/components/auth/LoginForm';
import GuestRoute from '@/components/auth/GuestRoute';

export default function LoginPage() {
  return (
    <GuestRoute>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    </GuestRoute>
  );
}
