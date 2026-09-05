ALTER TABLE public.expenses ADD COLUMN reserved_brenda numeric not null default 0, ADD COLUMN reserved_luiz numeric not null default 0;

UPDATE public.expenses SET reserved_brenda = CASE WHEN owner = 'Brenda' THEN reserved WHEN owner = 'Ambos' THEN reserved / 2 ELSE 0 END, reserved_luiz = CASE WHEN owner = 'Luiz' THEN reserved WHEN owner = 'Ambos' THEN reserved / 2 ELSE 0 END;

ALTER TABLE public.expenses DROP COLUMN reserved;