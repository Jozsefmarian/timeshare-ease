
ALTER TABLE public.cases
  ADD COLUMN IF NOT EXISTS classification text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS internal_note text DEFAULT NULL;
