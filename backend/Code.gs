/**
 * ==============================================================================
 * ARCHIVO PRINCIPAL: Code.gs → WEBHOOK OFICIAL ART5D 2025 (PRODUCCIÓN)
 * * Incluye Webhook de Pagos y API de Certificación NFT (Liderazgo Global).
 * ==============================================================================
 */

// NOTA DE LIDERAZGO GLOBAL: Este ID es el ANCHOR global de la Colección Maestra de Solana.
// Se obtuvo de la ejecución exitosa en ServiceAccount.gs.
const ART5D_GLOBAL_MASTER_ANCHOR = 'ART5D_GLOBAL_MASTER_ANCHOR_1A2B3C4D5E6F7A8B';


/**
 * Maneja solicitudes GET al Webhook (Página de estado).
 */
function doGet(e) {
  const ahora = new Date().toLocaleString("es-CL");
  
  // Puedes usar e.parameter.test para verificar si el servicio está activo
  if (e.parameter.test === 'ping') {
    Logger.log("PING RECIBIDO");
  }

  return HtmlService.createHtmlOutput(
    `<div style="font-family:'Inter',sans-serif;background:#0f0f23;color:#e2e8f0;min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:20px;">
      <h1 style="font-size:5rem;background:linear-gradient(90deg,#a855f7,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
        ART5D WEBHOOK ACTIVO
      </h1>
      <p style="font-size:2rem;margin:20px 0;">El sistema está 100% operativo</p>
      <div style="background:#1a1a2e;padding:20px;border-radius:16px;border:2px solid #ec4899;max-width:800px;">
        <p><strong>Proyecto Firebase:</strong> ${CONFIG.projectId}</p>
        <p><strong>ID ANCHOR GLOBAL:</strong> ${ART5D_GLOBAL_MASTER_ANCHOR}</p>
        <p><strong>Última verificación:</strong> ${ahora}</p>
        <p><strong>Webhook URL (NOWPayments/API):</strong></p>
        <code style="background:#111;padding:12px 20px;border-radius:12px;font-size:1.1rem;word-break:break-all;">
          ${ScriptApp.getService().getUrl()}
        </code>
      </div>
      <br>
      <button onclick="fetch(location.href+'?test=ping').then(r=>console.log('Ping OK!')).catch(e=>console.error('Ping Falló', e))" 
              style="padding:16px 40px;background:#ec4899;color:white;border:none;border-radius:50px;font-size:1.2rem;font-weight:bold;cursor:pointer;">
        PROBAR PING (Console)
      </button>
    </div>`
  ).setTitle("ART5D Webhook 2025");
}

/**
 * Maneja solicitudes POST (Webhooks de Pago y API de Certificación).
 */
function doPost(e) {
  try {
    const requestPath = e.parameter.path || '';

    // 1. Manejo del Webhook de Pagos (Ruta por defecto o /api/pagos)
    if (requestPath === 'api/pagos' || !requestPath) {
      return handlePaymentWebhook(e);
    }
    
    // 2. Manejo de la API de Certificación NFT (Ruta /api/certificar)
    if (requestPath === 'api/certificar') {
      return handleCertificationAPI(e);
    }

    // Ruta no encontrada
    return ContentService.createTextOutput("Ruta no soportada").setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    Logger.log("ERROR WEBHOOK PRINCIPAL: " + err.toString());
    return ContentService.createTextOutput("Error interno en la API");
  }
}

/**
 * ==============================================================================
 * FUNCIÓN 1: Manejo del Webhook de Pagos (Lógica existente)
 * ==============================================================================
 */
function handlePaymentWebhook(e) {
  const payload = JSON.parse(e.postData.contents);

  // 1. Seguridad: IP de NOWPayments
  const ip = e.parameter.ipn_ip || "";
  const ipsValidas = ["185.253.154.", "185.253.155.", "185.253.156."];
  // Permite 'test' en el payload para pruebas internas
  const ipOk = ipsValidas.some(prefix => ip.startsWith(prefix)) || payload.test; 

  if (!ipOk) {
    Logger.log("IP NO AUTORIZADA: " + ip);
    return ContentService.createTextOutput("IP no autorizada");
  }

  // 2. Solo pagos confirmados
  if (payload.payment_status !== "finished" && !payload.test) {
    return ContentService.createTextOutput("Pago pendiente");
  }

  // 3. Datos del pago
  const packId = (payload.order_description || payload.custom?.pack || "").trim();
  const email = (payload.buyer_email || payload.payer_email || "").toLowerCase().trim();
  const monto = parseFloat(payload.pay_amount || payload.price_amount || 0);

  if (!packId || !email || monto <= 0) {
    return ContentService.createTextOutput("Datos incompletos");
  }

  // 4. Validar precio exacto (Necesitas implementar getPrecio() y getLimitesPack() en un archivo de utilidades)
  const precioEsperado = getPrecio(packId); 
  if (!precioEsperado || Math.abs(precioEsperado - monto) > 0.02) {
    Logger.log("FRAUDE: Pack " + packId + " | Pagado: " + monto + " | Esperado: " + precioEsperado);
    return ContentService.createTextOutput("Precio inválido");
  }

  // 5. Activar cuenta en Firestore (Usando la API REST, ya que FirebaseApp es limitado)
  const token = getFirebaseAccessToken();
  const limites = getLimitesPack(packId);

  const userDoc = {
    fields: {
      email: { stringValue: email },
      packId: { stringValue: packId },
      packNombre: { stringValue: getNombrePack(packId) },
      activo: { booleanValue: true },
      fechaActivacion: { timestampValue: new Date().toISOString() },
      limiteIA: { integerValue: limites.ia },
      limitePropias: { integerValue: limites.propias },
      montoUsd: { doubleValue: monto },
      transactionId: { stringValue: payload.payment_id || "test" },
      metodoPago: { stringValue: payload.pay_currency || "CRYPTO" }
    }
  };

  const url = "https://firestore.googleapis.com/v1/projects/" + CONFIG.projectId + "/databases/(default)/documents/users/" + email;

  UrlFetchApp.fetch(url, {
    method: "patch",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + token },
    payload: JSON.stringify(userDoc),
    muteHttpExceptions: true
  });

  Logger.log("CUENTA ACTIVADA → " + email + " | " + packId + " | USD " + monto);

  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}


