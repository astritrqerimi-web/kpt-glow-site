import { queryOptions } from "@tanstack/react-query";
import { getSupabase } from "./supabase-lazy";
import { countdownGroupSchema, type CountdownGroup } from "./deadline-countdown";

export type DeadlineRow = {
  formAl: string;
  formEn: string;
  abbr: string;
  deadlineAl: string;
  deadlineEn: string;
  methodAl: string;
  methodEn: string;
};

export type RateRow = {
  labelAl: string;
  labelEn: string;
  thresholdAl: string;
  thresholdEn: string;
  rate: string;
  section: boolean;
};

export type DeadlinesTable = {
  titleAl: string;
  titleEn: string;
  noteAl: string;
  noteEn: string;
  rows: DeadlineRow[];
};

export type RatesTable = {
  titleAl: string;
  titleEn: string;
  noteAl: string;
  noteEn: string;
  rows: RateRow[];
};

export type DeadlinesContent = {
  deadlines: DeadlinesTable;
  rates: RatesTable;
  countdowns: CountdownGroup[];
};

const MONTH_20 = { al: "Prej 01 deri 20 të çdo muaji", en: "From the 1st to the 20th of each month" };
const MONTH_15 = { al: "Prej 01 deri 15 të çdo muaji", en: "From the 1st to the 15th of each month" };
const QUARTER_15 = { al: "Prej 01 deri 15 të çdo tremujori", en: "From the 1st to the 15th of each quarter" };
const YEAR_Q1 = { al: "Prej 01 janar deri 31 mars", en: "From 1 January to 31 March" };
const EDI = { al: "Elektronike (EDI)", en: "Electronic (EDI)" };
const EDI_MANUAL = { al: "Elektronike (EDI) & Manuale", en: "Electronic (EDI) & Manual" };

const row = (formAl: string, formEn: string, abbr: string, d: { al: string; en: string }, m: { al: string; en: string }): DeadlineRow => ({
  formAl, formEn, abbr, deadlineAl: d.al, deadlineEn: d.en, methodAl: m.al, methodEn: m.en,
});

