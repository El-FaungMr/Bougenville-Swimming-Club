import { REGISTRATION_STATUSES } from "./constants";

export type RegistrationStatus = typeof REGISTRATION_STATUSES[number];

export interface RegistrationInput {
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  age: number;
  parentName: string;
  parentWhatsapp: string;
  program: "reguler-3" | "reguler-4" | "private";
  swimmingLevel: "pemula" | "menengah" | "mahir";
  preferredSchedule: string;
  notes?: string;
  agreePrivacy: boolean;
}

export interface RegistrationRecord extends RegistrationInput {
  id: string;
  programTitle: string;
  priceDisplay: string;
  status: RegistrationStatus;
  adminNotes?: string;
  agreedSchedule?: string;
  createdAt: string; // ISO string
  updatedAt?: string;
}

export interface AdminUser {
  email: string;
  role: "admin";
  displayName?: string;
  createdAt?: string;
}
