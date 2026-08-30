begin;

-- ---------------------------------------------------------------------------
-- Core configuration (safe for every environment)
-- ---------------------------------------------------------------------------

insert into public.professional_types
  (id, code, slug, name, description, is_regulated, sort_order, is_active)
values
  ('20000000-0000-4000-8000-000000000001', 'psychology_orientation', 'psicologia-orientacion', 'Psicólogo/a', 'Acompañamiento psicológico aplicado a decisiones educativas y laborales.', true, 10, true),
  ('20000000-0000-4000-8000-000000000002', 'psychopedagogy', 'psicopedagogia', 'Psicopedagogo/a', 'Procesos de aprendizaje, elección y planificación educativa.', true, 20, true),
  ('20000000-0000-4000-8000-000000000003', 'career_coaching', 'coaching-de-carrera', 'Coaching de carrera', 'Acompañamiento orientado a objetivos y desarrollo de carrera.', false, 30, false),
  ('20000000-0000-4000-8000-000000000004', 'career_consulting', 'consultoria-de-carrera', 'Consultoría de carrera', 'Estrategia profesional y planificación de transiciones.', false, 40, false),
  ('20000000-0000-4000-8000-000000000005', 'recruiting', 'recruiting', 'Recruiting y Talent Acquisition', 'Perspectiva de selección, empleabilidad y mercado laboral.', false, 50, false),
  ('20000000-0000-4000-8000-000000000006', 'interview_specialist', 'preparacion-de-entrevistas', 'Especialista en entrevistas', 'Preparación práctica para procesos de selección.', false, 60, false),
  ('20000000-0000-4000-8000-000000000007', 'personal_branding', 'marca-profesional', 'Marca profesional', 'CV, LinkedIn, portfolio y posicionamiento profesional.', false, 70, false),
  ('20000000-0000-4000-8000-000000000008', 'technology_mentoring', 'mentoria-tecnologica', 'Mentoría tecnológica', 'Transición y crecimiento en roles de tecnología.', false, 80, false),
  ('20000000-0000-4000-8000-000000000009', 'executive_mentoring', 'mentoria-ejecutiva', 'Mentoría ejecutiva', 'Liderazgo, gestión y desarrollo ejecutivo.', false, 90, false),
  ('20000000-0000-4000-8000-000000000010', 'educational_guidance', 'orientacion-educativa', 'Orientación educativa', 'Exploración y planificación de trayectorias formativas.', false, 100, false),
  ('20000000-0000-4000-8000-000000000011', 'professional_reinvention', 'reinvencion-profesional', 'Reinvención profesional', 'Rediseño de trayectoria y cambio de profesión.', false, 110, false),
  ('20000000-0000-4000-8000-000000000012', 'leadership_mentoring', 'mentoria-de-liderazgo', 'Mentoría de liderazgo', 'Desarrollo de liderazgo y gestión de equipos.', false, 120, false)
on conflict (id) do update set
  code = excluded.code, slug = excluded.slug, name = excluded.name,
  description = excluded.description, is_regulated = excluded.is_regulated,
  sort_order = excluded.sort_order, is_active = excluded.is_active;

insert into public.credential_types (id, code, name, description, sort_order)
values
  ('21000000-0000-4000-8000-000000000001', 'professional_license', 'Matrícula profesional', 'Matrícula y jurisdicción de ejercicio.', 10),
  ('21000000-0000-4000-8000-000000000002', 'university_degree', 'Título universitario', 'Título emitido por una institución educativa.', 20),
  ('21000000-0000-4000-8000-000000000003', 'coaching_certificate', 'Certificación de coaching', 'Certificación y entidad emisora.', 30),
  ('21000000-0000-4000-8000-000000000004', 'professional_experience', 'Experiencia profesional', 'Antecedentes verificables de experiencia.', 40),
  ('21000000-0000-4000-8000-000000000005', 'specialization_certificate', 'Certificación de especialización', 'Formación específica relevante para el servicio.', 50)
on conflict (id) do update set name = excluded.name, description = excluded.description, is_active = true;

insert into public.verification_rules
  (professional_type_id, credential_type_id, requirement_level, jurisdiction_required, instructions)
values
  ('20000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000001', 'REQUIRED', true, 'Presentar matrícula vigente y jurisdicción.'),
  ('20000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000002', 'REQUIRED', false, 'Presentar título universitario.'),
  ('20000000-0000-4000-8000-000000000002', '21000000-0000-4000-8000-000000000002', 'REQUIRED', false, 'Presentar título habilitante.'),
  ('20000000-0000-4000-8000-000000000003', '21000000-0000-4000-8000-000000000003', 'OPTIONAL', false, 'La certificación se informa con su entidad emisora.'),
  ('20000000-0000-4000-8000-000000000005', '21000000-0000-4000-8000-000000000004', 'OPTIONAL', false, 'Acreditar experiencia relevante cuando corresponda.'),
  ('20000000-0000-4000-8000-000000000008', '21000000-0000-4000-8000-000000000004', 'OPTIONAL', false, 'Acreditar experiencia en el área de mentoría.')
on conflict (professional_type_id, credential_type_id) do update set
  requirement_level = excluded.requirement_level,
  jurisdiction_required = excluded.jurisdiction_required,
  instructions = excluded.instructions,
  is_active = true;

insert into public.needs (id, code, slug, name, short_description, sort_order)
values
  ('22000000-0000-4000-8000-000000000001', 'choose_studies', 'no-se-que-estudiar', 'No sé qué estudiar', 'Explorar intereses y opciones formativas.', 10),
  ('22000000-0000-4000-8000-000000000002', 'study_doubts', 'dudas-con-mi-carrera', 'Tengo dudas con mi carrera', 'Revisar una elección educativa en curso.', 20),
  ('22000000-0000-4000-8000-000000000003', 'professional_reinvention', 'reinvencion-profesional', 'Mi profesión ya no me representa', 'Explorar una nueva dirección profesional.', 30),
  ('22000000-0000-4000-8000-000000000004', 'job_change', 'cambiar-de-trabajo', 'Quiero cambiar de trabajo', 'Planificar una transición laboral.', 40),
  ('22000000-0000-4000-8000-000000000005', 'job_loss', 'reinsercion-laboral', 'Perdí mi trabajo', 'Recuperar foco y estrategia de búsqueda.', 50),
  ('22000000-0000-4000-8000-000000000006', 'move_to_technology', 'pasar-a-tecnologia', 'Quiero pasar a tecnología', 'Trazar un camino realista hacia roles digitales.', 60),
  ('22000000-0000-4000-8000-000000000007', 'professional_positioning', 'mejorar-mi-posicionamiento', 'Quiero mejorar mi posicionamiento', 'Fortalecer CV, LinkedIn y propuesta de valor.', 70),
  ('22000000-0000-4000-8000-000000000008', 'job_interviews', 'preparar-entrevistas', 'Tengo entrevistas', 'Practicar entrevistas y comunicar experiencia.', 80),
  ('22000000-0000-4000-8000-000000000009', 'career_growth', 'crecer-profesionalmente', 'Quiero crecer profesionalmente', 'Definir próximos pasos y capacidades.', 90),
  ('22000000-0000-4000-8000-000000000010', 'change_industry', 'cambiar-de-industria', 'Quiero cambiar de industria', 'Traducir experiencia hacia otro sector.', 100),
  ('22000000-0000-4000-8000-000000000011', 'adult_guidance', 'orientacion-de-adultos', 'Orientación de adultos', 'Acompañamiento a personas adultas en decisiones de estudio, trabajo o carrera.', 105),
  ('22000000-0000-4000-8000-000000000012', 'reorientation', 'reorientacion', 'Reorientación', 'Redefinir un rumbo educativo o profesional en curso.', 35),
  ('22000000-0000-4000-8000-000000000013', 'retirement', 'retiro', 'Retiro', 'Pensar la etapa de retiro laboral y lo que sigue.', 115)
on conflict (id) do update set name = excluded.name, short_description = excluded.short_description, is_active = true;

