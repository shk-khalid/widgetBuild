import * as yup from 'yup';

// Common validation schemas
export const emailSchema = yup
  .string()
  .required('Email is required')
  .email('Invalid email format');

export const passwordSchema = yup
  .string()
  .required('Password is required')
  .min(6, 'Password must be at least 6 characters')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

export const nameSchema = yup
  .string()
  .required('Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces');

// Form validation schemas
export const loginFormSchema = yup.object({
  email: emailSchema,
  password: yup.string().required('Password is required'),
});

// signup: cross‑field password match via .test()
export const signupFormSchema = yup
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: yup.string().required('Please confirm your password'),
    role: yup
      .mixed<'customer' | 'merchant'>()
      .oneOf(['customer', 'merchant'], 'Invalid role')
      .required('Role is required'),
  })
  .test(
    'passwords-match',
    "Passwords don't match",
    (value) => value?.password === value?.confirmPassword
  );

export const forgotPasswordFormSchema = yup.object({
  email: emailSchema,
});

export const resetPasswordFormSchema = yup
  .object({
    password: passwordSchema,
    confirmPassword: yup.string().required('Please confirm your password'),
  })
  .test(
    'passwords-match',
    "Passwords don't match",
    (value) => value?.password === value?.confirmPassword
  );

// Type inference helpers (if you’re using TS)
export type LoginFormData = yup.InferType<typeof loginFormSchema>;
export type SignupFormData = yup.InferType<typeof signupFormSchema>;
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordFormSchema>;
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordFormSchema>;
