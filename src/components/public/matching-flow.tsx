"use client";

import Link from "next/link";
import { useState } from "react";
import { trackAnalytics } from "@/lib/analytics/client";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";

export type MatchingProfessional = {
  slug: string;
  name: string;
  initials: string;
  role: string;
  headline: string;
  professionalType: string;
  needs: string[];
  modalities: string[];
  verified: boolean;
};

type Answers = {
  situation: string;
  intention: string;
  kind: string;
  modality: string;
};

const initialAnswers: Answers = { situation: "", intention: "", kind: "", modality: "" };

const questions = [
  {
    key: "situation" as const,
    eyebrow: "Tu momento",
    title: "¿Qué situación se parece más a la que estás atravesando?",
    help: "No hace falta que encaje perfecto. Elegí el punto de partida más cercano.",
    options: [
      ["elegir-estudios", "Estoy eligiendo qué estudiar", "Quiero explorar intereses, posibilidades y criterios de decisión."],
      ["reinvencion", "Mi profesión ya no me representa", "Necesito pensar un cambio más profundo de rumbo."],
      ["cambio-trabajo", "Quiero cambiar o volver a trabajar", "Necesito ordenar mi búsqueda y moverme hacia otra oportunidad."],
      ["transicion-digital", "Quiero pasar a un rol o industria nueva", "Busco entender alternativas y capacidades transferibles."],
      ["desarrollo", "Quiero crecer donde estoy", "Tengo un desafío de desarrollo, liderazgo o posicionamiento."],
    ],
  },
  {
    key: "intention" as const,
    eyebrow: "El movimiento",
    title: "¿En qué punto estás hoy?",
    help: "Esto nos ayuda a distinguir exploración de acción inmediata.",
    options: [
      ["explorar", "Necesito explorar", "Todavía no tengo una decisión tomada y quiero abrir posibilidades."],
      ["decidir", "Necesito decidir", "Tengo algunas alternativas y quiero compararlas con criterio."],
      ["actuar", "Necesito actuar ahora", "Ya sé bastante qué quiero y necesito herramientas o un plan."],
    ],
  },
  {
    key: "kind" as const,
    eyebrow: "Tipo de conversación",
    title: "¿Qué te resultaría más útil trabajar primero?",
    help: "No estás eligiendo una profesión: sólo el tipo de ayuda que hoy imaginás.",
    options: [
      ["sentido", "Deseo, identidad y sentido", "Quiero comprender mejor qué me pasa antes de resolver."],
      ["estrategia", "Claridad y estrategia", "Quiero ordenar opciones y convertirlas en una hoja de ruta."],
      ["herramientas", "Herramientas concretas", "Quiero mejorar materiales, entrevistas o acciones específicas."],
      ["experiencia", "Una mirada de experiencia", "Quiero conversar con alguien que conozca ese rol o industria."],
      ["no-se", "Todavía no lo sé", "Prefiero que la orientación contemple más de una forma de acompañar."],
    ],
  },
  {
    key: "modality" as const,
    eyebrow: "Preferencia práctica",
    title: "¿Qué modalidad podrías sostener mejor?",
    help: "Podés cambiar este criterio después en el buscador.",
    options: [
      ["online", "Online", "Quiero tener opciones sin depender de la ubicación."],
      ["presencial", "Presencial", "Valoro compartir un espacio físico cuando sea posible."],
      ["indistinto", "Me resulta indistinto", "Prefiero priorizar el encaje profesional."],
    ],
  },
] as const;

const situationLabels: Record<string, string> = {
  "elegir-estudios": "elegir qué estudiar",
  reinvencion: "repensar tu rumbo profesional",
  "cambio-trabajo": "cambiar o volver al trabajo",
  "transicion-digital": "explorar una transición de industria",
  desarrollo: "crecer profesionalmente",
};

type MatchType = "orientacion" | "psicologia" | "coaching" | "empleabilidad" | "mentoring";

const typeLabels: Record<MatchType, string> = {
  orientacion: "orientación vocacional y de trayectoria",
  psicologia: "psicología laboral",
  coaching: "coaching de carrera",
  empleabilidad: "empleabilidad",
  mentoring: "mentoría",
};

