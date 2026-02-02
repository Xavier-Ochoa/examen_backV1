"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, AlertCircle, X, Plus, ImagePlus } from "lucide-react"
import { crearProyecto } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const carreras = [
  "Desarrollo de Software",
  "Redes y Telecomunicaciones",
  "Electromecánica",
  "Agua y Saneamiento Ambiental",
]

export default function NuevoProyectoPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "",
    asignatura: "",
    carrera: user?.carrera || "",
    nivel: user?.nivel?.toString() || "",
    fechaInicio: "",
    fechaFin: "",
    repositorio: "",
    enlaceDemo: "",
    docenteNombre: "",
    docenteEmail: "",
  })
  const [tecnologias, setTecnologias] = useState<string[]>([])
  const [newTech, setNewTech] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const addTech = () => {
    if (newTech.trim() && !tecnologias.includes(newTech.trim())) {
      setTecnologias([...tecnologias, newTech.trim()])
      setNewTech("")
    }
  }

  const removeTech = (tech: string) => {
    setTecnologias(tecnologias.filter((t) => t !== tech))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()])
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 5) {
      toast({
        title: "Límite de imágenes",
        description: "Máximo 5 imágenes por proyecto",
        variant: "destructive",
      })
      return
    }

    const newImages = [...images, ...files]
    setImages(newImages)

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...newPreviews])
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.titulo || !formData.descripcion || !formData.categoria || !formData.fechaInicio) {
      setError("Por favor completa los campos obligatorios")
      return
    }

    setIsLoading(true)

    try {
      const data = new FormData()
      data.append("titulo", formData.titulo)
      data.append("descripcion", formData.descripcion)
      data.append("categoria", formData.categoria)
      data.append("carrera", formData.carrera || user?.carrera || "")
      data.append("fechaInicio", formData.fechaInicio)

      if (formData.asignatura) data.append("asignatura", formData.asignatura)
      if (formData.nivel) data.append("nivel", formData.nivel)
      if (formData.fechaFin) data.append("fechaFin", formData.fechaFin)
      if (formData.repositorio) data.append("repositorio", formData.repositorio)
      if (formData.enlaceDemo) data.append("enlaceDemo", formData.enlaceDemo)

      if (formData.docenteNombre || formData.docenteEmail) {
        data.append("docente", JSON.stringify({
          nombre: formData.docenteNombre,
          email: formData.docenteEmail,
        }))
      }

      tecnologias.forEach((tech) => data.append("tecnologias[]", tech))
      tags.forEach((tag) => data.append("tags[]", tag))
      images.forEach((image) => data.append("imagenes", image))

      await crearProyecto(data)

      toast({
        title: "Proyecto creado",
        description: "Tu proyecto ha sido creado exitosamente",
      })

      router.push("/mis-proyectos")
    } catch (err: any) {
      setError(err.message || "Error al crear el proyecto")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
          {/* Back Button */}
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link href="/mis-proyectos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a mis proyectos
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Nuevo Proyecto</CardTitle>
              <CardDescription>
                Completa la información de tu proyecto académico o extracurricular
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título del Proyecto *</Label>
                    <Input
                      id="titulo"
                      name="titulo"
                      placeholder="Nombre de tu proyecto"
                      value={formData.titulo}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción *</Label>
                    <Textarea
                      id="descripcion"
                      name="descripcion"
                      placeholder="Describe tu proyecto, sus objetivos y funcionalidades..."
                      value={formData.descripcion}
                      onChange={handleChange}
                      rows={5}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoría *</Label>
                      <Select
                        value={formData.categoria}
                        onValueChange={(value) => handleSelectChange("categoria", value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academico">Académico</SelectItem>
                          <SelectItem value="extracurricular">Extracurricular</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="asignatura">Asignatura</Label>
                      <Input
                        id="asignatura"
                        name="asignatura"
                        placeholder="Ej: Desarrollo Web"
                        value={formData.asignatura}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="carrera">Carrera</Label>
                      <Select
                        value={formData.carrera}
                        onValueChange={(value) => handleSelectChange("carrera", value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          {carreras.map((carrera) => (
                            <SelectItem key={carrera} value={carrera}>
                              {carrera}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nivel">Nivel</Label>
                      <Select
                        value={formData.nivel}
                        onValueChange={(value) => handleSelectChange("nivel", value)}
                        disabled={isLoading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((nivel) => (
                            <SelectItem key={nivel} value={nivel.toString()}>
                              Nivel {nivel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fechaInicio">Fecha de Inicio *</Label>
                    <Input
                      id="fechaInicio"
                      name="fechaInicio"
                      type="date"
                      value={formData.fechaInicio}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaFin">Fecha de Fin</Label>
                    <Input
                      id="fechaFin"
                      name="fechaFin"
                      type="date"
                      value={formData.fechaFin}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-2">
                  <Label>Tecnologías</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ej: React, Node.js..."
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                      disabled={isLoading}
                    />
                    <Button type="button" variant="outline" onClick={addTech} disabled={isLoading}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {tecnologias.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tecnologias.map((tech) => (
                        <Badge key={tech} variant="secondary" className="gap-1">
                          {tech}
                          <button type="button" onClick={() => removeTech(tech)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ej: web, movil, iot..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      disabled={isLoading}
                    />
                    <Button type="button" variant="outline" onClick={addTag} disabled={isLoading}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="gap-1">
                          #{tag}
                          <button type="button" onClick={() => removeTag(tag)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Links */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="repositorio">Repositorio (GitHub, GitLab...)</Label>
                    <Input
                      id="repositorio"
                      name="repositorio"
                      type="url"
                      placeholder="https://github.com/..."
                      value={formData.repositorio}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enlaceDemo">Enlace Demo</Label>
                    <Input
                      id="enlaceDemo"
                      name="enlaceDemo"
                      type="url"
                      placeholder="https://..."
                      value={formData.enlaceDemo}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Teacher */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="docenteNombre">Nombre del Docente</Label>
                    <Input
                      id="docenteNombre"
                      name="docenteNombre"
                      placeholder="Nombre del docente responsable"
                      value={formData.docenteNombre}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="docenteEmail">Email del Docente</Label>
                    <Input
                      id="docenteEmail"
                      name="docenteEmail"
                      type="email"
                      placeholder="docente@epn.edu.ec"
                      value={formData.docenteEmail}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <Label>Imágenes (máx. 5)</Label>
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <img src={preview} alt="" className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {images.length < 5 && (
                      <label className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 cursor-pointer hover:border-primary/50 transition-colors">
                        <div className="text-center">
                          <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Agregar imagen</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={isLoading}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      "Crear Proyecto"
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
