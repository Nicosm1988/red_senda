export type Modality = "online" | "presencial";

export type Professional = {
  id: string;
  slug: string;
  name: string;
  initials: string;
  role: string;
  credential: string;
  headline: string;
  about: string;
  needs: string[];
  contactNeeds?: Array<{ id: string; label: string }>;
  professionalType: string;
  specialties: string[];
  modalities: Modality[];
  city: string;
  province: string;
  country: string;
  languages: string[];
  audiences: string[];
  careerStages: string[];
  industries: string[];
  serviceTypes: string[];
  agreementSlugs: string[];
  verified: boolean;
  featured: boolean;
  yearsExperience: number;
  isDemo?: boolean;
  acceptingLeads?: boolean;
  availabilityOrder: number;
  availabilityLabel: string;
  rating: number;
  reviewCount: number;
  workingStyle: string[];
  experience: Array<{ role: string; organization: string; period: string }>;
  education: Array<{ title: string; institution: string }>;
  credentials: string[];
  testimonials: Array<{ quote: string; author: string; context: string }>;
};

export type ResourceArticle = {
  slug: string;
  title: string;
  eyebrow: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  author: string;
  authorRole: string;
  professionalSlug?: string;
  lead: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
  takeaways: string[];
  isDemo?: boolean;
};

export type Agreement = {
  slug: string;
  institution: string;
  institutionInitials: string;
  kind: string;
  title: string;
  excerpt: string;
  audience: string;
  coverage: string;
  modalities: string[];
  services: string[];
  benefits: string[];
  eligibility: string[];
  access: string[];
  validity: string;
  professionalCount: number;
  isDemo?: boolean;
};

export type Plan = {
  slug: string;
  name: string;
  description: string;
  monthlyPrice: number | null;
  currency: "ARS";
  featured?: boolean;
  badge?: string;
  features: string[];
  cta: string;
};

export type ProfessionalFilters = {
  q?: string;
  need?: string[];
  type?: string[];
  modality?: string[];
  location?: string[];
  language?: string[];
  verified?: boolean;
  sort?: string;
};

export const needOptions = [
  { value: "elegir-estudios", label: "Elegir qué estudiar" },
  { value: "reinvencion", label: "Reinventarme profesionalmente" },
  { value: "cambio-trabajo", label: "Cambiar o encontrar trabajo" },
  { value: "transicion-digital", label: "Pasar a roles digitales" },
  { value: "posicionamiento", label: "Mejorar mi posicionamiento" },
  { value: "entrevistas", label: "Preparar entrevistas" },
  { value: "desarrollo", label: "Crecer en mi carrera" },
  { value: "cambio-industria", label: "Cambiar de industria" },
] as const;

export const professionalTypeOptions = [
  { value: "psicologia", label: "Psicólogo/a" },
  { value: "psicopedagogia", label: "Psicopedagogo/a" },
] as const;

export const modalityOptions = [
  { value: "online", label: "Online" },
  { value: "presencial", label: "Presencial" },
] as const;

export const locationOptions = [
  { value: "caba", label: "Ciudad de Buenos Aires" },
  { value: "cordoba", label: "Córdoba" },
  { value: "mendoza", label: "Mendoza" },
  { value: "rosario", label: "Rosario" },
] as const;

export const languageOptions = [
  { value: "espanol", label: "Español" },
  { value: "ingles", label: "Inglés" },
  { value: "portugues", label: "Portugués" },
] as const;

export const sortOptions = [
  { value: "relevance", label: "Relevancia" },
  { value: "match", label: "Mejor coincidencia" },
  { value: "recommended", label: "Recomendados" },
  { value: "availability", label: "Disponibilidad" },
  { value: "featured", label: "Destacados" },
] as const;

