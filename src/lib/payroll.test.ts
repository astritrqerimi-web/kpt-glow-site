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
  test("0% employee pension: primary net 929, secondary net 900", () => { strictEqual(calculatePayroll(1000,"gross",{...DEFAULT_PAYROLL,employeeRate:0},"primary").net,92900); strictEqual(calculatePayroll(1000,"gross",{...DEFAULT_PAYROLL,employeeRate:0},"secondary").net,90000); });
  test("0%/0% keeps zero employer cost and net->gross roundtrips", () => { const c={...DEFAULT_PAYROLL,employeeRate:0,employerRate:0}; strictEqual(calculatePayroll(1000,"gross",c,"primary").totalCost,100000); strictEqual(calculatePayroll(929,"net",c,"primary").gross,100000); strictEqual(calculatePayroll(900,"net",c,"secondary").gross,100000); });
  test("rates above 5% are rejected", () => strictEqual(resolvePayrollConfig({...DEFAULT_PAYROLL,employeeRate:6,secondaryRate:12}).secondaryRate,10));
  test("visitor employee contribution adjustment applies in both conversion modes", () => {
    const adjusted = {...DEFAULT_PAYROLL, employeeRate:4};
    strictEqual(calculatePayroll(1000,"gross",adjusted,"primary").net,89300);
    strictEqual(calculatePayroll(893,"net",adjusted,"primary").gross,100000);
    strictEqual(DEFAULT_PAYROLL.employeeRate,5);
  });
  test("visitor employer contribution adjustment changes employer cost only", () => {
    const adjusted = calculatePayroll(1000,"gross",{...DEFAULT_PAYROLL,employerRate:4},"primary");
    strictEqual(adjusted.totalCost,104000);
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
  test("secondary 75 gross at 5% has 3.75 employer pension and 78.75 total cost", () => {
    const result = calculatePayroll(75,"gross",DEFAULT_PAYROLL,"secondary");
    deepStrictEqual([result.gross, result.employerPension, result.totalCost], [7500,375,7875]);
  });
  test("secondary net-to-gross computes employer pension from resolved gross with cent rounding", () => {
    const result = calculatePayroll(64.12,"net",DEFAULT_PAYROLL,"secondary");
    deepStrictEqual([result.gross, result.employerPension, result.totalCost], [7499,375,7874]);
  });
  test("secondary 0% employer contribution stays zero in both conversion modes", () => {
    const config = {...DEFAULT_PAYROLL,employerRate:0};
    for (const [amount, mode, gross] of [[75,"gross",7500],[64.12,"net",7499]] as const) {
      const result = calculatePayroll(amount,mode,config,"secondary");
      deepStrictEqual([result.gross, result.employerPension, result.totalCost], [gross,0,gross]);
    }
  });
  test("secondary employer pension follows changed salary and selected percentage", () => {
    const config = {...DEFAULT_PAYROLL,employerRate:4};
    for (const [amount, mode, pension, totalCost] of [[75,"gross",300,7800],[64.12,"net",300,7799],[100,"gross",400,10400],[85.5,"net",400,10400]] as const) {
      const result = calculatePayroll(amount,mode,config,"secondary");
      deepStrictEqual([result.employerPension, result.totalCost], [pension,totalCost]);
    }
  });
  test("switching primary and secondary preserves only the primary full-time floor", () => {
    for (const [amount, mode] of [[75,"gross"],[71.25,"net"]] as const) {
      strictEqual(calculatePayroll(amount,mode,DEFAULT_PAYROLL,"primary").employerPension,1750);
    }
    strictEqual(calculatePayroll(75,"gross",DEFAULT_PAYROLL,"secondary").employerPension,375);
    strictEqual(calculatePayroll(64.12,"net",DEFAULT_PAYROLL,"secondary").employerPension,375);
  });
  test("zero salary produces zero contributions", () => strictEqual(calculatePayroll(0,"gross",DEFAULT_PAYROLL,"primary").totalCost,0));
  test("admin parameters immediately affect calculation", () => strictEqual(calculatePayroll(1000,"gross",{...DEFAULT_PAYROLL,secondaryRate:12},"secondary").tax,11400));
  test("invalid and decreasing brackets rejected", () => strictEqual(payrollConfigSchema.safeParse({...DEFAULT_PAYROLL,brackets:[{upTo:450,rate:0},{upTo:250,rate:8},{upTo:null,rate:10}]}).success,false));
});