"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  Search, 
  BookOpen, 
  Users, 
  Trophy, 
  Lightbulb,
  Code2,
  Rocket,
  GraduationCap
} from "lucide-react"
import { getProyectosDestacados, getProyectos } from "@/lib/api"

const carreras = [
  "Desarrollo de Software",
  "Redes y Telecomunicaciones",
  "Electromecánica",
  "Agua y Saneamiento Ambiental",
]

const stats = [
  { label: "Proyectos Publicados", value: "150+", icon: BookOpen },
  { label: "Estudiantes Activos", value: "500+", icon: Users },
  { label: "Proyectos Destacados", value: "25+", icon: Trophy },
  { label: "Carreras", value: "4", icon: GraduationCap },
]

export default function HomePage() {
  const [proyectosDestacados, setProyectosDestacados] = useState([])
  const [proyectosRecientes, setProyectosRecientes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [destacados, recientes] = await Promise.all([
          getProyectosDestacados(),
          getProyectos(),
        ])
        setProyectosDestacados(destacados.slice(0, 4))
        setProyectosRecientes(recientes.slice(0, 6))
      } catch (error) {
        console.error("Error al cargar proyectos:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/proyectos?buscar=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8 lg:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-6">
                Escuela de Formación de Tecnólogos - EPN
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                Proyectos Académicos y Extracurriculares
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
                Descubre los proyectos innovadores desarrollados por estudiantes de la ESFOT. 
                Una plataforma para compartir conocimiento, inspirar y colaborar.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mt-10 flex max-w-lg mx-auto gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar proyectos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button type="submit" size="lg" className="h-12">
                  Buscar
                </Button>
              </form>

              {/* Quick Links */}
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {carreras.map((carrera) => (
                  <Link key={carrera} href={`/proyectos?carrera=${encodeURIComponent(carrera)}`}>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      {carrera}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
                  Proyectos Destacados
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Los proyectos más populares de nuestra comunidad
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/proyectos?destacados=true">
                  Ver todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : proyectosDestacados.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {proyectosDestacados.map((proyecto: any) => (
                  <ProjectCard key={proyecto._id} proyecto={proyecto} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No hay proyectos destacados aún</p>
              </div>
            )}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
                Explora por Categoría
              </h2>
              <p className="mt-2 text-muted-foreground">
                Encuentra proyectos según su tipo y propósito
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Link href="/proyectos?categoria=academico">
                <div className="group relative overflow-hidden rounded-xl border bg-card p-8 transition-all hover:shadow-lg hover:border-primary/50">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Code2 className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        Proyectos Académicos
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Proyectos desarrollados como parte del plan de estudios, trabajos de titulación 
                        y proyectos de asignaturas específicas.
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>

              <Link href="/proyectos?categoria=extracurricular">
                <div className="group relative overflow-hidden rounded-xl border bg-card p-8 transition-all hover:shadow-lg hover:border-primary/50">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Lightbulb className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        Proyectos Extracurriculares
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Iniciativas personales, proyectos de clubes estudiantiles, hackathons 
                        y competencias de innovación.
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Projects */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
                  Proyectos Recientes
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Las últimas incorporaciones a nuestra plataforma
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/proyectos">
                  Explorar todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : proyectosRecientes.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {proyectosRecientes.map((proyecto: any) => (
                  <ProjectCard key={proyecto._id} proyecto={proyecto} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No hay proyectos recientes</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Rocket className="h-12 w-12 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold lg:text-4xl text-balance">
                ¿Tienes un proyecto increíble?
              </h2>
              <p className="mt-4 text-lg opacity-90 text-pretty">
                Comparte tu trabajo con la comunidad ESFOT. Inspira a otros estudiantes 
                y muestra tus habilidades al mundo.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/registro">
                    Crear cuenta
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                  <Link href="/acerca">
                    Conocer más
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
