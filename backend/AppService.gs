/**
 * ==============================================================================
 * generateArtworkAndMetadata() → FUNCIÓN MAESTRA ART5D 2025
 * Flujo completo: Evaluación → Rate Limit → Generación IA → Certificado PDF → Email
 * ==============================================================================
 * @param {string} prompt           - Texto del prompt del usuario
 * @param {string} userEmail        - Email del usuario (o null si anónimo)
 * @param {string} engine           - "grok" | "gemini" | "both" (por defecto "both")
 * @returns {{success: boolean, data?: object, error?: string}}
 */
function generateArtworkAndMetadata(prompt, userEmail = null, engine = "both") {

  // ==========================================================================
  // 1. VALIDACIÓN BÁSICA DEL PROMPT
  // ==========================================================================
  if (!prompt || prompt.trim().length < 8) {
    return {
      success: false,
      error: "El prompt es demasiado corto. Describe tu obra con más detalle."
    };
  }
  const cleanPrompt = prompt.trim();

  // ==========================================================================
  // 2. EVALUACIÓN DE CALIDAD Y SEGURIDAD (AIEvaluatorService.gs)
  // ==========================================================================
  const evalResult = evaluatePrompt(cleanPrompt);
  if (evalResult.status !== "OK") {
    return {
      success: false,
      error: evalResult.reason || "El prompt no cumple con los estándares de calidad y seguridad de ART5D."
    };
  }

  // ==========================================================================
  // 3. RATE LIMIT – 3 GENERACIONES GRATIS POR DÍA
  // ==========================================================================
  const userIp = Session.getScriptApp()?.getRequestIp() || "unknown";
  const rateLimit = checkAndIncrementFreeUsage(userEmail, userIp);

  if (!rateLimit.allowed) {
    return {
      success: false,
      error: "Límite diario gratuito alcanzado (3/3). Compra un pack para generaciones ilimitadas.",
      limitReached: true,
      attemptsLeft: 0
    };
  }

  // ==========================================================================
  // 4. GENERACIÓN DE IMÁGENES CON IA
  // ==========================================================================
  let grokUrl = null;
  let geminiUrl = null;

  try {
    if (engine === "grok" || engine === "both") {
      grokUrl = generarConGrok(cleanPrompt);
    }
    if (engine === "gemini" || engine === "both") {
      geminiUrl = generarConGemini(cleanPrompt);
    }
  } catch (err) {
    Logger.log("Error en generación IA: " + err.toString());
    return { success: false, error: "Error al generar la imagen con IA. Intenta de nuevo." };
  }

  if (!grokUrl && !geminiUrl) {
    return { success: false, error: "No se pudo generar ninguna imagen. Revisa tu prompt." };
  }

  // ==========================================================================
  // 5. CREACIÓN DE METADATA + GUARDADO EN DRIVE
  // ==========================================================================
  const artworkId = Utilities.getUuid();

  const metadata = {
    artworkId: artworkId,
    prompt: cleanPrompt,
    userEmail: userEmail || "anonimo@art5d.cl",
    grokUrl: grokUrl,
    geminiUrl: geminiUrl,
    engine: engine,
    fechaCreacion: new Date().toISOString(),
    version: "ART5D_2025_v1"
  };

  let metadataUrl = "";
  try {
    const folder = DriveApp.getFolderById(CONFIG.CARPETA_OBRAS_ID); // Asegúrate de tener esta constante
    const file = folder.createFile(`${artworkId}.json`, JSON.stringify(metadata, null, 2));
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    metadataUrl = file.getId();
    metadataUrl = `https://drive.google.com/file/d/${metadataId}/view`;
  } catch (err) {
    Logger.log("Error al guardar metadata: " + err);
  }

  // ==========================================================================
  // 6. GENERACIÓN DE CERTIFICADO PDF + ENVÍO POR EMAIL
  // ==========================================================================
  let pdfUrl = "";

  try {
    const resultForPDF = {
      artworkId,
      prompt: cleanPrompt,
      grok: grokUrl,
      gemini: geminiUrl,
      metadataUrl
    };

    const pdfBlob = generateCertificatePDF(resultForPDF);
    const certFolder = DriveApp.getFolderById(CONFIG.CARPETA_CERTIFICADOS_ID);
    const pdfFile = certFolder.createFile(pdfBlob.setName(`Certificado_ART5D_${artworkId}.pdf`));
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    pdfUrl = pdfFile.getUrl();

    // Envío de email solo si hay correo
    if (userEmail) {
      GmailApp.sendEmail(
        userEmail,
        `¡Tu obra "${cleanPrompt.substring(0, 50)}..." está CERTIFICADA! – ART5D`,
        "Felicidades, tu arte ya es propiedad digital certificada a nivel mundial.",
        {
          htmlBody: getCertifiedArtworkHtml(resultForPDF, pdfUrl),
          attachments: [pdfBlob]
        }
      );
    }

  } catch (err) {
    Logger.log("Error al generar/enviar certificado: " + err.toString());
    // No bloqueamos el flujo si falla el PDF/email – el usuario ya tiene la imagen
  }

  // ==========================================================================
  // 7. RESPUESTA FINAL AL CLIENTE
  // ==========================================================================
  return {
    success: true,
    data: {
      artworkId,
      grok: grokUrl,
      gemini: geminiUrl,
      metadataUrl,
      pdfUrl,
      prompt: cleanPrompt,
      message: userEmail
        ? "Obra generada y certificado enviado a tu correo."
        : "Obra generada. Inicia sesión con Google para recibir tu certificado oficial por email.",
      attemptsLeft: MAX_FREE_ATTEMPTS - rateLimit.count
    }
  };
}
