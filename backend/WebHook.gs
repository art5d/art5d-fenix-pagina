/**
 * Maneja las peticiones POST enviadas a la URL de la Web App.
 * * @param {object} e Objeto de evento que contiene los datos de la petición (payload).
 * @returns {GoogleAppsScript.Content.TextOutput} Respuesta HTTP en formato JSON.
 */
function doPost(e) {
  // Asegurarse de que hay datos en la petición
  if (!e.postData || e.postData.type !== "application/json") {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Petición inválida o formato incorrecto. Espera 'application/json'." 
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // 1. Parsear los datos JSON enviados en el cuerpo de la petición
    const data = JSON.parse(e.postData.contents);
    
    // Extraer los parámetros que necesita generateArtwork
    const prompt = data.prompt;
    const userEmail = data.userEmail;
    // Usar "both" como motor por defecto si no se especifica
    const engine = data.engine || "both"; 
    
    // 2. Llamar a tu función principal para generar el arte y manejar los límites
    const resultados = generateArtwork(prompt, userEmail, engine);
    
    // 3. Devolver la respuesta al cliente en formato JSON
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      data: resultados 
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Capturar cualquier error durante la ejecución o el parseo
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "ERROR INTERNO: " + error.message 
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