insert into public.services (id, code, slug, name, description, sort_order)
values
  ('23000000-0000-4000-8000-000000000001', 'vocational_guidance', 'orientacion-vocacional', 'Orientación vocacional', 'Proceso de exploración para decisiones educativas.', 10),
  ('23000000-0000-4000-8000-000000000002', 'career_strategy', 'estrategia-de-carrera', 'Estrategia de carrera', 'Definición de objetivos y plan de acción.', 20),
  ('23000000-0000-4000-8000-000000000003', 'job_search', 'busqueda-laboral', 'Búsqueda laboral', 'Estrategia y herramientas para encontrar oportunidades.', 30),
  ('23000000-0000-4000-8000-000000000004', 'cv_review', 'revision-de-cv', 'Revisión de CV', 'Revisión y mejora de CV orientado a objetivos.', 40),
  ('23000000-0000-4000-8000-000000000005', 'linkedin_strategy', 'estrategia-linkedin', 'Estrategia de LinkedIn', 'Optimización de perfil y posicionamiento.', 50),
  ('23000000-0000-4000-8000-000000000006', 'interview_practice', 'practica-de-entrevistas', 'Práctica de entrevistas', 'Simulación y devolución estructurada.', 60),
  ('23000000-0000-4000-8000-000000000007', 'technology_transition', 'transicion-a-tecnologia', 'Transición a tecnología', 'Mapa de roles, brechas y próximos pasos.', 70),
  ('23000000-0000-4000-8000-000000000008', 'leadership_development', 'desarrollo-de-liderazgo', 'Desarrollo de liderazgo', 'Acompañamiento para desafíos de liderazgo.', 80),
  ('23000000-0000-4000-8000-000000000009', 'industry_mentoring', 'mentoria-de-industria', 'Mentoría de industria', 'Perspectiva práctica sobre un sector profesional.', 90),
  ('23000000-0000-4000-8000-000000000010', 'professional_reinvention', 'proceso-de-reinvencion', 'Proceso de reinvención', 'Exploración y diseño de una nueva trayectoria.', 100)
on conflict (id) do update set name = excluded.name, description = excluded.description, is_active = true;

insert into public.specialties (id, code, slug, name, sort_order)
values
  ('24000000-0000-4000-8000-000000000001', 'vocational_exploration', 'exploracion-vocacional', 'Exploración vocacional', 10),
  ('24000000-0000-4000-8000-000000000002', 'career_change', 'cambio-de-carrera', 'Cambio de carrera', 20),
  ('24000000-0000-4000-8000-000000000003', 'employability', 'empleabilidad', 'Empleabilidad', 30),
  ('24000000-0000-4000-8000-000000000004', 'cv_linkedin', 'cv-y-linkedin', 'CV y LinkedIn', 40),
  ('24000000-0000-4000-8000-000000000005', 'interviews', 'entrevistas', 'Entrevistas', 50),
  ('24000000-0000-4000-8000-000000000006', 'technology_careers', 'carreras-tecnologicas', 'Carreras tecnológicas', 60),
  ('24000000-0000-4000-8000-000000000007', 'leadership', 'liderazgo', 'Liderazgo', 70),
  ('24000000-0000-4000-8000-000000000008', 'career_planning', 'planificacion-de-carrera', 'Planificación de carrera', 80),
  ('24000000-0000-4000-8000-000000000009', 'personal_brand', 'marca-personal', 'Marca personal', 90),
  ('24000000-0000-4000-8000-000000000010', 'industry_change', 'cambio-de-industria', 'Cambio de industria', 100)
on conflict (id) do update set name = excluded.name, is_active = true;

insert into public.audiences (id, code, name, sort_order)
values
  ('25000000-0000-4000-8000-000000000001', 'students', 'Estudiantes', 10),
  ('25000000-0000-4000-8000-000000000002', 'job_seekers', 'Personas en búsqueda laboral', 20),
  ('25000000-0000-4000-8000-000000000003', 'professionals', 'Profesionales', 30),
  ('25000000-0000-4000-8000-000000000004', 'leaders', 'Líderes y managers', 40),
  ('25000000-0000-4000-8000-000000000005', 'entrepreneurs', 'Personas emprendedoras', 50)
on conflict (id) do update set name = excluded.name, is_active = true;

insert into public.modalities (id, code, name, sort_order)
values
  ('26000000-0000-4000-8000-000000000001', 'ONLINE', 'Online', 10),
  ('26000000-0000-4000-8000-000000000002', 'IN_PERSON', 'Presencial', 20),
  ('26000000-0000-4000-8000-000000000003', 'HYBRID', 'Híbrida', 30)
on conflict (id) do update set name = excluded.name, is_active = true;

insert into public.locations
  (id, parent_id, kind, country_code, slug, name, full_name, timezone, sort_order)
values
  ('27000000-0000-4000-8000-000000000001', null, 'COUNTRY', 'AR', 'argentina', 'Argentina', 'Argentina', 'America/Argentina/Buenos_Aires', 10),
  ('27000000-0000-4000-8000-000000000010', '27000000-0000-4000-8000-000000000001', 'PROVINCE', 'AR', 'buenos-aires', 'Buenos Aires', 'Buenos Aires, Argentina', 'America/Argentina/Buenos_Aires', 20),
  ('27000000-0000-4000-8000-000000000011', '27000000-0000-4000-8000-000000000001', 'PROVINCE', 'AR', 'cordoba', 'Córdoba', 'Córdoba, Argentina', 'America/Argentina/Cordoba', 30),
  ('27000000-0000-4000-8000-000000000012', '27000000-0000-4000-8000-000000000001', 'PROVINCE', 'AR', 'santa-fe', 'Santa Fe', 'Santa Fe, Argentina', 'America/Argentina/Cordoba', 40),
  ('27000000-0000-4000-8000-000000000013', '27000000-0000-4000-8000-000000000001', 'PROVINCE', 'AR', 'mendoza', 'Mendoza', 'Mendoza, Argentina', 'America/Argentina/Mendoza', 50),
  ('27000000-0000-4000-8000-000000000014', '27000000-0000-4000-8000-000000000001', 'PROVINCE', 'AR', 'caba', 'Ciudad Autónoma de Buenos Aires', 'CABA, Argentina', 'America/Argentina/Buenos_Aires', 15),
  ('27000000-0000-4000-8000-000000000101', '27000000-0000-4000-8000-000000000014', 'CITY', 'AR', 'buenos-aires', 'Buenos Aires', 'Buenos Aires, CABA, Argentina', 'America/Argentina/Buenos_Aires', 10),
  ('27000000-0000-4000-8000-000000000102', '27000000-0000-4000-8000-000000000011', 'CITY', 'AR', 'cordoba-capital', 'Córdoba Capital', 'Córdoba Capital, Córdoba, Argentina', 'America/Argentina/Cordoba', 20),
  ('27000000-0000-4000-8000-000000000103', '27000000-0000-4000-8000-000000000012', 'CITY', 'AR', 'rosario', 'Rosario', 'Rosario, Santa Fe, Argentina', 'America/Argentina/Cordoba', 30),
  ('27000000-0000-4000-8000-000000000104', '27000000-0000-4000-8000-000000000013', 'CITY', 'AR', 'mendoza-capital', 'Mendoza Capital', 'Mendoza Capital, Mendoza, Argentina', 'America/Argentina/Mendoza', 40),
  ('27000000-0000-4000-8000-000000000105', '27000000-0000-4000-8000-000000000010', 'CITY', 'AR', 'mar-del-plata', 'Mar del Plata', 'Mar del Plata, Buenos Aires, Argentina', 'America/Argentina/Buenos_Aires', 50)
on conflict (id) do update set name = excluded.name, full_name = excluded.full_name, is_active = true;

insert into public.languages (id, code, name, sort_order)
values
  ('28000000-0000-4000-8000-000000000001', 'es', 'Español', 10),
  ('28000000-0000-4000-8000-000000000002', 'en', 'Inglés', 20),
  ('28000000-0000-4000-8000-000000000003', 'pt', 'Portugués', 30)
on conflict (id) do update set name = excluded.name, is_active = true;

insert into public.industries (id, code, slug, name, sort_order)
values
  ('29000000-0000-4000-8000-000000000001', 'technology', 'tecnologia', 'Tecnología', 10),
  ('29000000-0000-4000-8000-000000000002', 'education', 'educacion', 'Educación', 20),
  ('29000000-0000-4000-8000-000000000003', 'health', 'salud', 'Salud', 30),
  ('29000000-0000-4000-8000-000000000004', 'professional_services', 'servicios-profesionales', 'Servicios profesionales', 40),
  ('29000000-0000-4000-8000-000000000005', 'retail', 'retail', 'Retail y consumo', 50),
  ('29000000-0000-4000-8000-000000000006', 'finance', 'finanzas', 'Finanzas', 60)
on conflict (id) do update set name = excluded.name, is_active = true;

insert into public.career_stages (id, code, slug, name, sort_order)
values
  ('2a000000-0000-4000-8000-000000000001', 'exploration', 'exploracion', 'Exploración y primera elección', 10),
  ('2a000000-0000-4000-8000-000000000002', 'early_career', 'inicio-profesional', 'Inicio profesional', 20),
  ('2a000000-0000-4000-8000-000000000003', 'mid_career', 'carrera-media', 'Carrera media', 30),
  ('2a000000-0000-4000-8000-000000000004', 'senior', 'senior', 'Profesional senior', 40),
  ('2a000000-0000-4000-8000-000000000005', 'leadership', 'liderazgo', 'Liderazgo', 50),
  ('2a000000-0000-4000-8000-000000000006', 'reinvention', 'reinvencion', 'Reinvención', 60)
