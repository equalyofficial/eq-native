import { z } from 'zod';

/** Exactly 10 digits — matches backend validation */
export const PhoneSchema = z
  .string()
  .regex(/^\d{10}$/, 'Enter a valid 10-digit phone number');

/** Min 8 chars, at least one number — matches backend validation */
export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/(?=.*\d)/, 'Password must contain at least one number');

export const UUIDSchema = z.string().uuid();

export const CurrencyAmountSchema = z
  .number()
  .positive('Amount must be greater than 0')
  .multipleOf(0.01, 'Amount can have at most 2 decimal places');
