import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { usePageTitle } from "@/hooks/use-page-title";
import Toast from "@/components/Toast";
import { SiGoogle } from "react-icons/si";
import type { JSX } from "react";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

function LoginPage(): JSX.Element {
  usePageTitle("Log In");
  
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    setToastConfig({
      type: "success",
      title: "Success",
      message: "Login Successful!",
    });
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
      // navigate({ to: "/welcome" });
    }, 2500);
    
    // Handle login logic 
  };

  const handleGoogleSignIn = () => {
    setToastConfig({
      type: "error",
      title: "Error",
      message: "Unable to connect to Google services.",
    });
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
    
    // Handle Google sign in
  };

  return (
    <>
      <Toast
        visible={showToast}
        type={toastConfig.type}
        title={toastConfig.title}
        message={toastConfig.message}
      />
      
      <motion.div 
        className="rounded-3xl py-6 px-10 md:py-8 md:px-12 lg:py-6 lg:px-10 sm:py-5 sm:px-6 shadow-[1px_1px_4px_1px_rgba(96,126,242,0.5)] bg-[#F0F7FF] min-h-[520px] sm:min-h-[480px] w-full max-w-md mx-auto"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div>
          <div className="text-center mb-8 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl mb-1 text-[#3F58B2]">
              Log In
            </h1>
            <p className="text-[10px] sm:text-[11px] text-[#8C8C8C]">
              Don't have an account?{" "}
              <Link 
                to="/register"
                className="text-[#3A52A6] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="space-y-4 sm:space-y-3">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-[11px] text-[#111827] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter Email"
                className="w-full px-4 py-3 sm:px-3 sm:py-2.5 rounded-lg text-xs sm:text-[11px] focus:outline-none focus:ring-1 focus:border-[#3A52A6] focus:ring-[#3A52A6] transition-all bg-transparent border border-[#C4CBD5] text-[#111827] placeholder:text-[#C4CBD5]" 
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-[11px] text-[#111827] mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter Password"
                className="w-full px-4 py-3 sm:px-3 sm:py-2.5 rounded-lg text-xs sm:text-[11px] focus:outline-none focus:ring-1 focus:border-[#3A52A6] focus:ring-[#3A52A6] transition-all bg-transparent border border-[#C4CBD5] text-[#111827] placeholder:text-[#C4CBD5]"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs mt-5 sm:mt-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3 h-3 sm:w-2.5 sm:h-2.5 rounded border-[#C4CBD5] text-[#3A52A6] focus:ring-[#3A52A6] cursor-pointer"
                />
                <span className="ml-1 text-[#8C8C8C] text-xs sm:text-[11px]">Remember Me</span>
              </label>
              <Link 
                to="/"
                className="text-[#3A52A6] text-xs sm:text-[11px] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 sm:py-2.5 mt-8 sm:mt-6 rounded-lg text-[#F0F7FF] text-xs sm:text-[11px] cursor-pointer shadow-md hover:shadow-lg transition-all bg-[#3A52A6]"
            >
              Log In
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-5 sm:my-4">
            <div className="flex-1 border-t border-dashed border-[#3A52A6] opacity-50"></div>
            <span className="px-2 text-[10px] sm:text-[9px] text-[#8C8C8C]">
              Or log in with
            </span>
            <div className="flex-1 border-t border-dashed border-[#3A52A6] opacity-50"></div>
          </div>

          {/* Google sign in button */}
          <div className="flex justify-center">
            <button
              onClick={handleGoogleSignIn}
              className="w-12 h-12 flex items-center justify-center rounded-full hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.25)] transition-all bg-[#F0F7FF] shadow-[0_2px_4px_0_rgba(0,0,0,0.25)] cursor-pointer"
            >
              <SiGoogle size={24} className="text-[#3A52A6] sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}