on conflict (id) do update set name = excluded.name, is_active = true;

-- Pricing intentionally remains DRAFT: the owner must approve commercial
-- amounts. This avoids presenting invented subscription prices as final.
insert into public.plans
  (id, code, name, description, price_amount, currency, billing_interval,
   pricing_status, monthly_lead_quota, ranking_boost_points, visibility_score, sort_order)
values
  ('2b000000-0000-4000-8000-000000000001', 'BASE', 'Base', 'Perfil, buscador y recepción de contactos.', null, 'ARS', 'MONTH', 'DRAFT', null, 0, 40, 10),
  ('2b000000-0000-4000-8000-000000000002', 'IMPULSO', 'Impulso', 'Estadísticas, contenidos y prioridad moderada.', null, 'ARS', 'MONTH', 'DRAFT', null, 1, 70, 20),
  ('2b000000-0000-4000-8000-000000000003', 'REFERENTE', 'Referente', 'Analítica avanzada y participación preferencial.', null, 'ARS', 'MONTH', 'DRAFT', null, 2, 100, 30)
on conflict (id) do update set
  name = excluded.name, description = excluded.description,
  price_amount = excluded.price_amount, pricing_status = excluded.pricing_status,
  ranking_boost_points = excluded.ranking_boost_points, is_active = true;

insert into public.plan_entitlements (plan_id, entitlement_code, enabled, limit_value, configuration)
values
  ('2b000000-0000-4000-8000-000000000001', 'public_profile', true, null, '{}'),
  ('2b000000-0000-4000-8000-000000000001', 'receive_leads', true, null, '{}'),
  ('2b000000-0000-4000-8000-000000000002', 'analytics', true, null, '{"level":"standard"}'),
  ('2b000000-0000-4000-8000-000000000002', 'publish_articles', true, null, '{}'),
  ('2b000000-0000-4000-8000-000000000003', 'analytics', true, null, '{"level":"advanced"}'),
  ('2b000000-0000-4000-8000-000000000003', 'agreement_priority', true, null, '{}')
on conflict (plan_id, entitlement_code) do update set
  enabled = excluded.enabled, limit_value = excluded.limit_value, configuration = excluded.configuration;

insert into public.article_categories (id, slug, name, description, sort_order)
values
  ('2c000000-0000-4000-8000-000000000001', 'decisiones', 'Decisiones', 'Herramientas para decidir con más claridad.', 10),
  ('2c000000-0000-4000-8000-000000000002', 'empleabilidad', 'Empleabilidad', 'Búsqueda laboral y posicionamiento.', 20),
  ('2c000000-0000-4000-8000-000000000003', 'transiciones', 'Transiciones', 'Cambios de carrera, rol o industria.', 30),
  ('2c000000-0000-4000-8000-000000000004', 'liderazgo', 'Liderazgo', 'Desafíos de crecimiento y gestión.', 40)
on conflict (id) do update set name = excluded.name, description = excluded.description, is_active = true;

-- Initial deterministic questionnaire.
insert into public.matching_questions
  (id, rule_version, code, prompt, help_text, answer_type, position)
values
  ('2d000000-0000-4000-8000-000000000001', 'match-v1', 'current_situation', '¿Qué situación se parece más a la que estás atravesando?', 'No es un diagnóstico; sólo orienta tipos de acompañamiento.', 'SINGLE', 10),
  ('2d000000-0000-4000-8000-000000000002', 'match-v1', 'preferred_focus', '¿Qué te gustaría trabajar primero?', null, 'SINGLE', 20),
  ('2d000000-0000-4000-8000-000000000003', 'match-v1', 'preferred_modality', '¿Qué modalidad preferís?', null, 'SINGLE', 30)
on conflict (id) do update set prompt = excluded.prompt, help_text = excluded.help_text, is_active = true;

insert into public.matching_options (id, question_id, code, label, description, position)
values
  ('2e000000-0000-4000-8000-000000000001', '2d000000-0000-4000-8000-000000000001', 'choose_studies', 'No sé qué estudiar', null, 10),
  ('2e000000-0000-4000-8000-000000000002', '2d000000-0000-4000-8000-000000000001', 'change_career', 'Quiero cambiar de carrera', null, 20),
  ('2e000000-0000-4000-8000-000000000003', '2d000000-0000-4000-8000-000000000001', 'find_job', 'Necesito conseguir trabajo', null, 30),
  ('2e000000-0000-4000-8000-000000000004', '2d000000-0000-4000-8000-000000000001', 'move_to_tech', 'Quiero pasar a tecnología', null, 40),
  ('2e000000-0000-4000-8000-000000000005', '2d000000-0000-4000-8000-000000000002', 'explore_identity', 'Explorar intereses y dirección', null, 10),
  ('2e000000-0000-4000-8000-000000000006', '2d000000-0000-4000-8000-000000000002', 'practical_tools', 'Trabajar herramientas concretas', null, 20),
  ('2e000000-0000-4000-8000-000000000007', '2d000000-0000-4000-8000-000000000003', 'online', 'Online', null, 10),
  ('2e000000-0000-4000-8000-000000000008', '2d000000-0000-4000-8000-000000000003', 'in_person', 'Presencial', null, 20),
  ('2e000000-0000-4000-8000-000000000009', '2d000000-0000-4000-8000-000000000003', 'either', 'Cualquiera', null, 30)
on conflict (id) do update set label = excluded.label, description = excluded.description, is_active = true;

delete from public.matching_rules where rule_version = 'match-v1';

insert into public.matching_rules
  (rule_version, option_id, need_id, service_id, professional_type_id, modality_id, weight, reason)
values
  ('match-v1', '2e000000-0000-4000-8000-000000000001', '22000000-0000-4000-8000-000000000001', null, null, null, 40, 'Acompaña una primera elección educativa.'),
  ('match-v1', '2e000000-0000-4000-8000-000000000001', null, '23000000-0000-4000-8000-000000000001', null, null, 25, 'Ofrece un proceso de orientación vocacional.'),
  ('match-v1', '2e000000-0000-4000-8000-000000000002', '22000000-0000-4000-8000-000000000003', null, null, null, 40, 'Trabaja procesos de reinvención profesional.'),
  ('match-v1', '2e000000-0000-4000-8000-000000000002', null, null, '20000000-0000-4000-8000-000000000011', null, 25, 'Acompaña el rediseño de trayectoria.'),
  ('match-v1', '2e000000-0000-4000-8000-000000000003', '22000000-0000-4000-8000-000000000005', null, null, null, 40, 'Acompaña una búsqueda laboral activa.'),
  ('match-v1', '2e000000-0000-4000-8000-000000000003', null, '23000000-0000-4000-8000-000000000003', null, null, 25, 'Trabaja estrategia de búsqueda laboral.'),
  ('match-v1', '2e000000-0000-4000-8000-000000000004', '22000000-0000-4000-8000-000000000006', null, null, null, 40, 'Se enfoca en una transición hacia tecnología.'),
  ('match-v1', '2e000000-0000-4000-8000-000000000004', null, null, '20000000-0000-4000-8000-000000000008', null, 25, 'Aporta experiencia de mentoría tecnológica.'),
  ('match-v1', '2e000000-0000-4000-8000-000000000005', null, null, '20000000-0000-4000-8000-000000000001', null, 15, 'Propone un espacio de exploración de intereses.'),
  ('match-v1', '2e000000-0000-4000-8000-000000000006', null, null, '20000000-0000-4000-8000-000000000005', null, 15, 'Aporta herramientas concretas de empleabilidad.'),
  ('match-v1', '2e000000-0000-4000-8000-000000000007', null, null, null, '26000000-0000-4000-8000-000000000001', 15, 'Atiende en modalidad online.'),
  ('match-v1', '2e000000-0000-4000-8000-000000000008', null, null, null, '26000000-0000-4000-8000-000000000002', 15, 'Atiende en modalidad presencial.')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Clearly fictional demo data. No auth users, passwords, emails or real PII.
-- ---------------------------------------------------------------------------

insert into public.professional_profiles
  (id, slug, first_name, last_name, headline, bio, approach, experience_summary,
   education_summary, years_experience, starting_price, currency,
   availability_status, next_available_on, publication_status,
   verification_state, published_at, is_accepting_leads, is_demo)