const professionals: Professional[] = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    slug: "valentina-acosta",
    name: "Valentina Acosta",
    initials: "VA",
    role: "Psicóloga · Orientadora vocacional",
    credential: "M.P. 48.271 · CABA",
    headline: "Para elegir sin apurarte y convertir la incertidumbre en una exploración posible.",
    about:
      "Acompaño a jóvenes y personas adultas que necesitan volver a mirar sus intereses, capacidades y contexto antes de decidir. Mi trabajo no parte de un test que define respuestas: construimos criterios propios, abrimos alternativas y diseñamos pequeños pasos para probarlas en la realidad.",
    needs: ["elegir-estudios", "reinvencion"],
    professionalType: "psicologia",
    specialties: ["Orientación vocacional", "Reorientación", "Diseño de trayectoria"],
    modalities: ["online", "presencial"],
    city: "Ciudad de Buenos Aires",
    province: "caba",
    country: "Argentina",
    languages: ["espanol", "ingles"],
    audiences: ["Jóvenes", "Personas adultas"],
    careerStages: ["Primeras elecciones", "Reinvención"],
    industries: ["Educación", "Servicios profesionales"],
    serviceTypes: ["Proceso individual", "Consulta de orientación"],
    agreementSlugs: ["comunidad-universitaria-del-rio"],
    verified: true,
    featured: true,
    yearsExperience: 12,
    availabilityOrder: 2,
    availabilityLabel: "Próximo espacio: jueves",
    rating: 4.9,
    reviewCount: 28,
    workingStyle: [
      "Primera conversación para ordenar la pregunta y acordar objetivos.",
      "Exploración guiada con ejercicios narrativos, información y experiencias breves.",
      "Cierre con criterios de decisión y una hoja de ruta concreta.",
    ],
    experience: [
      { role: "Orientadora vocacional", organization: "Práctica independiente", period: "2014 — actualidad" },
      { role: "Coordinadora de orientación", organization: "Programa Puentes", period: "2018 — 2023" },
    ],
    education: [
      { title: "Licenciatura en Psicología", institution: "Universidad de Buenos Aires" },
      { title: "Posgrado en Orientación Vocacional y Ocupacional", institution: "Universidad Nacional de Tres de Febrero" },
    ],
    credentials: ["Matrícula profesional revisada", "Formación de posgrado validada"],
    testimonials: [
      {
        quote: "Me ayudó a dejar de buscar la opción perfecta y a construir una decisión que sí se sentía mía.",
        author: "Marina, 24",
        context: "Proceso de reorientación",
      },
    ],
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    slug: "lucas-ibarra",
    name: "Lucas Ibarra",
    initials: "LI",
    role: "Coach de carrera",
    credential: "Certificación profesional revisada",
    headline: "Claridad para traducir experiencia, elegir el próximo paso y sostener el cambio.",
    about:
      "Trabajo con personas que llegaron a un punto de quiebre o crecimiento y necesitan recuperar perspectiva. Combinamos conversación estratégica, experimentos de carrera y un plan semanal realista para mover la situación sin negar las dudas.",
    needs: ["reinvencion", "cambio-trabajo", "desarrollo"],
    professionalType: "coaching",
    specialties: ["Cambio de carrera", "Desarrollo profesional", "Plan de transición"],
    modalities: ["online"],
    city: "Córdoba",
    province: "cordoba",
    country: "Argentina",
    languages: ["espanol"],
    audiences: ["Profesionales", "Líderes"],
    careerStages: ["Mitad de carrera", "Liderazgo"],
    industries: ["Tecnología", "Servicios", "Consumo masivo"],
    serviceTypes: ["Proceso individual", "Sesión estratégica"],
    agreementSlugs: ["alianza-talento-norte"],
    verified: true,
    featured: false,
    yearsExperience: 9,
    availabilityOrder: 1,
    availabilityLabel: "Próximo espacio: martes",
    rating: 4.8,
    reviewCount: 19,
    workingStyle: [
      "Definimos qué cambio querés producir y qué no querés perder en el camino.",
      "Mapeamos activos de carrera, hipótesis y conversaciones necesarias.",
      "Trabajamos con ciclos cortos de acción, revisión y aprendizaje.",
    ],
    experience: [
      { role: "Coach de carrera", organization: "Práctica independiente", period: "2017 — actualidad" },
      { role: "People Development Lead", organization: "Estudio Sur", period: "2012 — 2019" },
    ],
    education: [
      { title: "Licenciatura en Recursos Humanos", institution: "Universidad Empresarial Siglo 21" },
      { title: "Certificación en Coaching Profesional", institution: "International Coaching Federation — programa acreditado" },
    ],
    credentials: ["Certificación de coaching revisada", "Identidad validada"],
    testimonials: [
      {
        quote: "En pocas semanas pasé de una lista de ideas a dos caminos concretos que pude probar sin renunciar a todo.",
        author: "Pablo, 37",
        context: "Transición de carrera",
      },
    ],
  },
  {
    id: "11111111-1111-4111-8111-111111111103",
    slug: "ines-moreno",
    name: "Inés Moreno",
    initials: "IM",
    role: "Psicopedagoga · Orientadora educativa",
    credential: "Matrícula profesional revisada",
    headline: "Estrategias para aprender, elegir y construir una trayectoria educativa posible.",
    about:
      "Acompaño a jóvenes y personas adultas a comprender cómo aprenden, explorar opciones educativas y organizar decisiones de estudio. Construimos estrategias concretas sin reducir el proceso a una respuesta automática.",
    needs: ["elegir-estudios", "reinvencion"],
    professionalType: "psicopedagogia",
    specialties: ["Psicopedagogía", "Orientación educativa", "Estrategias de aprendizaje"],
    modalities: ["online"],
    city: "Rosario",
    province: "rosario",
    country: "Argentina",
    languages: ["espanol", "ingles"],
    audiences: ["Profesionales", "Personas en búsqueda activa"],
    careerStages: ["Primer empleo", "Mitad de carrera"],
    industries: ["Tecnología", "Finanzas", "Servicios"],
    serviceTypes: ["Proceso individual", "Consulta de orientación"],
    agreementSlugs: ["programa-reimpulso-litoral"],
    verified: true,
    featured: true,
    yearsExperience: 11,
    availabilityOrder: 4,
    availabilityLabel: "Próximo espacio: viernes",
    rating: 5,
    reviewCount: 34,
    workingStyle: [
      "Conversamos sobre la trayectoria educativa, los intereses y las dificultades actuales.",
      "Exploramos alternativas y estrategias de aprendizaje aplicables a cada contexto.",
      "Cerramos con criterios y próximos pasos que la persona pueda sostener.",
    ],
    experience: [
      { role: "Psicopedagoga", organization: "Práctica independiente", period: "2018 — actualidad" },
      { role: "Orientadora educativa", organization: "Programa Horizonte", period: "2014 — 2018" },
    ],
    education: [
      { title: "Licenciatura en Psicopedagogía", institution: "Universidad Nacional de Rosario" },
      { title: "Posgrado en Orientación Educativa", institution: "Universidad Nacional de Tres de Febrero" },
    ],
    credentials: ["Matrícula profesional revisada", "Formación universitaria validada"],
    testimonials: [
      {
        quote: "Pude ordenar las opciones y encontrar una forma de estudiar que sí podía sostener.",
        author: "Florencia, 22",
        context: "Orientación educativa",
      },
    ],
  },
  {
    id: "11111111-1111-4111-8111-111111111104",
    slug: "tomas-ferrer",
    name: "Tomás Ferrer",
    initials: "TF",
    role: "Mentor de transición digital",
    credential: "Experiencia sectorial revisada",
    headline: "Una mirada honesta para acercarte a tecnología sin empezar de cero ni comprar atajos.",
    about:
      "Acompaño a perfiles no técnicos que quieren entender dónde pueden aportar en productos digitales. Traducimos experiencia previa, exploramos roles y armamos proyectos breves para validar el interés antes de elegir una formación larga.",
    needs: ["transicion-digital", "cambio-industria", "desarrollo"],
    professionalType: "mentoring",
    specialties: ["Roles digitales", "Producto", "Transición sectorial"],
    modalities: ["online"],
    city: "Mendoza",
    province: "mendoza",
    country: "Argentina",
    languages: ["espanol", "ingles", "portugues"],
    audiences: ["Profesionales", "Emprendedores"],
    careerStages: ["Transición sectorial", "Mitad de carrera"],
    industries: ["Tecnología", "E-commerce", "Educación"],
    serviceTypes: ["Mentoría individual", "Mapa de roles"],
    agreementSlugs: ["alianza-talento-norte"],
    verified: true,
    featured: false,
    yearsExperience: 13,
    availabilityOrder: 3,
    availabilityLabel: "Próximo espacio: miércoles",
    rating: 4.9,
    reviewCount: 16,
    workingStyle: [
      "Mapeamos tu experiencia y los problemas que ya sabés resolver.",
      "Exploramos familias de roles y descartamos caminos con evidencia.",
      "Diseñamos un proyecto de prueba y un plan de aprendizaje acotado.",
    ],
    experience: [
      { role: "Product Director", organization: "Colectivo Norte", period: "2021 — actualidad" },
      { role: "Product Manager", organization: "Plataformas regionales", period: "2013 — 2021" },
    ],
    education: [
      { title: "Ingeniería Industrial", institution: "Universidad Nacional de Cuyo" },
      { title: "Programa Ejecutivo de Producto", institution: "Reforge" },
    ],
    credentials: ["Experiencia sectorial revisada", "Identidad validada"],
    testimonials: [
      {
        quote: "No me vendió una carrera nueva: me mostró cómo comprobar si producto realmente era para mí.",
        author: "Leandro, 35",
        context: "Transición digital",
      },
    ],
  },
  {
    id: "11111111-1111-4111-8111-111111111105",
    slug: "mariana-ortiz",
    name: "Mariana Ortiz",
    initials: "MO",
    role: "Psicóloga laboral",
    credential: "M.P. 9.184 · Córdoba",
    headline: "Un espacio para escuchar qué pide el cambio antes de convertirlo en una decisión.",
    about:
      "Trabajo con malestar laboral, agotamiento y preguntas de identidad profesional. La propuesta es comprender qué se volvió insostenible, reconocer recursos y construir un movimiento cuidadoso, sin fórmulas ni decisiones impulsivas.",
    needs: ["reinvencion", "cambio-trabajo", "desarrollo"],
    professionalType: "psicologia",
    specialties: ["Malestar laboral", "Identidad profesional", "Transiciones"],
    modalities: ["online", "presencial"],
    city: "Córdoba",
    province: "cordoba",
    country: "Argentina",
    languages: ["espanol"],
    audiences: ["Personas adultas", "Líderes"],
    careerStages: ["Mitad de carrera", "Liderazgo"],
    industries: ["Salud", "Educación", "Servicios"],
    serviceTypes: ["Proceso individual"],
    agreementSlugs: ["programa-reimpulso-litoral"],
    verified: false,
    featured: false,
    yearsExperience: 15,
    availabilityOrder: 6,
    availabilityLabel: "Consulta por nuevos espacios",
    rating: 4.8,
    reviewCount: 22,
    workingStyle: [
      "Delimitamos la situación y aquello que hoy necesita cuidado.",
      "Trabajamos patrones, expectativas y sentidos ligados al trabajo.",
      "Cuando corresponde, construimos condiciones para un cambio sostenible.",
    ],
    experience: [
      { role: "Psicóloga laboral", organization: "Práctica clínica y organizacional", period: "2011 — actualidad" },
      { role: "Consultora", organization: "Red de Salud Ocupacional", period: "2013 — 2020" },
    ],
    education: [
      { title: "Licenciatura en Psicología", institution: "Universidad Nacional de Córdoba" },
      { title: "Especialización en Psicología del Trabajo", institution: "Universidad Nacional de Córdoba" },
    ],
    credentials: ["Matrícula profesional revisada", "Formación de especialización validada"],
    testimonials: [
      {
        quote: "Pude entender que no estaba fallando: necesitaba cambiar la forma en que venía sosteniendo mi trabajo.",
        author: "Carla, 42",
        context: "Proceso de transición",
      },
    ],
  },
  {
    id: "11111111-1111-4111-8111-111111111106",
    slug: "agustin-paz",
    name: "Agustín Paz",
    initials: "AP",
    role: "Mentor de liderazgo",
    credential: "Experiencia ejecutiva revisada",
    headline: "Acompañamiento entre pares para liderar una etapa nueva con criterio propio.",
    about:
      "Fui gerente por más de una década y conozco la distancia entre saber hacer y empezar a liderar. Trabajo como mentor con responsables de equipo que quieren leer mejor el sistema, conversar con claridad y decidir sin copiar estilos ajenos.",
    needs: ["desarrollo", "cambio-industria"],
    professionalType: "mentoring",
    specialties: ["Primer liderazgo", "Decisiones", "Conversaciones difíciles"],
    modalities: ["online", "presencial"],
    city: "Ciudad de Buenos Aires",
    province: "caba",
    country: "Argentina",
    languages: ["espanol", "ingles"],
    audiences: ["Líderes", "Profesionales senior"],
    careerStages: ["Primer liderazgo", "Liderazgo"],
    industries: ["Finanzas", "Energía", "Tecnología"],
    serviceTypes: ["Mentoría individual"],
    agreementSlugs: ["alianza-talento-norte"],
    verified: false,
    featured: false,
    yearsExperience: 18,
    availabilityOrder: 5,
    availabilityLabel: "Próximo espacio: en 10 días",
    rating: 4.7,
    reviewCount: 8,
    workingStyle: [
      "Acordamos un desafío real de liderazgo como eje del proceso.",
      "Leemos actores, tensiones y alternativas antes de actuar.",
      "Revisamos resultados y convertimos la experiencia en criterio transferible.",
    ],
    experience: [
      { role: "Mentor ejecutivo", organization: "Práctica independiente", period: "2020 — actualidad" },
      { role: "Gerente de Operaciones", organization: "Compañía regional", period: "2008 — 2020" },
    ],
    education: [
      { title: "Licenciatura en Administración", institution: "Universidad Nacional de La Plata" },
      { title: "Programa de Liderazgo", institution: "IAE Business School" },
    ],
    credentials: ["Identidad validada", "Verificación de experiencia en curso"],
    testimonials: [],
  },
];

