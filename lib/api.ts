const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// IA - Sugerencias de títulos
export async function getSugerenciasTitulo(descripcion: string) {
  const response = await fetch(`${API_URL}/ia/sugerir-titulo`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ descripcion }),
  })
  if (!response.ok) throw new Error("Error al obtener sugerencias")
  return response.json()
}

// Random image
export async function getRandomImage() {
  const response = await fetch(`${API_URL}/auth/random-image`)
  if (!response.ok) throw new Error("Error al obtener imagen")
  return response.json()
}

// Frases inspiradoras
export async function getFraseInspiradora() {
  const response = await fetch(`${API_URL}/auth/frases`)
  if (!response.ok) throw new Error("Error al obtener frase")
  return response.json()
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Proyectos
export async function getProyectos(params?: {
  categoria?: string
  carrera?: string
  buscar?: string
}) {
  const searchParams = new URLSearchParams()
  if (params?.categoria) searchParams.set("categoria", params.categoria)
  if (params?.carrera) searchParams.set("carrera", params.carrera)
  if (params?.buscar) searchParams.set("q", params.buscar)

  const url = params?.buscar
    ? `${API_URL}/proyectos/buscar?${searchParams}`
    : `${API_URL}/proyectos?${searchParams}`

  const response = await fetch(url)
  if (!response.ok) throw new Error("Error al obtener proyectos")
  return response.json()
}

export async function getProyectosDestacados() {
  const response = await fetch(`${API_URL}/proyectos/destacados`)
  if (!response.ok) throw new Error("Error al obtener proyectos destacados")
  return response.json()
}

export async function getProyecto(id: string) {
  const response = await fetch(`${API_URL}/proyectos/${id}`)
  if (!response.ok) throw new Error("Error al obtener proyecto")
  return response.json()
}

export async function getProyectosPorCategoria(categoria: string) {
  const response = await fetch(`${API_URL}/proyectos/categoria/${categoria}`)
  if (!response.ok) throw new Error("Error al obtener proyectos por categoría")
  return response.json()
}

export async function getProyectosPorCarrera(carrera: string) {
  const response = await fetch(`${API_URL}/proyectos/carrera/${encodeURIComponent(carrera)}`)
  if (!response.ok) throw new Error("Error al obtener proyectos por carrera")
  return response.json()
}

export async function crearProyecto(data: FormData) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const response = await fetch(`${API_URL}/proyectos`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.msg || "Error al crear proyecto")
  }
  return response.json()
}

export async function actualizarProyecto(id: string, data: FormData) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const response = await fetch(`${API_URL}/proyectos/${id}`, {
    method: "PUT",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data,
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.msg || "Error al actualizar proyecto")
  }
  return response.json()
}

export async function eliminarProyecto(id: string) {
  const response = await fetch(`${API_URL}/proyectos/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error("Error al eliminar proyecto")
  return response.json()
}

export async function agregarLike(id: string) {
  const response = await fetch(`${API_URL}/proyectos/${id}/like`, {
    method: "POST",
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error("Error al dar like")
  return response.json()
}

export async function quitarLike(id: string) {
  const response = await fetch(`${API_URL}/proyectos/${id}/like`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error("Error al quitar like")
  return response.json()
}

export async function agregarComentario(id: string, texto: string) {
  const response = await fetch(`${API_URL}/proyectos/${id}/comentarios`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ texto }),
  })
  if (!response.ok) throw new Error("Error al agregar comentario")
  return response.json()
}

export async function eliminarComentario(proyectoId: string, comentarioId: string) {
  const response = await fetch(`${API_URL}/proyectos/${proyectoId}/comentarios/${comentarioId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error("Error al eliminar comentario")
  return response.json()
}

// Mis proyectos
export async function getMisProyectos() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {}
  
  const response = await fetch(`${API_URL}/proyectos/estudiante/${user._id}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })
  if (!response.ok) throw new Error("Error al obtener mis proyectos")
  return response.json()
}

// Dashboard
export async function getDashboardUsuario() {
  const response = await fetch(`${API_URL}/dashboard/usuario`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error("Error al obtener dashboard")
  return response.json()
}

export async function getDashboardAdmin() {
  const response = await fetch(`${API_URL}/dashboard/admin`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error("Error al obtener dashboard admin")
  return response.json()
}

// Admin proyectos
export async function getProyectosAdmin() {
  const response = await fetch(`${API_URL}/admin/proyectos`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error("Error al obtener proyectos")
  return response.json()
}

export async function publicarProyecto(id: string) {
  const response = await fetch(`${API_URL}/admin/proyectos/${id}/publicar`, {
    method: "PUT",
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error("Error al publicar proyecto")
  return response.json()
}

export async function despublicarProyecto(id: string) {
  const response = await fetch(`${API_URL}/admin/proyectos/${id}/despublicar`, {
    method: "PUT",
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error("Error al despublicar proyecto")
  return response.json()
}

// Estudiantes admin
export async function getEstudiantes(params?: { carrera?: string; nivel?: number; apellido?: string }) {
  const searchParams = new URLSearchParams()
  if (params?.carrera) searchParams.set("carrera", params.carrera)
  if (params?.nivel) searchParams.set("nivel", params.nivel.toString())
  if (params?.apellido) searchParams.set("apellido", params.apellido)

  const response = await fetch(`${API_URL}/admin/estudiantes?${searchParams}`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error("Error al obtener estudiantes")
  return response.json()
}

export async function getEstadisticasEstudiantes() {
  const response = await fetch(`${API_URL}/admin/estudiantes/estadisticas`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error("Error al obtener estadísticas")
  return response.json()
}

// Perfil
export async function actualizarPerfil(id: string, data: Record<string, unknown>) {
  const response = await fetch(`${API_URL}/auth/perfil/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.msg || "Error al actualizar perfil")
  }
  return response.json()
}

export async function cambiarPassword(id: string, data: { passwordActual: string; nuevoPassword: string }) {
  const response = await fetch(`${API_URL}/auth/password/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.msg || "Error al cambiar contraseña")
  }
  return response.json()
}
