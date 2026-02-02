import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  GraduationCap, 
  Target, 
  Users, 
  Lightbulb, 
  Code2, 
  Globe, 
  Award,
  BookOpen,
} from "lucide-react"

const carreras = [
  {
    nombre: "Desarrollo de Software",
    descripcion: "Formación en diseño, desarrollo y mantenimiento de aplicaciones y sistemas informáticos.",
    icon: Code2,
  },
  {
    nombre: "Redes y Telecomunicaciones",
    descripcion: "Especialización en diseño, implementación y administración de redes de comunicación.",
    icon: Globe,
  },
  {
    nombre: "Electromecánica",
    descripcion: "Integración de conocimientos eléctricos y mecánicos para sistemas automatizados.",
    icon: Lightbulb,
  },
  {
    nombre: "Agua y Saneamiento Ambiental",
    descripcion: "Gestión de recursos hídricos y tratamiento de residuos para el cuidado ambiental.",
    icon: Target,
  },
]

const valores = [
  {
    titulo: "Innovación",
    descripcion: "Fomentamos el pensamiento creativo y la búsqueda de soluciones innovadoras.",
    icon: Lightbulb,
  },
  {
    titulo: "Colaboración",
    descripcion: "Promovemos el trabajo en equipo y el intercambio de conocimientos.",
    icon: Users,
  },
  {
    titulo: "Excelencia",
    descripcion: "Buscamos la calidad y la mejora continua en cada proyecto.",
    icon: Award,
  },
  {
    titulo: "Aprendizaje",
    descripcion: "Valoramos el aprendizaje continuo y la formación integral.",
    icon: BookOpen,
  },
]

export default function AcercaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/5 via-background to-background py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 p-3">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
                Escuela de Formación de Tecnólogos
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
                La ESFOT es parte de la Escuela Politécnica Nacional, formando profesionales 
                técnicos de excelencia desde hace más de 50 años. Nuestra misión es preparar 
                tecnólogos competentes que contribuyan al desarrollo del país.
              </p>
            </div>
          </div>
        </section>

        {/* About Platform */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Sobre la Plataforma
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Esta plataforma fue creada para visibilizar y documentar los proyectos 
                  académicos y extracurriculares desarrollados por estudiantes de la ESFOT. 
                  Es un espacio donde la comunidad estudiantil puede compartir sus trabajos, 
                  inspirarse mutuamente y demostrar sus habilidades técnicas.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Aquí encontrarás desde proyectos de asignaturas específicas hasta iniciativas 
                  personales, hackathons y competencias. Cada proyecto representa el esfuerzo 
                  y dedicación de nuestros estudiantes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild>
                    <Link href="/proyectos">Explorar Proyectos</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/registro">Unirse a la Comunidad</Link>
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {valores.map((valor) => (
                  <Card key={valor.titulo}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <valor.icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-base">{valor.titulo}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{valor.descripcion}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Carreras */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Nuestras Carreras</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                La ESFOT ofrece cuatro carreras tecnológicas de excelencia, 
                cada una enfocada en áreas clave del desarrollo nacional.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {carreras.map((carrera) => (
                <Card key={carrera.nombre} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <carrera.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{carrera.nombre}</h3>
                        <p className="text-sm text-muted-foreground">{carrera.descripcion}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                ¿Eres estudiante de la ESFOT?
              </h2>
              <p className="text-muted-foreground mb-8">
                Únete a nuestra plataforma y comparte tus proyectos con la comunidad. 
                Es una excelente oportunidad para documentar tu trabajo y conectar con otros estudiantes.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/registro">Crear una cuenta</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/proyectos">Ver proyectos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Contacto</h2>
              <p className="text-muted-foreground mb-6">
                Si tienes preguntas o sugerencias sobre la plataforma, 
                no dudes en contactarnos.
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>Escuela de Formación de Tecnólogos</p>
                <p>Escuela Politécnica Nacional</p>
                <p>Ladrón de Guevara E11-253, Quito - Ecuador</p>
                <p className="text-primary">esfot@epn.edu.ec</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
