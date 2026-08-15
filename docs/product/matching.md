# Matching y ranking explicables

## Estado actual

| Estado | Alcance |
| --- | --- |
| **Implementado** | `rank_professionals` para el directorio con filtros, límites, `rank-v1`, componentes, razones, boost máximo de 2 y desempate estable. UI de cuatro preguntas determinística, explicación no diagnóstica y analytics sin respuestas. |
| **Preparado** | `matching_questions`, `matching_options`, `matching_rules`, sesiones/respuestas/recomendaciones y RPC `explain_matching`. |
| **Pendiente** | Reemplazar preguntas/pesos hardcodeados de `MatchingFlow`, llamar `explain_matching`, persistir sólo lo consentido y calibrar reglas con especialistas/casos de prueba. |

La UI actual no consume todavía el modelo administrable: calcula dos tipos de acompañamiento en el navegador con reglas locales, cruza esos tipos/modalidad con perfiles ya cargados desde el repositorio público y mantiene las respuestas sólo en memoria hasta reiniciar o salir. Esta limitación es deliberada y visible; no debe describirse como matching dinámico o aprendido.

## Dos problemas, un mismo catálogo

1. **Matching guiado:** traduce respuestas humanas a uno o más tipos de acompañamiento posibles.
2. **Ranking del directorio:** ordena profesionales que cumplen filtros y elegibilidad.

En el contrato objetivo ambos comparten taxonomías y reglas versionadas. Hoy el ranking sí usa el catálogo de Supabase; el matching guiado tiene una equivalencia local de slugs hasta completar la integración. Ninguno produce un diagnóstico psicológico.

## Entradas

- situación/necesidades expresadas;
- intención: explorar, decidir, conseguir trabajo, cambiar rol/profesión/industria;
- preferencia por enfoque identitario o herramientas concretas;
- modalidad, ubicación, idioma, audiencia/etapa, industria;
- disponibilidad y rango de precio opcionales;
- filtros explícitos del directorio.

No inferir atributos sensibles no solicitados ni reutilizar respuestas para marketing sin consentimiento separado.

## Pipeline objetivo

1. Validar y normalizar respuestas contra IDs de taxonomía.
2. Aplicar **restricciones duras**: perfil publicable, servicio activo, modalidad/ubicación requerida y reglas del convenio.
3. Calcular compatibilidad base de 0 a 100.
4. Aplicar modificadores operativos/comerciales acotados.
5. Rotar empates para distribuir exposición.
6. Generar razones desde las reglas activadas, no con texto inventado.
7. Guardar versión, entradas consentidas y desglose para reproducibilidad.

## Score `rank-v1`

La relevancia cruda vale 0–100 y luego aporta hasta 78 puntos:

| Coincidencia | Peso crudo |
| --- | ---: |
| Necesidades | 40 |
| Tipo profesional + servicio + especialidad | 20 |
| Modalidad + ubicación | 15 |
| Audiencia + etapa de carrera | 10 |
| Idioma + industria | 8 |
| Presupuesto | 7 |

El total visible queda en 0–100:

| Componente | Máximo |
| --- | ---: |
| Relevancia normalizada | 78 |
| Disponibilidad | 6 |
| Verificación revisada | 5 |
| Completitud | 4 |
| Respuesta | 2,5 |
| Actividad | 1,5 |
| Plan | 2 |
| Rotación determinística | 1 |

El plan nunca rescata una incompatibilidad. La rotación se deriva de perfil + fecha + firma de búsqueda, por lo que es estable dentro de la ventana diaria. `is_sponsored` no altera el score: habilita un bloque rotulado de hasta tres perfiles compatibles; después continúa el orden orgánico.

Las reglas administrables del cuestionario pueden tener pesos positivos/negativos y restricciones duras y ya tienen soporte en `matching_rules`. **Pendiente:** retirar sus equivalentes locales de `MatchingFlow` cuando la UI consuma esa fuente. Un dato ausente se distingue de una falta de coincidencia.

Antes de producción se calibran pesos con casos de prueba y revisión de especialistas. No se presentan porcentajes de precisión no validados.

## Explicación al usuario

Formato recomendado:

> Por lo que nos contás, estos tipos de acompañamiento podrían resultarte útiles.

Cada recomendación muestra dos o tres razones concretas, por ejemplo: “acompaña reinvenciones”, “trabaja online” y “tiene experiencia en transición tecnológica”. También permite cambiar filtros o explorar otra categoría.

Nunca usar: “necesitás un psicólogo”, “tu vocación es…”, “esta es la mejor carrera” o cualquier certeza clínica/profesional injustificada.

## Elegibilidad y confianza

- Sólo perfiles `PUBLISHED` y elegibles entran en resultados públicos. La verificación puede ser requisito duro según el tipo profesional/regla aplicable.
- El badge se muestra únicamente con `verification_state = VERIFIED` y refleja una revisión real conforme a `VerificationRule`.
- Las reseñas cuentan sólo si están `APPROVED`; no reemplazan relevancia.
- Un perfil suspendido o que no acepta leads se excluye. El estado de plan no es hoy una restricción de elegibilidad: sólo puede aportar el boost acotado de una señal administrada.
- Precio y disponibilidad desactualizados reducen confianza; deben mostrar fecha o condición.

## Fairness

- **Implementado:** boost de plan máximo 2, hasta tres patrocinados compatibles, rótulo visible y rotación determinística diaria por perfil/contexto.
- **Preparado:** `ranking_version`, desglose y señales separadas permiten explicar/comparar cambios.
- **Pendiente:** límite de frecuencia longitudinal, métricas por necesidad/ubicación, auditoría de concentración/CTR/conversión por posición-plan y comparación offline antes de cambiar pesos.

## Persistencia preparada

`matching_questions`, `matching_options` y `matching_rules` definen el cuestionario y sus razones/pesos por `rule_version`. `matching_sessions` puede guardar usuario opcional, versión, timestamps y resumen. `matching_answers` admite opciones/valores acotados; `matching_recommendations` conserva rank, score, explicación y `ranking_version`. Estas tablas y `explain_matching` están **preparadas**, pero el flujo actual no las escribe ni las consulta.

Cuando se habilite persistencia, una sesión anónima se acreditará con un token opaco cuyo hash vive en `private.matching_session_tokens`; nunca se persiste el token en claro. La explicación puede ser JSONB pequeño/versionado, pero las taxonomías siguen normalizadas.

La retención de respuestas se define por privacidad. La expiración inicial de una sesión es 24 horas y debe limpiarse operativamente cuando venza.

## IA futura

Una capa de IA puede clasificar texto, resumir o redactar explicaciones, pero no decide elegibilidad ni credenciales. Debe devolver IDs del catálogo, citar señales usadas, admitir “no sé” y pasar validación determinística. No se envían PII o respuestas sensibles a un proveedor sin base legal, contrato y consentimiento adecuados.

## Eventos y pruebas

Eventos implementados de allowlist: `matching_started` y `matching_completed`; el segundo sólo envía `steps_completed`. Agregar eventos de respuesta/selección exige una migración de la allowlist y revisión de privacidad; no se envían respuestas como propiedades analíticas.

Casos mínimos pendientes para la integración dinámica:

- misma entrada + misma versión → mismo desglose;
- restricciones duras nunca son superadas por plan;
- falta de una respuesta opcional no inventa preferencia;
- explicación coincide con señales reales;
- perfiles suspendidos y perfiles regulados sin verificación vigente no aparecen;
- empates rotan sin concentrar exposición;
- lenguaje de salida respeta guardrails no diagnósticos.
