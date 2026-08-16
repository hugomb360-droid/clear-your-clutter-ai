import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runEstimation } from "./estimate.server";

const EstimateInput = z.object({
  propertyType: z.string().min(1),
  surfaceM2: z.number().int().positive().max(2000).optional(),
  floor: z.number().int().min(0).max(30),
  hasElevator: z.boolean(),
  notes: z.string().max(1500).optional(),
  images: z.array(z.string().startsWith("data:image/")).max(8).default([]),
});

export const estimateClearance = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EstimateInput.parse(input))
  .handler(async ({ data }) => runEstimation(data));
