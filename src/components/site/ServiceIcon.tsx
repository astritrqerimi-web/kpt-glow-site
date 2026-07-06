import {
  Award, BarChart3, BookOpen, Briefcase, Building2, FileText, GraduationCap,
  Lightbulb, Monitor, TrendingUp, Users, Calculator, PiggyBank, ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Award, BarChart3, BookOpen, Briefcase, Building2, FileText, GraduationCap,
  Lightbulb, Monitor, TrendingUp, Users, Calculator, PiggyBank, ShieldCheck,
};

export const ICON_NAMES = Object.keys(map);

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? Briefcase;
  return <Icon className={className} strokeWidth={1.6} />;
}
