"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  FolderOpen,
  Heart,
  MessageCircle,
  Eye,
  Plus,
  Loader2,
  TrendingUp,
  Clock,
  BarChart3,
} from "lucide-react"
import { getDashboardUsuario } from "@/lib/api"

interface DashboardStats {
  totalProyectos: number
  totalLikes: number
  totalComentarios: number
  totalVistas: number
  proyectosPublicados: number
  proyectosEnProgreso: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    async function fetchDashboard() {
      if (!user) return
      try {
        const data = await getDashboardUsuario()
        setStats(data)
      } catch (error) {
        console.error("Error al cargar dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchDashboard()
    }
  }, [user])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const statCards = [
    {
      title: "Mis Proyectos",
      value: stats?.totalProyectos || 0,
      icon: FolderOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Likes",
      value: stats?.totalLikes || 0,
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Comentarios",
      value: stats?.totalComentarios || 0,
      icon: MessageCircle,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
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
          {/* Welcome Section */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.fotoPerfil?.url} />
                <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                  {getInitials(user.nombre, user.apellido)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Bienvenido, {user.nombre}
                </h1>
                <p className="text-muted-foreground">
                  {user.carrera} - Nivel {user.nivel}
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/mis-proyectos/nuevo">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proyecto
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-16 animate-pulse rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
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

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Estado de Proyectos
                </CardTitle>
                <CardDescription>Resumen de tus proyectos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">Publicados</span>
                  </div>
                  <span className="font-medium">{stats?.proyectosPublicados || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="text-sm text-muted-foreground">En Progreso</span>
                  </div>
                  <span className="font-medium">{stats?.proyectosEnProgreso || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/mis-proyectos">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Ver mis proyectos
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/mis-proyectos/nuevo">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear nuevo proyecto
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/perfil">
                    <Clock className="h-4 w-4 mr-2" />
                    Editar perfil
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tu Perfil</CardTitle>
                <CardDescription>Información de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-foreground truncate ml-2">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carrera</span>
                  <span className="text-foreground">{user.carrera}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nivel</span>
                  <span className="text-foreground">{user.nivel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cédula</span>
                  <span className="text-foreground">{user.cedula}</span>
                </div>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link href="/perfil">Ver perfil completo</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