values
  ('11111111-1111-4111-8111-111111111101', 'valentina-acosta', 'Valentina', 'Acosta', 'Para elegir sin apurarte y convertir la incertidumbre en una exploración posible', 'Perfil completamente ficticio creado para probar Red Senda. Acompaña a jóvenes y personas adultas a mirar intereses, capacidades y contexto antes de decidir, sin prometer respuestas automáticas.', 'Construye criterios propios, abre alternativas y propone pequeños pasos para probarlas.', 'Trayectoria ficticia en orientación vocacional y reorientación.', 'Formación y credenciales sintéticas, sin vínculo con una persona real.', 12, 35000, 'ARS', 'AVAILABLE', '2026-08-20', 'PUBLISHED', 'VERIFIED', '2026-01-15 12:00:00+00', true, true),
  ('11111111-1111-4111-8111-111111111102', 'lucas-ibarra', 'Lucas', 'Ibarra', 'Claridad para traducir experiencia, elegir el próximo paso y sostener el cambio', 'Perfil ficticio de demostración. Trabaja con personas que necesitan recuperar perspectiva, traducir su experiencia y convertir una intención de cambio en un plan realista.', 'Combina conversación estratégica, experimentos de carrera y seguimiento.', 'Experiencia demostrativa en coaching y desarrollo de carrera.', 'Certificaciones ficticias consignadas únicamente para pruebas.', 9, 42000, 'ARS', 'AVAILABLE', '2026-08-19', 'PUBLISHED', 'VERIFIED', '2026-01-16 12:00:00+00', true, true),
  ('11111111-1111-4111-8111-111111111103', 'ines-moreno', 'Inés', 'Moreno', 'Estrategias para aprender, elegir y construir una trayectoria educativa posible', 'Perfil ficticio creado para el entorno demo. Acompaña a jóvenes y personas adultas a comprender cómo aprenden, explorar opciones educativas y organizar decisiones de estudio sin respuestas automáticas.', 'Trabaja con entrevistas, estrategias de aprendizaje y exploración guiada de alternativas.', 'Experiencia ficticia en psicopedagogía y orientación educativa.', 'Información educativa y credenciales totalmente sintéticas.', 11, 30000, 'ARS', 'LIMITED', '2026-08-22', 'PUBLISHED', 'VERIFIED', '2026-01-17 12:00:00+00', true, true),
  ('11111111-1111-4111-8111-111111111104', 'tomas-ferrer', 'Tomás', 'Ferrer', 'Una mirada honesta para acercarte a tecnología sin empezar de cero ni comprar atajos', 'Perfil ficticio para probar filtros y matching. Acompaña a perfiles no técnicos a traducir experiencia, explorar familias de roles digitales y validar interés antes de elegir una formación larga.', 'Trabaja con mapas de roles, proyectos breves y revisión de evidencia.', 'Trayectoria demostrativa en producto digital y mentoría.', 'Datos formativos íntegramente ficticios.', 13, 45, 'USD', 'WAITLIST', null, 'PUBLISHED', 'VERIFIED', '2026-01-18 12:00:00+00', true, true),
  ('11111111-1111-4111-8111-111111111105', 'mariana-ortiz', 'Mariana', 'Ortiz', 'Un espacio para escuchar qué pide el cambio antes de convertirlo en una decisión', 'Perfil ficticio de prueba. Trabaja con malestar laboral, agotamiento y preguntas de identidad profesional para construir movimientos cuidadosos, sin fórmulas ni decisiones impulsivas.', 'Explora patrones, expectativas, recursos y sentidos ligados al trabajo.', 'Experiencia demostrativa en psicología laboral y transiciones.', 'Antecedentes y matrícula completamente sintéticos.', 15, 38000, 'ARS', 'ASK', null, 'PUBLISHED', 'VERIFIED', '2026-01-19 12:00:00+00', true, true),
  ('11111111-1111-4111-8111-111111111106', 'agustin-paz', 'Agustín', 'Paz', 'Acompañamiento entre pares para liderar una etapa nueva con criterio propio', 'Perfil ficticio creado para validar la experiencia del marketplace. Acompaña a responsables de equipo a leer mejor el sistema, conversar con claridad y decidir sin copiar estilos ajenos.', 'Trabaja sobre desafíos reales, actores, tensiones y alternativas.', 'Experiencia ejecutiva ficticia en operaciones y mentoría.', 'Formación de ejemplo que no corresponde a una persona real.', 18, 55, 'USD', 'LIMITED', '2026-08-29', 'PUBLISHED', 'NOT_VERIFIED', '2026-01-20 12:00:00+00', true, true),
  ('11111111-1111-4111-8111-111111111107', 'gala-rumbo-demo', 'Gala', 'Rumbo Demo', 'Práctica de entrevistas con devolución accionable', 'Perfil ficticio para escenarios de prueba. Prepara entrevistas y ayuda a construir ejemplos claros de experiencia y resultados.', 'Realiza simulaciones y una devolución priorizada.', 'Experiencia sintética en entrevistas y selección.', 'Datos de formación creados sólo para demo.', 6, 19000, 'ARS', 'AVAILABLE', '2026-08-19', 'PUBLISHED', 'PENDING', '2026-01-21 12:00:00+00', true, true),
  ('11111111-1111-4111-8111-111111111108', 'hugo-faro-demo', 'Hugo', 'Faro Demo', 'CV, LinkedIn y propuesta de valor profesional', 'Perfil ficticio de Red Senda. Ayuda a presentar una trayectoria de forma clara sin fórmulas mágicas ni promesas de contratación.', 'Revisa objetivos, evidencias y consistencia del mensaje.', 'Experiencia demostrativa en marca y comunicación profesional.', 'Antecedentes completamente sintéticos.', 10, 24000, 'ARS', 'AVAILABLE', '2026-08-21', 'PUBLISHED', 'NOT_VERIFIED', '2026-01-22 12:00:00+00', true, true),
  ('11111111-1111-4111-8111-111111111109', 'ines-umbral-demo', 'Inés', 'Umbral Demo', 'Mentoría para desafíos de liderazgo', 'Perfil ficticio para probar el catálogo. Acompaña a líderes que necesitan ordenar prioridades, conversaciones y decisiones de desarrollo.', 'Trabaja con casos concretos y compromisos entre encuentros.', 'Experiencia demostrativa en gestión y liderazgo.', 'Información ficticia sin datos de profesionales reales.', 18, 68000, 'ARS', 'LIMITED', '2026-09-02', 'PUBLISHED', 'VERIFIED', '2026-01-23 12:00:00+00', true, true),
  ('11111111-1111-4111-8111-111111111110', 'julian-mapa-demo', 'Julián', 'Mapa Demo', 'Mentoría para comprender otra industria', 'Perfil ficticio. Ayuda a investigar sectores, reconocer capacidades transferibles y conversar con mayor criterio sobre un cambio.', 'Combina contexto sectorial con un plan de exploración.', 'Experiencia sintética en distintas industrias.', 'Credenciales creadas para la demostración.', 13, 45000, 'ARS', 'ASK', null, 'PUBLISHED', 'NOT_VERIFIED', '2026-01-24 12:00:00+00', true, true),
  ('11111111-1111-4111-8111-111111111111', 'kiara-anden-demo', 'Kiara', 'Andén Demo', 'Desarrollo profesional y liderazgo de equipos', 'Perfil ficticio para validar búsquedas. Acompaña crecimiento hacia roles de coordinación y primeros desafíos de liderazgo.', 'Ordena competencias, oportunidades de práctica y feedback.', 'Experiencia demostrativa en desarrollo de talento.', 'Toda la información es sintética.', 9, 39000, 'ARS', 'AVAILABLE', '2026-08-27', 'PUBLISHED', 'VERIFIED', '2026-01-25 12:00:00+00', true, true),
  ('11111111-1111-4111-8111-111111111112', 'lautaro-via-demo', 'Lautaro', 'Vía Demo', 'Mentoría para proyectos y caminos emprendedores', 'Perfil ficticio creado exclusivamente para pruebas. Ayuda a explorar el encaje entre experiencia, proyecto y próximos experimentos.', 'Trabaja con decisiones pequeñas y evidencia temprana.', 'Trayectoria demostrativa en proyectos y mentoría.', 'Datos ficticios, no representan credenciales reales.', 8, 32000, 'ARS', 'WAITLIST', null, 'PUBLISHED', 'PENDING', '2026-01-26 12:00:00+00', true, true),
  ('11111111-1111-4111-8111-111111111113', 'maia-prisma-demo', 'Maia', 'Prisma Demo', 'Orientación educativa para explorar alternativas', 'Perfil ficticio en estado borrador para probar onboarding y administración. No corresponde a ninguna profesional real.', 'Enfoque demostrativo basado en exploración guiada.', 'Experiencia de ejemplo.', 'Formación ficticia.', 5, 21000, 'ARS', 'ASK', null, 'DRAFT', 'NOT_VERIFIED', null, false, true),
  ('11111111-1111-4111-8111-111111111114', 'nicolas-atlas-demo', 'Nicolás', 'Atlas Demo', 'Empleabilidad y estrategia de postulación', 'Perfil ficticio pendiente de revisión para probar el circuito administrativo de Red Senda.', 'Enfoque práctico de demostración.', 'Experiencia ficticia en selección.', 'Antecedentes sintéticos.', 7, 27000, 'ARS', 'ASK', null, 'PENDING_REVIEW', 'PENDING', null, false, true),
  ('11111111-1111-4111-8111-111111111115', 'olivia-nexo-demo', 'Olivia', 'Nexo Demo', 'Planificación de crecimiento profesional', 'Perfil ficticio rechazado para probar estados y mensajes administrativos. Ningún dato identifica a una persona real.', 'Metodología ficticia para demo.', 'Experiencia sintética.', 'Información educativa de ejemplo.', 10, 41000, 'ARS', 'ASK', null, 'REJECTED', 'REJECTED', null, false, true),
  ('11111111-1111-4111-8111-111111111116', 'pablo-delta-demo', 'Pablo', 'Delta Demo', 'Acompañamiento para una transición digital', 'Perfil ficticio suspendido para probar exclusión del catálogo y herramientas de administración.', 'Enfoque de prueba orientado a experimentos.', 'Experiencia completamente ficticia.', 'Antecedentes sintéticos.', 12, 56000, 'ARS', 'ASK', null, 'SUSPENDED', 'EXPIRED', null, false, true)
