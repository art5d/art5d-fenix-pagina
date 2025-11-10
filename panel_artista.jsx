/**
 * Netlify Function para invocar la API de Imagen de forma segura.
 * * Esta función se ejecuta en el backend de Netlify, por lo que la
 * GEMINI_API_KEY (o IMAGEN_API_KEY) permanece oculta en las variables de entorno.
 * * Ruta de acceso en el frontend: /.netlify/functions/generar-boceto
 */
const fetch = require('node-fetch');

// El nombre de la variable de entorno que debes configurar en Netlify
const API_KEY = process.env.GEMINI_API_KEY; 

// URL del modelo de Imagen
const BASE_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict";

exports.handler = async (event, context) => {
    // Solo permitimos POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método no permitido. Use POST.' }),
        };
    }

    // Asegúrate de que la clave exista antes de continuar
    if (!API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'La clave de API no está configurada en las variables de entorno de Netlify.' }),
        };
    }

    try {
        const { prompt } = JSON.parse(event.body);

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Falta el prompt en el cuerpo de la solicitud.' }),
            };
        }

        const payload = { 
            instances: [{ prompt: prompt }], 
            parameters: { "sampleCount": 1 } 
        };

        // Llama a la API de Imagen usando la clave segura
        const response = await fetch(`${BASE_API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        
        const base64Image = result?.predictions?.[0]?.bytesBase64Encoded;

        if (base64Image) {
            // Devuelve la imagen base64
            return {
                statusCode: 200,
                body: JSON.stringify({ imageUrl: `data:image/png;base64,${base64Image}` }),
            };
        } else {
            console.error("Respuesta de Imagen inválida:", result);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Fallo al generar la imagen. Respuesta de la API inválida.' }),
            };
        }

    } catch (error) {
        console.error("Error al llamar a la API:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Error interno: ${error.message}` }),
        };
    }
};
