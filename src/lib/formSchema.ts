import { z } from 'zod';
import { departments, jobTypes, relationships } from '@/data/mockData';

// Step 1: Personal Info Schema
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z
    .date()
    .refine(
      (date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        const dayDiff = today.getDate() - date.getDate();
        
        // Adjust age if birthday hasn't occurred this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          return age - 1 >= 18;
        }
        return age >= 18;
      },
      { message: 'Must be at least 18 years old' }
    ),
  profilePicture: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 2 * 1024 * 1024,
      'File size must be less than 2MB'
    )
    .refine(
      (file) => !file || ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
      'Only JPG and PNG files are allowed'
    ),
});

// Step 2: Job Details Schema
export const jobDetailsSchema = z.object({
  department: z.enum(departments, { required_error: 'Please select a department' }),
  positionTitle: z
    .string()
    .min(3, 'Position title must be at least 3 characters'),
  startDate: z
    .date()
    .refine(
      (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      { message: 'Start date cannot be in the past' }
    )
    .refine(
      (date) => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 90);
        return date <= maxDate;
      },
      { message: 'Start date cannot be more than 90 days in the future' }
    ),
  jobType: z.enum(jobTypes, { required_error: 'Please select a job type' }),
  salaryExpectation: z.union([
    z.number().min(30000).max(200000), // Full-time annual
    z.number().min(50).max(150), // Contract hourly
  ]),
  managerId: z.string().min(1, 'Please select a manager'),
})
.refine((data) => {
  // Weekend validation for HR and Finance
  if (['HR', 'Finance'].includes(data.department)) {
    const dayOfWeek = data.startDate.getDay();
    return dayOfWeek !== 5 && dayOfWeek !== 6; // Friday = 5, Saturday = 6
  }
  return true;
}, {
  message: 'HR and Finance employees cannot start on weekends',
  path: ['startDate'],
});

// Step 3: Skills & Preferences Schema
export const skillsPreferencesSchema = z.object({
  primarySkills: z
    .array(z.string())
    .min(3, 'Please select at least 3 skills'),
  skillExperience: z.record(z.string(), z.number().min(0).max(20)),
  preferredWorkingHours: z.object({
    start: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
    end: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  }),
  remoteWorkPreference: z.number().min(0).max(100),
  managerApproved: z.boolean().optional(),
  extraNotes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

// Step 4: Emergency Contact Schema
export const emergencyContactSchema = z.object({
  contactName: z.string().min(1, 'Contact name is required'),
  relationship: z.enum(relationships, { required_error: 'Please select a relationship' }),
  contactPhoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits'),
  guardianName: z.string().optional(),
  guardianPhoneNumber: z.string().optional(),
});

// Step 5: Review Schema
export const reviewSchema = z.object({
  confirmInformation: z.boolean().refine((val) => val === true, {
    message: 'You must confirm that all information is correct',
  }),
});

// Complete form schema
export const completeFormSchema = personalInfoSchema
  .and(jobDetailsSchema)
  .and(skillsPreferencesSchema)
  .and(emergencyContactSchema)
  .and(reviewSchema);

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type JobDetails = z.infer<typeof jobDetailsSchema>;
export type SkillsPreferences = z.infer<typeof skillsPreferencesSchema>;
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type CompleteForm = z.infer<typeof completeFormSchema>;