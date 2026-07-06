import { MessageCircle } from "lucide-react";

interface Props {
  phone: string;
  message?: string;
}

export function WhatsAppButton({ phone, message = "Përshëndetje, dua më shumë informacion për shërbimet e KPT Consulting." }: Props) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Kontakto në WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" style={{ animationDuration: "2.4s" }} />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elegant transition-transform duration-300 group-hover:scale-110 group-hover:shadow-hover">
        <MessageCircle className="h-7 w-7" strokeWidth={2.2} />
      </span>
    </a>
  );
}