function recommendations(answers: Answers) {
  const scores: Record<MatchType, number> = {
    orientacion: 0,
    psicologia: 0,
    coaching: 0,
    empleabilidad: 0,
    mentoring: 0,
  };

  if (answers.situation === "elegir-estudios") scores.orientacion += 6;
  if (answers.situation === "reinvencion") {
    scores.orientacion += 3;
    scores.psicologia += 4;
    scores.coaching += 3;
  }
  if (answers.situation === "cambio-trabajo") {
    scores.empleabilidad += 5;
    scores.coaching += 3;
  }
  if (answers.situation === "transicion-digital") {
    scores.mentoring += 5;
    scores.coaching += 2;
  }
  if (answers.situation === "desarrollo") {
    scores.coaching += 4;
    scores.mentoring += 4;
  }

  if (answers.intention === "explorar") {
    scores.orientacion += 2;
    scores.psicologia += 1;
  }
  if (answers.intention === "decidir") scores.coaching += 2;
  if (answers.intention === "actuar") {
    scores.empleabilidad += 2;
    scores.mentoring += 1;
  }

  if (answers.kind === "sentido") {
    scores.psicologia += 4;
    scores.orientacion += 2;
  }
  if (answers.kind === "estrategia") scores.coaching += 4;
  if (answers.kind === "herramientas") scores.empleabilidad += 4;
  if (answers.kind === "experiencia") scores.mentoring += 4;
  if (answers.kind === "no-se") {
    scores.orientacion += 1;
    scores.coaching += 1;
    scores.psicologia += 1;
  }

  return (Object.entries(scores) as Array<[MatchType, number]>)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .slice(0, 2)
    .map(([type, score]) => ({ type, score }));
}