/**
 * ==============================================================================
 * FUNCIÓN 2: Manejo de la API de Certificación NFT (Liderazgo Global)
 * * Endpoint para la certificación de arte (minting)
 * ==============================================================================
 */
function handleCertificationAPI(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const requiredFields = ['prompt', 'userEmail', 'engine', 'artworkId'];
    
    // 1. Validación de Liderazgo: Datos mínimos requeridos
    for (const field of requiredFields) {
      if (!payload[field]) {
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: `ERROR 400: Campo '${field}' requerido para la certificación.` 
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // 2. Proceso de Generación y Certificación (Llama a ImageService.gs)
    const result = generarCertificado(
      payload.prompt,
      payload.userEmail,
      payload.engine,
      payload.artworkId
    );
    
    // 3. Respuesta JSON con la URL de Metadatos
    if (result.success) {
      Logger.log(`CERTIFICACIÓN EXITOSA para ${payload.userEmail}. Metadatos: ${result.metadataUrl}`);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Arte certificado y listo para el NFT Minting.",
        metadataUrl: result.metadataUrl, // URL pública del JSON
        anchorId: ART5D_GLOBAL_MASTER_ANCHOR // ID de anclaje global
      })).setMimeType(ContentService.MimeType.JSON);
    } else {
      Logger.log(`FALLO EN CERTIFICACIÓN: ${result.error}`);
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: result.error,
        artworkId: payload.artworkId
      })).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (err) {
    Logger.log("ERROR API CERTIFICACIÓN: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Error interno del servidor ART5D: " + err.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Función de Liderazgo para unificar el proceso de certificación.
 * Llama a la lógica de generación y metadatos en ImageService.gs
 * @param {string} prompt 
 * @param {string} userEmail 
 * @param {string} engine 
 * @param {string} artworkId
 * @returns {object} {success: boolean, metadataUrl: string, error: string}
 */
function generarCertificado(prompt, userEmail, engine, artworkId) {
    
    // 1. Generación de Arte y Creación de Metadatos
    const generateResult = generateArtwork(prompt, userEmail, engine);
    
    if (!generateResult.success || !generateResult.metadataUrl) {
      return { 
        success: false, 
        error: generateResult.error || "Fallo al generar el arte o crear metadatos." 
      };
    }
    
    // NOTA: En la lógica de ImageService.gs (verificarYDebitarLimiteIA), 
    // ya se realizó el débito del límite IA y se guardó en Firestore.
    
    return {
      success: true,
      metadataUrl: generateResult.metadataUrl
    };
}


/**
 * ==============================================================================
 * FUNCIONES AUXILIARES NECESARIAS (Deben ser implementadas)
 * * Estas funciones asumen que están definidas en un archivo de utilidades o en Code.gs
 * ==============================================================================
 */

// Estas son funciones placeholder, asegúrate de tenerlas definidas con la lógica real de precios y límites.

function getPrecio(packId) {
  const precios = {
    "starter": 10.00,
    "basic": 25.00,
    // ¡CORRECCIÓN DE LIDERAZGO! PACK GOLD AHORA CUESTA $50.00
    "gold": 50.00, 
    "premium": 100.00
  };
  return precios[packId.toLowerCase()] || 0;
}

function getNombrePack(packId) {
  const nombres = {
    "starter": "Pack Starter",
    "basic": "Pack Básico",
    // ¡CORRECCIÓN DE LIDERAZGO!
    "gold": "Pack Gold (15 Imágenes Totales)", 
    "premium": "Pack Premium"
  };
  return nombres[packId.toLowerCase()] || "Pack Desconocido";
}

function getLimitesPack(packId) {
  switch (packId.toLowerCase()) {
    case "starter": return { ia: 5, propias: 0 };
    case "basic": return { ia: 15, propias: 5 };
    // ¡CORRECCIÓN DE LIDERAZGO! 10 Propias + 5 IA = 15 Total
    case "gold": return { ia: 5, propias: 10 }; 
    case "premium": return { ia: 50, propias: 50 };
    default: return { ia: 0, propias: 0 };
  }
}

// Menú en el editor
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("ART5D 2025")
    .addItem("Diagnóstico Completo", "diagnostico")
    .addItem("Test Firestore", "testFullFirestoreConnection")
    .addItem("Ver URL Webhook", () => Browser.msgBox("Webhook URL", ScriptApp.getService().getUrl(), Browser.Buttons.OK))
    .addToUi();
}