const publishedProfessionals = professionals.filter((professional) =>
  ["psicologia", "psicopedagogia"].includes(professional.professionalType),
);

const resources: ResourceArticle[] = [
  {
    slug: "cambiar-de-trabajo-o-de-rumbo",
    title: "¿Cambiar de trabajo o cambiar de rumbo? Una distinción para empezar",
    eyebrow: "Decisiones de carrera",
    excerpt: "Tres preguntas para diferenciar el desgaste con un contexto del deseo genuino de transformar tu trayectoria.",
    category: "Transiciones",
    publishedAt: "2026-07-28",
    readingTime: "6 min",
    author: "Valentina Acosta",
    authorRole: "Psicóloga · Orientadora vocacional",
    professionalSlug: "valentina-acosta",
    lead:
      "Cuando todo pesa, cambiar de profesión parece una respuesta completa. A veces lo es. Otras veces, el problema está en el contexto, el rol o la manera en que el trabajo ocupa la vida. Separar esas capas evita exigirle a una sola decisión que resuelva todo.",
    sections: [
      {
        heading: "Primero: nombrá qué querés dejar",
        paragraphs: [
          "No es lo mismo querer salir de una jefatura que de una disciplina. Probá escribir una lista muy concreta de situaciones que ya no querés sostener: tareas, ritmos, vínculos, condiciones, valores o formas de reconocimiento.",
          "Después preguntate cuáles de esos elementos pertenecen a tu profesión y cuáles a este trabajo en particular. La diferencia puede abrir alternativas que hoy están tapadas por el cansancio.",
        ],
      },
      {
        heading: "Buscá evidencia fuera de la fantasía",
        paragraphs: [
          "Un rumbo nuevo se entiende mejor con experiencias pequeñas que con meses de pensamiento circular. Una conversación con alguien del área, un proyecto breve o una clase abierta permiten sentir el trabajo real detrás de una etiqueta atractiva.",
          "La exploración no compromete una decisión. Su función es producir información propia para que la decisión futura sea menos abstracta.",
        ],
      },
      {
        heading: "Diseñá una transición, no un salto heroico",
        paragraphs: [
          "Cambiar puede incluir conservar ingresos, reducir riesgos y aprovechar capacidades ya desarrolladas. Las transiciones más sostenibles suelen tener puentes: proyectos adyacentes, roles híbridos, formación acotada y conversaciones tempranas.",
        ],
      },
    ],
    takeaways: [
      "Separá profesión, rol, organización y condiciones de trabajo.",
      "Probá hipótesis con experiencias pequeñas antes de decidir.",
      "Construí puentes que cuiden recursos, vínculos e identidad.",
    ],
  },
  {
    slug: "preparar-una-entrevista-sin-actuar-un-personaje",
    title: "Preparar una entrevista sin actuar un personaje",
    eyebrow: "Búsqueda laboral",
    excerpt: "Cómo llegar con una narrativa clara, ejemplos honestos y preguntas que también te permitan elegir.",
    category: "Empleabilidad",
    publishedAt: "2026-07-16",
    readingTime: "5 min",
    author: "Inés Moreno",
    authorRole: "Especialista en empleabilidad",
    professionalSlug: "ines-moreno",
    lead:
      "Prepararse no significa memorizar respuestas perfectas. Significa entender qué necesita conocer la otra parte, elegir evidencia concreta y llegar con suficiente claridad para sostener una conversación de doble vía.",
    sections: [
      {
        heading: "Elegí cuatro historias, no veinte respuestas",
        paragraphs: [
          "Identificá experiencias que muestren aprendizaje, colaboración, resolución de problemas y criterio. Una misma historia puede responder distintas preguntas si conocés bien el contexto, tu aporte y el resultado.",
        ],
      },
      {
        heading: "Traducí, no infles",
        paragraphs: [
          "Tu experiencia puede ser valiosa y, al mismo tiempo, estar expresada en un lenguaje que el nuevo contexto no reconoce. Preparar una entrevista implica traducir responsabilidades en problemas resueltos, decisiones tomadas y aprendizajes transferibles.",
          "La claridad genera más confianza que una lista de adjetivos difíciles de comprobar.",
        ],
      },
      {
        heading: "Llevá preguntas que te ayuden a decidir",
        paragraphs: [
          "Preguntá cómo se define un buen primer semestre, qué tensiones atraviesa hoy el equipo y qué autonomía tendrá el rol. No son preguntas para impresionar: son información para evaluar si el trabajo también encaja con vos.",
        ],
      },
    ],
    takeaways: [
      "Prepará historias concretas y adaptables.",
      "Explicá tu aporte con evidencia, sin sobreactuar seguridad.",
      "Usá la entrevista para evaluar el contexto, no sólo para ser evaluado.",
    ],
  },
  {
    slug: "explorar-roles-digitales-con-criterio",
    title: "Explorar roles digitales sin empezar de cero",
    eyebrow: "Transición digital",
    excerpt: "Un mapa para reconocer capacidades transferibles y probar un rol antes de comprometer tiempo y dinero.",
    category: "Reinvención",
    publishedAt: "2026-06-30",
    readingTime: "7 min",
    author: "Tomás Ferrer",
    authorRole: "Mentor de transición digital",
    professionalSlug: "tomas-ferrer",
    lead:
      "Tecnología no es un único destino ni exige borrar tu historia profesional. El primer trabajo es comprender familias de problemas y reconocer qué capacidades ya construiste para resolverlos.",
    sections: [
      {
        heading: "Empezá por problemas, no por títulos",
        paragraphs: [
          "Producto, datos, experiencia de usuario y operaciones digitales agrupan trabajos muy distintos. Investigá qué problemas resuelve cada equipo durante una semana normal antes de elegir una etiqueta profesional.",
        ],
      },
      {
        heading: "Hacé inventario de lo transferible",
        paragraphs: [
          "Facilitar acuerdos, comprender usuarios, ordenar información compleja o mejorar procesos son capacidades valiosas en múltiples roles. Escribí ejemplos donde ya las aplicaste y observá qué parte disfrutaste.",
        ],
      },
      {
        heading: "Probá el trabajo en escala pequeña",
        paragraphs: [
          "Antes de una formación extensa, armá una práctica breve con un problema real: analizá un flujo, entrevistá usuarios, ordená métricas o documentá un proceso. La experiencia te dará preguntas mucho mejores para elegir cómo seguir.",
        ],
      },
    ],
    takeaways: [
      "Investigá el trabajo cotidiano detrás de cada rol.",
      "Conectá capacidades previas con problemas nuevos.",
      "Probá primero; elegí formación con evidencia después.",
    ],
  },
  {
    slug: "primeros-noventa-dias-liderando",
    title: "Los primeros noventa días liderando: qué conviene observar antes de cambiar",
    eyebrow: "Liderazgo",
    excerpt: "Una guía serena para leer el sistema, cuidar acuerdos y no confundir velocidad con impacto.",
    category: "Desarrollo",
    publishedAt: "2026-06-12",
    readingTime: "8 min",
    author: "Agustín Paz",
    authorRole: "Mentor de liderazgo",
    professionalSlug: "agustin-paz",
    lead:
      "El primer impulso al asumir un equipo suele ser demostrar valor con cambios rápidos. Sin contexto, esa velocidad puede romper acuerdos invisibles. Observar bien también es una forma de liderazgo.",
    sections: [
      {
        heading: "Leé el sistema informal",
        paragraphs: [
          "Además del organigrama, existen personas de referencia, rituales útiles y tensiones antiguas. Conversá con distintas voces y contrastá versiones antes de convertir una impresión en diagnóstico.",
        ],
      },
      {
        heading: "Acordá qué significa progresar",
        paragraphs: [
          "Clarificá con tu responsable y con el equipo cuáles son los resultados importantes, qué restricciones existen y qué decisiones te corresponden. La ambigüedad no se resuelve trabajando más horas.",
        ],
      },
      {
        heading: "Elegí una mejora que enseñe",
        paragraphs: [
          "Un cambio acotado permite observar cómo decide el equipo, dónde circula la información y qué apoyos faltan. Buscá una mejora real, reversible y suficientemente visible para aprender juntos.",
        ],
      },
    ],
    takeaways: [
      "Escuchá voces diversas antes de sacar conclusiones.",
      "Volvé explícitos resultados, restricciones y decisiones.",
      "Usá una mejora acotada para aprender cómo funciona el sistema.",
    ],
  },
];