function MatchingResult({
  answers,
  professionals,
  onRestart,
}: {
  answers: Answers;
  professionals: MatchingProfessional[];
  onRestart: () => void;
}) {
  const recommendedTypes = recommendations(answers);
  const primaryRecommendation = recommendedTypes[0] ?? { type: "orientacion" as const, score: 0 };
  const secondaryRecommendation = recommendedTypes[1] ?? { type: "coaching" as const, score: 0 };
  const typeSet = new Set<string>(recommendedTypes.map(({ type }) => type));
  const typeMatches = professionals.filter((professional) => typeSet.has(professional.professionalType));
  const modalityMatches = typeMatches.filter(
    (professional) => answers.modality === "indistinto" || professional.modalities.includes(answers.modality),
  );
  const hasExactModalityMatches = modalityMatches.length > 0;
  const matches = (hasExactModalityMatches ? modalityMatches : typeMatches)
    .sort((a, b) => {
      const aScore = recommendedTypes.find(({ type }) => type === a.professionalType)?.score ?? 0;
      const bScore = recommendedTypes.find(({ type }) => type === b.professionalType)?.score ?? 0;
      return bScore - aScore || Number(b.verified) - Number(a.verified);
    })
    .slice(0, 3);

  const query = new URLSearchParams();
  query.set("need", answers.situation);
  if (answers.modality !== "indistinto") query.set("modality", answers.modality);
  recommendedTypes.forEach(({ type }) => query.append("type", type));
  query.set("sort", "match");

  return (
    <div aria-live="polite" className="overflow-hidden rounded-[1.75rem] border border-line bg-paper">
      <div className="bg-ink px-6 py-8 text-white sm:px-10 sm:py-10">
        <Badge tone="clay">Orientación completada</Badge>
        <h2 className="mt-5 max-w-3xl font-display text-3xl font-semibold leading-tight tracking-[-0.035em] text-balance sm:text-4xl">
          Podrían resultarte útiles {typeLabels[primaryRecommendation.type]} y {typeLabels[secondaryRecommendation.type]}.
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-6 text-white/72 sm:text-base">
          Esta orientación no es un diagnóstico. Es una primera hipótesis para ayudarte a conversar con personas que acompañan {situationLabels[answers.situation]}.
        </p>
      </div>

      <div className="p-6 sm:p-10">
        <section aria-labelledby="why-this-result">
          <h3 id="why-this-result" className="font-display text-2xl font-semibold tracking-[-0.025em] text-ink">
            Cómo llegamos a esta sugerencia
          </h3>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted md:grid-cols-3">
            <li className="rounded-2xl bg-canvas p-4">
              <strong className="block text-ink">Tu situación</strong>
              Querés {situationLabels[answers.situation]}.
            </li>
            <li className="rounded-2xl bg-canvas p-4">
              <strong className="block text-ink">Tu momento</strong>
              {answers.intention === "explorar" ? "Necesitás abrir posibilidades antes de decidir." : answers.intention === "decidir" ? "Ya tenés alternativas y buscás criterio." : "Priorizás un movimiento concreto y cercano."}
            </li>
            <li className="rounded-2xl bg-canvas p-4">
              <strong className="block text-ink">Tu preferencia</strong>
              {answers.kind === "no-se" ? "Dejaste abierto el tipo de conversación." : `Elegiste trabajar primero sobre ${answers.kind}.`}
            </li>
          </ul>
        </section>

        <section aria-labelledby="compatible-professionals" className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-senda-dark">Primeras coincidencias</p>
              <h3 id="compatible-professionals" className="mt-2 font-display text-2xl font-semibold tracking-[-0.025em] text-ink">
                Perfiles para empezar a comparar
              </h3>
            </div>
            <Link href={`/profesionales?${query.toString()}`} className={buttonStyles({ variant: "secondary", size: "sm" })}>
              Ver todos los resultados
            </Link>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {matches.map((professional, index) => (
              <article key={professional.slug} className="rounded-[1.25rem] border border-line p-5">
                <div className="flex items-center gap-3">
                  <Avatar initials={professional.initials} size="md" toneIndex={index} />
                  <div>
                    <h4 className="font-display text-xl font-semibold tracking-[-0.025em] text-ink">{professional.name}</h4>
                    <p className="mt-0.5 text-xs font-semibold text-senda-dark">{professional.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">{professional.headline}</p>
                <Link className={`${buttonStyles({ variant: "secondary", size: "sm" })} mt-5 w-full`} href={`/profesionales/${professional.slug}`}>
                  Conocer su perfil
                </Link>
              </article>
            ))}
          </div>
          {!hasExactModalityMatches ? (
            <p className="mt-4 rounded-xl bg-canvas px-4 py-3 text-xs leading-5 text-muted">
              No encontramos una coincidencia exacta con la modalidad elegida. Mostramos perfiles por tipo de acompañamiento para que puedas explorar alternativas.
            </p>
          ) : null}
        </section>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-line pt-6">
          <Link href={`/profesionales?${query.toString()}`} className={buttonStyles()}>
            Explorar coincidencias
          </Link>
          <Button variant="quiet" onClick={onRestart}>
            Volver a empezar
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MatchingFlow({ professionals }: { professionals: MatchingProfessional[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const completed = step >= questions.length;
  const progressClass = ["w-1/4", "w-1/2", "w-3/4", "w-full"][step] ?? "w-1/4";

  if (completed) {
    return (
      <MatchingResult
        answers={answers}
        professionals={professionals}
        onRestart={() => {
          setAnswers(initialAnswers);
          setStep(0);
        }}
      />
    );
  }

  const question = questions[step] ?? questions[0];
  const selected = answers[question.key];

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-line bg-paper">
      <div className="border-b border-line bg-canvas px-6 py-5 sm:px-9">
        <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.1em] text-muted">
          <span>Paso {step + 1} de {questions.length}</span>
          <span>{question.eyebrow}</span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div className={`h-full rounded-full bg-senda transition-[width] duration-300 motion-reduce:transition-none ${progressClass}`} />
        </div>
      </div>

      <form
        className="p-6 sm:p-9"
        onSubmit={(event) => {
          event.preventDefault();
          if (selected) {
            if (step === 0) trackAnalytics("matching_started");
            if (step === questions.length - 1) {
              trackAnalytics("matching_completed", {
                properties: { steps_completed: questions.length },
              });
            }
            setStep((current) => current + 1);
          }
        }}
      >
        <fieldset>
          <legend className="max-w-3xl font-display text-3xl font-semibold leading-tight tracking-[-0.035em] text-ink text-balance sm:text-4xl">
            {question.title}
          </legend>
          <p className="mt-4 text-sm leading-6 text-muted">{question.help}</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {question.options.map(([value, label, description]) => (
              <label
                key={value}
                className={`cursor-pointer rounded-[1.25rem] border p-5 transition-colors focus-within:ring-3 focus-within:ring-senda/25 motion-reduce:transition-none ${
                  selected === value ? "border-senda bg-senda-soft" : "border-line bg-paper hover:border-senda/45 hover:bg-canvas"
                }`}
              >
                <span className="flex items-start gap-3">
                  <input
                    type="radio"
                    name={question.key}
                    value={value}
                    checked={selected === value}
                    onChange={() => setAnswers((current) => ({ ...current, [question.key]: value }))}
                    className="mt-1 size-4 shrink-0 accent-senda focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/35"
                  />
                  <span>
                    <strong className="block font-semibold text-ink">{label}</strong>
                    <span className="mt-1 block text-sm leading-5 text-muted">{description}</span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
          {step > 0 ? (
            <Button variant="quiet" onClick={() => setStep((current) => current - 1)}>
              ← Anterior
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" disabled={!selected}>
            {step === questions.length - 1 ? "Ver orientación" : "Continuar →"}
          </Button>
        </div>
      </form>
    </div>
  );
}
