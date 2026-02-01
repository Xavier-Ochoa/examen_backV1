import fetch from 'node-fetch';



// ============================================
// CONFIGURACIÓN DEL MODELO DE IA
// ============================================
// Modelo: Stable Diffusion XL Base 1.0
// Función: Generación de imágenes a partir de descripciones de texto
// Proveedor: Hugging Face Inference API
const MODELO_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';

// ============================================================
// POST /api/ia/generar-imagen
// Body: { descripcion: string }
// Retorna: { success: boolean, data: { imagen: string (base64), prompt: string } }
// ============================================================
export const generarImagenProyecto = async (req, res) => {
  try {
    const { descripcion } = req.body;

    // ── Validaciones ──
    if (!descripcion || descripcion.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'La descripción debe tener al menos 10 caracteres para generar una imagen'
      });
    }

    // Verificar que el token de Hugging Face esté configurado
    const hfToken = process.env.HF_API_TOKEN;
    if (!hfToken) {
      console.error('⚠️ HF_API_TOKEN no está definido en .env');
      return res.status(500).json({
        success: false,
        message: 'El servicio de IA no está configurado en el servidor'
      });
    }

    // ── Construir el prompt optimizado para generación de imágenes ──
    // Stable Diffusion funciona mejor con prompts descriptivos en inglés
    const prompt = construirPromptImagen(descripcion);

    console.log('🎨 Generando imagen con prompt:', prompt);

    // ── Llamada a Hugging Face API ──
    const response = await fetch(MODELO_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: "blurry, low quality, distorted, ugly, bad anatomy",
          num_inference_steps: 30,
          guidance_scale: 7.5
        }
      })
    });

    // ── Manejar errores de la API ──
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ Error de Hugging Face API:', response.status, errorBody);

      // El modelo puede tardar en cargar la primera vez (503)
      if (response.status === 503) {
        return res.status(503).json({
          success: false,
          message: 'El modelo de IA está cargando. Por favor, espera 10-20 segundos e intenta nuevamente.'
        });
      }

      if (response.status === 401) {
        return res.status(401).json({
          success: false,
          message: 'Token de Hugging Face inválido. Verifica HF_API_TOKEN en el archivo .env'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Error al comunicarse con el servicio de generación de imágenes'
      });
    }

    // ── Obtener el Blob de la imagen ──
    const imageBlob = await response.blob();

    // Verificar que sea una imagen válida
    if (!imageBlob.type.startsWith('image/')) {
      console.error('❌ La respuesta no es una imagen válida:', imageBlob.type);
      return res.status(500).json({
        success: false,
        message: 'El modelo no generó una imagen válida. Intenta con una descripción diferente.'
      });
    }

    // ── Convertir Blob a Base64 ──
    const base64Image = await convertirBlobABase64(imageBlob);

    console.log('✅ Imagen generada exitosamente');

    // ── Retornar la imagen en Base64 ──
    res.status(200).json({
      success: true,
      data: {
        imagen: base64Image,
        prompt: prompt,
        modelo: 'stabilityai/stable-diffusion-xl-base-1.0'
      }
    });

  } catch (error) {
    console.error('❌ Error al generar imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno al generar la imagen del proyecto'
    });
  }
};

// ============================================================
// FUNCIONES AUXILIARES
// ============================================================

/**
 * Construye un prompt optimizado para Stable Diffusion
 * a partir de la descripción del proyecto
 * 
 * @param {string} descripcion - Descripción del proyecto en español
 * @returns {string} - Prompt optimizado en inglés
 */
function construirPromptImagen(descripcion) {
  const desc = descripcion.toLowerCase();
  
  // Detectar palabras clave para mejorar el prompt
  let estilo = 'professional, modern, clean design';
  let categoria = 'technology project';
  
  // Categorías específicas
  if (/educaci[oó]n|académ|estudiant|escuela|universidad/i.test(desc)) {
    categoria = 'educational technology';
    estilo = 'clean, professional, learning environment';
  }
  if (/salud|médic|hospital|pacient|clínic/i.test(desc)) {
    categoria = 'healthcare technology';
    estilo = 'medical, professional, trustworthy';
  }
  if (/e-commerce|tienda|venta|comercio/i.test(desc)) {
    categoria = 'e-commerce platform';
    estilo = 'modern, commercial, attractive';
  }
  if (/m[oó]vil|mobile|app/i.test(desc)) {
    categoria = 'mobile application';
    estilo = 'modern, sleek, user-friendly interface';
  }
  if (/web|sitio|página/i.test(desc)) {
    categoria = 'web application';
    estilo = 'modern web design, responsive';
  }
  if (/agr[ií]cola|campo|cultivo|granja/i.test(desc)) {
    categoria = 'agricultural technology';
    estilo = 'nature, technology, sustainable';
  }
  if (/juego|game|entretenimiento/i.test(desc)) {
    categoria = 'gaming application';
    estilo = 'colorful, fun, engaging';
  }

  // Construir el prompt final
  const prompt = `${categoria}, ${estilo}, high quality, detailed, digital illustration, professional presentation`;
  
  return prompt;
}

/**
 * Convierte un Blob de imagen a formato Base64
 * 
 * @param {Blob} blob - Imagen en formato Blob
 * @returns {Promise<string>} - Imagen en formato Base64 (data:image/jpeg;base64,...)
 */
async function convertirBlobABase64(blob) {
  // Convertir el Blob a ArrayBuffer
  const arrayBuffer = await blob.arrayBuffer();
  
  // Convertir ArrayBuffer a Buffer de Node.js
  const buffer = Buffer.from(arrayBuffer);
  
  // Convertir Buffer a Base64
  const base64 = buffer.toString('base64');
  
  // Determinar el tipo MIME de la imagen
  const mimeType = blob.type || 'image/jpeg';
  
  // Retornar en formato Data URL
  return `data:${mimeType};base64,${base64}`;
}