const agreements: Agreement[] = [
  {
    slug: "comunidad-universitaria-del-rio",
    institution: "Universidad del Río",
    institutionInitials: "UR",
    kind: "Universidad",
    title: "Orientación para estudiantes y graduados recientes",
    excerpt: "Un acceso acompañado a orientación vocacional, reorientación y primeros pasos de empleabilidad.",
    audience: "Estudiantes regulares y personas graduadas durante los últimos 24 meses.",
    coverage: "Argentina",
    modalities: ["Online", "Presencial en CABA"],
    services: ["Consulta inicial de orientación", "Proceso breve de reorientación", "Revisión de estrategia de primer empleo"],
    benefits: ["Arancel preferencial", "Primera orientación sin cargo", "Profesionales con credenciales revisadas"],
    eligibility: ["Ser estudiante regular", "O haber egresado hace menos de 24 meses", "Contar con correo institucional activo"],
    access: ["Completá la solicitud con tu correo institucional.", "Recibí un código personal y las condiciones del convenio.", "Elegí entre los profesionales adheridos y coordiná directamente."],
    validity: "Vigente hasta el 31 de diciembre de 2026",
    professionalCount: 8,
  },
  {
    slug: "alianza-talento-norte",
    institution: "Cámara Talento Norte",
    institutionInitials: "TN",
    kind: "Asociación profesional",
    title: "Desarrollo y movilidad para profesionales asociados",
    excerpt: "Mentoría, coaching de carrera y transición sectorial para acompañar movimientos de mediano plazo.",
    audience: "Personas asociadas activas de la Cámara Talento Norte.",
    coverage: "Todo el país",
    modalities: ["Online"],
    services: ["Coaching de carrera", "Mentoría de liderazgo", "Transición a roles digitales"],
    benefits: ["20% de beneficio en la primera sesión", "Agenda prioritaria", "Encuentros abiertos trimestrales"],
    eligibility: ["Membresía activa", "Código de asociado vigente"],
    access: ["Ingresá tu número de asociado.", "Validamos la membresía sin compartir información innecesaria.", "Accedé al catálogo específico y coordiná tu primera conversación."],
    validity: "Vigente durante 2026",
    professionalCount: 12,
  },
  {
    slug: "programa-reimpulso-litoral",
    institution: "Fundación Reimpulso",
    institutionInitials: "FR",
    kind: "Fundación",
    title: "Acompañamiento para volver al trabajo",
    excerpt: "Un programa focalizado para personas desempleadas que necesitan sostén y herramientas en su reinserción.",
    audience: "Participantes derivados por organizaciones aliadas de Fundación Reimpulso.",
    coverage: "Santa Fe y Córdoba",
    modalities: ["Online", "Presencial según sede"],
    services: ["Orientación de reinserción", "CV y posicionamiento", "Preparación de entrevistas"],
    benefits: ["Hasta tres encuentros cubiertos", "Seguimiento durante 60 días", "Derivación según necesidad"],
    eligibility: ["Participar del programa Reimpulso", "Contar con derivación de una sede habilitada"],
    access: ["Solicitá la derivación en tu sede.", "El equipo del programa valida el cupo.", "Red Senda te propone opciones y explica el criterio de selección."],
    validity: "Cupos mensuales sujetos a disponibilidad",
    professionalCount: 6,
  },
];

