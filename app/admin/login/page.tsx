'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const loadingToast = toast.loading('Signing in...');

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        setError(error.message || 'Login failed. Please try again.');
        toast.error(error.message || 'Login failed. Please try again.', { id: loadingToast });
      } else {
        toast.success('Login successful! Redirecting...', { id: loadingToast });
        // Redirect to admin dashboard
        router.push('/admin/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred. Please try again.', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-white dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 flex flex-1 justify-center items-center py-5">
          <div className="layout-content-container flex flex-col max-w-md w-full flex-1">
            <div className="flex flex-col gap-8 p-4">
              {/* Header */}
              <div className="flex flex-col gap-4 text-center">
                {/* Logo */}
                <div className="flex justify-center mb-2">
                  <div className="h-16 w-16">
                    <img 
                      src="/adrigologo.png" 
                      alt="Rivora Logo" 
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <p className="text-[#131616] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  Admin Login
                </p>
                <p className="text-[#6c7f7f] dark:text-gray-400 text-base font-normal leading-normal">
                  Welcome back. Please enter your details.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Email Field */}
                <label className="flex flex-col w-full flex-1">
                  <p className="text-[#131616] dark:text-white text-base font-medium leading-normal pb-2">
                    Email Address
                  </p>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#131616] dark:text-white dark:bg-background-dark/50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dee3e3] dark:border-gray-700 bg-white focus:border-primary h-14 placeholder:text-[#6c7f7f] p-[15px] text-base font-normal leading-normal transition-all hover:border-gray-400 dark:hover:border-gray-600"
                    placeholder="Enter your email address"
                    required
                  />
                </label>

                {/* Password Field */}
                <label className="flex flex-col w-full flex-1">
                  <p className="text-[#131616] dark:text-white text-base font-medium leading-normal pb-2">
                    Password
                  </p>
                  <div className="flex w-full flex-1 items-stretch">
                    <input
                      name="password"
                      type={isPasswordVisible ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#131616] dark:text-white dark:bg-background-dark/50 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dee3e3] dark:border-gray-700 bg-white focus:border-primary h-14 placeholder:text-[#6c7f7f] p-[15px] rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal transition-all hover:border-gray-400 dark:hover:border-gray-600"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      aria-label="Toggle password visibility"
                      className="text-[#6c7f7f] dark:text-gray-400 flex border border-[#dee3e3] dark:border-gray-700 bg-white dark:bg-background-dark/50 items-center justify-center pr-[15px] rounded-r-xl border-l-0 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                    >
                      <span className="material-symbols-outlined">
                        {isPasswordVisible ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </label>

                {/* Submit Button and Forgot Password */}
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex min-w-[84px] max-w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-6 flex-1 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 dark:focus:ring-offset-background-dark shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span className="truncate flex items-center gap-2">
                      {loading ? (
                        <>
                          <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                          Signing in...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-lg">login</span>
                          Login
                        </>
                      )}
                    </span>
                  </button>
                  <a
                    href="#"
                    className="text-[#6c7f7f] dark:text-gray-400 text-sm font-normal leading-normal text-center underline hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
