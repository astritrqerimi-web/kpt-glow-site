import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { explanationInputSchema } from "./input";

export const explainPayroll = createServerFn({ method: "POST" })
  .validator(explanationInputSchema)
  .handler(async ({ data }) => {
    const { explainSalary } = await import("./explain.server");
    return explainSalary(data, getRequest());
  });