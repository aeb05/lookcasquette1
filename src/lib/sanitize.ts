import { z } from "zod";

/**
 * Strip HTML tags and trim whitespace to prevent XSS / injection.
 */
export const stripHtml = (str: string): string =>
  str.replace(/<[^>]*>/g, "").trim();

/**
 * Sanitize a plain text field: strip HTML, collapse whitespace, trim.
 */
export const sanitizeText = (str: string): string =>
  stripHtml(str).replace(/\s+/g, " ");

/**
 * Moroccan phone: 06/07/05/08 followed by 8 digits, or +212 variant.
 */
const phoneRegex = /^(?:\+212|0)[5-8]\d{8}$/;

// ── Checkout form ──────────────────────────────────────────────
export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne doit pas dépasser 100 caractères")
    .transform(sanitizeText),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Numéro de téléphone invalide (ex: 06XXXXXXXX)")
    .max(20),
  city: z
    .string()
    .trim()
    .min(2, "La ville doit contenir au moins 2 caractères")
    .max(100, "La ville ne doit pas dépasser 100 caractères")
    .transform(sanitizeText),
  address: z
    .string()
    .trim()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(300, "L'adresse ne doit pas dépasser 300 caractères")
    .transform(sanitizeText),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ── Product form ───────────────────────────────────────────────
export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom est obligatoire")
    .max(200, "Le nom ne doit pas dépasser 200 caractères")
    .transform(sanitizeText),
  price: z
    .number({ invalid_type_error: "Le prix doit être un nombre" })
    .min(0, "Le prix doit être positif"),
  category: z
    .string()
    .trim()
    .min(1, "La catégorie est obligatoire")
    .max(50, "La catégorie ne doit pas dépasser 50 caractères")
    .transform((v) => sanitizeText(v).toUpperCase()),
  image: z
    .string()
    .url("L'URL de l'image est invalide")
    .max(2000),
  images: z.array(z.string().url().max(2000)).default([]),
  description: z
    .string()
    .max(2000, "La description ne doit pas dépasser 2000 caractères")
    .transform(sanitizeText)
    .default(""),
  details: z
    .array(
      z.string().max(500).transform(sanitizeText)
    )
    .default([]),
});

export type ProductFormData = z.infer<typeof productSchema>;

// ── Login form ─────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Adresse email invalide")
    .max(255),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .max(128),
});

export type LoginFormData = z.infer<typeof loginSchema>;
