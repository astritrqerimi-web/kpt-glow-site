import { describe, test, expect } from "bun:test";
import { DEFAULT_PAYROLL, calculatePayroll, payrollFromGross, payrollConfigSchema } from "./payroll";

describe("Kosovo monthly payroll", () => {
  test("primary 1000 gross matches current 250/450 brackets", () => {
    const r = calculatePayroll(1000, "gross", DEFAULT_PAYROLL, "primary");
    expect([r.employee, r.taxable, r.tax, r.net, r.totalCost]).toEqual([5000,95000,6600,88400,105000]);
  });
  test("secondary withholding is 10% after employee pension", () => {
    const r = calculatePayroll(1000, "gross", DEFAULT_PAYROLL, "secondary");
    expect([r.tax, r.net]).toEqual([9500,85500]);
  });
  test("net to gross returns 1000 for 884 primary", () => expect(calculatePayroll(884,"net",DEFAULT_PAYROLL,"primary").gross).toBe(100000));
  test("net to gross returns 1000 for 855 secondary", () => expect(calculatePayroll(855,"net",DEFAULT_PAYROLL,"secondary").gross).toBe(100000));
  test("taxable boundary 250 is untaxed", () => expect(payrollFromGross(25000,{...DEFAULT_PAYROLL, employeeRate:0},"primary").tax).toBe(0));
  test("taxable boundary 450 accumulates 16 tax", () => expect(payrollFromGross(45000,{...DEFAULT_PAYROLL, employeeRate:0},"primary").tax).toBe(1600));
  test("15% employee pension changes primary net to 794", () => expect(calculatePayroll(1000,"gross",{...DEFAULT_PAYROLL,employeeRate:15},"primary").net).toBe(79400));
  test("full-time employer contribution floor uses 350 minimum wage", () => expect(calculatePayroll(100,"gross",DEFAULT_PAYROLL,"primary").employerPension).toBe(1750));
  test("part-time does not apply full-time employer minimum base", () => expect(calculatePayroll(100,"gross",DEFAULT_PAYROLL,"primary",false).employerPension).toBe(500));
  test("zero salary produces zero contributions", () => expect(calculatePayroll(0,"gross",DEFAULT_PAYROLL,"primary").totalCost).toBe(0));
  test("admin parameters immediately affect calculation", () => expect(calculatePayroll(1000,"gross",{...DEFAULT_PAYROLL,secondaryRate:12},"secondary").tax).toBe(11400));
  test("invalid and decreasing brackets rejected", () => expect(payrollConfigSchema.safeParse({...DEFAULT_PAYROLL,brackets:[{upTo:450,rate:0},{upTo:250,rate:8},{upTo:null,rate:10}]}).success).toBe(false));
});