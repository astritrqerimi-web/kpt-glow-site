import { queryOptions } from "@tanstack/react-query";
import { getSupabase } from "./supabase-lazy";
import { resolvePayrollConfig } from "./payroll";

export const payrollQuery = () => queryOptions({
  queryKey: ["site_content", "payroll_calculator"],
  queryFn: async () => {
    const db = await getSupabase();
    const { data, error } = await db.from("site_content").select("value").eq("key", "payroll_calculator").maybeSingle();
    if (error) throw error;
    return resolvePayrollConfig(data?.value);
  },
  staleTime: 0,
  refetchInterval: 30000,
});