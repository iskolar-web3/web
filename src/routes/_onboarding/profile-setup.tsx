import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { usePageTitle } from "@/hooks/usePageTitle"
import Toast from "@/components/Toast"
import Preloader from "@/components/Preloader"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"; 
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
// import { profileService } from '@/services/profile.service';

export const Route = createFileRoute('/_onboarding/profile-setup')({
  component: ProfileSetup,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      role: (search.role as string) || undefined,
    }
  },
})

type Role = 'student' | 'individual_sponsor' | 'organization_sponsor' | 'government_sponsor' | 'school'

const VALID_ROLES: Role[] = ['student', 'individual_sponsor', 'organization_sponsor', 'government_sponsor', 'school']

// Student validation 
const studentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(['male', 'female'], { message: 'Please select a gender' }),
  dateOfBirth: z.date().refine((date) => date <= new Date(), {
    message: 'Date of birth cannot be in the future',
  }),
  contactNumber: z.string()
    .min(1, 'Contact number is required')
    .regex(/^\d+$/, 'Contact number must contain only numbers')
    .min(11, 'Contact number must be at least 11 digits'),
})

// individual Sponsor validation
const individualSponsorSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  employmentType: z.enum(['employed', 'self_employed', 'freelancer', 'overseas_filipino_worker', 'student'], { message: 'Please select employment type' }),
  dateOfBirth: z.date().refine((date) => date <= new Date(), {
    message: 'Date of birth cannot be in the future',
  }),
  contactNumber: z.string()
    .min(1, 'Contact number is required')
    .regex(/^\d+$/, 'Contact number must contain only numbers')
    .min(11, 'Contact number must be at least 11 digits'),
})

// Organization Sponsor validation
const organizationSponsorSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required'),
  organizationType: z.enum(['private_company', 'non_governmental_organization', 'educational_institution'], { message: 'Please select organization type' }),
  contactNumber: z.string()
    .min(1, 'Contact number is required')
    .regex(/^\d+$/, 'Contact number must contain only numbers')
    .min(11, 'Contact number must be at least 11 digits'),
})

// Government Sponsor validation
const governmentSponsorSchema = z.object({
  agencyName: z.string().min(1, 'Agency name is required'),
  agencyType: z.enum(['national_government_agency', 'local_government_unit', 'government_owned_and_controlled_corporation'], { message: 'Please select agency type' }),
  contactNumber: z.string()
    .min(1, 'Contact number is required')
    .regex(/^\d+$/, 'Contact number must contain only numbers')
    .min(11, 'Contact number must be at least 11 digits'),
})

// School validation
const schoolSchema = z.object({
  schoolName: z.string().min(1, 'School name is required'),
  schoolType: z.enum(['public', 'private', 'international', 'vocational', 'religious'], { message: 'Please select school type' }),
  contactNumber: z.string()
    .min(1, 'Contact number is required')
    .regex(/^\d+$/, 'Contact number must contain only numbers')
    .min(11, 'Contact number must be at least 11 digits'),
})

type StudentFormData = z.infer<typeof studentSchema>
type IndividualSponsorFormData = z.infer<typeof individualSponsorSchema>
type OrganizationSponsorFormData = z.infer<typeof organizationSponsorSchema>
type GovernmentSponsorFormData = z.infer<typeof governmentSponsorSchema>
type SchoolFormData = z.infer<typeof schoolSchema>

