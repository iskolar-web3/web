import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import Toast from "@/components/Toast";
import { useToast } from '@/hooks/useToast';
import { SiGoogle } from "react-icons/si";
import type { JSX } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react"; 
import { handleError } from '@/lib/errorHandler';
import { logger } from "@/lib/logger";
// import { authService } from '@/services/auth.service';
// import { profileService } from '@/services/profile.service';

export const Route = createFileRoute("/_auth/register")({
  component: RegisterPage,
});

// Registration Validation
const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_\-+.,:;])/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterPage(): JSX.Element {
  usePageTitle("Sign Up");

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur", 
  });
  
  const onSubmit = async (data: RegisterFormData) => {
    // try {
    //   setLoading(true);

    //   const result = await authService.register({
    //     email: data.email,
    //     password: data.password,
    //     confirm_password: data.confirmPassword,
    //   })

    //   if(result.success) {
    //     showSuccess(`Success`, result.message, 1250); 
    
    //     setTimeout(() => {
    //       navigate({ to: "/login" });
    //     }, 1300);
    //   } else {
    //     showError(`Error`, result.error, 2500);
    //   }
    // } catch(error) {
    //   const handled = handleError(error, 'Unable to load scholarship details.');
    //   logger.error('Failed to load scholarship:', handled.raw);
    //   showError(`Error`, error.message, 2500);
    // } finally {
    //   setLoading(false);
    // }

    // Simulate
    setLoading(true);
    showSuccess(`Success`, 'Login successful', 1250);

    setTimeout(() => {
      setLoading(false);
      navigate({ to: "/login" });
    }, 1300);
  };

  const handleGoogleSignUp = () => {
    showError(`Error`, "Google Auth is not available at the moment.", 2500);
    
    // Handle Google sign up
  };

  return (
    <>
      {toast && <Toast {...toast} />}

      <motion.div 
        className="rounded-3xl py-6 px-10 md:py-8 md:px-12 lg:py-6 lg:px-10 sm:py-5 sm:px-6 shadow-[1px_1px_4px_1px_rgba(96,126,242,0.5)] bg-[#F0F7FF] min-h-[520px] sm:min-h-[480px] w-full max-w-md mx-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div>
          <div className="text-center mb-8 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl mb-1 text-[#3F58B2]">
              Create an Account
            </h1>
            <p className="text-[11px] sm:text-xs text-[#8C8C8C]">
              Already have an account?{" "}
              <Link 
                to="/login"
                className="text-secondary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-3">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-[11px] text-primary mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter Email"
                {...register("email")}
                disabled={loading}
                className={`w-full px-4 py-3 sm:px-3 sm:py-2.5 rounded-lg text-xs sm:text-[11px] focus:outline-none focus:ring-1 transition-all bg-transparent border text-primary placeholder:text-[#C4CBD5] ${
                  errors.email
                    ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]"
                    : "border-[#C4CBD5] focus:border-[#3A52A6] focus:ring-[#3A52A6]"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                  {errors.email.message}
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
                  {...register("password")}
                  disabled={loading}
                  className={`w-full px-4 py-3 sm:px-3 sm:py-2.5 pr-10 rounded-lg text-xs sm:text-[11px] focus:outline-none focus:ring-1 transition-all bg-transparent border text-primary placeholder:text-[#C4CBD5] ${
                    errors.password
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
              {errors.password && (
                <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-[11px] text-primary mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  disabled={loading}
                  className={`w-full px-4 py-3 sm:px-3 sm:py-2.5 pr-10 rounded-lg text-xs sm:text-[11px] focus:outline-none focus:ring-1 transition-all bg-transparent border text-primary placeholder:text-[#C4CBD5] ${
                    errors.confirmPassword
                      ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]"
                      : "border-[#C4CBD5] focus:border-[#3A52A6] focus:ring-[#3A52A6]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8C8C] hover:text-secondary transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-3.5 sm:h-3.5 transition-transform duration-200" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5 transition-transform duration-200" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                  {errors.confirmPassword.message}
                </p>
              )}
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
                <span>Sign Up</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5 sm:my-4">
            <div className="flex-1 border-t border-dashed border-[#3A52A6] opacity-50"></div>
            <span className="px-2 text-[10px] sm:text-[9px] text-[#8C8C8C]">
              Or sign up with
            </span>
            <div className="flex-1 border-t border-dashed border-[#3A52A6] opacity-50"></div>
          </div>

          {/* Google sign up button */}
          <div className="flex justify-center">
            <button
              onClick={handleGoogleSignUp}
              type="button"
              className="w-12 h-12 flex items-center justify-center rounded-full hover:shadow-[0_2px_8px_0_rgba(0,0,0,0.25)] transition-all bg-[#F0F7FF] shadow-[0_2px_4px_0_rgba(0,0,0,0.25)] cursor-pointer"
            >
              <SiGoogle size={24} className="text-secondary sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}