const plans: Plan[] = [
  {
    slug: "base",
    name: "Base",
    description: "Para construir una presencia profesional clara y empezar a recibir consultas.",
    monthlyPrice: null,
    currency: "ARS",
    features: ["Perfil público completo", "Presencia en el buscador", "Recepción y gestión de contactos", "Verificación según tu profesión", "Panel con métricas esenciales"],
    cta: "Empezar con Base",
  },
  {
    slug: "impulso",
    name: "Impulso",
    description: "Para profesionales que quieren desarrollar autoridad y comprender mejor su demanda.",
    monthlyPrice: null,
    currency: "ARS",
    featured: true,
    badge: "Más elegido",
    features: ["Todo lo incluido en Base", "Publicación de recursos", "Analítica de visitas y contactos", "Participación en convenios", "Posicionamiento destacado y siempre identificado"],
    cta: "Elegir Impulso",
  },
  {
    slug: "referente",
    name: "Referente",
    description: "Para quienes ya tienen trayectoria y buscan ampliar alcance, alianzas y participación.",
    monthlyPrice: null,
    currency: "ARS",
    features: ["Todo lo incluido en Impulso", "Analítica avanzada", "Prioridad en convocatorias", "Encuentros editoriales y profesionales", "Acompañamiento de posicionamiento"],
    cta: "Conversar sobre Referente",
  },
];

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");

