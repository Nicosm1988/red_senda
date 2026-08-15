# Visión de producto

## Estado del vertical

| Estado | Alcance |
| --- | --- |
| **Implementado** | Recorrido directorio → perfil → lead; alta profesional → credencial privada → revisión admin → publicación; dashboard básico. |
| **Preparado** | Matching administrable, planes/suscripciones, artículos, convenios y proveedores externos. |
| **Pendiente** | Entrega real de email, precios/cobro, matching dinámico, contenido/convenios productivos y expansión de consolas. |

## Norte

> Red Senda es la red de profesionales para acompañar trayectorias, decisiones y transiciones profesionales.

La oportunidad no es crear otro directorio por profesión. Es ordenar una demanda fragmentada y ayudar a que alguien que expresa “mi profesión ya no me representa” llegue a un acompañamiento pertinente sin conocer previamente la disciplina correcta.

## Problema

- Las necesidades mezclan identidad, educación, carrera, empleabilidad e industria.
- La oferta está distribuida entre psicología, orientación, coaching, recruiting, consultoría y mentoring.
- Los títulos profesionales no explican bien qué situación puede acompañar cada persona.
- Comparar credenciales, modalidad, enfoque, precio y disponibilidad requiere confianza.
- Profesionales valiosos carecen de visibilidad, posicionamiento y demanda predecible.

## Públicos y propuesta de valor

| Público | Necesidad | Valor de Red Senda |
| --- | --- | --- |
| Persona (B2C) | Entender opciones y encontrar ayuda confiable | Búsqueda por situación, explicación, comparación y contacto gratuito. |
| Profesional (B2P) | Captar demanda y construir autoridad | Perfil, visibilidad, leads, verificación, contenido, analítica y red. |
| Institución (B2B) | Ofrecer acompañamiento a una comunidad | Convenios configurables, oferta curada y métricas agregadas. |

## Experiencia central

1. La persona nombra su situación o explora necesidades.
2. Puede filtrar directamente o completar un matching breve.
3. Entiende qué tipos de acompañamiento podrían servirle y por qué.
4. Compara perfiles públicos verificables y patrocinio claramente rotulado.
5. Envía un contacto con los datos mínimos.
6. El profesional gestiona el lead en su dashboard; recibir un email real depende de Resend configurado y verificado. La relación continúa fuera de la plataforma en el MVP.

## Principios de producto

- **Situación antes que profesión.** La taxonomía parte del lenguaje de la persona.
- **Orientar sin diagnosticar.** Las respuestas son posibilidades, no conclusiones clínicas.
- **Confianza demostrable.** “Verificado” exige revisión humana según reglas de cada tipo profesional.
- **Calidad antes que volumen.** No crear páginas SEO, perfiles ni contenidos pobres para inflar inventario.
- **Oferta comparable, no uniforme.** Credenciales y criterios varían por disciplina.
- **Transparencia comercial.** El pago no reemplaza la relevancia.
- **Humano y adulto.** Sin promesas de éxito, pasión o transformación garantizada.

## Relación SENDA / Red Senda

SENDA es un servicio boutique, de mayor intervención y metodología propia. Red Senda es una plataforma escalable de profesionales independientes. La firma “Una iniciativa de Senda” y cualquier navegación cruzada deben poder cambiarse por configuración; no se asume una arquitectura de marca definitiva.

## Vertical MVP

El MVP termina un circuito real, no cincuenta módulos decorativos:

- home, directorio Supabase, filtros, perfil y lead persistido con notificación en outbox;
- matching determinístico local con explicación; modelo administrable preparado;
- registro, onboarding, credenciales, revisión y dashboard profesional;
- roles y administración básica;
- planes `DRAFT` y selección `PENDING_PAYMENT`, sin cobro;
- contenidos y convenios demo rotulados, con esquemas preparados;
- SEO, analítica, datos demo, seguridad y tests críticos.

La comunidad profesional, derivaciones, IA y dashboards institucionales avanzados son extensiones posteriores.

## Métricas

**North star:** contactos válidos enviados a profesionales compatibles.

Métricas de diagnóstico:

- visita → búsqueda y búsqueda → perfil;
- perfil → inicio de contacto → lead válido;
- matching iniciado → completado → perfil/contacto;
- profesional iniciado → perfil enviado → verificado;
- tasa de respuesta, spam y lead calificado;
- activación B2P, MRR, ARPU, churn y LTV;
- cobertura de oferta por necesidad, modalidad y ubicación;
- diversidad de exposición y concentración del ranking.

La conversión final fuera de plataforma sólo se mide con consentimiento y señales confiables; no se inventa.

## Guardrails

- No diagnóstico, consejo clínico ni decisión de carrera presentada como verdad.
- No exposición pública de documentación, domicilio, teléfono privado o identificadores innecesarios.
- No garantía de leads, empleo, resultados ni ingresos.
- No reseñas auto-publicadas ni verificación automática por completar un formulario.
- Textos legales y de privacidad son borradores hasta revisión profesional.