on conflict (id) do update set
  slug = excluded.slug, first_name = excluded.first_name, last_name = excluded.last_name,
  headline = excluded.headline, bio = excluded.bio, approach = excluded.approach,
  experience_summary = excluded.experience_summary, education_summary = excluded.education_summary,
  starting_price = excluded.starting_price, availability_status = excluded.availability_status,
  publication_status = excluded.publication_status, verification_state = excluded.verification_state,
  published_at = excluded.published_at, is_accepting_leads = excluded.is_accepting_leads,
  is_demo = true;

-- Rebuild demo-only many-to-many assignments so re-running the seed converges
-- after taxonomy changes instead of accumulating stale relationships.
delete from public.professional_profile_types x using public.professional_profiles p
where x.professional_profile_id = p.id and p.is_demo;
delete from public.professional_needs x using public.professional_profiles p
where x.professional_profile_id = p.id and p.is_demo;
delete from public.professional_services x using public.professional_profiles p
where x.professional_profile_id = p.id and p.is_demo;
delete from public.professional_specialties x using public.professional_profiles p
where x.professional_profile_id = p.id and p.is_demo;
delete from public.professional_audiences x using public.professional_profiles p
where x.professional_profile_id = p.id and p.is_demo;
delete from public.professional_modalities x using public.professional_profiles p
where x.professional_profile_id = p.id and p.is_demo;
delete from public.professional_locations x using public.professional_profiles p
where x.professional_profile_id = p.id and p.is_demo;
delete from public.professional_languages x using public.professional_profiles p
where x.professional_profile_id = p.id and p.is_demo;
delete from public.professional_industries x using public.professional_profiles p
where x.professional_profile_id = p.id and p.is_demo;
delete from public.professional_career_stages x using public.professional_profiles p
where x.professional_profile_id = p.id and p.is_demo;

insert into public.professional_profile_types
  (professional_profile_id, professional_type_id, is_primary)
values
  ('11111111-1111-4111-8111-111111111101','20000000-0000-4000-8000-000000000001',true),
  ('11111111-1111-4111-8111-111111111102','20000000-0000-4000-8000-000000000003',true),
  ('11111111-1111-4111-8111-111111111103','20000000-0000-4000-8000-000000000002',true),
  ('11111111-1111-4111-8111-111111111104','20000000-0000-4000-8000-000000000008',true),
  ('11111111-1111-4111-8111-111111111105','20000000-0000-4000-8000-000000000001',true),
  ('11111111-1111-4111-8111-111111111106','20000000-0000-4000-8000-000000000012',true),
  ('11111111-1111-4111-8111-111111111107','20000000-0000-4000-8000-000000000006',true),
  ('11111111-1111-4111-8111-111111111108','20000000-0000-4000-8000-000000000007',true),
  ('11111111-1111-4111-8111-111111111109','20000000-0000-4000-8000-000000000009',true),
  ('11111111-1111-4111-8111-111111111110','20000000-0000-4000-8000-000000000009',true),
  ('11111111-1111-4111-8111-111111111111','20000000-0000-4000-8000-000000000012',true),
  ('11111111-1111-4111-8111-111111111112','20000000-0000-4000-8000-000000000009',true),
  ('11111111-1111-4111-8111-111111111113','20000000-0000-4000-8000-000000000002',true),
  ('11111111-1111-4111-8111-111111111114','20000000-0000-4000-8000-000000000005',true),
  ('11111111-1111-4111-8111-111111111115','20000000-0000-4000-8000-000000000003',true),
  ('11111111-1111-4111-8111-111111111116','20000000-0000-4000-8000-000000000008',true)
on conflict do nothing;

insert into public.professional_needs (professional_profile_id, need_id)
select p.id, n.id
from (values
  ('11111111-1111-4111-8111-111111111101'::uuid, array['22000000-0000-4000-8000-000000000001'::uuid,'22000000-0000-4000-8000-000000000002'::uuid]),
  ('11111111-1111-4111-8111-111111111102'::uuid, array['22000000-0000-4000-8000-000000000003'::uuid,'22000000-0000-4000-8000-000000000004'::uuid]),
  ('11111111-1111-4111-8111-111111111103'::uuid, array['22000000-0000-4000-8000-000000000001'::uuid,'22000000-0000-4000-8000-000000000002'::uuid]),
  ('11111111-1111-4111-8111-111111111104'::uuid, array['22000000-0000-4000-8000-000000000006'::uuid,'22000000-0000-4000-8000-000000000010'::uuid]),
  ('11111111-1111-4111-8111-111111111105'::uuid, array['22000000-0000-4000-8000-000000000003'::uuid,'22000000-0000-4000-8000-000000000004'::uuid,'22000000-0000-4000-8000-000000000009'::uuid]),
  ('11111111-1111-4111-8111-111111111106'::uuid, array['22000000-0000-4000-8000-000000000009'::uuid,'22000000-0000-4000-8000-000000000010'::uuid]),
  ('11111111-1111-4111-8111-111111111107'::uuid, array['22000000-0000-4000-8000-000000000008'::uuid,'22000000-0000-4000-8000-000000000005'::uuid]),
  ('11111111-1111-4111-8111-111111111108'::uuid, array['22000000-0000-4000-8000-000000000007'::uuid,'22000000-0000-4000-8000-000000000004'::uuid]),
  ('11111111-1111-4111-8111-111111111109'::uuid, array['22000000-0000-4000-8000-000000000009'::uuid,'22000000-0000-4000-8000-000000000010'::uuid]),
  ('11111111-1111-4111-8111-111111111110'::uuid, array['22000000-0000-4000-8000-000000000010'::uuid,'22000000-0000-4000-8000-000000000003'::uuid]),
  ('11111111-1111-4111-8111-111111111111'::uuid, array['22000000-0000-4000-8000-000000000009'::uuid,'22000000-0000-4000-8000-000000000004'::uuid]),
  ('11111111-1111-4111-8111-111111111112'::uuid, array['22000000-0000-4000-8000-000000000003'::uuid,'22000000-0000-4000-8000-000000000009'::uuid]),
  ('11111111-1111-4111-8111-111111111113'::uuid, array['22000000-0000-4000-8000-000000000001'::uuid]),
  ('11111111-1111-4111-8111-111111111114'::uuid, array['22000000-0000-4000-8000-000000000005'::uuid]),
  ('11111111-1111-4111-8111-111111111115'::uuid, array['22000000-0000-4000-8000-000000000009'::uuid]),
  ('11111111-1111-4111-8111-111111111116'::uuid, array['22000000-0000-4000-8000-000000000006'::uuid])
) p(id, need_ids)
cross join lateral unnest(p.need_ids) n(id)
on conflict do nothing;

insert into public.professional_services
  (professional_profile_id, service_id, title, price_from, currency, duration_minutes)
