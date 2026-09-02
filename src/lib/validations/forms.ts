import { z } from "zod";

export const diagnosticFormSchema = z.object({
  sector: z.string().min(1, "Sélectionnez un secteur"),
  employeeCount: z.coerce.number().int().min(0).max(100000),
  revenueRange: z.enum(["moins-10m", "10-50m", "50-200m", "plus-200m"]),
  outletsCount: z.coerce.number().int().min(0).max(10000),
  hasStockManagement: z.boolean(),
  hasCashManagement: z.boolean(),
  hasMobileMoney: z.boolean(),
  hasProcurement: z.boolean(),
  hasVehicles: z.boolean(),
  hasProjects: z.boolean(),
  existingControls: z.enum(["aucun", "partiel", "structure"]),
  mainDifficulties: z.string().max(2000).optional().default(""),
  companyName: z.string().max(200).optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().max(40).optional(),
});

export type DiagnosticFormValues = z.infer<typeof diagnosticFormSchema>;

export const missionRequestSchema = z.object({
  companyName: z.string().min(2, "Nom de l'entreprise requis").max(200),
  sector: z.string().min(1, "Sélectionnez un secteur"),
  responsibleName: z.string().min(2, "Nom du responsable requis").max(150),
  phone: z.string().min(6, "Numéro de téléphone requis").max(40),
  email: z.string().email("Email invalide"),
  location: z.string().min(2, "Localisation requise").max(200),
  employeeCount: z.coerce.number().int().min(0).max(100000).optional(),
  requestType: z.enum([
    "diagnostic",
    "investigation",
    "controle-ponctuel",
    "installation-systeme",
    "supervision",
    "controle-terrain",
    "autre",
  ]),
  problemDescription: z.string().min(10, "Merci de décrire votre besoin (10 caractères minimum)").max(4000),
  urgency: z.enum(["faible", "normale", "urgente"]),
  solutionSlug: z.string().optional(),
});

export type MissionRequestFormValues = z.infer<typeof missionRequestSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(4000),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
