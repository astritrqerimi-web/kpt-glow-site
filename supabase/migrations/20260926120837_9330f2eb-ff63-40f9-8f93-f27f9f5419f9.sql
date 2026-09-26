ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS lang text NOT NULL DEFAULT 'sq' CHECK (lang IN ('sq','en'));

CREATE TABLE public.appointment_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.contact_messages(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('received','confirmed','cancelled','rescheduled')),
  idempotency_key text NOT NULL UNIQUE,
  recipient text NOT NULL,
  status text NOT NULL DEFAULT 'sending' CHECK (status IN ('sending','sent','failed')),
  provider_message_id text,
  error text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX appointment_notifications_msg_idx ON public.appointment_notifications(message_id);
GRANT SELECT ON public.appointment_notifications TO authenticated;
GRANT ALL ON public.appointment_notifications TO service_role;
ALTER TABLE public.appointment_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read notifications" ON public.appointment_notifications FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));