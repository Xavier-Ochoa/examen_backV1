"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, X, Loader2, FolderOpen } from "lucide-react"
import { getProyectos, getProyectosPorCategoria, getProyectosPorCarrera } from "@/lib/api"

const carreras = [
  "Desarrollo de Software",
  "Redes y Telecomunicaciones",
  "Electromecánica",
  "Agua y Saneamiento Ambiental",
]

export default function ProyectosPage() {
  const searchParams = useSearchParams()
  const [proyectos, setProyectos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("buscar") || "")
  const [categoria, setCategoria] = useState(searchParams.get("categoria") || "todos")
  const [carrera, setCarrera] = useState(searchParams.get("carrera") || "todas")
  const [showFilters, setShowFilters] = useState(false)

  const fetchProyectos = useCallback(async () => {
    setIsLoading(true)
    try {
      let data

      if (searchQuery) {
        data = await getProyectos({ buscar: searchQuery })
      } else if (categoria !== "todos") {
        data = await getProyectosPorCategoria(categoria)
      } else if (carrera !== "todas") {
        data = await getProyectosPorCarrera(carrera)
      } else {
        data = await getProyectos()
      }

      // Filter by carrera if needed (when combined with category)
      if (carrera !== "todas" && categoria !== "todos") {
        data = data.filter((p: any) => p.carrera === carrera)
      }

      setProyectos(data)
    } catch (error) {
      console.error("Error al cargar proyectos:", error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, categoria, carrera])

  useEffect(() => {
    fetchProyectos()
  }, [fetchProyectos])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProyectos()
  }

  const clearFilters = () => {
    setSearchQuery("")
    setCategoria("todos")
    setCarrera("todas")
  }

  const hasActiveFilters = searchQuery || categoria !== "todos" || carrera !== "todas"

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
                Explorar Proyectos
              </h1>
              <p className="mt-3 text-muted-foreground">
                Descubre los proyectos desarrollados por estudiantes de la ESFOT. 
                Filtra por categoría, carrera o busca por palabras clave.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b bg-background sticky top-16 z-40">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar proyectos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Buscar</Button>
              </form>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center gap-4">
                <Tabs value={categoria} onValueChange={setCategoria}>
                  <TabsList>
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="academico">Académicos</TabsTrigger>
                    <TabsTrigger value="extracurricular">Extracurriculares</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Select value={carrera} onValueChange={setCarrera}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Todas las carreras" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las carreras</SelectItem>
                    {carreras.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    Activos
                  </Badge>
                )}
              </Button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mt-4 pt-4 border-t space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Categoría
                  </label>
                  <Select value={categoria} onValueChange={setCategoria}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="academico">Académicos</SelectItem>
                      <SelectItem value="extracurricular">Extracurriculares</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Carrera
                  </label>
                  <Select value={carrera} onValueChange={setCarrera}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas las carreras</SelectItem>
                      {carreras.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                    <X className="h-4 w-4 mr-1" />
                    Limpiar filtros
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            {/* Active filters badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Búsqueda: {searchQuery}
                    <button onClick={() => setSearchQuery("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {categoria !== "todos" && (
                  <Badge variant="secondary" className="gap-1">
                    {categoria === "academico" ? "Académicos" : "Extracurriculares"}
                    <button onClick={() => setCategoria("todos")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {carrera !== "todas" && (
                  <Badge variant="secondary" className="gap-1">
                    {carrera}
                    <button onClick={() => setCarrera("todas")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-6">
              {isLoading ? "Cargando..." : `${proyectos.length} proyecto${proyectos.length !== 1 ? "s" : ""} encontrado${proyectos.length !== 1 ? "s" : ""}`}
            </p>

            {/* Projects Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : proyectos.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {proyectos.map((proyecto: any) => (
                  <ProjectCard key={proyecto._id} proyecto={proyecto} onLikeChange={fetchProyectos} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No se encontraron proyectos
                </h3>
                <p className="text-muted-foreground mb-6">
                  {hasActiveFilters
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Aún no hay proyectos publicados"}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
