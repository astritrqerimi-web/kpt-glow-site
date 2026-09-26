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
  appointment_date?: string; // contact mode, YYYY-MM-DD
  appointment_time?: string; // contact mode, HH:MM
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

const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

/** Accepts "Name <mail@x.com>", "mail@x.com", " mail@x.com " → "mail@x.com" or null */
function extractEmail(raw?: string | null): string | null {
  if (!raw) return null;
  const v = raw.trim();
  const angled = v.match(/<([^>]+)>/);
  const candidate = (angled ? angled[1] : v).trim();
  return EMAIL_RE.test(candidate) ? candidate : null;
}

/** Normalizes an SMTP host: strips scheme, port and path. Rejects email addresses. */
function normalizeHost(raw?: string | null): string | null {
  if (!raw) return null;
  let v = raw.trim().replace(/^[a-z]+:\/\//i, "");
  if (v.includes("@")) return null; // an email address is NOT a mail server hostname
  v = v.split("/")[0].split(":")[0].trim();
  if (!v || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(v)) return null;
  return v;
}


// ---------------- Customer appointment notifications ----------------
type NotifyType = "received" | "confirmed" | "cancelled" | "rescheduled";
interface NotifyPayload {
  mode: "notify";
  message_id: string;
  type: NotifyType;
  old_date?: string;
  old_time?: string;
}
interface SmtpCfg { hostname: string; port: number; tls: boolean; username: string; password: string; from: string }

const OFFICE_ADDRESS = "Rr. e Llapit, L/1, Kati Përdhesë, Objekti A, Nr. 1 – Fushë Kosovë";
const SIGN_SQ = "Me respekt,\nKPT Consulting\ninfo@kptconsulting.al\n+383 (0) 45 555 686";
const SIGN_EN = "Kind regards,\nKPT Consulting\ninfo@kptconsulting.al\n+383 (0) 45 555 686";
const dmy = (iso?: string | null) => (iso && /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.split("-").reverse().join(".") : "-");

function buildCustomerEmail(type: NotifyType, lang: "sq" | "en", a: Record<string, any>, oldDate?: string, oldTime?: string) {
  const name = a.name ?? "";
  const d = dmy(a.appointment_date), t = a.appointment_time ?? "-", svc = a.subject ?? "-";
  const en = lang === "en";
  let subject = "", text = "";
  if (type === "received") {
    subject = en ? "Your appointment request was received – KPT Consulting" : "Kërkesa juaj për termin u pranua – KPT Consulting";
    text = en
      ? `Hello ${name},\n\nWe have received your appointment request at KPT Consulting.\n\nRequested date: ${d}\nRequested time: ${t}\nService: ${svc}\n\nThis is only an acknowledgement that your request was received. The appointment is considered confirmed only after you receive another email from KPT Consulting confirming it.\n\nWe will contact you as soon as possible.\n\n${SIGN_EN}`
      : `Përshëndetje ${name},\n\nKemi pranuar kërkesën tuaj për termin në KPT Consulting.\n\nData e kërkuar: ${d}\nOra e kërkuar: ${t}\nShërbimi: ${svc}\n\nKy është vetëm konfirmim i pranimit të kërkesës. Termini konsiderohet i konfirmuar vetëm pasi të merrni një email tjetër nga KPT Consulting që konfirmon terminin.\n\nDo t'ju kontaktojmë sa më shpejt që të jetë e mundur.\n\n${SIGN_SQ}`;
  } else if (type === "confirmed") {
    subject = en ? "Your appointment at KPT Consulting is confirmed" : "Termini juaj në KPT Consulting është konfirmuar";
    text = en
      ? `Hello ${name},\n\nWe confirm that your appointment at KPT Consulting has been confirmed.\n\nAppointment details:\nDate: ${d}\nTime: ${t}\nService: ${svc}\n\nAddress:\n${OFFICE_ADDRESS}\n\nIf you have any questions or cannot attend at the scheduled time, please contact us in advance.\n\n${SIGN_EN}`
      : `Përshëndetje ${name},\n\nJu konfirmojmë se termini juaj në KPT Consulting është konfirmuar.\n\nDetajet e terminit:\nData: ${d}\nOra: ${t}\nShërbimi: ${svc}\n\nAdresa:\n${OFFICE_ADDRESS}\n\nNëse keni ndonjë pyetje ose nuk mund të paraqiteni në terminin e caktuar, ju lutemi na kontaktoni paraprakisht.\n\n${SIGN_SQ}`;
  } else if (type === "cancelled") {
    subject = en ? "Notice about your appointment – KPT Consulting" : "Njoftim për terminin tuaj – KPT Consulting";
    text = en
      ? `Hello ${name},\n\nWe inform you that the appointment scheduled for:\n\nDate: ${d}\nTime: ${t}\n\nhas been cancelled.\n\nTo schedule another appointment, you can contact us or use the appointment form on our website.\n\n${SIGN_EN}`
      : `Përshëndetje ${name},\n\nJu njoftojmë se termini i planifikuar për:\n\nData: ${d}\nOra: ${t}\n\nështë anuluar.\n\nPër të caktuar një termin tjetër, mund të na kontaktoni ose të përdorni formularin për caktimin e terminit në webfaqen tonë.\n\n${SIGN_SQ}`;
  } else {
    subject = en ? "Appointment change – KPT Consulting" : "Ndryshim i terminit – KPT Consulting";
    const od = dmy(oldDate), ot = oldTime ?? "-";
    text = en
      ? `Hello ${name},\n\nYour appointment at KPT Consulting has been changed.\n\nPrevious appointment:\nDate: ${od}\nTime: ${ot}\n\nNew appointment:\nDate: ${d}\nTime: ${t}\n\nService: ${svc}\n\nIf this time does not suit you, please contact us.\n\n${SIGN_EN}`
      : `Përshëndetje ${name},\n\nTermini juaj në KPT Consulting është ndryshuar.\n\nTermini i mëparshëm:\nData: ${od}\nOra: ${ot}\n\nTermini i ri:\nData: ${d}\nOra: ${t}\n\nShërbimi: ${svc}\n\nNëse ky orar nuk ju përshtatet, ju lutemi na kontaktoni.\n\n${SIGN_SQ}`;
  }
  // Escape user content; bold "Label: value" lines for readability.
  const html = text.split("\n").map((line) => {
    const e = esc(line);
    const m = e.match(/^([^:]{2,30}):\s(.+)$/);
    return m ? `<div><span style="color:#64748b">${m[1]}:</span> <strong>${m[2]}</strong></div>` : e ? `<div>${e}</div>` : `<div style="height:10px"></div>`;
  }).join("");
  return { subject, text, html: htmlWrap(subject, html) };
}

async function handleNotify(body: NotifyPayload, req: Request, smtp: SmtpCfg): Promise<Response> {
  const TYPES: NotifyType[] = ["received", "confirmed", "cancelled", "rescheduled"];
  if (!body.message_id || !/^[0-9a-f-]{36}$/i.test(body.message_id) || !TYPES.includes(body.type)) {
    return json({ error: "Kërkesë e pavlefshme." }, 400);
  }
  const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

  const { data: a } = await supa.from("contact_messages").select("*").eq("id", body.message_id).maybeSingle();
  if (!a || !a.appointment_date) return json({ error: "Termini nuk u gjet." }, 404);

  if (body.type === "received") {
    // Public trigger: only allowed shortly after submission (the key below makes it one-shot).
    if (Date.now() - new Date(a.created_at).getTime() > 15 * 60 * 1000) return json({ error: "Skaduar." }, 403);
  } else {
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Nuk jeni i autentikuar." }, 401);
    const { data: u, error: ue } = await supa.auth.getUser(token);
    if (ue || !u.user) return json({ error: "Token jo i vlefshëm." }, 401);
    const { data: role } = await supa.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
    if (!role) return json({ error: "Nuk keni të drejta administratori." }, 403);
    if (body.type === "confirmed" && a.status !== "confirmed") return json({ error: "Termini nuk është i konfirmuar." }, 409);
    if (body.type === "cancelled" && a.status !== "cancelled") return json({ error: "Termini nuk është i anuluar." }, 409);
  }

  // Recipient always comes from the database record, never from the request.
  const recipient = extractEmail(a.email);
  if (!recipient) return json({ error: "Email-i i klientit nuk është i vlefshëm." }, 400);

  let oldDate: string | undefined, oldTime: string | undefined;
  if (body.type === "rescheduled") {
    oldDate = /^\d{4}-\d{2}-\d{2}$/.test(body.old_date ?? "") ? body.old_date : undefined;
    oldTime = /^\d{2}:\d{2}$/.test(body.old_time ?? "") ? body.old_time : undefined;
  }
  const key = `${body.type}:${a.id}:${a.appointment_date}:${a.appointment_time}`;

  // Claim the send atomically: new row, or retry a previously failed one.
  let claimed = false;
  const ins = await supa.from("appointment_notifications").insert({ message_id: a.id, type: body.type, idempotency_key: key, recipient, status: "sending" });
  if (!ins.error) claimed = true;
  else if (ins.error.code === "23505") {
    const { data: upd } = await supa.from("appointment_notifications")
      .update({ status: "sending", error: null, recipient, updated_at: new Date().toISOString() })
      .eq("idempotency_key", key).eq("status", "failed").select("id");
    claimed = !!upd?.length;
    if (!claimed) return json({ ok: true, skipped: "already_sent" });
  } else {
    console.error("notify claim error", ins.error);
    return json({ error: "Gabim në server." }, 500);
  }

  const lang = a.lang === "en" ? "en" : "sq";
  const mail = buildCustomerEmail(body.type, lang, a, oldDate, oldTime);
  const client = new SMTPClient({ connection: { hostname: smtp.hostname, port: smtp.port, tls: smtp.tls, auth: { username: smtp.username, password: smtp.password } } });
  try {
    await client.send({ from: `KPT Consulting <${smtp.from}>`, to: recipient, subject: mail.subject, content: mail.text, html: mail.html, replyTo: "info@kptconsulting.al" });
    await supa.from("appointment_notifications").update({ status: "sent", sent_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("idempotency_key", key);
    return json({ ok: true });
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    console.error("notify send error", detail);
    await supa.from("appointment_notifications").update({ status: "failed", error: detail.slice(0, 300), updated_at: new Date().toISOString() }).eq("idempotency_key", key);
    return json({ error: "Dërgimi i email-it dështoi." }, 502);
  } finally {
    try { await client.close(); } catch { /* ignore */ }
  }
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  let client: SMTPClient | null = null;
  try {
    const rawHost = Deno.env.get("SMTP_HOST");
    const portStr = Deno.env.get("SMTP_PORT") ?? "465";
    const user = Deno.env.get("SMTP_USER");
    const password = Deno.env.get("SMTP_PASSWORD");
    const secure = (Deno.env.get("SMTP_SECURE") ?? "true").toLowerCase() !== "false";

    const host = normalizeHost(rawHost);
    const fromAddr = extractEmail(Deno.env.get("SMTP_FROM")) ?? extractEmail(user);

    const configProblems: string[] = [];
    if (!rawHost) configProblems.push("SMTP_HOST mungon.");
    else if (!host) configProblems.push(`SMTP_HOST nuk është hostname i vlefshëm (p.sh. mail.kptconsulting.al) — vlera aktuale nuk pranohet.`);
    if (!user) configProblems.push("SMTP_USER mungon.");
    if (!password) configProblems.push("SMTP_PASSWORD mungon.");
    if (!fromAddr) configProblems.push("SMTP_FROM duhet të jetë një adresë email e vlefshme (p.sh. info@kptconsulting.al).");
    if (!Number(portStr)) configProblems.push("SMTP_PORT duhet të jetë numër (465 ose 587).");

    if (configProblems.length) {
      console.error("send-smtp config error", configProblems);
      return json({ error: `Konfigurimi SMTP është i pasaktë: ${configProblems.join(" ")}` }, 500);
    }

    let body: Payload;
    try {
      body = (await req.json()) as Payload;
    } catch {
      return json({ error: "Kërkesa nuk është JSON i vlefshëm." }, 400);
    }
    if ((body as unknown as NotifyPayload)?.mode === "notify") {
      return await handleNotify(body as unknown as NotifyPayload, req, {
        hostname: host!, port: Number(portStr) || 465, tls: secure, username: user!, password: password!, from: fromAddr!,
      });
    }
    if (!body?.mode || !body.subject || !body.message) {
      return json({ error: "Fusha të mangëta (mode, subject, message)." }, 400);
    }

    let toAddr = "";
    let subject = body.subject.slice(0, 200);
    let htmlBody = "";
    let replyTo: string | undefined = extractEmail(body.replyTo) ?? undefined;

    if (body.mode === "contact") {
      // Public: notify the site owner at the fixed admin inbox.
      toAddr = "info@kptconsulting.al";
      const apptDate = /^\d{4}-\d{2}-\d{2}$/.test(body.appointment_date ?? "")
        ? body.appointment_date!.split("-").reverse().join(".")
        : "";
      const apptTime = /^\d{2}:\d{2}$/.test(body.appointment_time ?? "") ? body.appointment_time! : "";
      const isAppt = !!(apptDate && apptTime);
      const rows = isAppt
        ? [
            ["Emri", body.from_name ?? "-"],
            ["Email", body.from_email ?? "-"],
            ["Telefoni", body.phone ?? "-"],
            ["Shërbimi", body.subject],
            ["Data e terminit", apptDate],
            ["Ora", apptTime],
          ]
        : [
            ["Emri", body.from_name ?? "-"],
            ["Email", body.from_email ?? "-"],
            ["Telefoni", body.phone ?? "-"],
            ["Subjekti", body.subject],
          ];
      const originalMessage = body.message;
      if (isAppt) {
        subject = `Termin i ri – ${(body.from_name ?? "").slice(0, 100)} – ${apptDate} ${apptTime}`;
        body.message = `Keni pranuar një kërkesë të re për termin në KPT Consulting.\n\n${rows
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n")}\nMesazhi: ${originalMessage}`;
      } else {
        subject = `[Kontakt] ${subject}`;
      }
      htmlBody = (isAppt ? `<p>Keni pranuar një kërkesë të re për termin në KPT Consulting.</p>` : "") +
        `<table style="width:100%;border-collapse:collapse;margin-bottom:16px">${rows
        .map(([k, v]) => `<tr><td style="padding:6px 0;color:#64748b;width:130px;font-size:13px">${esc(k)}</td><td style="padding:6px 0;font-weight:600">${esc(String(v))}</td></tr>`)
        .join("")}</table><div style="font-size:13px;color:#64748b;margin-bottom:6px">Mesazhi:</div><div style="white-space:pre-wrap;padding:16px;background:#f8fafc;border-radius:8px;border:1px solid #e5e7eb">${esc(originalMessage)}</div>`;
      const sender = extractEmail(body.from_email);
      if (sender && !replyTo) replyTo = sender;
    } else if (body.mode === "reply") {
      // Admin-only: verify bearer token belongs to a user with role 'admin'.
      const authHeader = req.headers.get("Authorization") ?? "";
      const token = authHeader.replace(/^Bearer\s+/i, "");
      if (!token) return json({ error: "Nuk jeni i autentikuar." }, 401);

      const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
      const { data: userData, error: userErr } = await supa.auth.getUser(token);
      if (userErr || !userData.user) return json({ error: "Token jo i vlefshëm." }, 401);

      const { data: roleRow } = await supa.from("user_roles").select("role").eq("user_id", userData.user.id).eq("role", "admin").maybeSingle();
      if (!roleRow) return json({ error: "Nuk keni të drejta administratori." }, 403);

      const recipient = extractEmail(body.to);
      if (!recipient) return json({ error: `Marrësi nuk është email i vlefshëm: ${body.to ?? "(bosh)"}` }, 400);
      toAddr = recipient;
      htmlBody = `<div style="white-space:pre-wrap">${esc(body.message)}</div>`;
    } else {
      return json({ error: "Mode i pavlefshëm." }, 400);
    }

    client = new SMTPClient({
      connection: {
        hostname: host!,
        port: Number(portStr) || 465,
        tls: secure,
        auth: { username: user!, password: password! },
      },
    });

    await client.send({
      from: fromAddr!,
      to: toAddr,
      subject,
      content: body.message,
      html: htmlWrap(subject, htmlBody),
      replyTo,
    });

    return json({ ok: true }, 200);
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    console.error("send-smtp error", detail, e);
    return json({ error: `Dërgimi i email-it dështoi: ${detail}` }, 500);
  } finally {
    try { await client?.close(); } catch { /* ignore */ }
  }
});

