ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS appointment_date date,
  ADD COLUMN IF NOT EXISTS appointment_time text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new';
ALTER TABLE public.contact_messages
  ADD CONSTRAINT contact_messages_status_chk CHECK (status IN ('new','confirmed','cancelled')),
  ADD CONSTRAINT contact_messages_appt_time_chk CHECK (appointment_time IS NULL OR appointment_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$');