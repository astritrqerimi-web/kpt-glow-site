// SMTP email sender — portable, no dependency on Resend or Lovable Emails.
// Uses denomailer to talk to any standard SMTP server (your hosting SMTP).
//
// Two modes:
//   - "contact": public. Sends a notification to SMTP_FROM (admin inbox) from the site.
//   - "reply":   admin only. Sends a reply to a contact_message recipient.
//
// Required environment variables (add them in Cloud → Backend → Secrets):
//   SMTP_HOST        e.g. mail.kptconsulting.al
//   SMTP_PORT        e.g. 465 (SSL) or 587 (STARTTLS)
//   SMTP_USER        full mailbox login, usually info@kptconsulting.al
//   SMTP_PASSWORD    mailbox password
//   SMTP_FROM        display From, usually info@kptconsulting.al
//   SMTP_SECURE      "true" for implicit TLS (port 465), "false" for STARTTLS (587). Default "true".

import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Payload {
  mode: "contact" | "reply";
  to?: string;           // reply mode only
  subject: string;
  message: string;       // plain text; will be wrapped in a minimal HTML template
  replyTo?: string;      // optional Reply-To header
  from_name?: string;    // contact mode: name of the sender for the notification
  from_email?: string;   // contact mode: email of the sender (used as Reply-To)
  phone?: string;        // contact mode
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function htmlWrap(subject: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f6f7f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
  <div style="max-width:600px;margin:24px auto;background:#ffffff;border-radius:12px;padding:28px;border:1px solid #e5e7eb">
    <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#0F8B8D;font-weight:600">KPT Consulting</div>
    <h1 style="font-size:20px;margin:8px 0 16px;color:#0f172a">${esc(subject)}</h1>
    <div style="font-size:15px;line-height:1.6;color:#334155">${bodyHtml}</div>
    <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb"/>
    <div style="font-size:12px;color:#64748b">KPT Consulting L.L.C. · Rr. e Llapit, Fushë Kosovë · info@kptconsulting.al</div>
  </div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  try {
    const host = Deno.env.get("SMTP_HOST");
    const portStr = Deno.env.get("SMTP_PORT") ?? "465";
    const user = Deno.env.get("SMTP_USER");
    const password = Deno.env.get("SMTP_PASSWORD");
    const fromAddr = Deno.env.get("SMTP_FROM") ?? user;
    const secure = (Deno.env.get("SMTP_SECURE") ?? "true").toLowerCase() !== "false";
    if (!host || !user || !password || !fromAddr) {
      return new Response(JSON.stringify({ error: "SMTP nuk është konfiguruar. Shtoni SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM." }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const body = (await req.json()) as Payload;
    if (!body?.mode || !body.subject || !body.message) {
      return new Response(JSON.stringify({ error: "Fusha të mangëta." }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    let toAddr = "";
    let subject = body.subject.slice(0, 200);
    let htmlBody = "";
    let replyTo: string | undefined = body.replyTo;

    if (body.mode === "contact") {
      // Public: notify the site owner. Recipient is always SMTP_FROM (the admin inbox).
      toAddr = fromAddr;
      subject = `[Kontakt] ${subject}`;
      const rows = [
        ["Emri", body.from_name ?? "-"],
        ["Email", body.from_email ?? "-"],
        ["Telefoni", body.phone ?? "-"],
        ["Subjekti", body.subject],
      ];
      htmlBody = `<table style="width:100%;border-collapse:collapse;margin-bottom:16px">${rows
        .map(([k, v]) => `<tr><td style="padding:6px 0;color:#64748b;width:110px;font-size:13px">${esc(k)}</td><td style="padding:6px 0;font-weight:600">${esc(String(v))}</td></tr>`)
        .join("")}</table><div style="white-space:pre-wrap;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e5e7eb">${esc(body.message)}</div>`;
      if (body.from_email && !replyTo) replyTo = body.from_email;
    } else if (body.mode === "reply") {
      // Admin-only: verify bearer token belongs to a user with role 'admin'.
      const authHeader = req.headers.get("Authorization") ?? "";
      const token = authHeader.replace(/^Bearer\s+/i, "");
      if (!token) {
        return new Response(JSON.stringify({ error: "Nuk jeni i autentikuar." }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });
      }
      const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
      const { data: userData, error: userErr } = await supa.auth.getUser(token);
      if (userErr || !userData.user) {
        return new Response(JSON.stringify({ error: "Token jo i vlefshëm." }), { status: 401, headers: { ...cors, "Content-Type": "application/json" } });
      }
      const { data: roleRow } = await supa.from("user_roles").select("role").eq("user_id", userData.user.id).eq("role", "admin").maybeSingle();
      if (!roleRow) {
        return new Response(JSON.stringify({ error: "Nuk keni të drejta administratori." }), { status: 403, headers: { ...cors, "Content-Type": "application/json" } });
      }
      if (!body.to) {
        return new Response(JSON.stringify({ error: "Marrësi mungon." }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
      }
      toAddr = body.to;
      htmlBody = `<div style="white-space:pre-wrap">${esc(body.message)}</div>`;
    } else {
      return new Response(JSON.stringify({ error: "Mode i pavlefshëm." }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    const client = new SMTPClient({
      connection: {
        hostname: host,
        port: Number(portStr) || 465,
        tls: secure,
        auth: { username: user, password },
      },
    });

    await client.send({
      from: fromAddr,
      to: toAddr,
      subject,
      content: body.message,
      html: htmlWrap(subject, htmlBody),
      replyTo,
    });
    await client.close();

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("send-smtp error", e);
    return new Response(JSON.stringify({ error: "Dërgimi i email-it dështoi. Provoni përsëri." }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