export const DEFAULT_DEADLINES: DeadlinesContent = {
  countdowns: [],
  deadlines: {
    titleAl: "Afatet e Deklarimit",
    titleEn: "Filing Deadlines",
    noteAl: "*Për çdo ndryshim të afateve të deklarimit dhe pagesës së tatimeve të aplikueshme në Kosovë, do të njoftoheni nga KPT Consulting.",
    noteEn: "*For any change to the applicable tax declaration and payment deadlines in Kosovo, you will be notified by KPT Consulting.",
    rows: [
      row("Formulari i deklarimit dhe pagesës së TVSH", "VAT declaration and payment form", "TV", MONTH_20, EDI),
      row("Pasqyra mujore e tatimit në burim në paga dhe kontribute pensionale", "Monthly statement of tax withheld at source on wages and pension contributions", "WM/CM", MONTH_15, EDI),
      row("Pasqyra mujore e mbajtjes në burim dhe pagesës së tatimit në interes, të drejtat pronësore, qira, fitore në lotari dhe lojëra të fatit dhe personin jo-rezident", "Monthly statement of withholding and payment of tax on interest, property rights, rent, lottery and gambling winnings, and non-residents", "WR", MONTH_15, EDI),
      row("Pasqyra tremujore mbi qiranë dhe pasurinë e patundshme", "Quarterly statement on rent and immovable property", "IR", QUARTER_15, EDI_MANUAL),
      row("Pasqyra tremujore e tatimit dhe kontributeve për bizneset e vogla individuale", "Quarterly statement of tax and contributions for small individual businesses", "IS", QUARTER_15, EDI_MANUAL),
      row("Pasqyra tremujore e pagesës paradhënie për bizneset e mëdha individuale", "Quarterly advance payment statement for large individual businesses", "IL", QUARTER_15, EDI_MANUAL),
      row("Pasqyra tremujore e pagesës së tatimit për korporatat e vogla", "Quarterly tax payment statement for small corporations", "QS", QUARTER_15, EDI_MANUAL),
      row("Pasqyra tremujore e pagesës paradhënie për korporatat e mëdha", "Quarterly advance payment statement for large corporations", "QL", QUARTER_15, EDI_MANUAL),
      row("Formular i Deklarimit vjetor dhe pagesën për tatimin mbi të Ardhurat Personale", "Annual declaration and payment form for Personal Income Tax", "PD", YEAR_Q1, EDI_MANUAL),
      row("Formular i Deklarimit vjetor dhe pagesën për tatimin në të Ardhurat e Korporatave", "Annual declaration and payment form for Corporate Income Tax", "CD", YEAR_Q1, EDI_MANUAL),
      row("Deklarata e Tatimit në të Ardhurat nga Ortakëria", "Partnership Income Tax declaration", "DO", YEAR_Q1, EDI_MANUAL),
      row("Deklarimi i Librit të Blerjes", "Purchase Ledger declaration", "LB", MONTH_20, EDI),
      row("Deklarimi i Librit të Shitjes", "Sales Ledger declaration", "LSH", MONTH_20, EDI),
      row("Deklarimi i Raportit të blerjeve mbi 500€", "Declaration of the report of purchases over €500", "RB", YEAR_Q1, EDI),
      row("Deklarimi i Pasqyrave Financiare", "Financial Statements declaration", "PF", YEAR_Q1, EDI),
    ],
  },
  rates: {
    titleAl: "Normat Tatimore",
    titleEn: "Tax Rates",
    noteAl: "*Për çdo ndryshim të normave tatimore të aplikueshme në Kosovë, do të njoftoheni nga KPT Consulting.",
    noteEn: "*For any change to the applicable tax rates in Kosovo, you will be notified by KPT Consulting.",
    rows: [
      { labelAl: "Tatimi mbi Vlerën e Shtuar - TVSH", labelEn: "Value Added Tax - VAT", thresholdAl: "Mbi 30,000 euro", thresholdEn: "Over €30,000", rate: "8% dhe 18%", section: false },
      { labelAl: "Tatimi në të Ardhura të Korporatave - TAK", labelEn: "Corporate Income Tax - CIT", thresholdAl: "", thresholdEn: "", rate: "", section: true },
      { labelAl: "Veprimtaria prodhuese, tregtare dhe transportuese, etj.", labelEn: "Production, trade and transport activities, etc.", thresholdAl: "Nën pragun për tatuarje reale", thresholdEn: "Below the real taxation threshold", rate: "3%", section: false },
      { labelAl: "Veprimtaria shërbyese", labelEn: "Service activities", thresholdAl: "Nën pragun për tatuarje reale", thresholdEn: "Below the real taxation threshold", rate: "9%", section: false },
      { labelAl: "Tatimi në të Ardhura të Korporatave - TAK", labelEn: "Corporate Income Tax - CIT", thresholdAl: "Mbi pragun për tatuarje reale", thresholdEn: "Above the real taxation threshold", rate: "10%", section: false },
      { labelAl: "Tatimi në të Ardhurat Personale - TAP", labelEn: "Personal Income Tax - PIT", thresholdAl: "", thresholdEn: "", rate: "", section: true },
      { labelAl: "Veprimtaria prodhuese, tregtare dhe transportuese, etj.", labelEn: "Production, trade and transport activities, etc.", thresholdAl: "Nën pragun për tatuarje reale", thresholdEn: "Below the real taxation threshold", rate: "3%", section: false },
      { labelAl: "Veprimtaria shërbyese", labelEn: "Service activities", thresholdAl: "Nën pragun për tatuarje reale", thresholdEn: "Below the real taxation threshold", rate: "9%", section: false },
      { labelAl: "Të ardhurat vjetore nga 0 deri 960", labelEn: "Annual income from 0 to 960", thresholdAl: "", thresholdEn: "", rate: "0%", section: false },
      { labelAl: "Të ardhurat vjetore nga 960 - 3.000", labelEn: "Annual income from 960 to 3,000", thresholdAl: "", thresholdEn: "", rate: "0%", section: false },
      { labelAl: "Të ardhurat vjetore nga 3.000 deri 5.400", labelEn: "Annual income from 3,000 to 5,400", thresholdAl: "", thresholdEn: "", rate: "8%", section: false },
      { labelAl: "Të ardhurat vjetore nga 5.400 e tutje", labelEn: "Annual income from 5,400 and above", thresholdAl: "", thresholdEn: "", rate: "10%", section: false },
      { labelAl: "Tatimi i mbajtur në burim në Paga - TAP (person fizik jo-afarist)", labelEn: "Tax withheld at source on Wages - PIT (non-business individual)", thresholdAl: "", thresholdEn: "", rate: "", section: true },
      { labelAl: "Të ardhurat mujore nga 0 deri 80", labelEn: "Monthly income from 0 to 80", thresholdAl: "", thresholdEn: "", rate: "0%", section: false },
      { labelAl: "Të ardhurat mujore nga 80 - 250", labelEn: "Monthly income from 80 to 250", thresholdAl: "", thresholdEn: "", rate: "0%", section: false },
      { labelAl: "Të ardhurat mujore nga 250 - 450", labelEn: "Monthly income from 250 to 450", thresholdAl: "", thresholdEn: "", rate: "8%", section: false },
      { labelAl: "Të ardhurat mujore nga 450 e tutje", labelEn: "Monthly income from 450 and above", thresholdAl: "", thresholdEn: "", rate: "10%", section: false },
      { labelAl: "Tatimi në Qira", labelEn: "Tax on Rent", thresholdAl: "", thresholdEn: "", rate: "10%", section: false },
      { labelAl: "Tatimi i mbajtur në burim në qira", labelEn: "Tax withheld at source on rent", thresholdAl: "", thresholdEn: "", rate: "9%", section: false },
      { labelAl: "Tatimi i mbajtur në burim në interes", labelEn: "Tax withheld at source on interest", thresholdAl: "", thresholdEn: "", rate: "10%", section: false },
      { labelAl: "Tatimi i mbajtur në burim në të drejta pronësore", labelEn: "Tax withheld at source on property rights", thresholdAl: "", thresholdEn: "", rate: "10%", section: false },
      { labelAl: "Tatimi i mbajtur në burim për kategori të veçanta", labelEn: "Tax withheld at source for special categories", thresholdAl: "Varësisht nga statusi i biznesit", thresholdEn: "Depending on business status", rate: "1 ose 3%", section: false },
      { labelAl: "Tatimi i mbajtur në burim për jo-rezidentët", labelEn: "Tax withheld at source for non-residents", thresholdAl: "", thresholdEn: "", rate: "5%", section: false },
    ],
  },
};