values
  ('11111111-1111-4111-8111-111111111101','23000000-0000-4000-8000-000000000001','Proceso de orientación vocacional',26000,'ARS',60),
  ('11111111-1111-4111-8111-111111111102','23000000-0000-4000-8000-000000000002','Estrategia de carrera',36000,'ARS',60),
  ('11111111-1111-4111-8111-111111111103','23000000-0000-4000-8000-000000000001','Orientación psicopedagógica',22000,'ARS',60),
  ('11111111-1111-4111-8111-111111111104','23000000-0000-4000-8000-000000000007','Mapa de transición tecnológica',47000,'ARS',75),
  ('11111111-1111-4111-8111-111111111105','23000000-0000-4000-8000-000000000010','Proceso de transición laboral',38000,'ARS',60),
  ('11111111-1111-4111-8111-111111111106','23000000-0000-4000-8000-000000000008','Mentoría de liderazgo',55,'USD',75),
  ('11111111-1111-4111-8111-111111111107','23000000-0000-4000-8000-000000000006','Simulación de entrevista',19000,'ARS',45),
  ('11111111-1111-4111-8111-111111111108','23000000-0000-4000-8000-000000000005','Revisión de LinkedIn',24000,'ARS',60),
  ('11111111-1111-4111-8111-111111111109','23000000-0000-4000-8000-000000000008','Mentoría de liderazgo',68000,'ARS',75),
  ('11111111-1111-4111-8111-111111111110','23000000-0000-4000-8000-000000000009','Mentoría sectorial',45000,'ARS',60),
  ('11111111-1111-4111-8111-111111111111','23000000-0000-4000-8000-000000000008','Desarrollo de liderazgo',39000,'ARS',60),
  ('11111111-1111-4111-8111-111111111112','23000000-0000-4000-8000-000000000010','Exploración de proyecto profesional',32000,'ARS',60),
  ('11111111-1111-4111-8111-111111111113','23000000-0000-4000-8000-000000000001','Orientación educativa demo',21000,'ARS',60),
  ('11111111-1111-4111-8111-111111111114','23000000-0000-4000-8000-000000000003','Búsqueda laboral demo',27000,'ARS',60),
  ('11111111-1111-4111-8111-111111111115','23000000-0000-4000-8000-000000000002','Planificación profesional demo',41000,'ARS',60),
  ('11111111-1111-4111-8111-111111111116','23000000-0000-4000-8000-000000000007','Transición digital demo',56000,'ARS',75)
on conflict do nothing;

-- Demo fixtures exercise the catalogue without publishing fees. Unsupported
-- historical professions remain available only as suspended workflow data.
update public.professional_profiles p
set starting_price = null,
    currency = null,
    show_starting_price = false,
    publication_status = case
      when private.has_supported_professional_types(p.id)
        then p.publication_status
      else 'SUSPENDED'
    end,
    published_at = case
      when private.has_supported_professional_types(p.id)
        then p.published_at
      else null
    end,
    is_accepting_leads = case
      when private.has_supported_professional_types(p.id)
        then p.is_accepting_leads
      else false
    end
where p.is_demo;

update public.professional_services ps
set price_from = null,
    currency = null
where exists (
  select 1
  from public.professional_profiles p
  where p.id = ps.professional_profile_id and p.is_demo
);

insert into public.professional_specialties (professional_profile_id, specialty_id)
select ('11111111-1111-4111-8111-1111111111' || lpad(n::text, 2, '0'))::uuid,
       ('24000000-0000-4000-8000-' || lpad((((n - 1) % 10) + 1)::text, 12, '0'))::uuid
from generate_series(1, 16) n
on conflict do nothing;

-- Map the 16 profiles to one audience, modality, city, language, industry and
-- career stage each. Additional online/English/Portuguese rows provide filter coverage.
insert into public.professional_audiences (professional_profile_id, audience_id)
select ('11111111-1111-4111-8111-1111111111' || lpad(n::text, 2, '0'))::uuid,
       ('25000000-0000-4000-8000-' || lpad((((n - 1) % 5) + 1)::text, 12, '0'))::uuid
from generate_series(1, 16) n on conflict do nothing;

insert into public.professional_modalities (professional_profile_id, modality_id)
select ('11111111-1111-4111-8111-1111111111' || lpad(n::text, 2, '0'))::uuid,
       case when n % 3 = 0 then '26000000-0000-4000-8000-000000000003'::uuid
            when n % 2 = 0 then '26000000-0000-4000-8000-000000000001'::uuid
            else '26000000-0000-4000-8000-000000000002'::uuid end
from generate_series(1, 16) n on conflict do nothing;
insert into public.professional_modalities (professional_profile_id, modality_id)
select ('11111111-1111-4111-8111-1111111111' || lpad(n::text, 2, '0'))::uuid,
       '26000000-0000-4000-8000-000000000001'
from generate_series(1, 16) n where n % 2 = 1 on conflict do nothing;

insert into public.professional_locations (professional_profile_id, location_id, is_primary)
select ('11111111-1111-4111-8111-1111111111' || lpad(n::text, 2, '0'))::uuid,
       ('27000000-0000-4000-8000-' || lpad((100 + (((n - 1) % 5) + 1))::text, 12, '0'))::uuid,
       true
from generate_series(1, 16) n on conflict do nothing;

insert into public.professional_languages (professional_profile_id, language_id, proficiency)
select ('11111111-1111-4111-8111-1111111111' || lpad(n::text, 2, '0'))::uuid,
       '28000000-0000-4000-8000-000000000001', 'NATIVE'
from generate_series(1, 16) n on conflict do nothing;
insert into public.professional_languages (professional_profile_id, language_id, proficiency)
select ('11111111-1111-4111-8111-1111111111' || lpad(n::text, 2, '0'))::uuid,
       '28000000-0000-4000-8000-000000000002', 'PROFESSIONAL'
from generate_series(2, 16, 2) n on conflict do nothing;
insert into public.professional_languages (professional_profile_id, language_id, proficiency)
values
  ('11111111-1111-4111-8111-111111111104','28000000-0000-4000-8000-000000000003','CONVERSATIONAL'),
  ('11111111-1111-4111-8111-111111111112','28000000-0000-4000-8000-000000000003','FLUENT')
on conflict do nothing;

insert into public.professional_industries (professional_profile_id, industry_id)
select ('11111111-1111-4111-8111-1111111111' || lpad(n::text, 2, '0'))::uuid,
       ('29000000-0000-4000-8000-' || lpad((((n - 1) % 6) + 1)::text, 12, '0'))::uuid
from generate_series(1, 16) n on conflict do nothing;

insert into public.professional_career_stages (professional_profile_id, career_stage_id)
select ('11111111-1111-4111-8111-1111111111' || lpad(n::text, 2, '0'))::uuid,
       ('2a000000-0000-4000-8000-' || lpad((((n - 1) % 6) + 1)::text, 12, '0'))::uuid
from generate_series(1, 16) n on conflict do nothing;

-- Keep the first six database identities aligned with the demo UI contract.
delete from public.professional_locations
where professional_profile_id = '11111111-1111-4111-8111-111111111105';
insert into public.professional_locations (professional_profile_id, location_id, is_primary)
values ('11111111-1111-4111-8111-111111111105','27000000-0000-4000-8000-000000000102',true)
on conflict do nothing;

delete from public.professional_modalities
where professional_profile_id = '11111111-1111-4111-8111-111111111103'
  and modality_id = '26000000-0000-4000-8000-000000000003';
insert into public.professional_modalities (professional_profile_id, modality_id)
values
  ('11111111-1111-4111-8111-111111111106','26000000-0000-4000-8000-000000000001'),
  ('11111111-1111-4111-8111-111111111106','26000000-0000-4000-8000-000000000002')
on conflict do nothing;

delete from public.professional_languages
where professional_profile_id = '11111111-1111-4111-8111-111111111102'
  and language_id = '28000000-0000-4000-8000-000000000002';
insert into public.professional_languages (professional_profile_id, language_id, proficiency)
values
  ('11111111-1111-4111-8111-111111111101','28000000-0000-4000-8000-000000000002','PROFESSIONAL'),
  ('11111111-1111-4111-8111-111111111103','28000000-0000-4000-8000-000000000002','PROFESSIONAL')
on conflict do nothing;

delete from public.professional_specialties
where professional_profile_id in (
  '11111111-1111-4111-8111-111111111103',
  '11111111-1111-4111-8111-111111111104',
  '11111111-1111-4111-8111-111111111105',
  '11111111-1111-4111-8111-111111111106'
);
insert into public.professional_specialties (professional_profile_id, specialty_id)
values
  ('11111111-1111-4111-8111-111111111103','24000000-0000-4000-8000-000000000001'),
  ('11111111-1111-4111-8111-111111111104','24000000-0000-4000-8000-000000000006'),
  ('11111111-1111-4111-8111-111111111105','24000000-0000-4000-8000-000000000002'),
  ('11111111-1111-4111-8111-111111111106','24000000-0000-4000-8000-000000000007')
on conflict do nothing;

insert into public.professional_career_stages (professional_profile_id, career_stage_id)
values
  ('11111111-1111-4111-8111-111111111102','2a000000-0000-4000-8000-000000000003'),
  ('11111111-1111-4111-8111-111111111102','2a000000-0000-4000-8000-000000000005'),
  ('11111111-1111-4111-8111-111111111103','2a000000-0000-4000-8000-000000000002'),
  ('11111111-1111-4111-8111-111111111104','2a000000-0000-4000-8000-000000000006'),
  ('11111111-1111-4111-8111-111111111105','2a000000-0000-4000-8000-000000000003'),
  ('11111111-1111-4111-8111-111111111106','2a000000-0000-4000-8000-000000000005')
on conflict do nothing;

insert into public.professional_ranking_signals
  (professional_profile_id, availability_score, completeness_score,
   response_score, activity_score, quality_score, plan_boost_points,
   is_sponsored, ranking_version)
