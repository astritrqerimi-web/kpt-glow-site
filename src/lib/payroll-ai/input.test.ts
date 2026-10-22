import { describe, test } from "node:test";
import { strictEqual } from "node:assert";
import { explanationInputSchema } from "./input";
const input = {amount:1000,mode:"gross",employeeRate:5,employerRate:5,employer:"primary",fullTime:true,language:"sq"};
describe("AI payroll input", () => {
  test("accepts calculator gross and contribution choices", () => strictEqual(explanationInputSchema.safeParse(input).success,true));
  test("rejects invalid salary precision", () => strictEqual(explanationInputSchema.safeParse({...input,amount:1000.001}).success,false));
  test("rejects contribution outside existing validated range", () => strictEqual(explanationInputSchema.safeParse({...input,employeeRate:16}).success,false));
  test("strips client-supplied authoritative net amounts", () => strictEqual("net" in explanationInputSchema.parse({...input,net:999999}),false));
});