import { createFileRoute, Link } from "@tanstack/react-router";
import type { JSX } from "react";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function LoginPage(): JSX.Element {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign in
  };

  return (
      <div className="relative z-10">
        {/* Top navigation tabs */}
        <div className="flex justify-end mb-6">
          <div className="inline-flex rounded-full p-1 bg-[#3A52A6]">
            <button 
              className="px-4 py-1.5 rounded-full text-xs text-[#F0F7FF] transition-all bg-[#607EF2]"
            >
              Log In
            </button>
            <Link 
              to="/register"
              className="px-4 py-1.5 rounded-full text-xs text-[#F0F7FF] opacity-50 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Log In card */}
        <div className="rounded-3xl py-6 px-10 shadow-[1px_1px_4px_1px_rgba(96,126,242,0.5)] bg-[#F0F7FF]">
          <div className="text-center mb-8">
            <h1 className="text-2xl mb-1 text-[#3F58B2]">
              Log In
            </h1>
            <p className="text-[11px] text-[#8C8C8C]">
              Don't have an account?{" "}
              <Link 
                to="/register"
                className="text-[#3A52A6] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full px-4 py-3 rounded-lg text-xs focus:outline-none focus:ring-1 focus:border-[#3A52A6] focus:ring-[#3A52A6] transition-all bg-transparent border border-[#C4CBD5] text-[#111827] placeholder:text-[#C4CBD5]" 
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full px-4 py-3 rounded-lg text-xs focus:outline-none focus:ring-1 focus:border-[#3A52A6] focus:ring-[#3A52A6] transition-all bg-transparent border border-[#C4CBD5] text-[#111827] placeholder:text-[#C4CBD5]"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs mb-8">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3 h-3 rounded border-[#C4CBD5] text-[#3A52A6] focus:ring-[#3A52A6] cursor-pointer"
                />
                <span className="ml-1 text-[#8C8C8C] text-xs">Remember Me</span>
              </label>
              <Link 
                to="/"
                className="text-[#3A52A6] text-xs hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-lg text-[#F0F7FF] text-xs cursor-pointer shadow-md hover:shadow-lg transition-all bg-[#3A52A6]"
            >
              Log In
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-dashed border-[#3A52A6] opacity-50"></div>
            <span className="px-2 text-[10px] text-[#8C8C8C]">
              Or log in with
            </span>
            <div className="flex-1 border-t border-dashed border-[#3A52A6] opacity-50"></div>
          </div>

          {/* Google sign up button */}
          <div className="flex justify-center">
            <button
              onClick={handleGoogleSignIn}
              className="w-12 h-12 flex items-center justify-center rounded-full hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.25)] transition-all bg-[#F0F7FF] shadow-[0_2px_4px_0_rgba(0,0,0,0.25)] cursor-pointer"
            >
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.8055 10.2292C19.8055 9.55108 19.7493 8.86855 19.6289 8.2019H10.2002V11.9897H15.6014C15.3774 13.2001 14.6571 14.2669 13.6084 14.9582V17.4278H16.8330C18.7178 15.6889 19.8055 13.1734 19.8055 10.2292Z" fill="#4285F4"/>
                <path d="M10.2002 19.8311C12.8571 19.8311 15.0658 18.9774 16.8371 17.4278L13.6125 14.9582C12.7177 15.5634 11.5589 15.9042 10.2043 15.9042C7.64452 15.9042 5.49849 14.1489 4.70479 11.7836H1.38672V14.3212C3.19618 17.9165 6.54004 19.8311 10.2002 19.8311Z" fill="#34A853"/>
                <path d="M4.70068 11.7836C4.26158 10.5732 4.26158 9.25877 4.70068 8.04835V5.51074H1.38668C-0.0687425 8.37466 -0.0687425 11.4573 1.38668 14.3212L4.70068 11.7836Z" fill="#FBBC04"/>
                <path d="M10.2002 4.92786C11.6287 4.90597 13.0043 5.45676 14.0244 6.45644L16.8861 3.59466C15.0005 1.82575 12.546 0.840077 10.2002 0.870088C6.54004 0.870088 3.19618 2.78471 1.38672 6.38017L4.70072 8.91778C5.48644 6.54806 7.63654 4.92786 10.2002 4.92786Z" fill="#EA4335"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
  );
}