select
  ('11111111-1111-4111-8111-1111111111' || lpad(n::text, 2, '0'))::uuid,
  55 + (n % 5) * 8,
  72 + (n % 6) * 4,
  60 + (n % 4) * 9,
  58 + (n % 5) * 7,
  70 + (n % 4) * 6,
  case when n % 3 = 0 then 2 when n % 2 = 0 then 1 else 0 end,
  n in (3, 9),
  'rank-v1'
from generate_series(1, 16) n
on conflict (professional_profile_id) do update set
  availability_score = excluded.availability_score,
  completeness_score = excluded.completeness_score,
  response_score = excluded.response_score,
  activity_score = excluded.activity_score,
  quality_score = excluded.quality_score,
  plan_boost_points = excluded.plan_boost_points,
  is_sponsored = excluded.is_sponsored,
  ranking_version = excluded.ranking_version;

insert into public.articles
  (id, author_profile_id, category_id, title, slug, excerpt, body, tags, takeaways,
   status, seo_title, seo_description, published_at, moderated_at, is_demo)
values
  ('33000000-0000-4000-8000-000000000001','11111111-1111-4111-8111-111111111101','2c000000-0000-4000-8000-000000000001','Elegir sin tener todas las respuestas','elegir-sin-todas-las-respuestas-demo','Una guía breve para convertir la incertidumbre en preguntas que sí se pueden investigar.',
   'Elegir no exige adivinar el futuro: puede empezar por reconocer intereses, condiciones y alternativas, conversar con personas y diseñar experiencias pequeñas antes de comprometer una decisión.

## Separá lo que ya sabés de lo que falta explorar

Antes de buscar más información conviene escribir lo que ya es conocido: intereses declarados, tareas que generan energía y condiciones no negociables como presupuesto o ubicación. Esa lista reduce el terreno real de incertidumbre.

Lo que queda afuera de esa lista es lo que vale la pena investigar activamente, en lugar de seguir dando vueltas sobre lo que ya se sabe.

## Diseñá pasos reversibles antes que una decisión definitiva

Una materia suelta, una certificación corta o una conversación con alguien que ejerce esa profesión aportan evidencia real sin cerrar otras puertas.

Ese tipo de pasos intermedios convierte una decisión abstracta en una serie de decisiones pequeñas y revisables, más fáciles de sostener que una apuesta única.',
   '{decisiones,orientacion}',
   '{"Separá lo que ya sabés de lo que necesitás investigar.","Priorizá pasos reversibles antes de un compromiso definitivo.","Buscá evidencia conversando con quienes ya recorrieron ese camino."}',
   'PUBLISHED','Elegir sin todas las respuestas','Preguntas y experimentos para explorar decisiones educativas.', '2026-02-01 12:00:00+00','2026-02-01 10:00:00+00',true),
  ('33000000-0000-4000-8000-000000000002','11111111-1111-4111-8111-111111111102','2c000000-0000-4000-8000-000000000003','Cómo convertir un cambio en un experimento','convertir-cambio-en-experimento-demo','Una forma práctica de reducir el riesgo cuando estás pensando en una transición profesional.',
   'En lugar de tratar un cambio de carrera como una única decisión irreversible, se puede formular una hipótesis, definir qué evidencia falta y diseñar un experimento acotado.

## Convertí la duda en una hipótesis concreta

"Quiero cambiar de rubro" es difícil de poner a prueba. "Quiero saber si un rol de análisis de datos me resulta sostenible" sí se puede investigar con una acción concreta.

Nombrar la hipótesis con precisión ayuda a decidir qué información falta y evita confundir intuición con evidencia.

## Elegí el experimento más chico que aporte evidencia real

Una conversación con alguien del área, un proyecto breve o una observación del trabajo cotidiano suelen bastar para contrastar la fantasía con la tarea real.

El objetivo no es acertar a la primera, sino acumular información propia que reduzca el riesgo de la decisión siguiente.',
   '{transiciones,carrera}',
   '{"Transformá la duda en una hipótesis que se pueda poner a prueba.","Elegí experimentos pequeños antes de un cambio definitivo.","Cada experimento deja evidencia propia, no sólo intuición."}',
   'PUBLISHED','Cambios profesionales como experimentos','Una aproximación gradual y basada en evidencia para explorar transiciones.', '2026-02-05 12:00:00+00','2026-02-05 10:00:00+00',true),
  ('33000000-0000-4000-8000-000000000003','11111111-1111-4111-8111-111111111103','2c000000-0000-4000-8000-000000000002','Leer una búsqueda laboral con criterio','leer-busqueda-laboral-demo','Qué observar en un aviso antes de adaptar tu postulación y decidir si vale la pena avanzar.',
   'Conviene separar requisitos centrales, señales de contexto y preferencias antes de adaptar una postulación o decidir si vale la pena avanzar.

## Distinguí lo excluyente de lo deseable

Un aviso mezcla condiciones centrales con preferencias del equipo. Separarlas permite entender qué barreras son reales y cuáles admiten matices.

Esa lectura evita descartarse por no cumplir un punto que, en la práctica, no define el proceso.

## Buscá señales de contexto antes de postularte

El tono, las responsabilidades descriptas y la forma de redactar el aviso anticipan parte de la cultura del equipo y del momento que atraviesa el área.

Esas señales también sirven para preparar preguntas propias durante el proceso, en lugar de responder únicamente a lo que pide la empresa.',
   '{empleabilidad,busqueda}',
   '{"Separá requisitos excluyentes de preferencias deseables.","Leé el contexto del aviso, no sólo la lista de tareas.","Preparate preguntas propias antes de avanzar en el proceso."}',
   'PUBLISHED','Cómo leer una búsqueda laboral','Criterios para analizar avisos y preparar postulaciones relevantes.', '2026-02-10 12:00:00+00','2026-02-10 10:00:00+00',true),
  ('33000000-0000-4000-8000-000000000004','11111111-1111-4111-8111-111111111104','2c000000-0000-4000-8000-000000000003','Transición a tecnología: empezar por los roles','transicion-tecnologia-empezar-roles-demo','Tecnología no es un único destino: una primera exploración puede comparar familias de roles.',
   'Tecnología no es un único destino: antes de elegir una formación conviene comparar familias de roles y las tareas reales que implican.

## Comparé tareas, no títulos

Producto, datos, desarrollo, diseño y operaciones requieren combinaciones distintas de capacidades, aunque compartan la etiqueta "tecnología".

Mirar tareas concretas de cada rol evita elegir una formación en base a un nombre atractivo pero poco preciso.

## Contrastá la brecha con tu experiencia actual

Conversar con quienes ejercen esos roles y revisar procesos reales de trabajo ayuda a estimar qué tan lejos está la experiencia previa de ese nuevo camino.

Esa brecha, una vez nombrada, permite elegir una formación acotada en lugar de un recorrido genérico y extenso.',
   '{tecnologia,transiciones}',
   '{"Comparé familias de roles por sus tareas, no por su nombre.","Hablá con quienes ya ejercen el rol que te interesa.","Elegí formación específica según la brecha real, no genérica."}',
   'PUBLISHED','Transición a tecnología y familias de roles','Cómo explorar roles tecnológicos antes de elegir formación.', '2026-02-15 12:00:00+00','2026-02-15 10:00:00+00',true),
  ('33000000-0000-4000-8000-000000000005','11111111-1111-4111-8111-111111111107','2c000000-0000-4000-8000-000000000002','Preparar historias para una entrevista','preparar-historias-entrevista-demo','Una estructura simple para comunicar contexto, decisiones, acciones y resultados sin memorizar discursos.',
   'Prepararse no significa memorizar respuestas perfectas, sino elegir algunas historias que muestren contexto, decisiones, acciones y resultados con precisión.

## Elegí pocas historias, no muchas respuestas

Cuatro o cinco episodios bien elegidos alcanzan para responder preguntas distintas si se conoce bien el contexto, el aporte propio y el resultado obtenido.

Repasar demasiadas respuestas memorizadas suele generar un discurso rígido en lugar de una conversación genuina.

## Estructurá cada historia con cuidado

Contexto, desafío, acción propia, resultado y aprendizaje son suficientes para comunicar una experiencia con claridad, sin exponer información confidencial.

Esa estructura también ayuda a identificar qué historias todavía faltan pulir antes de la entrevista.',
   '{entrevistas,empleabilidad}',
   '{"Elegí pocas historias representativas, no una respuesta por pregunta.","Usá una misma estructura: contexto, acción, resultado, aprendizaje.","Cuidá la información confidencial al elegir tus ejemplos."}',
   'PUBLISHED','Historias claras para entrevistas','Cómo preparar ejemplos concretos para una entrevista laboral.', '2026-02-20 12:00:00+00','2026-02-20 10:00:00+00',true),
  ('33000000-0000-4000-8000-000000000006','11111111-1111-4111-8111-111111111109','2c000000-0000-4000-8000-000000000004','Primeros meses liderando un equipo','primeros-meses-liderando-demo','Preguntas útiles para ordenar expectativas, acuerdos y aprendizaje al asumir un rol de liderazgo.',
   'Un nuevo rol de liderazgo no exige tener todas las respuestas, sino hacer explícito cómo se van a tomar las decisiones.

## Escuchá antes de reorganizar

Entender el propósito del equipo, sus acuerdos previos y las tensiones existentes evita cambios apresurados que generan más resistencia que resultado.

Las primeras conversaciones individuales suelen aportar más información que cualquier plan armado de antemano.

## Construí un ritmo de seguimiento explícito

Acordar cómo y cuándo se van a revisar prioridades, resultados y obstáculos da previsibilidad al equipo y reduce la ambigüedad del inicio.

Ese ritmo también ayuda a la persona que lidera a corregir el rumbo con información temprana, en lugar de esperar señales tardías.',
   '{liderazgo,equipos}',
   '{"Escuchá al equipo antes de proponer cambios.","Hacé explícito cómo se van a tomar las decisiones.","Construí un ritmo de seguimiento desde el principio."}',
   'PUBLISHED','Primeros meses como líder','Preguntas y acuerdos para iniciar un rol de liderazgo.', '2026-02-25 12:00:00+00','2026-02-25 10:00:00+00',true)
