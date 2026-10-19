import { z } from "zod";

export const successionSchema = z.object({
  address: z.string().trim().min(5).max(300),
  postalCode: z.string().regex(/^\d{5}$/, "Code postal à 5 chiffres requis"),
  city: z.string().trim().min(2).max(100),
  propertyType: z.enum(["Maison", "Appartement", "Autre logement"]),
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(30).regex(/^[+\d\s().-]+$/),
  heirPresent: z.boolean(),
  remoteKeys: z.boolean(),
  keyInstructions: z.string().trim().max(1500),
  valuables: z.string().trim().max(2000),
  furnitureChoice: z.enum(["don", "revente", "don_revente", "evacuation"]),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => !Number.isNaN(Date.parse(value)), "Date invalide"),
  deadlineReason: z.enum(["vente", "bail", "autre"]),
  heirsAgreement: z.literal(true, { errorMap: () => ({ message: "L'accord des héritiers est nécessaire" }) }),
}).superRefine((data, ctx) => {
  if (data.remoteKeys && data.keyInstructions.length < 5) ctx.addIssue({ code: "custom", path: ["keyInstructions"], message: "Précisez comment seront remises les clés" });
});

export const reportSchema = z.object({
  bidId: z.string().uuid(),
  volumeM3: z.number().positive("Indiquez le volume réellement évacué").max(2000),
  recycling: z.string().trim().min(10, "Précisez les filières et les lieux de dépôt").max(3000),
});

export const referralSchema = z.object({
  organization: z.string().trim().min(2).max(150),
  profession: z.enum(["notaire", "agence", "ehpad"]),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).regex(/^[+\d\s().-]*$/),
  message: z.string().trim().min(10).max(3000),
  consent: z.literal(true),
  website: z.string().max(0),
});

export const reportAvailable = (status: string) => status === "awaiting_confirmation" || status === "completed";

export type SuccessionInput = z.infer<typeof successionSchema>;