import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f9] dark:bg-[#1a1a1c] p-4 text-center">
      <div className="bg-white dark:bg-[#202124] p-8 sm:p-12 rounded-[28px] shadow-xl max-w-md w-full border border-gray-100 dark:border-[#5f6368]/30">
        <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
          <span className="text-white font-bold text-2xl">404</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Page not found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-full transition-colors shadow-sm"
        >
          Return to Notes
        </Link>
      </div>
    </div>
  );
}
