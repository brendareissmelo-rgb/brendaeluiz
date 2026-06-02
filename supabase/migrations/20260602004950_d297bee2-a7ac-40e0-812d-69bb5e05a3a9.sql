ALTER TABLE public.expenses DROP CONSTRAINT IF EXISTS expenses_owner_check;
ALTER TABLE public.expenses ADD CONSTRAINT expenses_owner_check CHECK (owner IN ('Luiz','Brenda','Ambos','Presente'));