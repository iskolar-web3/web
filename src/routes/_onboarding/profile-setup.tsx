import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { usePageTitle } from "@/hooks/use-page-title"
import Toast from "@/components/Toast"
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

// Profile setup validation 
const studentSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  gender: z.enum(['male', 'female'], { message: 'Please select a gender' }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  contactNumber: z.string()
    .min(1, 'Contact number is required')
    .regex(/^\d+$/, 'Contact number must contain only numbers')
    .min(11, 'Contact number must be at least 11 digits'),
})

const individualSponsorSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  employmentType: z.enum(['employed', 'self-employed', 'freelancer', 'overseas_filipino_worker', 'student'], { message: 'Please select employment type' }),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  contactNumber: z.string()
    .min(1, 'Contact number is required')
    .regex(/^\d+$/, 'Contact number must contain only numbers')
    .min(11, 'Contact number must be at least 11 digits'),
})

const organizationSponsorSchema = z.object({
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  organizationType: z.enum(['private_company', 'non_governmental_organization', 'educational_institution'], { message: 'Please select organization type' }),
  emailAddress: z.string()
    .min(1, 'Email address is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),
  contactNumber: z.string()
    .min(1, 'Contact number is required')
    .regex(/^\d+$/, 'Contact number must contain only numbers')
    .min(11, 'Contact number must be at least 11 digits'),
})

const governmentSponsorSchema = z.object({
  agencyName: z.string().min(2, 'Agency name must be at least 2 characters'),
  agencyType: z.enum(['national_government_agency', 'local_government_unit', 'government_owned_and_controlled_corporation'], { message: 'Please select agency type' }),
  emailAddress: z.string()
    .min(1, 'Email address is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),
  contactNumber: z.string()
    .min(1, 'Contact number is required')
    .regex(/^\d+$/, 'Contact number must contain only numbers')
    .min(11, 'Contact number must be at least 11 digits'),
})

const schoolSchema = z.object({
  schoolName: z.string().min(2, 'School name must be at least 2 characters'),
  schoolType: z.enum(['public', 'private', 'international', 'vocational', 'religious'], { message: 'Please select school type' }),
  emailAddress: z.string()
    .min(1, 'Email address is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),
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
  
  const [showToast, setShowToast] = useState(false)
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
      fullName: '',
      gender: undefined,
      dateOfBirth: '',
      contactNumber: '',
    }
  })

  // Individual Sponsor form
  const individualSponsorForm = useForm<IndividualSponsorFormData>({
    resolver: zodResolver(individualSponsorSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: '',
      employmentType: undefined,
      dateOfBirth: '',
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
      emailAddress: '',
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
      emailAddress: '',
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
      emailAddress: '',
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

  const onSubmit = <T,>(data: T) => {
    if (selectedRole) {
      console.log(`${selectedRole} data:`, data)
    } else {
      console.log('profile data:', data)
    }
    setToastConfig({
      type: 'success',
      title: 'Success',
      message: 'Profile completed!',
    })
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      // navigate({ to: '/' });
    }, 1000)
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
            <p className="text-[#3A52A6]">Redirecting to role selection...</p>
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
        <div className="w-full max-w-md">
          {/* Title and Subtitle */}
          <motion.div 
            className="text-center mb-8 sm:mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#3A52A6] mb-1.5 sm:mb-2">
              Welcome to iSkolar
            </h1>
            <p className="text-base sm:text-lg sm:text-xl text-[#3A52A6]/80">
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
                <div>
                  <input
                    type="text"
                    {...studentForm.register('fullName')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      studentForm.formState.errors.fullName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                    }`}
                    placeholder="What's your full name?"
                  />
                  {studentForm.formState.errors.fullName && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {studentForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Select 
                    value={studentForm.watch('gender')} 
                    onValueChange={(value) => studentForm.setValue('gender', value as 'male' | 'female', { shouldValidate: true })}
                  >
                    <SelectTrigger className={`w-full px-4 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all data-[placeholder]:text-gray-400 ${
                      studentForm.formState.errors.gender
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                    }`}>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {studentForm.formState.errors.gender && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {studentForm.formState.errors.gender.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="date"
                    {...studentForm.register('dateOfBirth')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      studentForm.watch('dateOfBirth') ? 'text-[#111827]' : 'text-gray-400'
                    } ${
                      studentForm.formState.errors.dateOfBirth
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20'
                    }`}
                  />
                  {studentForm.formState.errors.dateOfBirth && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
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
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                    }`}
                    placeholder="Enter contact number"
                    inputMode="numeric"
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '')
                      studentForm.setValue('contactNumber', numericValue, { shouldValidate: true })
                    }}
                  />
                  {studentForm.formState.errors.contactNumber && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {studentForm.formState.errors.contactNumber.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-3 sm:py-3.5 px-6 rounded-lg transition-all duration-300 text-[#F0F7FF] text-xs sm:text-sm mt-3 ${
                    isFormValid
                      ? 'bg-[#EFA508] hover:bg-[#D89407] shadow-md hover:shadow-lg cursor-pointer'
                      : 'bg-[#9CA3AF] cursor-not-allowed'
                  }`}
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                >
                  Complete
                </motion.button>
              </form>
            )}

            {/* Individual Sponsor Form */}
            {selectedRole === 'individual_sponsor' && (
              <form onSubmit={individualSponsorForm.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                <div>
                  <input
                    type="text"
                    {...individualSponsorForm.register('fullName')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      individualSponsorForm.formState.errors.fullName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                    }`}
                    placeholder="What's your full name?"
                  />
                  {individualSponsorForm.formState.errors.fullName && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {individualSponsorForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Select 
                    value={individualSponsorForm.watch('employmentType')} 
                    onValueChange={(value) => individualSponsorForm.setValue('employmentType', value as any, { shouldValidate: true })}
                  >
                    <SelectTrigger className={`w-full text-sm px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all data-[placeholder]:text-gray-400 ${
                      individualSponsorForm.formState.errors.employmentType
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                    }`}>
                      <SelectValue placeholder="Select your employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                      <SelectItem value="overseas_filipino_worker">Overseas Filipino Worker</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                  {individualSponsorForm.formState.errors.employmentType && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {individualSponsorForm.formState.errors.employmentType.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="date"
                    {...individualSponsorForm.register('dateOfBirth')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      individualSponsorForm.watch('dateOfBirth') ? 'text-[#111827]' : 'text-gray-400'
                    } ${
                      individualSponsorForm.formState.errors.dateOfBirth
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20'
                    }`}
                  />
                  {individualSponsorForm.formState.errors.dateOfBirth && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {individualSponsorForm.formState.errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    {...individualSponsorForm.register('contactNumber')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      individualSponsorForm.formState.errors.contactNumber
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                    }`}
                    placeholder="Enter contact number"
                    inputMode="numeric"
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '')
                      individualSponsorForm.setValue('contactNumber', numericValue, { shouldValidate: true })
                    }}
                  />
                  {individualSponsorForm.formState.errors.contactNumber && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {individualSponsorForm.formState.errors.contactNumber.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-3 sm:py-3.5 px-6 rounded-lg transition-all duration-300 text-[#F0F7FF] text-xs sm:text-sm mt-3 ${
                    isFormValid
                      ? 'bg-[#EFA508] hover:bg-[#D89407] shadow-md hover:shadow-lg cursor-pointer'
                      : 'bg-[#9CA3AF] cursor-not-allowed'
                  }`}
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                >
                  Complete
                </motion.button>
              </form>
            )}

            {/* Organization Sponsor Form */}
            {selectedRole === 'organization_sponsor' && (
              <form onSubmit={organizationSponsorForm.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                <div>
                  <input
                    type="text"
                    {...organizationSponsorForm.register('organizationName')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      organizationSponsorForm.formState.errors.organizationName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                    }`}
                    placeholder="What's your organization name?"
                  />
                  {organizationSponsorForm.formState.errors.organizationName && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {organizationSponsorForm.formState.errors.organizationName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Select 
                    value={organizationSponsorForm.watch('organizationType')} 
                    onValueChange={(value) => organizationSponsorForm.setValue('organizationType', value as any, { shouldValidate: true })}
                  >
                    <SelectTrigger className={`w-full text-sm px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all data-[placeholder]:text-gray-400 ${
                      organizationSponsorForm.formState.errors.organizationType
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
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
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {organizationSponsorForm.formState.errors.organizationType.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    {...organizationSponsorForm.register('emailAddress')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      organizationSponsorForm.formState.errors.emailAddress
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                    }`}
                    placeholder="Enter official email address"
                  />
                  {organizationSponsorForm.formState.errors.emailAddress && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {organizationSponsorForm.formState.errors.emailAddress.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    {...organizationSponsorForm.register('contactNumber')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      organizationSponsorForm.formState.errors.contactNumber
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                    }`}
                    placeholder="Enter contact number"
                    inputMode="numeric"
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '')
                      organizationSponsorForm.setValue('contactNumber', numericValue, { shouldValidate: true })
                    }}
                  />
                  {organizationSponsorForm.formState.errors.contactNumber && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {organizationSponsorForm.formState.errors.contactNumber.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-3 sm:py-3.5 px-6 rounded-lg transition-all duration-300 text-[#F0F7FF] text-xs sm:text-sm mt-3 ${
                    isFormValid
                      ? 'bg-[#EFA508] hover:bg-[#D89407] shadow-md hover:shadow-lg cursor-pointer'
                      : 'bg-[#9CA3AF] cursor-not-allowed'
                  }`}
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                >
                  Complete
                </motion.button>
              </form>
            )}

            {/* Government Sponsor Form */}
            {selectedRole === 'government_sponsor' && (
              <form onSubmit={governmentSponsorForm.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                <div>
                  <input
                    type="text"
                    {...governmentSponsorForm.register('agencyName')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      governmentSponsorForm.formState.errors.agencyName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                    }`}
                    placeholder="What's your agency name?"
                  />
                  {governmentSponsorForm.formState.errors.agencyName && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {governmentSponsorForm.formState.errors.agencyName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Select 
                    value={governmentSponsorForm.watch('agencyType')} 
                    onValueChange={(value) => governmentSponsorForm.setValue('agencyType', value as any, { shouldValidate: true })}
                  >
                    <SelectTrigger className={`w-full text-sm px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all data-[placeholder]:text-gray-400 ${
                      governmentSponsorForm.formState.errors.agencyType
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
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
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {governmentSponsorForm.formState.errors.agencyType.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    {...governmentSponsorForm.register('emailAddress')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      governmentSponsorForm.formState.errors.emailAddress
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                    }`}
                    placeholder="Enter official email address"
                  />
                  {governmentSponsorForm.formState.errors.emailAddress && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {governmentSponsorForm.formState.errors.emailAddress.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    {...governmentSponsorForm.register('contactNumber')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      governmentSponsorForm.formState.errors.contactNumber
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                    }`}
                    placeholder="Enter contact number"
                    inputMode="numeric"
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '')
                      governmentSponsorForm.setValue('contactNumber', numericValue, { shouldValidate: true })
                    }}
                  />
                  {governmentSponsorForm.formState.errors.contactNumber && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {governmentSponsorForm.formState.errors.contactNumber.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-3 sm:py-3.5 px-6 rounded-lg transition-all duration-300 text-[#F0F7FF] text-xs sm:text-sm mt-3 ${
                    isFormValid
                      ? 'bg-[#EFA508] hover:bg-[#D89407] shadow-md hover:shadow-lg cursor-pointer'
                      : 'bg-[#9CA3AF] cursor-not-allowed'
                  }`}
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                >
                  Complete
                </motion.button>
              </form>
            )}

            {/* School Form */}
            {selectedRole === 'school' && (
              <form onSubmit={schoolForm.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                <div>
                  <input
                    type="text"
                    {...schoolForm.register('schoolName')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      schoolForm.formState.errors.schoolName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                    }`}
                    placeholder="What's your school name?"
                  />
                  {schoolForm.formState.errors.schoolName && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {schoolForm.formState.errors.schoolName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Select 
                    value={schoolForm.watch('schoolType')} 
                    onValueChange={(value) => schoolForm.setValue('schoolType', value as any, { shouldValidate: true })}
                  >
                    <SelectTrigger className={`w-full text-sm px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all data-[placeholder]:text-gray-400 ${
                      schoolForm.formState.errors.schoolType
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
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
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {schoolForm.formState.errors.schoolType.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    {...schoolForm.register('emailAddress')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      schoolForm.formState.errors.emailAddress
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                    }`}
                    placeholder="Enter official email address"
                  />
                  {schoolForm.formState.errors.emailAddress && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {schoolForm.formState.errors.emailAddress.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="tel"
                    {...schoolForm.register('contactNumber')}
                    className={`w-full px-4 py-3 sm:py-3.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${
                      schoolForm.formState.errors.contactNumber
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-[#111827]'
                        : 'border-gray-300 focus:border-[#3A52A6] focus:ring-[#3A52A6]/20 text-[#111827]'
                    }`}
                    placeholder="Enter contact number"
                    inputMode="numeric"
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '')
                      schoolForm.setValue('contactNumber', numericValue, { shouldValidate: true })
                    }}
                  />
                  {schoolForm.formState.errors.contactNumber && (
                    <p className="mt-1 text-[10px] sm:text-[9px] text-red-500">
                      {schoolForm.formState.errors.contactNumber.message}
                    </p>
                  )}
                </div>

                {/* Complete Button */}
                <motion.button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-3 sm:py-3.5 px-6 rounded-lg transition-all duration-300 text-[#F0F7FF] text-xs sm:text-sm mt-3 ${
                    isFormValid
                      ? 'bg-[#EFA508] hover:bg-[#D89407] shadow-md hover:shadow-lg cursor-pointer'
                      : 'bg-[#9CA3AF] cursor-not-allowed'
                  }`}
                  whileHover={isFormValid ? { scale: 1.02 } : {}}
                  whileTap={isFormValid ? { scale: 0.98 } : {}}
                >
                  Complete
                </motion.button>
              </form>
            )}

          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
