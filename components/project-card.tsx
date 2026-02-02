"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Eye, Calendar, ExternalLink, Github } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { agregarLike, quitarLike } from "@/lib/api"
import { useState } from "react"

interface Proyecto {
  _id: string
  titulo: string
  descripcion: string
  categoria: "academico" | "extracurricular"
  autor: {
    _id: string
    nombre: string
    apellido: string
    fotoPerfil?: { url: string }
    carrera: string
  }
  imagenes: string[]
  tecnologias: string[]
  likes: string[]
  comentarios: { _id: string }[]
  vistas: number
  fechaInicio: string
  repositorio?: string
  enlaceDemo?: string
  carrera: string
  estado: string
}

interface ProjectCardProps {
  proyecto: Proyecto
  onLikeChange?: () => void
}

export function ProjectCard({ proyecto, onLikeChange }: ProjectCardProps) {
  const { user } = useAuth()
  const [isLiking, setIsLiking] = useState(false)
  const [likes, setLikes] = useState(proyecto.likes)

  const hasLiked = user ? likes.includes(user._id) : false

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user || isLiking) return

    setIsLiking(true)
    try {
      if (hasLiked) {
        await quitarLike(proyecto._id)
        setLikes(likes.filter((id) => id !== user._id))
      } else {
        await agregarLike(proyecto._id)
        setLikes([...likes, user._id])
      }
      onLikeChange?.()
    } catch (error) {
      console.error("Error al dar/quitar like:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "short",
    })
  }

  return (
    <Link href={`/proyectos/${proyecto._id}`}>
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {proyecto.imagenes?.[0] ? (
            <Image
              src={proyecto.imagenes[0]}
              alt={proyecto.titulo}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <span className="text-4xl font-bold text-primary/40">
                {proyecto.titulo.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant={proyecto.categoria === "academico" ? "default" : "secondary"}>
              {proyecto.categoria === "academico" ? "Académico" : "Extracurricular"}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <h3 className="line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {proyecto.titulo}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{proyecto.descripcion}</p>
        </CardHeader>

        <CardContent className="pb-2">
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-7 w-7">
              <AvatarImage src={proyecto.autor?.fotoPerfil?.url} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {proyecto.autor ? getInitials(proyecto.autor.nombre, proyecto.autor.apellido) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {proyecto.autor?.nombre} {proyecto.autor?.apellido}
              </p>
              <p className="text-xs text-muted-foreground truncate">{proyecto.carrera}</p>
            </div>
          </div>

          {proyecto.tecnologias?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {proyecto.tecnologias.slice(0, 3).map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
              {proyecto.tecnologias.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{proyecto.tecnologias.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t pt-3">
          <div className="flex w-full items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`h-auto p-0 ${hasLiked ? "text-red-500" : ""}`}
                onClick={handleLike}
                disabled={!user || isLiking}
              >
                <Heart className={`h-4 w-4 mr-1 ${hasLiked ? "fill-current" : ""}`} />
                <span className="text-xs">{likes.length}</span>
              </Button>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{proyecto.comentarios?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span className="text-xs">{proyecto.vistas}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {proyecto.repositorio && (
                <Github className="h-4 w-4" />
              )}
              {proyecto.enlaceDemo && (
                <ExternalLink className="h-4 w-4" />
              )}
              <div className="flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3" />
                {formatDate(proyecto.fechaInicio)}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
