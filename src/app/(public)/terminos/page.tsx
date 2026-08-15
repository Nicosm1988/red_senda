import type { Metadata } from "next";

import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Términos de uso | Red Senda",
  description: "Condiciones de uso de la plataforma Red Senda.",
};

export default function TermsPage() {
  return (
    <section className="bg-paper py-16 sm:py-24">
      <Container className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-senda">Versión agosto de 2026</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl">Términos de uso</h1>
        <div className="mt-10 space-y-8 text-base leading-8 text-muted">
          <section><h2 className="text-xl font-semibold text-ink">Qué ofrece Red Senda</h2><p className="mt-2">Red Senda facilita el descubrimiento y contacto con profesionales de orientación, carrera, empleabilidad y mentoring. No presta esos servicios ni garantiza un resultado profesional, laboral, educativo o de salud.</p></section>
          <section><h2 className="text-xl font-semibold text-ink">Perfiles y verificación</h2><p className="mt-2">Los profesionales son responsables por la exactitud y vigencia de su información. La insignia de verificación indica que Red Senda revisó la documentación definida para esa categoría; no reemplaza la evaluación personal ni constituye una recomendación absoluta.</p></section>
          <section><h2 className="text-xl font-semibold text-ink">Uso responsable</h2><p className="mt-2">No está permitido suplantar identidades, cargar contenido ilegal, acosar, extraer datos en forma automatizada ni interferir con la seguridad de la plataforma. Podemos moderar, suspender o retirar contenido ante incumplimientos.</p></section>
          <section><h2 className="text-xl font-semibold text-ink">Consultas y pagos</h2><p className="mt-2">Enviar una consulta no crea por sí solo una relación profesional. Las condiciones de cada servicio se acuerdan con el profesional. Ninguna suscripción queda activa ni se cobra mientras el flujo de pago figure como pendiente de configuración.</p></section>
          <section><h2 className="text-xl font-semibold text-ink">Cambios</h2><p className="mt-2">Si estos términos cambian de forma sustancial, informaremos la nueva versión y solicitaremos una nueva aceptación cuando corresponda.</p></section>
        </div>
      </Container>
    </section>
  );
}