on conflict (id) do update set
  title = excluded.title, excerpt = excluded.excerpt, body = excluded.body,
  tags = excluded.tags, takeaways = excluded.takeaways,
  status = excluded.status, published_at = excluded.published_at,
  moderated_at = excluded.moderated_at, is_demo = true;

insert into public.institutions
  (id, slug, name, institution_type, summary, website_url, is_demo)
values
  ('44000000-0000-4000-8000-000000000001','instituto-horizonte-demo','Instituto Horizonte Demo','UNIVERSITY','Institución completamente ficticia creada para probar convenios educativos.',null,true),
  ('44000000-0000-4000-8000-000000000002','comunidad-puente-demo','Comunidad Puente Demo','COMMUNITY','Comunidad ficticia utilizada sólo para escenarios de demostración.',null,true)
on conflict (id) do update set name = excluded.name, summary = excluded.summary, is_demo = true;

insert into public.agreements
  (id, institution_id, slug, name, summary, terms_public, status,
   modality_notes, audience_summary, coverage_summary, benefits, eligibility, access_steps,
   discount_percent, quota_total, valid_from, valid_until,
   is_public, is_demo)
values
  ('45000000-0000-4000-8000-000000000001','44000000-0000-4000-8000-000000000001','orientacion-estudiantil-demo','Orientación estudiantil demo','Convenio ficticio para probar una propuesta de orientación destinada a estudiantes.','Condiciones ilustrativas sujetas a definición; no constituye una oferta real.','PUBLISHED',
   'Atención online y presencial según profesional.',
   'Estudiantes de grado y de los últimos años de secundario del instituto, en proceso de elegir o revisar una carrera.',
   'Atención remota en todo el país y encuentros presenciales en sede del instituto.',
   '{"Turnos de orientación con arancel reducido","Acceso prioritario a los cupos disponibles","Seguimiento durante todo el ciclo lectivo"}',
   '{"Formar parte de la comunidad educativa del instituto","Presentar la credencial o constancia institucional vigente","Aceptar los términos generales de Red Senda"}',
   '{"Solicitá el código de convenio en tu institución","Ingresá el código al contactar a un profesional adherido","Coordiná el primer encuentro dentro de los cupos disponibles"}',
   15,40,'2026-01-01','2026-12-31',true,true),
  ('45000000-0000-4000-8000-000000000002','44000000-0000-4000-8000-000000000002','transiciones-comunidad-demo','Transiciones para la comunidad demo','Convenio ficticio para probar acompañamiento en búsqueda y cambio profesional.','Condiciones de demostración sin validez comercial.','PUBLISHED',
   'Atención online.',
   'Personas asociadas a la comunidad que atraviesan una búsqueda laboral o un cambio de rumbo profesional.',
   'Atención remota para personas asociadas en cualquier ubicación.',
   '{"Arancel especial para personas asociadas","Prioridad en la asignación de cupos mensuales","Contenidos exclusivos sobre búsqueda laboral"}',
   '{"Acreditar membresía vigente en la comunidad","Completar el formulario de acceso institucional","Aceptar los términos generales de Red Senda"}',
   '{"Verificá tu membresía activa en la comunidad","Accedé al enlace institucional compartido por la comunidad","Elegí un profesional adherido y coordiná el primer contacto"}',
   10,60,'2026-01-01','2026-12-31',true,true)
on conflict (id) do update set
  name = excluded.name, summary = excluded.summary, status = excluded.status,
  modality_notes = excluded.modality_notes,
  audience_summary = excluded.audience_summary, coverage_summary = excluded.coverage_summary,
  benefits = excluded.benefits, eligibility = excluded.eligibility, access_steps = excluded.access_steps,
  is_public = excluded.is_public, is_demo = true;

insert into public.agreement_professionals
  (agreement_id, professional_profile_id, status)
values
  ('45000000-0000-4000-8000-000000000001','11111111-1111-4111-8111-111111111101','ACTIVE'),
  ('45000000-0000-4000-8000-000000000001','11111111-1111-4111-8111-111111111105','ACTIVE'),
  ('45000000-0000-4000-8000-000000000002','11111111-1111-4111-8111-111111111102','ACTIVE'),
  ('45000000-0000-4000-8000-000000000002','11111111-1111-4111-8111-111111111103','ACTIVE'),
  ('45000000-0000-4000-8000-000000000002','11111111-1111-4111-8111-111111111106','ACTIVE')
on conflict do nothing;

insert into public.agreement_services (agreement_id, service_id)
values
  ('45000000-0000-4000-8000-000000000001','23000000-0000-4000-8000-000000000001'),
  ('45000000-0000-4000-8000-000000000002','23000000-0000-4000-8000-000000000002'),
  ('45000000-0000-4000-8000-000000000002','23000000-0000-4000-8000-000000000003')
on conflict do nothing;

insert into public.reviews
  (id, professional_profile_id, reviewer_display_name, rating, title, body,
   status, moderated_at, is_demo)
values
  ('55000000-0000-4000-8000-000000000001','11111111-1111-4111-8111-111111111101','Persona demo A',5,'Más claridad para explorar','Reseña completamente ficticia: el proceso ayudó a ordenar preguntas y próximos pasos.','APPROVED','2026-03-01 12:00:00+00',true),
  ('55000000-0000-4000-8000-000000000002','11111111-1111-4111-8111-111111111102','Persona demo B',4,'Un plan concreto','Reseña ficticia de prueba: pude convertir ideas dispersas en acciones pequeñas.','APPROVED','2026-03-02 12:00:00+00',true),
  ('55000000-0000-4000-8000-000000000003','11111111-1111-4111-8111-111111111103','Persona demo C',5,'Búsqueda más enfocada','Reseña ficticia: mejoré el foco de mis postulaciones y la forma de presentar experiencia.','APPROVED','2026-03-03 12:00:00+00',true),
  ('55000000-0000-4000-8000-000000000004','11111111-1111-4111-8111-111111111104','Persona demo D',4,'Mapa útil de roles','Reseña ficticia: entendí mejor las diferencias entre roles antes de elegir formación.','APPROVED','2026-03-04 12:00:00+00',true),
  ('55000000-0000-4000-8000-000000000005','11111111-1111-4111-8111-111111111105','Persona demo E',5,'Exploración acompañada','Reseña ficticia de demostración: las actividades ayudaron a investigar alternativas.','APPROVED','2026-03-05 12:00:00+00',true),
  ('55000000-0000-4000-8000-000000000006','11111111-1111-4111-8111-111111111106','Persona demo F',4,'Cambio por etapas','Reseña ficticia: pude pensar la transición como etapas y no como un salto inmediato.','APPROVED','2026-03-06 12:00:00+00',true),
  ('55000000-0000-4000-8000-000000000007','11111111-1111-4111-8111-111111111107','Persona demo G',5,'Práctica muy útil','Reseña ficticia: practicar respuestas me permitió comunicar ejemplos con más claridad.','APPROVED','2026-03-07 12:00:00+00',true),
  ('55000000-0000-4000-8000-000000000008','11111111-1111-4111-8111-111111111109','Persona demo H',4,'Buenas preguntas','Reseña ficticia: las preguntas ayudaron a ordenar un desafío nuevo de liderazgo.','APPROVED','2026-03-08 12:00:00+00',true)
on conflict (id) do update set
  rating = excluded.rating, title = excluded.title, body = excluded.body,
  status = excluded.status, moderated_at = excluded.moderated_at, is_demo = true;

commit;
