"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  MessageCircle,
  Eye,
  Calendar,
  Github,
  ExternalLink,
  ArrowLeft,
  Loader2,
  Send,
  Trash2,
  Share2,
  BookOpen,
  User,
} from "lucide-react"
import { getProyecto, agregarLike, quitarLike, agregarComentario, eliminarComentario } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Proyecto {
  _id: string
  titulo: string
  descripcion: string
  categoria: "academico" | "extracurricular"
  asignatura?: string
  autor: {
    _id: string
    nombre: string
    apellido: string
    fotoPerfil?: { url: string }
    carrera: string
    nivel: number
  }
  colaboradores?: Array<{
    _id: string
    nombre: string
    apellido: string
    fotoPerfil?: { url: string }
  }>
  docente?: { nombre: string; email: string }
  imagenes: string[]
  tecnologias: string[]
  tags: string[]
  likes: string[]
  comentarios: Array<{
    _id: string
    estudiante: {
      _id: string
      nombre: string
      apellido: string
      fotoPerfil?: { url: string }
    }
    texto: string
    fecha: string
  }>
  vistas: number
  fechaInicio: string
  fechaFin?: string
  repositorio?: string
  enlaceDemo?: string
  carrera: string
  nivel?: number
  estado: string
}

export default function ProyectoDetallePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [proyecto, setProyecto] = useState<Proyecto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [comentario, setComentario] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    async function fetchProyecto() {
      try {
        const data = await getProyecto(params.id as string)
        setProyecto(data)
      } catch (error) {
        console.error("Error al cargar proyecto:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar el proyecto",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchProyecto()
    }
  }, [params.id, toast])

  const hasLiked = user && proyecto ? proyecto.likes.includes(user._id) : false

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para dar like",
      })
      return
    }

    if (!proyecto || isLiking) return

    setIsLiking(true)
    try {
      if (hasLiked) {
        await quitarLike(proyecto._id)
        setProyecto({
          ...proyecto,
          likes: proyecto.likes.filter((id) => id !== user._id),
        })
      } else {
        await agregarLike(proyecto._id)
        setProyecto({
          ...proyecto,
          likes: [...proyecto.likes, user._id],
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar el like",
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para comentar",
      })
      return
    }

    if (!comentario.trim() || !proyecto) return

    setIsSubmittingComment(true)
    try {
      const data = await agregarComentario(proyecto._id, comentario)
      setProyecto(data.proyecto)
      setComentario("")
      toast({
        title: "Comentario agregado",
        description: "Tu comentario ha sido publicado",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el comentario",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (comentarioId: string) => {
    if (!proyecto) return

    try {
      const data = await eliminarComentario(proyecto._id, comentarioId)
      setProyecto(data.proyecto)
      toast({
        title: "Comentario eliminado",
        description: "El comentario ha sido eliminado",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el comentario",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: proyecto?.titulo,
          text: proyecto?.descripcion,
          url,
        })
      } catch (error) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Enlace copiado",
        description: "El enlace ha sido copiado al portapapeles",
      })
    }
  }

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!proyecto) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Proyecto no encontrado</h1>
            <Button asChild>
              <Link href="/proyectos">Ver todos los proyectos</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b">
          <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/proyectos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a proyectos
              </Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <Badge variant={proyecto.categoria === "academico" ? "default" : "secondary"} className="mb-3">
                      {proyecto.categoria === "academico" ? "Académico" : "Extracurricular"}
                    </Badge>
                    <h1 className="text-3xl font-bold text-foreground lg:text-4xl text-balance">
                      {proyecto.titulo}
                    </h1>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 ${hasLiked ? "text-red-500" : ""}`}
                    onClick={handleLike}
                    disabled={isLiking}
                  >
                    <Heart className={`h-5 w-5 ${hasLiked ? "fill-current" : ""}`} />
                    {proyecto.likes.length}
                  </Button>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    {proyecto.comentarios.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    {proyecto.vistas}
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Images */}
              {proyecto.imagenes?.length > 0 && (
                <div className="space-y-4">
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={proyecto.imagenes[selectedImage]}
                      alt={proyecto.titulo}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {proyecto.imagenes.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {proyecto.imagenes.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                            selectedImage === index ? "border-primary" : "border-transparent"
                          }`}
                        >
                          <Image src={img} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Descripción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {proyecto.descripcion}
                  </p>
                </CardContent>
              </Card>

              {/* Technologies */}
              {proyecto.tecnologias?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tecnologías utilizadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {proyecto.tecnologias.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Comments */}
              <Card>
                <CardHeader>
                  <CardTitle>Comentarios ({proyecto.comentarios.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Comment Form */}
                  {user ? (
                    <form onSubmit={handleSubmitComment} className="space-y-4">
                      <Textarea
                        placeholder="Escribe un comentario..."
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        rows={3}
                      />
                      <Button type="submit" disabled={isSubmittingComment || !comentario.trim()}>
                        {isSubmittingComment ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        Comentar
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-4 bg-muted/50 rounded-lg">
                      <p className="text-muted-foreground mb-2">Inicia sesión para comentar</p>
                      <Button variant="outline" asChild>
                        <Link href="/login">Iniciar sesión</Link>
                      </Button>
                    </div>
                  )}

                  <Separator />

                  {/* Comments List */}
                  {proyecto.comentarios.length > 0 ? (
                    <div className="space-y-4">
                      {proyecto.comentarios.map((comentario) => (
                        <div key={comentario._id} className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={comentario.estudiante?.fotoPerfil?.url} />
                            <AvatarFallback>
                              {comentario.estudiante
                                ? getInitials(comentario.estudiante.nombre, comentario.estudiante.apellido)
                                : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-foreground">
                                {comentario.estudiante?.nombre} {comentario.estudiante?.apellido}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(comentario.fecha)}
                                </span>
                                {user && user._id === comentario.estudiante?._id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-destructive"
                                    onClick={() => handleDeleteComment(comentario._id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <p className="text-muted-foreground mt-1">{comentario.texto}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      Aún no hay comentarios. Sé el primero en comentar.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Autor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={proyecto.autor?.fotoPerfil?.url} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {proyecto.autor
                          ? getInitials(proyecto.autor.nombre, proyecto.autor.apellido)
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {proyecto.autor?.nombre} {proyecto.autor?.apellido}
                      </p>
                      <p className="text-sm text-muted-foreground">{proyecto.autor?.carrera}</p>
                      <p className="text-xs text-muted-foreground">Nivel {proyecto.autor?.nivel}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Collaborators */}
              {proyecto.colaboradores && proyecto.colaboradores.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Colaboradores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {proyecto.colaboradores.map((colab) => (
                        <div key={colab._id} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={colab.fotoPerfil?.url} />
                            <AvatarFallback className="text-xs">
                              {getInitials(colab.nombre, colab.apellido)}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm text-foreground">
                            {colab.nombre} {colab.apellido}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Información
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Carrera</p>
                    <p className="font-medium text-foreground">{proyecto.carrera}</p>
                  </div>
                  {proyecto.asignatura && (
                    <div>
                      <p className="text-sm text-muted-foreground">Asignatura</p>
                      <p className="font-medium text-foreground">{proyecto.asignatura}</p>
                    </div>
                  )}
                  {proyecto.docente && (
                    <div>
                      <p className="text-sm text-muted-foreground">Docente</p>
                      <p className="font-medium text-foreground">{proyecto.docente.nombre}</p>
                    </div>
                  )}
                  <Separator />
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Inicio:</span>
                    <span className="text-foreground">{formatDate(proyecto.fechaInicio)}</span>
                  </div>
                  {proyecto.fechaFin && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Fin:</span>
                      <span className="text-foreground">{formatDate(proyecto.fechaFin)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Links */}
              {(proyecto.repositorio || proyecto.enlaceDemo) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Enlaces</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {proyecto.repositorio && (
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href={proyecto.repositorio} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-2" />
                          Repositorio
                        </a>
                      </Button>
                    )}
                    {proyecto.enlaceDemo && (
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <a href={proyecto.enlaceDemo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Demo en vivo
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              {proyecto.tags?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {proyecto.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
