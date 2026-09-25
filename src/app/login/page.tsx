"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useAuth, DEFAULT_USER } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";

  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to destination
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(redirectPath);
    }
  }, [isAuthenticated, authLoading, router, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);

    // Validation
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your email or username");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters long");
      return;
    }

    setIsSubmitting(true);
    const result = await login(cleanEmail, password);

    if (result.success) {
      router.push(redirectPath);
    } else {
      setError(result.error || "Invalid credentials. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail(DEFAULT_USER.email);
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f9] dark:bg-[#1a1a1c] p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-[#202124] p-6 sm:p-10 rounded-[28px] shadow-xl w-full max-w-[440px] flex flex-col items-center border border-gray-100 dark:border-[#5f6368]/30 transition-colors">
        {/* App Logo */}
        <div className="mb-3 flex items-center justify-center">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
            <Image
              src="/Logo.png"
              alt="Note-X Logo"
              width={64}
              height={64}
              className="object-contain drop-shadow-md"
              priority
              style={{ width: "auto", height: "auto", maxHeight: "64px" }}
            />
          </div>
        </div>

        <h1 className="text-2xl sm:text-[26px] font-normal text-gray-900 dark:text-gray-100 mb-1">
          Sign in
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base font-normal">
          to continue to <span className="font-semibold text-gray-800 dark:text-gray-200">Note-X</span>
        </p>

        {/* Error message */}
        {error && (
          <div className="w-full mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-center gap-2.5 text-red-700 dark:text-red-400 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Email or username
            </label>
            <input
              id="email"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 text-sm sm:text-base"
              placeholder="e.g. mohammadshahbaj068@gmail.com"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 pr-11 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 text-sm sm:text-base"
                placeholder="Enter your password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-md"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Quick Demo Pre-fill Button */}
          <div className="flex justify-between items-center text-xs mt-1">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Fill demo credentials
            </button>
            <span className="text-gray-400 dark:text-gray-500">
              Demo account
            </span>
          </div>

          {/* Buttons */}
          <div className="w-full flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => {
                setError(
                  "Note-X demo uses any valid username with at least a 4-character password."
                );
              }}
              className="text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-950/30 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              Need help?
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-7 py-2.5 rounded-full font-medium transition-all shadow-sm flex items-center justify-center gap-2 min-w-[100px] disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Next"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f0f4f9] dark:bg-[#1a1a1c]">
          <div className="animate-pulse text-gray-500">Loading...</div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}