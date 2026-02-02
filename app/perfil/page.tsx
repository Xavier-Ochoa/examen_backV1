"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { actualizarPerfil, cambiarPassword } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

const carreras = [
  "Desarrollo de Software",
  "Redes y Telecomunicaciones",
  "Electromecánica",
  "Agua y Saneamiento Ambiental",
]

export default function PerfilPage() {
  const router = useRouter()
  const { user, updateUser, isLoading: authLoading } = useAuth()
  const { toast } = useToast()

  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    celular: "",
    bio: "",
    carrera: user?.carrera || "",
    nivel: user?.nivel?.toString() || "",
  })
  const [passwordData, setPasswordData] = useState({
    passwordActual: "",
    nuevoPassword: "",
    confirmarPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [profileError, setProfileError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase()
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError("")
    setIsUpdatingProfile(true)

    try {
      const data = await actualizarPerfil(user._id, {
        nombre: profileData.nombre,
        apellido: profileData.apellido,
        celular: profileData.celular || undefined,
        bio: profileData.bio || undefined,
        carrera: profileData.carrera,
        nivel: parseInt(profileData.nivel),
      })

      updateUser(data.user)
      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada correctamente",
      })
    } catch (err: any) {
      setProfileError(err.message)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (passwordData.nuevoPassword !== passwordData.confirmarPassword) {
      setPasswordError("Las contraseñas no coinciden")
      return
    }

    if (passwordData.nuevoPassword.length < 6) {
      setPasswordError("La nueva contraseña debe tener al menos 6 caracteres")
      return
    }

    setIsUpdatingPassword(true)

    try {
      await cambiarPassword(user._id, {
        passwordActual: passwordData.passwordActual,
        nuevoPassword: passwordData.nuevoPassword,
      })

      setPasswordData({
        passwordActual: "",
        nuevoPassword: "",
        confirmarPassword: "",
      })

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada correctamente",
      })
    } catch (err: any) {
      setPasswordError(err.message)
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
          <h1 className="text-2xl font-bold text-foreground mb-8">Mi Perfil</h1>

          {/* Profile Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.fotoPerfil?.url} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {getInitials(user.nombre, user.apellido)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">
                    {user.nombre} {user.apellido}
                  </CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.carrera} - Nivel {user.nivel}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Edit Profile Form */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Actualiza tu información de perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                {profileError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{profileError}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={profileData.nombre}
                      onChange={handleProfileChange}
                      disabled={isUpdatingProfile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      name="apellido"
                      value={profileData.apellido}
                      onChange={handleProfileChange}
                      disabled={isUpdatingProfile}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="celular">Celular</Label>
                  <Input
                    id="celular"
                    name="celular"
                    placeholder="0999999999"
                    value={profileData.celular}
                    onChange={handleProfileChange}
                    disabled={isUpdatingProfile}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Cuéntanos sobre ti..."
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    rows={3}
                    disabled={isUpdatingProfile}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="carrera">Carrera</Label>
                    <Select
                      value={profileData.carrera}
                      onValueChange={(value) => setProfileData({ ...profileData, carrera: value })}
                      disabled={isUpdatingProfile}
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                      value={profileData.nivel}
                      onValueChange={(value) => setProfileData({ ...profileData, nivel: value })}
                      disabled={isUpdatingProfile}
                    >
                      <SelectTrigger>
                        <SelectValue />
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

                <Button type="submit" disabled={isUpdatingProfile}>
                  {isUpdatingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password Form */}
          <Card>
            <CardHeader>
              <CardTitle>Cambiar Contraseña</CardTitle>
              <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {passwordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="passwordActual">Contraseña Actual</Label>
                  <div className="relative">
                    <Input
                      id="passwordActual"
                      name="passwordActual"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.passwordActual}
                      onChange={handlePasswordChange}
                      disabled={isUpdatingPassword}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nuevoPassword">Nueva Contraseña</Label>
                  <Input
                    id="nuevoPassword"
                    name="nuevoPassword"
                    type="password"
                    value={passwordData.nuevoPassword}
                    onChange={handlePasswordChange}
                    disabled={isUpdatingPassword}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarPassword">Confirmar Nueva Contraseña</Label>
                  <Input
                    id="confirmarPassword"
                    name="confirmarPassword"
                    type="password"
                    value={passwordData.confirmarPassword}
                    onChange={handlePasswordChange}
                    disabled={isUpdatingPassword}
                  />
                </div>

                <Button type="submit" disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cambiando...
                    </>
                  ) : (
                    "Cambiar Contraseña"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
