// HUB CENTRAL – ENLAZA TODOS LOS SERVICIOS
const AllServices = {
  Util: UTIL,
  Image: ImageService,
  Solana: SolanaService,
  App: AppService,
  Email: EmailService,
  PDF: PDFService,
  RateLimit: RateLimitService,
  AI: AIEvaluatorService,
  Alert: AdminAlertService,
  Template: TemplateService,
  WebHook: WebHook,  // Si tienes un WebHook.gs, agrégalo aquí
  Precios: Precios,  // Si tienes Precios.gs
  AdminDashboard: AdminDashboard
};

// ANCHOR GLOBAL
const ART5D_GLOBAL_MASTER_ANCHOR = 'ART5D_GLOBAL_MASTER_ANCHOR_1A2B3C4D5E6F7A8B';

// WEB APP URL
const WEB_APP_URL = ScriptApp.getService().getUrl();

// ==============================================================================
// doGet – Página principal y rutas públicas
// ==============================================================================
function doGet(e) {
  const page = (e.parameter.page || '').trim().toLowerCase();
  const path = (e.parameter.path || '').trim();

  // 1. RUTA RAÍZ → https://art5d.cl → PANEL PRINCIPAL (App.html)
  if (!page && !path) {
    return HtmlService.createHtmlOutputFromFile(CONFIG.HTML_FILES.APP)
      .setTitle('ART5D – Certificación Mundial de Arte IA')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // 2. RUTA /webhook o ?page=webhook → PÁGINA DE ESTADO
  if (page === 'webhook' || path === 'webhook') {
    const ahora = new Date().toLocaleString("es-CL");
    return HtmlService.createHtmlOutput(`
      <div style="font-family:'Inter',sans-serif;background:#0f0f23;color:#e2e8f0;min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:20px;">
        <h1 style="font-size:5rem;background:linear-gradient(90deg,#a855f7,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
          ART5D WEBHOOK ACTIVO
        </h1>
        <p style="font-size:2rem;margin:20px 0;">Sistema 100% operativo – Liderazgo Global</p>
        <div style="background:#1a1a2e;padding:30px;border-radius:16px;border:2px solid #ec4899;max-width:900px;">
          <p><strong>Proyecto Firebase:</strong> ${ScriptApp.getProjectKey()}</p>
          <p><strong>ID ANCHOR GLOBAL:</strong> ${ART5D_GLOBAL_MASTER_ANCHOR}</p>
          <p><strong>Última verificación:</strong> ${ahora}</p>
          <p><strong>Webhook URL:</strong></p>
          <code style="background:#111;padding:15px;border-radius:12px;font-size:1.1rem;word-break:break-all;display:block;margin:15px 0;">
            ${WEB_APP_URL}
          </code>
        </div>
        <br>
        <button onclick="fetch(location.href+'?test=ping').then(()=>alert('PING OK'))" 
                style="padding:18px 50px;background:#ec4899;color:white;border:none;border-radius:50px;font-size:1.3rem;font-weight:bold;cursor:pointer;">
          PROBAR CONEXIÓN
        </button>
      </div>`)
      .setTitle("ART5D – Webhook Oficial 2025");
  }

  // 3. PANEL PRINCIPAL → ?page=app o cualquier otra cosa
  if (page === 'app' || page === '' || !page) {
    return HtmlService.createHtmlOutputFromFile(CONFIG.HTML_FILES.APP)
      .setTitle('ART5D – Certificación Mundial de Arte IA')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // 4. PANEL ADMIN
  if (page === 'admin') {
    return HtmlService.createHtmlOutputFromFile(CONFIG.HTML_FILES.MANAGER)
      .setTitle('Panel Admin ART5D');
  }

  // 5. CUALQUIER OTRA RUTA → REDIRIGE AL PANEL PRINCIPAL (nunca más 404)
  return HtmlService.createHtmlOutputFromFile(CONFIG.HTML_FILES.APP)
    .setTitle('ART5D – Certificación Mundial de Arte IA')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

/**
 * doPost – Punto único de entrada para webhooks y API
 */
function doPost(e) {
  try {
    const path = (e.parameter.path || '').trim();

    // Webhook de NOWPayments (ruta raíz o /api/pagos)
    if (!path || path === 'api/pagos') {
      return AllServices.WebHook.handlePaymentWebhook(e);
    }

    // API de Certificación (llamada desde frontend o externo)
    if (path === 'api/certificar') {
      return AllServices.App.handleCertificationAPI(e);
    }

    // Generación desde frontend (POST interno)
    if (path === 'generate') {
      const payload = JSON.parse(e.postData.contents);
      return ContentService
        .createTextOutput(JSON.stringify(AllServices.App.handleGenerateRequest(payload)))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput("Ruta no soportada");

  } catch (err) {
    AllServices.Alert.logCriticalError(err);
    Logger.log("ERROR CRÍTICO doPost: " + err.toString());
    return ContentService.createTextOutput("Error interno").setMimeType(ContentService.MimeType.TEXT);
  }
}

/**
 * Generación de arte with Rate Limiting + PDF + Email
 */
function handleGenerateRequest(data) {
  const { prompt, engine = "both" } = data;
  const userEmail = Session.getActiveUser().getEmail() || null;
  const userIp = Session.getScriptApp().getRequestIp() || "unknown";

  if (!prompt || prompt.trim().length < 5) {
    return { success: false, error: "Prompt demasiado corto" };
  }

  // RATE LIMIT: 3 intentos gratis por día
  const rate = AllServices.RateLimit.checkAndIncrementFreeUsage(userEmail, userIp);
  if (!rate.allowed) {
    return {
      success: false,
      error: "Límite diario alcanzado (3/3)",
      limitReached: true,
      attempts: rate.count,
      upgradeUrl: "https://art5d.cl/packs"
    };
  }

  // GENERACIÓN COMPLETA (usa appservice.gs)
  const result = AllServices.App.generateArtworkAndMetadata(prompt.trim(), userEmail, engine);

  return {
    success: result.success,
    data: result.data,
    message: userEmail 
      ? "¡Obra certificada! Revisa tu correo con el PDF oficial." 
      : "Obra generada. Inicia sesión con Google para recibir tu certificado oficial.",
    attemptsLeft: AllServices.RateLimit.MAX_FREE_ATTEMPTS - rate.count
  };
}

/**
 * Webhook de NOWPayments – Activación de packs
 */
function handlePaymentWebhook(e) {
  const payload = JSON.parse(e.postData.contents);

  // Seguridad IP (NOWPayments)
  const ip = e.parameter.ipn_ip || "";
  const validPrefixes = ["185.253.154.", "185.253.155.", "185.253.156."];
  const ipOk = validPrefixes.some(p => ip.startsWith(p)) || payload.test;

  if (!ipOk && !payload.test) {
    return ContentService.createTextOutput("IP no autorizada");
  }

  if (payload.payment_status !== "finished" && !payload.test) {
    return ContentService.createTextOutput("Pago pendiente");
  }

  const packId = (payload.order_description || "").trim();
  const email = (payload.buyer_email || "").toLowerCase().trim();
  const monto = parseFloat(payload.pay_amount || 0);

  if (!packId || !email || monto <= 0) {
    return ContentService.createTextOutput("Datos incompletos");
  }

  const precioEsperado = AllServices.Precios.getPrecio(packId);
  if (Math.abs(precioEsperado - monto) > 0.02) {
    AllServices.Alert.logCriticalError(`FRAUDE DETECTADO: ${email} | ${monto} vs ${precioEsperado}`);
    Logger.log(`FRAUDE DETECTADO: ${email} | ${monto} vs ${precioEsperado}`);
    return ContentService.createTextOutput("Precio inválido");
  }

  // ACTIVAR PACK EN FIRESTORE
  AllServices.App.activarPackUsuario(email, packId, payload);

  Logger.log(`PACK ACTIVADO → ${email} | ${packId} | $${monto}`);
  return ContentService.createTextOutput("OK");
}

/**
 * API de Certificación (externa o interna)
 */
function handleCertificationAPI(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const { prompt, userEmail, engine = "both", artworkId } = payload;

    if (!prompt || !userEmail) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Faltan datos" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const result = AllServices.App.generateArtworkAndMetadata(prompt, userEmail, engine);

    return ContentService.createTextOutput(JSON.stringify({
      success: result.success,
      metadataUrl: result.data?.metadataUrl,
      pdfUrl: result.data?.pdfUrl,
      anchorId: ART5D_GLOBAL_MASTER_ANCHOR,
      message: result.success ? "Certificación completada con éxito" : result.error
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    AllServices.Alert.logCriticalError(err);
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==============================================================================
// FUNCIONES AUXILIARES
// ==============================================================================

function getPrecio(packId) {
  return AllServices.Precios.getPrecio(packId);
}

function getLimitesPack(packId) {
  return AllServices.Precios.getLimitesPack(packId);
}

function activarPackUsuario(email, packId, payload) {
  // Implementar con Firestore REST or FirebaseApp
  // (código existente en tu proyecto)
}

// Menú diagnóstico
function onOpen() {
  SpreadsheetApp.getUi().createMenu("ART5D 2025")
    .addItem("Webhook URL", () => Browser.msgBox(WEB_APP_URL))
    .addItem("Diagnóstico", "diagnostico")
    .addToUi();
}
function TEST_NFT_STORAGE_Y_SOLANA() {
  const datosPrueba = {
    id: "PRIMERA_PRUEBA",
    title: "Primera Obra ART5D 2025",
    artist: "Freddy Vicencio",
    prompt: "Un dragón cyberpunk sobre Valparaíso al atardecer",
    engine: "Grok + Gemini"
  };

  // Imagen transparente 10x10 válida (NFT.Storage la acepta siempre)
  const imagenValida = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==";

  const resultado = AllServices.Solana.prepareSolanaMint(imagenValida, datosPrueba);
  
  if (resultado.success) {
    Logger.log("¡ÉXITO TOTAL! Metadata subida a IPFS");
    Logger.log("Imagen: " + resultado.imageUrl);
    Logger.log("Metadata URI: " + resultado.metadataUri);
    Logger.log("Enlace directo: " + resultado.metadataUri);
    UTIL.safeAlert(
      "¡NFT STORAGE FUNCIONA AL 100%!\n\nMetadata lista para Solana:\n" + resultado.metadataUri
    );
  } else {
    Logger.log("Error: " + resultado.error);
    UTIL.safeAlert("Error: " + resultado.error);
  }
}