const isRow = (r: unknown): r is DeadlineRow =>
  !!r && typeof r === "object" &&
  ["formAl", "formEn", "abbr", "deadlineAl", "deadlineEn", "methodAl", "methodEn"]
    .every((k) => typeof (r as Record<string, unknown>)[k] === "string");

const isRateRow = (r: unknown): r is RateRow =>
  !!r && typeof r === "object" &&
  ["labelAl", "labelEn", "thresholdAl", "thresholdEn", "rate"].every((k) => typeof (r as Record<string, unknown>)[k] === "string") &&
  typeof (r as Record<string, unknown>).section === "boolean";

export function resolveDeadlinesContent(value: unknown): DeadlinesContent {
  const v = value as Partial<DeadlinesContent> | null | undefined;
  const d = v?.deadlines;
  const r = v?.rates;
  const rows = Array.isArray(d?.rows) && d.rows.every(isRow) ? d.rows : DEFAULT_DEADLINES.deadlines.rows;
  const savedCountdowns = countdownGroupSchema.array().safeParse(v?.countdowns);
  const groups: { titleAl: string; titleEn: string; frequency: CountdownGroup["frequency"]; day: number; codes: string[] }[] = [
    { titleAl: "Afati mujor deri më 15", titleEn: "Monthly deadline — 15th", frequency: "monthly", day: 15, codes: ["WM/CM", "WR"] },
    { titleAl: "Afati mujor deri më 20", titleEn: "Monthly deadline — 20th", frequency: "monthly", day: 20, codes: ["TV"] },
    { titleAl: "Afati tremujor deri më 15", titleEn: "Quarterly deadline — 15th after quarter end", frequency: "quarterly", day: 15, codes: ["IS", "IL", "QS", "QL"] },
    { titleAl: "Afati vjetor — 31 mars", titleEn: "Annual deadline — 31 March", frequency: "annual", day: 31, codes: ["PD", "CD"] },
  ];
  return {
    countdowns: savedCountdowns.success ? savedCountdowns.data : groups.map(g => ({
      titleAl: g.titleAl, titleEn: g.titleEn, frequency: g.frequency, day: g.day, month: 3,
      forms: g.codes.flatMap(code => { const form = rows.find(row => row.abbr === code) ?? DEFAULT_DEADLINES.deadlines.rows.find(row => row.abbr === code); return form ? [{ formAl: form.formAl, formEn: form.formEn, abbr: form.abbr }] : []; }),
    })),
    deadlines: {
      titleAl: typeof d?.titleAl === "string" ? d.titleAl : DEFAULT_DEADLINES.deadlines.titleAl,
      titleEn: typeof d?.titleEn === "string" ? d.titleEn : DEFAULT_DEADLINES.deadlines.titleEn,
      noteAl: typeof d?.noteAl === "string" ? d.noteAl : DEFAULT_DEADLINES.deadlines.noteAl,
      noteEn: typeof d?.noteEn === "string" ? d.noteEn : DEFAULT_DEADLINES.deadlines.noteEn,
      rows: Array.isArray(d?.rows) && d.rows.every(isRow) ? d.rows : DEFAULT_DEADLINES.deadlines.rows,
    },
    rates: {
      titleAl: typeof r?.titleAl === "string" ? r.titleAl : DEFAULT_DEADLINES.rates.titleAl,
      titleEn: typeof r?.titleEn === "string" ? r.titleEn : DEFAULT_DEADLINES.rates.titleEn,
      noteAl: typeof r?.noteAl === "string" ? r.noteAl : DEFAULT_DEADLINES.rates.noteAl,
      noteEn: typeof r?.noteEn === "string" ? r.noteEn : DEFAULT_DEADLINES.rates.noteEn,
      rows: Array.isArray(r?.rows) && r.rows.every(isRateRow) ? r.rows : DEFAULT_DEADLINES.rates.rows,
    },
  };
}

export const deadlinesQuery = () => queryOptions({
  queryKey: ["site_content", "filing_deadlines"],
  queryFn: async () => {
    const db = await getSupabase();
    const { data, error } = await db.from("site_content").select("value").eq("key", "filing_deadlines").maybeSingle();
    if (error) throw error;
    return resolveDeadlinesContent(data?.value);
  },
  staleTime: 0,
  refetchInterval: 30000,
});