const includesAny = (source: string[], filters?: string[]) =>
  !filters?.length || filters.some((filter) => source.includes(filter));

const matchingScore = (professional: Professional, filters: ProfessionalFilters) => {
  let score = professional.rating * 2 + Math.min(professional.reviewCount / 10, 4);
  score += filters.need?.filter((need) => professional.needs.includes(need)).length ?? 0;
  score += (filters.type?.includes(professional.professionalType) ? 1 : 0) * 2;
  score += filters.modality?.filter((mode) => professional.modalities.includes(mode as Modality)).length ?? 0;
  return score;
};

export const publicRepository = {
  async listProfessionals(filters: ProfessionalFilters = {}) {
    const query = filters.q ? normalize(filters.q) : "";
    const filtered = publishedProfessionals.filter((professional) => {
      const searchable = normalize(
        [
          professional.name,
          professional.role,
          professional.headline,
          professional.city,
          ...professional.specialties,
          ...professional.industries,
        ].join(" "),
      );

      return (
        (!query || searchable.includes(query)) &&
        includesAny(professional.needs, filters.need) &&
        (!filters.type?.length || filters.type.includes(professional.professionalType)) &&
        includesAny(professional.modalities, filters.modality) &&
        (!filters.location?.length || filters.location.includes(professional.province)) &&
        includesAny(professional.languages, filters.language) &&
        (!filters.verified || professional.verified)
      );
    });

    const sorted = [...filtered];
    switch (filters.sort) {
      case "availability":
        sorted.sort((a, b) => a.availabilityOrder - b.availabilityOrder);
        break;
      case "recommended":
        sorted.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
        break;
      case "featured":
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
        break;
      case "match":
        sorted.sort((a, b) => matchingScore(b, filters) - matchingScore(a, filters));
        break;
      default:
        sorted.sort((a, b) => matchingScore(b, filters) - matchingScore(a, filters));
    }

    return sorted;
  },

  async getProfessional(slug: string) {
    return publishedProfessionals.find((professional) => professional.slug === slug) ?? null;
  },

  async getFeaturedProfessionals(limit = 3) {
    return [...publishedProfessionals]
      .sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)
      .slice(0, limit);
  },

  async listProfessionalSlugs() {
    return publishedProfessionals.map(({ slug }) => ({ slug }));
  },

  async listResources() {
    return [...resources].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  },

  async getResource(slug: string) {
    return resources.find((resource) => resource.slug === slug) ?? null;
  },

  async listResourceSlugs() {
    return resources.map(({ slug }) => ({ slug }));
  },

  async listAgreements() {
    return agreements;
  },

  async getAgreement(slug: string) {
    return agreements.find((agreement) => agreement.slug === slug) ?? null;
  },

  async listAgreementSlugs() {
    return agreements.map(({ slug }) => ({ slug }));
  },

  async listPlans() {
    return plans;
  },
};

export const getNeedLabel = (value: string) =>
  needOptions.find((option) => option.value === value)?.label ?? value;

export const getProfessionalTypeLabel = (value: string) =>
  professionalTypeOptions.find((option) => option.value === value)?.label ?? value;

export const formatRating = (rating: number) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);

export const formatPlanPrice = (plan: Pick<Plan, "monthlyPrice" | "currency">) =>
  plan.monthlyPrice === null
    ? "Precio a confirmar"
    : new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: plan.currency,
        maximumFractionDigits: 0,
      }).format(plan.monthlyPrice);
