"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FolderOpen,
  Users,
  Heart,
  Eye,
  Loader2,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  ExternalLink,
  BarChart3,
} from "lucide-react"
import {
  getDashboardAdmin,
  getProyectosAdmin,
  getEstudiantes,
  publicarProyecto,
  despublicarProyecto,
  eliminarProyecto,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface AdminStats {
  totalProyectos: number
  proyectosPublicados: number
  proyectosEnProgreso: number
  totalEstudiantes: number
  totalLikes: number
  totalVistas: number
}

interface Proyecto {
  _id: string
  titulo: string
  autor: { nombre: string; apellido: string }
  categoria: string
  estado: string
  likes: string[]
  vistas: number
  createdAt: string
}

interface Estudiante {
  _id: string
  nombre: string
  apellido: string
  email: string
  carrera: string
  nivel: number
  fotoPerfil?: { url: string }
  createdAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchProyectos, setSearchProyectos] = useState("")
  const [searchEstudiantes, setSearchEstudiantes] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!authLoading && (!user || user.rol !== "admin")) {
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    async function fetchData() {
      if (!user || user.rol !== "admin") return

      try {
        const [statsData, proyectosData, estudiantesData] = await Promise.all([
          getDashboardAdmin(),
          getProyectosAdmin(),
          getEstudiantes(),
        ])
        setStats(statsData)
        setProyectos(proyectosData)
        setEstudiantes(estudiantesData)
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.rol === "admin") {
      fetchData()
    }
  }, [user])

  const handlePublicar = async (id: string) => {
    try {
      await publicarProyecto(id)
      setProyectos(
        proyectos.map((p) => (p._id === id ? { ...p, estado: "publicado" } : p))
      )
      toast({ title: "Proyecto publicado" })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo publicar el proyecto", variant: "destructive" })
    }
  }

  const handleDespublicar = async (id: string) => {
    try {
      await despublicarProyecto(id)
      setProyectos(
        proyectos.map((p) => (p._id === id ? { ...p, estado: "en_progreso" } : p))
      )
      toast({ title: "Proyecto despublicado" })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo despublicar el proyecto", variant: "destructive" })
    }
  }

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return

    try {
      await eliminarProyecto(id)
      setProyectos(proyectos.filter((p) => p._id !== id))
      toast({ title: "Proyecto eliminado" })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar el proyecto", variant: "destructive" })
    }
  }

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredProyectos = proyectos.filter(
    (p) =>
      p.titulo.toLowerCase().includes(searchProyectos.toLowerCase()) ||
      `${p.autor.nombre} ${p.autor.apellido}`.toLowerCase().includes(searchProyectos.toLowerCase())
  )

  const filteredEstudiantes = estudiantes.filter(
    (e) =>
      `${e.nombre} ${e.apellido}`.toLowerCase().includes(searchEstudiantes.toLowerCase()) ||
      e.email.toLowerCase().includes(searchEstudiantes.toLowerCase())
  )

  if (authLoading || !user || user.rol !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Proyectos",
      value: stats?.totalProyectos || 0,
      icon: FolderOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Estudiantes",
      value: stats?.totalEstudiantes || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Likes",
      value: stats?.totalLikes || 0,
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Vistas Totales",
      value: stats?.totalVistas || 0,
      icon: Eye,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
              Panel de Administración
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestiona proyectos y estudiantes de la plataforma
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">
                <BarChart3 className="h-4 w-4 mr-2" />
                Resumen
              </TabsTrigger>
              <TabsTrigger value="proyectos">
                <FolderOpen className="h-4 w-4 mr-2" />
                Proyectos
              </TabsTrigger>
              <TabsTrigger value="estudiantes">
                <Users className="h-4 w-4 mr-2" />
                Estudiantes
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="h-16 animate-pulse rounded bg-muted" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {statCards.map((stat) => (
                    <Card key={stat.title}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">{stat.title}</p>
                            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                          </div>
                          <div className={`p-3 rounded-full ${stat.bgColor}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Estado de Proyectos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                          <span className="text-muted-foreground">Publicados</span>
                        </div>
                        <span className="font-medium">{stats?.proyectosPublicados || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-yellow-500" />
                          <span className="text-muted-foreground">En Progreso</span>
                        </div>
                        <span className="font-medium">{stats?.proyectosEnProgreso || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Acciones Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("proyectos")}>
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Gestionar Proyectos
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("estudiantes")}>
                      <Users className="h-4 w-4 mr-2" />
                      Ver Estudiantes
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Proyectos Tab */}
            <TabsContent value="proyectos">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>Gestión de Proyectos</CardTitle>
                      <CardDescription>
                        {filteredProyectos.length} proyectos encontrados
                      </CardDescription>
                    </div>
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar proyectos..."
                        value={searchProyectos}
                        onChange={(e) => setSearchProyectos(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Proyecto</TableHead>
                            <TableHead>Autor</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-center">Likes</TableHead>
                            <TableHead className="text-center">Vistas</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProyectos.map((proyecto) => (
                            <TableRow key={proyecto._id}>
                              <TableCell className="font-medium max-w-[200px] truncate">
                                {proyecto.titulo}
                              </TableCell>
                              <TableCell>
                                {proyecto.autor.nombre} {proyecto.autor.apellido}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {proyecto.categoria === "academico" ? "Académico" : "Extracurricular"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={proyecto.estado === "publicado" ? "default" : "secondary"}
                                >
                                  {proyecto.estado === "publicado" ? "Publicado" : "En Progreso"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">{proyecto.likes.length}</TableCell>
                              <TableCell className="text-center">{proyecto.vistas}</TableCell>
                              <TableCell>{formatDate(proyecto.createdAt)}</TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/proyectos/${proyecto._id}`}>
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Ver proyecto
                                      </Link>
                                    </DropdownMenuItem>
                                    {proyecto.estado === "en_progreso" ? (
                                      <DropdownMenuItem onClick={() => handlePublicar(proyecto._id)}>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Publicar
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => handleDespublicar(proyecto._id)}>
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Despublicar
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => handleEliminar(proyecto._id)}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Estudiantes Tab */}
            <TabsContent value="estudiantes">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>Estudiantes Registrados</CardTitle>
                      <CardDescription>
                        {filteredEstudiantes.length} estudiantes encontrados
                      </CardDescription>
                    </div>
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar estudiantes..."
                        value={searchEstudiantes}
                        onChange={(e) => setSearchEstudiantes(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Estudiante</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Carrera</TableHead>
                            <TableHead>Nivel</TableHead>
                            <TableHead>Registro</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEstudiantes.map((estudiante) => (
                            <TableRow key={estudiante._id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={estudiante.fotoPerfil?.url} />
                                    <AvatarFallback className="text-xs">
                                      {getInitials(estudiante.nombre, estudiante.apellido)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">
                                    {estudiante.nombre} {estudiante.apellido}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{estudiante.email}</TableCell>
                              <TableCell>{estudiante.carrera}</TableCell>
                              <TableCell>Nivel {estudiante.nivel}</TableCell>
                              <TableCell>{formatDate(estudiante.createdAt)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
