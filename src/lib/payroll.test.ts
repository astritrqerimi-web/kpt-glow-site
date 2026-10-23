import { describe, test } from "node:test";
import { deepStrictEqual, strictEqual } from "node:assert";
import { DEFAULT_PAYROLL, calculatePayroll, payrollFromGross, payrollConfigSchema, resolvePayrollConfig } from "./payroll";

describe("Kosovo monthly payroll", () => {
  test("primary 1000 gross matches current 250/450 brackets", () => {
    const r = calculatePayroll(1000, "gross", DEFAULT_PAYROLL, "primary");
    deepStrictEqual([r.employee, r.taxable, r.tax, r.net, r.totalCost], [5000,95000,6600,88400,105000]);
  });
  test("secondary withholding is 10% after employee pension", () => {
    const r = calculatePayroll(1000, "gross", DEFAULT_PAYROLL, "secondary");
    deepStrictEqual([r.tax, r.net], [9500,85500]);
  });
  test("net to gross returns 1000 for 884 primary", () => strictEqual(calculatePayroll(884,"net",DEFAULT_PAYROLL,"primary").gross,100000));
  test("net to gross returns 1000 for 855 secondary", () => strictEqual(calculatePayroll(855,"net",DEFAULT_PAYROLL,"secondary").gross,100000));
  test("taxable boundary 250 is untaxed", () => strictEqual(payrollFromGross(25000,{...DEFAULT_PAYROLL, employeeRate:0},"primary").tax,0));
  test("taxable boundary 450 accumulates 16 tax", () => strictEqual(payrollFromGross(45000,{...DEFAULT_PAYROLL, employeeRate:0},"primary").tax,1600));
  test("0% employee pension: primary net 910, secondary net 900", () => { strictEqual(calculatePayroll(1000,"gross",{...DEFAULT_PAYROLL,employeeRate:0},"primary").net,91000); strictEqual(calculatePayroll(1000,"gross",{...DEFAULT_PAYROLL,employeeRate:0},"secondary").net,90000); });
  test("0%/0% keeps zero employer cost and net->gross roundtrips", () => { const c={...DEFAULT_PAYROLL,employeeRate:0,employerRate:0}; strictEqual(calculatePayroll(1000,"gross",c,"primary").totalCost,100000); strictEqual(calculatePayroll(910,"net",c,"primary").gross,100000); strictEqual(calculatePayroll(900,"net",c,"secondary").gross,100000); });
  test("rates above 5% are rejected", () => strictEqual(resolvePayrollConfig({...DEFAULT_PAYROLL,employeeRate:6}),DEFAULT_PAYROLL));
  test("visitor employee contribution adjustment applies in both conversion modes", () => {
    const adjusted = {...DEFAULT_PAYROLL, employeeRate:6};
    strictEqual(calculatePayroll(1000,"gross",adjusted,"primary").net,87500);
    strictEqual(calculatePayroll(875,"net",adjusted,"primary").gross,100000);
    strictEqual(DEFAULT_PAYROLL.employeeRate,5);
  });
  test("visitor employer contribution adjustment changes employer cost only", () => {
    const adjusted = calculatePayroll(1000,"gross",{...DEFAULT_PAYROLL,employerRate:6},"primary");
    strictEqual(adjusted.totalCost,106000);
    strictEqual(adjusted.net,88400);
  });
  test("older saved text fields preserve custom calculation parameters", () => {
    const {grossFlow, netFlow, contributions, employee, progressiveTax, flatTax, decrease, increase, ...legacyTexts} = DEFAULT_PAYROLL.texts;
    const resolved = resolvePayrollConfig({...DEFAULT_PAYROLL,texts:legacyTexts,secondaryRate:12});
    strictEqual(resolved.secondaryRate,12);
    strictEqual(calculatePayroll(1000,"gross",resolved,"secondary").tax,11400);
  });
  test("full-time employer contribution floor uses 350 minimum wage", () => strictEqual(calculatePayroll(100,"gross",DEFAULT_PAYROLL,"primary").employerPension,1750));
  test("part-time does not apply full-time employer minimum base", () => strictEqual(calculatePayroll(100,"gross",DEFAULT_PAYROLL,"primary",false).employerPension,500));
  test("zero salary produces zero contributions", () => strictEqual(calculatePayroll(0,"gross",DEFAULT_PAYROLL,"primary").totalCost,0));
  test("admin parameters immediately affect calculation", () => strictEqual(calculatePayroll(1000,"gross",{...DEFAULT_PAYROLL,secondaryRate:12},"secondary").tax,11400));
  test("invalid and decreasing brackets rejected", () => strictEqual(payrollConfigSchema.safeParse({...DEFAULT_PAYROLL,brackets:[{upTo:450,rate:0},{upTo:250,rate:8},{upTo:null,rate:10}]}).success,false));
});