function ProfileSetup() {
  usePageTitle("Profile Setup")
  
  const navigate = useNavigate()
  const { role } = Route.useSearch()
  
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [roleValidationError, setRoleValidationError] = useState(false)
  
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false)
  const [showPreloader, setShowPreloader] = useState(false)
  const [toastConfig, setToastConfig] = useState({
    type: "success" as "success" | "error",
    title: "",
    message: "",
  })
  
  // Student form
  const studentForm = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      gender: undefined,
      dateOfBirth: undefined,
      contactNumber: '',
    }
  })

  // Individual Sponsor form
  const individualSponsorForm = useForm<IndividualSponsorFormData>({
    resolver: zodResolver(individualSponsorSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      employmentType: undefined,
      dateOfBirth: undefined,
      contactNumber: '',
    }
  })

  // Organization Sponsor form
  const organizationSponsorForm = useForm<OrganizationSponsorFormData>({
    resolver: zodResolver(organizationSponsorSchema),
    mode: "onBlur",
    defaultValues: {
      organizationName: '',
      organizationType: undefined,
      contactNumber: '',
    }
  })

  // Government Sponsor form
  const governmentSponsorForm = useForm<GovernmentSponsorFormData>({
    resolver: zodResolver(governmentSponsorSchema),
    mode: "onBlur",
    defaultValues: {
      agencyName: '',
      agencyType: undefined,
      contactNumber: '',
    }
  })

  // School form
  const schoolForm = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    mode: "onBlur",
    defaultValues: {
      schoolName: '',
      schoolType: undefined,
      contactNumber: '',
    }
  })
  
  useEffect(() => {
    if (!role || !VALID_ROLES.includes(role as Role)) {
      setRoleValidationError(true)
      setToastConfig({
        type: 'error',
        title: 'Invalid Role',
        message: 'Please select a valid role to continue.',
      })
      setShowToast(true)
      
      setTimeout(() => {
        navigate({ to: '/role-selection' })
      }, 2000)
      return
    }
    
    setSelectedRole(role as Role)
    setRoleValidationError(false)
  }, [role, navigate])

  const onSubmit = async (data: StudentFormData | IndividualSponsorFormData | OrganizationSponsorFormData | GovernmentSponsorFormData | SchoolFormData) => {
    try {
      setLoading(true);

      if (selectedRole === 'student') {
        const studentData = data as StudentFormData;

        const formattedDate = studentData.dateOfBirth.toISOString().split('T')[0];

        // const result = await profileService.setupStudentProfile({
        //   role: selectedRole
        //   first_name: studentData.firstName,
        //   middle_name: studentData.middleName,
        //   last_name: studentData.lastName,
        //   gender: studentData.gender,
        //   date_of_birth: formattedDate,
        //   contact_number: studentData.contactNumber,
        // });

        // if (result.success) {
        //   setToastConfig({
        //     type: 'success',
        //     title: 'Profile Created',
        //     message: 'Your profile has been set up successfully!',
        //   })
        //   setShowToast(true);
        //   setTimeout(() => {
        //     setShowToast(false)
        //     setShowPreloader(true);
        //   }, 1250);
        // } else {
        //   setToastConfig({
        //     type: 'error',
        //     title: 'Error',
        //     message: result.message,
        //   })
        //   setShowToast(true);
        //   setTimeout(() => setShowToast(false), 2000);
        // }
        
        // For now, simulate successful profile setup to test preloader
        setToastConfig({
          type: 'success',
          title: 'Profile Created',
          message: 'Your profile has been set up successfully!',
        })
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false)
          setShowPreloader(true);
        }, 1250);
      } else if (selectedRole === 'individual_sponsor') {
        const individualSponsorData = data as IndividualSponsorFormData;

        const formattedDate = individualSponsorData.dateOfBirth.toISOString().split('T')[0];

        // const result = await profileService.setupIndividualSponsorProfile({
        //   role: selectedRole
        //   first_name: individualSponsorData.firstName,
        //   middle_name: individualSponsorData.middleName,
        //   last_name: individualSponsorData.lastName,
        //   employment_type: individualSponsorData.employmentType,
        //   date_of_birth: formattedDate,
        //   contact_number: individualSponsorData.contactNumber,
        // });

        // if (result.success) {
        //   setToastConfig({
        //     type: 'success',
        //     title: 'Profile Created',
        //     message: 'Your profile has been set up successfully!',
        //   })
        //   setShowToast(true);
        //   setTimeout(() => {
        //     setShowToast(false)
        //     // Show preloader after successful profile setup
        //     setShowPreloader(true);
        //   }, 1250);
        // } else {
        //   setToastConfig({
        //     type: 'error',
        //     title: 'Error',
        //     message: result.message,
        //   })
        //   setShowToast(true);
        //   setTimeout(() => setShowToast(false), 2000);
        // }
        
        // For now, simulate successful profile setup to test preloader
        setToastConfig({
          type: 'success',
          title: 'Profile Created',
          message: 'Your profile has been set up successfully!',
        })
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false)
          setShowPreloader(true);
        }, 1250);
      } else if (selectedRole === 'organization_sponsor') {
        const organizationSponsorData = data as OrganizationSponsorFormData;

        // const result = await profileService.setupOrganizationSponsorProfile({
        //   role: selectedRole
        //   organization_name: organizationSponsorData.organizationName,
        //   organization_type: organizationSponsorData.organizationType,
        //   official_email: organizationSponsorData.emailAddress,
        //   contact_number: organizationSponsorData.contactNumber,
        // });

        // if (result.success) {
        //   setToastConfig({
        //     type: 'success',
        //     title: 'Profile Created',
        //     message: 'Your profile has been set up successfully!',
        //   })
        //   setShowToast(true);
        //   setTimeout(() => {
        //     setShowToast(false)
        //     // Show preloader after successful profile setup
        //     setShowPreloader(true);
        //   }, 1250);
        // } else {
        //   setToastConfig({
        //     type: 'error',
        //     title: 'Error',
        //     message: result.message,
        //   })
        //   setShowToast(true);
        //   setTimeout(() => setShowToast(false), 2000);
        // }
        
        // For now, simulate successful profile setup to test preloader
        setToastConfig({
          type: 'success',
          title: 'Profile Created',
          message: 'Your profile has been set up successfully!',
        })
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false)
          setShowPreloader(true);
        }, 1250);
      } else if (selectedRole === 'government_sponsor') {
        const governmentSponsorData = data as GovernmentSponsorFormData;

        // const result = await profileService.setupGovernmentSponsorProfile({
        //   role: selectedRole
        //   agency_name: governmentSponsorData.agencyName,
        //   agency_type: governmentSponsorData.agencyType,
        //   official_email: governmentSponsorData.emailAddress,
        //   contact_number: governmentSponsorData.contactNumber,
        // });

        // if (result.success) {
        //   setToastConfig({
        //     type: 'success',
        //     title: 'Profile Created',
        //     message: 'Your profile has been set up successfully!',
        //   })
        //   setShowToast(true);
        //   setTimeout(() => {
        //     setShowToast(false)
        //     // Show preloader after successful profile setup
        //     setShowPreloader(true);
        //   }, 1250);
        // } else {
        //   setToastConfig({
        //     type: 'error',
        //     title: 'Error',
        //     message: result.message,
        //   })
        //   setShowToast(true);
        //   setTimeout(() => setShowToast(false), 2000);
        // }
        
        // For now, simulate successful profile setup to test preloader
        setToastConfig({
          type: 'success',
          title: 'Profile Created',
          message: 'Your profile has been set up successfully!',
        })
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false)
          setShowPreloader(true);
        }, 1250);
      } else if (selectedRole === 'school') {
        const schoolData = data as SchoolFormData;

        // const result = await profileService.setupSchoolProfile({
        //   role: selectedRole
        //   school_name: schoolData.schoolName,
        //   school_type: schoolData.schoolType,
        //   official_email: schoolData.emailAddress,
        //   contact_number: schoolData.contactNumber,
        // });

        // if (result.success) {
        //   setToastConfig({
        //     type: 'success',
        //     title: 'Profile Created',
        //     message: 'Your profile has been set up successfully!',
        //   })
        //   setShowToast(true);
        //   setTimeout(() => {
        //     setShowToast(false)
        //     // Show preloader after successful profile setup
        //     setShowPreloader(true);
        //   }, 1250);
        // } else {
        //   setToastConfig({
        //     type: 'error',
        //     title: 'Error',
        //     message: result.message,
        //   })
        //   setShowToast(true);
        //   setTimeout(() => setShowToast(false), 2000);
        // }
        
        // For now, simulate successful profile setup to test preloader
        setToastConfig({
          type: 'success',
          title: 'Profile Created',
          message: 'Your profile has been set up successfully!',
        })
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false)
          setShowPreloader(true);
        }, 1250);
      } 
    } catch(error) {
      console.error('Profile setup error:', error);
      setToastConfig({
        type: 'error',
        title: 'Connection Error',
        message: 'Failed to connect to server.',
      })
      setShowToast(true)
    } finally {
      setLoading(false);
    }
  }

  const handlePreloaderComplete = () => {
    // After preloader completes, navigate to appropriate page based on role
    // TODO: Uncomment when backend is ready
    // if (selectedRole === 'student') {
    //   navigate({ to: '/home', replace: true });
    // } else if (selectedRole === 'individual_sponsor' || selectedRole === 'organization_sponsor' || selectedRole === 'government_sponsor') {
    //   navigate({ to: '/my-scholarships', replace: true });
    // } else if (selectedRole === 'school') {
    //   navigate({ to: '/dashboard', replace: true });
    // }
    
    // For now, navigate based on role
    if (selectedRole === 'student') {
      navigate({ to: '/home', replace: true });
    } else if (selectedRole === 'individual_sponsor' || selectedRole === 'organization_sponsor' || selectedRole === 'government_sponsor') {
      navigate({ to: '/scholarships', replace: true });
    } 
  }

  if (roleValidationError || !selectedRole) {
    return (
      <>
        <Toast
          visible={showToast}
          type={toastConfig.type}
          title={toastConfig.title}
          message={toastConfig.message}
        />
        <motion.div 
          className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <p className="text-secondary">Redirecting to role selection...</p>
          </div>
        </motion.div>
      </>
    )
  }

  const getCurrentForm = () => {
    switch (selectedRole) {
      case 'student':
        return studentForm
      case 'individual_sponsor':
        return individualSponsorForm
      case 'organization_sponsor':
        return organizationSponsorForm
      case 'government_sponsor':
        return governmentSponsorForm
      case 'school':
        return schoolForm
      default:
        return null
    }
  }

  const currentForm = getCurrentForm()
  const isFormValid = currentForm ? currentForm.formState.isValid : false

  return (
    <>
      {showPreloader && (
        <Preloader 
          onComplete={handlePreloaderComplete}
          minDisplayTime={2000}
        />
      )}
      
      <Toast
        visible={showToast}
        type={toastConfig.type}
        title={toastConfig.title}
        message={toastConfig.message}
      />

      {!showPreloader && (
      <motion.div 
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full max-w-md">
          {/* Title and Subtitle */}
          <motion.div 
            className="text-center mb-8 sm:mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-secondary mb-1.5 sm:mb-2">
              Welcome to iSkolar
            </h1>
            <p className="text-base sm:text-lg sm:text-xl text-secondary/80">
              Complete your profile to get started
            </p>
          </motion.div>

          {/* Profile Setup Forms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* Student Form */}
            {selectedRole === 'student' && (
              <form onSubmit={studentForm.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      {...studentForm.register('firstName')}
                      className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                        studentForm.formState.errors.firstName
                          ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                          : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                      }`}
                      placeholder="First name"
                    />
                    {studentForm.formState.errors.firstName && (
                      <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                        {studentForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      {...studentForm.register('middleName')}
                      className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                        studentForm.formState.errors.middleName
                          ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                          : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                      }`}
                      placeholder="Middle name"
                    />
                    {studentForm.formState.errors.middleName && (
                      <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                        {studentForm.formState.errors.middleName.message}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      {...studentForm.register('lastName')}
                      className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                        studentForm.formState.errors.lastName
                          ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                          : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                      }`}
                      placeholder="Last name"
                    />
                    {studentForm.formState.errors.lastName && (
                      <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                        {studentForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Select 
                    value={studentForm.watch('gender')} 
                    onValueChange={(value) => studentForm.setValue('gender', value as 'male' | 'female', { shouldValidate: true })}
                  >
                    <SelectTrigger className={`w-full px-4 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all data-[placeholder]:text-gray-400 ${
                      studentForm.formState.errors.gender
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                    }`}>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {studentForm.formState.errors.gender && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                      {studentForm.formState.errors.gender.message}
                    </p>
                  )}
                </div>

                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all text-left flex items-center justify-between ${
                          studentForm.watch('dateOfBirth') ? 'text-primary' : 'text-gray-400'
                        } ${
                          studentForm.formState.errors.dateOfBirth
                            ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]'
                            : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20'
                        }`}
                      >
                        <span>
                          {studentForm.watch('dateOfBirth') 
                            ? studentForm.watch('dateOfBirth').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                            : 'Set birth date'}
                        </span>
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={studentForm.watch('dateOfBirth')}
                        onSelect={(date) => {
                          if (date) {
                            studentForm.setValue('dateOfBirth', date, { shouldValidate: true })
                          }
                        }}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {studentForm.formState.errors.dateOfBirth && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                      {studentForm.formState.errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    {...studentForm.register('contactNumber')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      studentForm.formState.errors.contactNumber
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                    }`}
                    placeholder="Enter contact number"
                    inputMode="numeric"
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '')
                      studentForm.setValue('contactNumber', numericValue, { shouldValidate: true })
                    }}
                  />
                  {studentForm.formState.errors.contactNumber && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                      {studentForm.formState.errors.contactNumber.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`w-full py-3 sm:py-3.5 px-6 rounded-lg transition-all duration-300 text-tertiary text-xs sm:text-sm mt-3 ${
                    isFormValid && !loading
                      ? 'bg-[#EFA508] hover:bg-[#D89407] shadow-md hover:shadow-lg cursor-pointer'
                      : 'bg-[#9CA3AF] cursor-not-allowed'
                  }`}
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </span>
                  ) : (
                    <span>Complete</span>
                  )}
                </motion.button>
              </form>
            )}

            {/* Individual Sponsor Form */}
            {selectedRole === 'individual_sponsor' && (
              <form onSubmit={individualSponsorForm.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      disabled={loading}
                      {...individualSponsorForm.register('firstName')}
                      className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                        individualSponsorForm.formState.errors.firstName
                          ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                          : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                      }`}
                      placeholder="First name"
                    />
                    {individualSponsorForm.formState.errors.firstName && (
                      <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                        {individualSponsorForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      disabled={loading}
                      {...individualSponsorForm.register('middleName')}
                      className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                        individualSponsorForm.formState.errors.middleName
                          ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                          : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                      }`}
                      placeholder="Middle name"
                    />
                    {individualSponsorForm.formState.errors.middleName && (
                      <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                        {individualSponsorForm.formState.errors.middleName.message}
                      </p>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      disabled={loading}
                      {...individualSponsorForm.register('lastName')}
                      className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                        individualSponsorForm.formState.errors.lastName
                          ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                          : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                      }`}
                      placeholder="Last name"
                    />
                    {individualSponsorForm.formState.errors.lastName && (
                      <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                        {individualSponsorForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Select 
                    value={individualSponsorForm.watch('employmentType')} 
                    disabled={loading}
                    onValueChange={(value) => individualSponsorForm.setValue('employmentType', value as any, { shouldValidate: true })}
                  >
                    <SelectTrigger className={`w-full text-sm px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all data-[placeholder]:text-gray-400 ${
                      individualSponsorForm.formState.errors.employmentType
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                    }`}>
                      <SelectValue placeholder="Select your employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self_employed">Self-Employed</SelectItem>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                      <SelectItem value="overseas_filipino_worker">Overseas Filipino Worker</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                  {individualSponsorForm.formState.errors.employmentType && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                      {individualSponsorForm.formState.errors.employmentType.message}
                    </p>
                  )}
                </div>

                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all text-left flex items-center justify-between ${
                          individualSponsorForm.watch('dateOfBirth') ? 'text-primary' : 'text-gray-400'
                        } ${
                          individualSponsorForm.formState.errors.dateOfBirth
                            ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]'
                            : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20'
                        }`}
                      >
                        <span>
                          {individualSponsorForm.watch('dateOfBirth') 
                            ? individualSponsorForm.watch('dateOfBirth').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                            : 'Set birth date'}
                        </span>
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={individualSponsorForm.watch('dateOfBirth')}
                        onSelect={(date) => {
                          if (date) {
                            individualSponsorForm.setValue('dateOfBirth', date, { shouldValidate: true })
                          }
                        }}
                        disabled={(date) => date > new Date() || loading}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {individualSponsorForm.formState.errors.dateOfBirth && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                      {individualSponsorForm.formState.errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    disabled={loading}
                    {...individualSponsorForm.register('contactNumber')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      individualSponsorForm.formState.errors.contactNumber
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                    }`}
                    placeholder="Enter contact number"
                    inputMode="numeric"
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '')
                      individualSponsorForm.setValue('contactNumber', numericValue, { shouldValidate: true })
                    }}
                  />
                  {individualSponsorForm.formState.errors.contactNumber && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                      {individualSponsorForm.formState.errors.contactNumber.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`w-full py-3 sm:py-3.5 px-6 rounded-lg transition-all duration-300 text-tertiary text-xs sm:text-sm mt-3 ${
                    isFormValid && !loading
                      ? 'bg-[#EFA508] hover:bg-[#D89407] shadow-md hover:shadow-lg cursor-pointer'
                      : 'bg-[#9CA3AF] cursor-not-allowed'
                  }`}
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </span>
                  ) : (
                    <span>Complete</span>
                  )}
                </motion.button>
              </form>
            )}

            {/* Organization Sponsor Form */}
            {selectedRole === 'organization_sponsor' && (
              <form onSubmit={organizationSponsorForm.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                <div>
                  <input
                    type="text"
                    disabled={loading}
                    {...organizationSponsorForm.register('organizationName')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      organizationSponsorForm.formState.errors.organizationName
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                    }`}
                    placeholder="What's your organization name?"
                  />
                  {organizationSponsorForm.formState.errors.organizationName && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                      {organizationSponsorForm.formState.errors.organizationName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Select 
                    value={organizationSponsorForm.watch('organizationType')} 
                    disabled={loading}
                    onValueChange={(value) => organizationSponsorForm.setValue('organizationType', value as any, { shouldValidate: true })}
                  >
                    <SelectTrigger className={`w-full text-sm px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all data-[placeholder]:text-gray-400 ${
                      organizationSponsorForm.formState.errors.organizationType
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                    }`}>
                      <SelectValue placeholder="Select your organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private_company">Private Company</SelectItem>
                      <SelectItem value="non_governmental_organization">Non-Governmental Organization</SelectItem>
                      <SelectItem value="educational_institution">Educational Institution</SelectItem>
                    </SelectContent>
                  </Select>
                  {organizationSponsorForm.formState.errors.organizationType && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                      {organizationSponsorForm.formState.errors.organizationType.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    disabled={loading}
                    {...organizationSponsorForm.register('contactNumber')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      organizationSponsorForm.formState.errors.contactNumber
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                    }`}
                    placeholder="Enter contact number"
                    inputMode="numeric"
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '')
                      organizationSponsorForm.setValue('contactNumber', numericValue, { shouldValidate: true })
                    }}
                  />
                  {organizationSponsorForm.formState.errors.contactNumber && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                      {organizationSponsorForm.formState.errors.contactNumber.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`w-full py-3 sm:py-3.5 px-6 rounded-lg transition-all duration-300 text-tertiary text-xs sm:text-sm mt-3 ${
                    isFormValid && !loading
                      ? 'bg-[#EFA508] hover:bg-[#D89407] shadow-md hover:shadow-lg cursor-pointer'
                      : 'bg-[#9CA3AF] cursor-not-allowed'
                  }`}
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </span>
                  ) : (
                    <span>Complete</span>
                  )}
                </motion.button>
              </form>
            )}

            {/* Government Sponsor Form */}
            {selectedRole === 'government_sponsor' && (
              <form onSubmit={governmentSponsorForm.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                <div>
                  <input
                    type="text"
                    disabled={loading}
                    {...governmentSponsorForm.register('agencyName')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      governmentSponsorForm.formState.errors.agencyName
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                    }`}
                    placeholder="What's your agency name?"
                  />
                  {governmentSponsorForm.formState.errors.agencyName && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                      {governmentSponsorForm.formState.errors.agencyName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Select 
                    value={governmentSponsorForm.watch('agencyType')} 
                    disabled={loading}
                    onValueChange={(value) => governmentSponsorForm.setValue('agencyType', value as any, { shouldValidate: true })}
                  >
                    <SelectTrigger className={`w-full text-sm px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all data-[placeholder]:text-gray-400 ${
                      governmentSponsorForm.formState.errors.agencyType
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                    }`}>
                      <SelectValue placeholder="Select your agency type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national_government_agency">National Government Agency</SelectItem>
                      <SelectItem value="local_government_unit">Local Government Unit</SelectItem>
                      <SelectItem value="government_owned_and_controlled_corporation">GOCC</SelectItem>
                    </SelectContent>
                  </Select>
                  {governmentSponsorForm.formState.errors.agencyType && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                      {governmentSponsorForm.formState.errors.agencyType.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    disabled={loading}
                    {...governmentSponsorForm.register('contactNumber')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      governmentSponsorForm.formState.errors.contactNumber
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                    }`}
                    placeholder="Enter contact number"
                    inputMode="numeric"
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '')
                      governmentSponsorForm.setValue('contactNumber', numericValue, { shouldValidate: true })
                    }}
                  />
                  {governmentSponsorForm.formState.errors.contactNumber && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                      {governmentSponsorForm.formState.errors.contactNumber.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`w-full py-3 sm:py-3.5 px-6 rounded-lg transition-all duration-300 text-tertiary text-xs sm:text-sm mt-3 ${
                    isFormValid && !loading
                      ? 'bg-[#EFA508] hover:bg-[#D89407] shadow-md hover:shadow-lg cursor-pointer'
                      : 'bg-[#9CA3AF] cursor-not-allowed'
                  }`}
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </span>
                  ) : (
                    <span>Complete</span>
                  )}
                </motion.button>
              </form>
            )}

            {/* School Form */}
            {selectedRole === 'school' && (
              <form onSubmit={schoolForm.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                <div>
                  <input
                    type="text"
                    disabled={loading}
                    {...schoolForm.register('schoolName')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      schoolForm.formState.errors.schoolName
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                    }`}
                    placeholder="What's your school name?"
                  />
                  {schoolForm.formState.errors.schoolName && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                      {schoolForm.formState.errors.schoolName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Select 
                    value={schoolForm.watch('schoolType')} 
                    disabled={loading}
                    onValueChange={(value) => schoolForm.setValue('schoolType', value as any, { shouldValidate: true })}
                  >
                    <SelectTrigger className={`w-full text-sm px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all data-[placeholder]:text-gray-400 ${
                      schoolForm.formState.errors.schoolType
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                    }`}>
                      <SelectValue placeholder="Select your school type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                      <SelectItem value="vocational">Vocational</SelectItem>
                      <SelectItem value="religious">Religious</SelectItem>
                    </SelectContent>
                  </Select>
                  {schoolForm.formState.errors.schoolType && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                      {schoolForm.formState.errors.schoolType.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    disabled={loading}
                    {...schoolForm.register('contactNumber')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      schoolForm.formState.errors.contactNumber
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444] text-primary'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-primary'
                    }`}
                    placeholder="Enter contact number"
                    inputMode="numeric"
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '')
                      schoolForm.setValue('contactNumber', numericValue, { shouldValidate: true })
                    }}
                  />
                  {schoolForm.formState.errors.contactNumber && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-[#EF4444]">
                      {schoolForm.formState.errors.contactNumber.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`w-full py-3 sm:py-3.5 px-6 rounded-lg transition-all duration-300 text-tertiary text-xs sm:text-sm mt-3 ${
                    isFormValid && !loading
                      ? 'bg-[#EFA508] hover:bg-[#D89407] shadow-md hover:shadow-lg cursor-pointer'
                      : 'bg-[#9CA3AF] cursor-not-allowed'
                  }`}
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </span>
                  ) : (
                    <span>Complete</span>
                  )}
                </motion.button>
              </form>
            )}

          </motion.div>
        </div>
      </motion.div>
      )}
    </>
  )
}