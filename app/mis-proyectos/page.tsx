"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Loader2, FolderOpen } from "lucide-react"
import { getMisProyectos } from "@/lib/api"

export default function MisProyectosPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [proyectos, setProyectos] = useState([])
  const [filteredProyectos, setFilteredProyectos] = useState([])
  const [filter, setFilter] = useState("todos")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    async function fetchProyectos() {
      if (!user) return
      try {
        const data = await getMisProyectos()
        setProyectos(data)
        setFilteredProyectos(data)
      } catch (error) {
        console.error("Error al cargar proyectos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchProyectos()
    }
  }, [user])

  useEffect(() => {
    if (filter === "todos") {
      setFilteredProyectos(proyectos)
    } else {
      setFilteredProyectos(proyectos.filter((p: any) => p.estado === filter))
    }
  }, [filter, proyectos])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                Mis Proyectos
              </h1>
              <p className="text-muted-foreground mt-1">
                Gestiona y administra tus proyectos académicos
              </p>
            </div>
            <Button asChild>
              <Link href="/mis-proyectos/nuevo">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proyecto
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="todos">Todos ({proyectos.length})</TabsTrigger>
                <TabsTrigger value="publicado">
                  Publicados ({proyectos.filter((p: any) => p.estado === "publicado").length})
                </TabsTrigger>
                <TabsTrigger value="en_progreso">
                  En Progreso ({proyectos.filter((p: any) => p.estado === "en_progreso").length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProyectos.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProyectos.map((proyecto: any) => (
                <ProjectCard key={proyecto._id} proyecto={proyecto} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {filter === "todos" ? "No tienes proyectos aún" : "No hay proyectos con este estado"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {filter === "todos"
                  ? "Comienza creando tu primer proyecto"
                  : "Intenta cambiar el filtro"}
              </p>
              {filter === "todos" && (
                <Button asChild>
                  <Link href="/mis-proyectos/nuevo">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Proyecto
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
