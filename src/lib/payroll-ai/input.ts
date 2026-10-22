import { z } from "zod";
export const explanationInputSchema = z.object({
  amount: z.number().finite().min(0).max(10000000).refine(value => Math.abs(value * 100 - Math.round(value * 100)) < 0.000001),
  mode: z.enum(["gross", "net"]),
  employeeRate: z.number().min(5).max(15),
  employerRate: z.number().min(5).max(15),
  employer: z.enum(["primary", "secondary"]),
  fullTime: z.boolean(),
  language: z.enum(["sq", "en"]),
});
export type ExplanationInput = z.infer<typeof explanationInputSchema>;