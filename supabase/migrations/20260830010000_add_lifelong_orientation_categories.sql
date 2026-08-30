begin;

-- Red Senda specializes in lifelong guidance: orientation is not limited to a
-- single early-career moment. These additive rows cover the two strategic
-- categories the existing catalog does not yet represent (adult orientation
-- and retirement) plus a distinct "reorientation" need, alongside the
-- already-covered "transiciones laborales" (job_change), "carrera"
-- (career_growth) and "reconversión profesional" (professional_reinvention).
insert into public.needs (id, code, slug, name, short_description, sort_order)
values
  ('22000000-0000-4000-8000-000000000011', 'adult_guidance', 'orientacion-de-adultos', 'Orientación de adultos', 'Acompañamiento a personas adultas en decisiones de estudio, trabajo o carrera.', 105),
  ('22000000-0000-4000-8000-000000000012', 'reorientation', 'reorientacion', 'Reorientación', 'Redefinir un rumbo educativo o profesional en curso.', 35),
  ('22000000-0000-4000-8000-000000000013', 'retirement', 'retiro', 'Retiro', 'Pensar la etapa de retiro laboral y lo que sigue.', 115)
on conflict (id) do update set
  code = excluded.code, slug = excluded.slug, name = excluded.name,
  short_description = excluded.short_description, sort_order = excluded.sort_order,
  is_active = true;

commit;
