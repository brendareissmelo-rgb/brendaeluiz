ALTER TABLE public.expenses ADD COLUMN owner text NOT NULL DEFAULT 'Ambos';
ALTER TABLE public.expenses ADD CONSTRAINT expenses_owner_check CHECK (owner IN ('Luiz','Brenda','Ambos'));