ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS internal_notes text;

CREATE TABLE public.appointment_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  working_days int[] NOT NULL DEFAULT '{1,2,3,4,5}', -- ISO: 1=Mon..7=Sun
  open_time text NOT NULL DEFAULT '08:00',
  close_time text NOT NULL DEFAULT '16:00',
  slot_minutes int NOT NULL DEFAULT 30 CHECK (slot_minutes BETWEEN 10 AND 240),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.appointment_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.appointment_settings TO authenticated;
GRANT ALL ON public.appointment_settings TO service_role;
ALTER TABLE public.appointment_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads appointment settings" ON public.appointment_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage appointment settings" ON public.appointment_settings FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
INSERT INTO public.appointment_settings (id) VALUES (1);

CREATE TABLE public.appointment_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_date date NOT NULL,
  block_time text CHECK (block_time IS NULL OR block_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.appointment_blocks TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.appointment_blocks TO authenticated;
GRANT ALL ON public.appointment_blocks TO service_role;
ALTER TABLE public.appointment_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads appointment blocks" ON public.appointment_blocks FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage appointment blocks" ON public.appointment_blocks FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- Double-booking protection (race-safe)
CREATE UNIQUE INDEX contact_messages_active_slot_uniq
  ON public.contact_messages (appointment_date, appointment_time)
  WHERE appointment_date IS NOT NULL AND status IN ('new','confirmed');

-- Booked slots for a date, without exposing any client data
CREATE OR REPLACE FUNCTION public.get_booked_slots(_date date)
RETURNS SETOF text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT appointment_time FROM public.contact_messages
  WHERE appointment_date = _date AND status IN ('new','confirmed') AND appointment_time IS NOT NULL;
$$;
GRANT EXECUTE ON FUNCTION public.get_booked_slots(date) TO anon, authenticated;

-- Server-side slot validation
CREATE OR REPLACE FUNCTION public.validate_appointment_slot()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  s public.appointment_settings;
  local_now timestamp := (now() AT TIME ZONE 'Europe/Belgrade');
  t_min int; o_min int; c_min int;
  is_admin boolean := private.has_role(auth.uid(), 'admin');
BEGIN
  IF NEW.appointment_date IS NULL OR NEW.status = 'cancelled' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND NEW.appointment_date IS NOT DISTINCT FROM OLD.appointment_date
     AND NEW.appointment_time IS NOT DISTINCT FROM OLD.appointment_time
     AND OLD.status <> 'cancelled' THEN RETURN NEW; END IF;
  IF NEW.appointment_time IS NULL THEN RAISE EXCEPTION 'slot_unavailable'; END IF;
  IF (NEW.appointment_date + NEW.appointment_time::time) <= local_now THEN RAISE EXCEPTION 'slot_unavailable'; END IF;
  IF EXISTS (SELECT 1 FROM public.appointment_blocks b WHERE b.block_date = NEW.appointment_date
             AND (b.block_time IS NULL OR b.block_time = NEW.appointment_time)) THEN
    RAISE EXCEPTION 'slot_unavailable';
  END IF;
  IF NOT is_admin THEN
    SELECT * INTO s FROM public.appointment_settings WHERE id = 1;
    IF NOT (EXTRACT(ISODOW FROM NEW.appointment_date)::int = ANY (s.working_days)) THEN RAISE EXCEPTION 'slot_unavailable'; END IF;
    t_min := EXTRACT(EPOCH FROM NEW.appointment_time::time)::int / 60;
    o_min := EXTRACT(EPOCH FROM s.open_time::time)::int / 60;
    c_min := EXTRACT(EPOCH FROM s.close_time::time)::int / 60;
    IF t_min < o_min OR t_min + s.slot_minutes > c_min OR (t_min - o_min) % s.slot_minutes <> 0 THEN
      RAISE EXCEPTION 'slot_unavailable';
    END IF;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER contact_messages_validate_slot
  BEFORE INSERT OR UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.validate_appointment_slot();