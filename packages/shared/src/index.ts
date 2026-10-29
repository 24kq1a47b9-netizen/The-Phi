import { z } from 'zod';

export const agreementStatusSchema = z.enum(['DRAFT','PENDING_EMPLOYEE','PENDING_REPRESENTATIVE','COMPLETED','REJECTED','EXPIRED','CANCELLED']);
export type AgreementStatus = z.infer<typeof agreementStatusSchema>;
export const roleSchema = z.enum(['ADMIN','MANAGER','EMPLOYEE']);
export type Role = z.infer<typeof roleSchema>;
export const agreementTypeSchema = z.enum(['EMPLOYMENT','INTERNSHIP','MANAGER','NDA','CUSTOM']);
export const agreementInputSchema = z.object({
  title: z.string().min(1).max(200), type: agreementTypeSchema, employeeId: z.string().uuid(), representativeId: z.string().uuid(),
  terms: z.string().min(1), effectiveDate: z.string().date(), expiresAt: z.string().date().optional(), metadata: z.record(z.string()).default({})
});
export type AgreementInput = z.infer<typeof agreementInputSchema>;
export const signInputSchema = z.object({ agreementVersion: z.number().int().positive(), acknowledgement: z.literal(true), idempotencyKey: z.string().min(16).max(128) });
export const apiError = (code: string, message: string) => ({ error: { code, message } });
