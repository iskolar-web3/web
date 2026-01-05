import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import Toast from "@/components/Toast";
import { useToast } from '@/hooks/useToast';
import Preloader from "@/components/Preloader";
import { SiGoogle } from "react-icons/si";
import type { JSX } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { BACKEND_URL, type ApiResponse } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "@/lib/cookie";
import type { AuthSession } from "@/lib/user/model";
import { REFRESH_TOKEN_KEY } from "@/lib/user/auth";
// import { handleError } from '@/lib/errorHandler';
// import { logger } from "@/lib/logger";
// import { authService } from '@/services/auth.service';
// import { profileService } from '@/services/profile.service';

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
});

// Login Validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

async function login(value: LoginFormData): Promise<AuthSession> {
	const response = await fetch(`${BACKEND_URL}/login`, {
		method: "POST",
		body: JSON.stringify(value),
		headers: { "Content-Type": "application/json" },
	});
	const result: ApiResponse<AuthSession> = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Login failed");
	}

	return result.data;
}

function LoginPage(): JSX.Element {
  usePageTitle("Log In");
  
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const { toast, showSuccess, showError } = useToast();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     setLoading(true);
  //     try {
  //       const hasToken = await authService.hasValidToken();
  //       if (hasToken) {
  //         const result = await profileService.getProfileStatus();

  //         if (result.user?.role === 'student') {
  //           navigate({ to: '/home', replace: true });
  //         } else if (result.user?.role === 'individual_sponsor' || result.user?.role === 'organization_sponsor' || result.user?.role === 'government_sponsor') {
  //           navigate({ to: '/my-scholarships', replace: true });
  //         }
  //       }
  //     } catch (e) {
  //       // Ignore
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   checkAuth();
  // }, []);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", 
    defaultValues: {
      rememberMe: false
    },
  });
  
  const mutation = useMutation({
      mutationFn: login,
      onSuccess: async (res) => {
        showSuccess(`Success`, 'Login successful', 1250);
        setLoading(false);
        setCookie(REFRESH_TOKEN_KEY, res.token);
        await navigate({ to: "/welcome" });
      }
  })
  
  const onSubmit = async (value: LoginFormData) => {
    setLoading(true);
    mutation.mutate(value)
  };

  const handlePreloaderComplete = () => {
    // const profileResult = await profileService.getProfileStatus();
    // if (profileResult.user?.role === 'student') {
    //   navigate({ to: '/home', replace: true });
    // } else if (profileResult.user?.role === 'individual_sponsor' || profileResult.user?.role === 'organization_sponsor' || profileResult.user?.role === 'government_sponsor') {
    //   navigate({ to: '/my-scholarships', replace: true });
    // } else {
    //   navigate({ to: "/welcome" });
    // }
    
    // For now, navigate to welcome page
    navigate({ to: "/welcome" });
  };

  const handleGoogleSignIn = () => {
    showError( `Error`, 'Google Auth is not available at the moment.', 2500);
    
    // Handle Google sign in
  };

  const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    showError(`Error`, 'Forgot password feature is not available yet.', 2500);
  };

  return (
    <>
      {showPreloader && (
        <Preloader 
          onComplete={handlePreloaderComplete}
          minDisplayTime={2000}
        />
      )}
      
      {toast && <Toast {...toast} />}
      
      {!showPreloader && (
      <motion.div 
        className="rounded-3xl py-6 px-10 md:py-8 md:px-12 lg:py-6 lg:px-10 sm:py-5 sm:px-6 shadow-[1px_1px_4px_1px_rgba(96,126,242,0.5)] bg-[#F0F7FF] min-h-[450px] sm:min-h-[480px] w-full max-w-md mx-auto"
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
            <p className="text-[11px] sm:text-xs text-[#8C8C8C]">
              Don't have an account?{" "}
              <Link 
                to="/register"
                className="text-secondary hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-3">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-[11px] text-primary mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter Email"
                {...form.register("email")}
                disabled={loading}
                className={`w-full px-4 py-3 sm:px-3 sm:py-2.5 rounded-lg text-xs sm:text-[11px] focus:outline-none focus:ring-1 transition-all bg-transparent border text-primary placeholder:text-[#C4CBD5] ${
                  form.formState.errors.email
                    ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]"
                    : "border-[#C4CBD5] focus:border-[#3A52A6] focus:ring-[#3A52A6]"
                }`}
              />
              {form.formState.errors.email && (
                <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs sm:text-[11px] text-primary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  {...form.register("password")}
                  disabled={loading}
                  className={`w-full px-4 py-3 sm:px-3 sm:py-2.5 pr-10 rounded-lg text-xs sm:text-[11px] focus:outline-none focus:ring-1 transition-all bg-transparent border text-primary placeholder:text-[#C4CBD5] ${
                    form.formState.errors.password
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]"
                      : "border-[#C4CBD5] focus:border-[#3A52A6] focus:ring-[#3A52A6]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8C8C] hover:text-secondary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-3.5 sm:h-3.5 transition-transform duration-200" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5 transition-transform duration-200" />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs mt-5 sm:mt-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...form.register("rememberMe")}
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded border-[#C4CBD5] text-secondary focus:ring-[#3A52A6] cursor-pointer"
                />
                <span className="ml-1 text-[#8C8C8C] text-xs sm:text-[11px]">Remember Me</span>
              </label>
              {/* Uncomment when forgot password is available */}
              {/* <Link 
                to="/"
                className="text-secondary text-xs sm:text-[11px] hover:underline"
              >
                Forgot password?
              </Link> */}
              <a 
                href="#"
                onClick={handleForgotPassword}
                className="text-secondary text-xs sm:text-[11px] hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className={`w-full py-3 sm:py-3 mt-6 sm:mt-5 rounded-lg text-[#F0F7FF] text-xs sm:text-[11px] cursor-pointer hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] active:shadow-md transition-all bg-[#3A52A6] ${
                loading && "opacity-60 cursor-not-allowed"
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </span>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </form>

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
              type="button"
              className="w-12 h-12 flex items-center justify-center rounded-full hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.25)] transition-all bg-[#F0F7FF] shadow-[0_2px_4px_0_rgba(0,0,0,0.25)] cursor-pointer"
            >
              <SiGoogle size={24} className="text-secondary sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </motion.div>
      )}
    </>
  );
}
