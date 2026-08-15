"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  languageOptions,
  locationOptions,
  modalityOptions,
  needOptions,
  professionalTypeOptions,
  sortOptions,
  type ProfessionalFilters,
} from "@/lib/demo/public-data";
import { trackAnalytics } from "@/lib/analytics/client";

type Option = { value: string; label: string };

function ChoiceGroup({
  legend,
  name,
  options,
  selected = [],
}: {
  legend: string;
  name: string;
  options: readonly Option[];
  selected?: string[];
}) {
  return (
    <fieldset className="border-t border-line py-5 first:border-t-0 first:pt-0">
      <legend className="mb-3 text-xs font-bold uppercase tracking-[0.09em] text-ink">{legend}</legend>
      <div className="space-y-2.5">
        {options.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-muted">
            <input
              className="mt-0.5 size-4 shrink-0 rounded border-line-strong accent-senda focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/35"
              type="checkbox"
              name={name}
              value={option.value}
              defaultChecked={selected.includes(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function FilterFields({ selected }: { selected: ProfessionalFilters }) {
  return (
    <>
      <div className="pb-5">
        <label htmlFor="professional-search" className="text-xs font-bold uppercase tracking-[0.09em] text-ink">
          Buscar por palabra
        </label>
        <input
          id="professional-search"
          name="q"
          type="search"
          defaultValue={selected.q}
          placeholder="Ej.: orientación, tecnología…"
          className="mt-3 min-h-11 w-full rounded-xl border border-line-strong bg-paper px-3.5 text-sm text-ink placeholder:text-muted/70 focus-visible:border-senda focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/20"
        />
      </div>
      <div className="border-t border-line py-5">
        <label htmlFor="sort" className="text-xs font-bold uppercase tracking-[0.09em] text-ink">
          Ordenar por
        </label>
        <select
          id="sort"
          name="sort"
          defaultValue={selected.sort ?? "relevance"}
          className="mt-3 min-h-11 w-full rounded-xl border border-line-strong bg-paper px-3 text-sm text-ink focus-visible:border-senda focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/20"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <ChoiceGroup legend="Qué estás atravesando" name="need" options={needOptions} selected={selected.need} />
      <ChoiceGroup legend="Tipo de profesional" name="type" options={professionalTypeOptions} selected={selected.type} />
      <ChoiceGroup legend="Modalidad" name="modality" options={modalityOptions} selected={selected.modality} />
      <ChoiceGroup legend="Ubicación" name="location" options={locationOptions} selected={selected.location} />
      <ChoiceGroup legend="Idioma" name="language" options={languageOptions} selected={selected.language} />
      <fieldset className="border-t border-line py-5">
        <legend className="mb-3 text-xs font-bold uppercase tracking-[0.09em] text-ink">Valor orientativo</legend>
        <div className="space-y-2.5">
          {[
            ["", "Cualquier valor"],
            ["hasta-35000", "Hasta $35.000 ARS"],
            ["35000-45000", "$35.000 a $45.000 ARS"],
            ["premium", "Más de $45.000 o USD"],
          ].map(([value, label]) => (
            <label key={value || "any"} className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-muted">
              <input
                className="mt-0.5 size-4 shrink-0 accent-senda focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/35"
                type="radio"
                name="price"
                value={value}
                defaultChecked={(selected.price ?? "") === value}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex cursor-pointer items-start gap-3 border-t border-line py-5 text-sm leading-5 text-muted">
        <input
          className="mt-0.5 size-4 shrink-0 rounded accent-senda focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/35"
          type="checkbox"
          name="verified"
          value="true"
          defaultChecked={selected.verified}
        />
        <span>
          <strong className="block font-semibold text-ink">Sólo perfiles verificados</strong>
          Credenciales revisadas según el tipo profesional.
        </span>
      </label>
      <div className="flex gap-2 border-t border-line pt-5">
        <Button className="flex-1" type="submit">
          Aplicar filtros
        </Button>
        <Link href="/profesionales" className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-senda/35">
          Limpiar
        </Link>
      </div>
    </>
  );
}

export function ProfessionalFiltersForm({ selected, activeCount }: { selected: ProfessionalFilters; activeCount: number }) {
  function trackFilterSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    trackAnalytics("filter_applied", { properties: { active_count: activeCount } });
    if (String(formData.get("q") ?? "").trim()) {
      trackAnalytics("search_started");
    }
  }

  return (
    <>
      <form action="/profesionales" method="get" onSubmit={trackFilterSubmit} className="hidden rounded-[1.5rem] border border-line bg-paper p-5 lg:block">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-ink">Afinar búsqueda</h2>
          {activeCount > 0 ? <span className="rounded-full bg-senda-soft px-2.5 py-1 text-xs font-bold text-senda-dark">{activeCount} activos</span> : null}
        </div>
        <FilterFields selected={selected} />
      </form>
      <details className="filter-panel rounded-[1.25rem] border border-line bg-paper lg:hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between px-5 font-semibold text-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-senda/35">
          <span>Filtros y orden</span>
          <span className="text-xs text-senda-dark">{activeCount > 0 ? `${activeCount} activos` : "Abrir"}</span>
        </summary>
        <form action="/profesionales" method="get" onSubmit={trackFilterSubmit} className="border-t border-line p-5">
          <FilterFields selected={selected} />
        </form>
      </details>
    </>
  );
}
