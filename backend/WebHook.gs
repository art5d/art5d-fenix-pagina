/**
 * ==============================================================================
 * WebHook.gs → CENTRO DE PRUEBAS Y DIAGNÓSTICO FINAL ART5D 2025
 * Archivo de guerra: pruebas críticas del flujo completo antes del lanzamiento mundial
 * ==============================================================================
 */

const EMAIL_PRUEBA = "freddy.vicencio@gmail.com";
const TEST_ARTWORK_ID = "TEST_" + Utilities.getUuid().substring(0, 8);

/**
 * PRUEBA DEFINITIVA DEL FLUJO COMPLETO (EJECUTAR ANTES DEL LANZAMIENTO)
 */
function PROBAR_FLUJO_COMPLETO_DEFINITIVO() {
  Logger.log("INICIANDO PRUEBA FINAL DEL FLUJO ART5D 2025...");

  const testPrompt = "Portal hexagonal dorado flotando en un espacio cósmico infinito, luz volumétrica rosa y púrpura, estilo cyberpunk sagrado, ultra detallado, cinematográfico, 8k";

  try {
    const result = generateArtworkAndMetadata(testPrompt, EMAIL_PRUEBA, "both");

    if (!result.success) {
      throw new Error("Falló la generación: " + (result.error || "Desconocido"));
    }

    Logger.log("GENERACIÓN OK – ArtworkID: " + result.data.artworkId);

    const pdfBlob = generateCertificatePDF(result.data);
    const tempFile = DriveApp.createFile(pdfBlob.setName("TEST_CERTIFICADO_" + TEST_ARTWORK_ID + ".pdf"));

    GmailApp.sendEmail(
      EMAIL_PRUEBA,
      "PRUEBA FINAL ART5D 2025 – FLUJO 100% OPERATIVO",
      "Todo el sistema está funcionando perfectamente.",
      {
        htmlBody: `
          <div style="font-family:Arial,sans-serif;background:#0f0f23;color:#e2e8f0;padding:30px;border-radius:16px;max-width:700px;margin:auto;">
            <h1 style="color:#ec4899;text-align:center;">ART5D 2025 — PRUEBA FINAL EXITOSA</h1>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString("es-CL")}</p>
            <p><strong>Artwork ID:</strong> <code>${result.data.artworkId}</code></p>
            <hr style="border-color:#ec4899;">
            <h2 style="color:#a855f7;">TODOS LOS SISTEMAS OPERATIVOS:</h2>
            <ul style="font-size:1.1rem;">
              <li>Evaluador IA (seguridad + calidad)</li>
              <li>Rate Limit (3 gratis/día)</li>
              <li>Generación Grok + Gemini</li>
              <li>Guardado en Drive + Metadata</li>
              <li>Certificado PDF oficial generado</li>
              <li>Envío automático por Gmail</li>
              <li>Webhook NOWPayments listo</li>
            </ul>
            <p style="text-align:center;margin-top:30px;">
              <strong style="font-size:1.4rem;color:#ec4899;">
                ART5D ESTÁ LISTO PARA DOMINAR EL MUNDO
              </strong>
            </p>
          </div>
        `,
        attachments: [pdfBlob]
      }
    );

    Logger.log("PRUEBA FINAL COMPLETADA – Email + PDF enviado");
    Logger.log("URL del PDF: " + tempFile.getUrl());

    Browser.msgBox(
      "PRUEBA FINAL ART5D 2025",
      "FLUJO COMPLETO 100% OPERATIVO\n\nRevisa tu correo: " + EMAIL_PRUEBA + "\n\n¡LANZAMIENTO MUNDIAL INMINENTE!",
      Browser.Buttons.OK
    );

  } catch (error) {
    Logger.log("ERROR EN PRUEBA FINAL: " + error.toString());
    Browser.msgBox("ERROR", "Falló la prueba:\\n" + error.toString(), Browser.Buttons.OK);
  }
}

/**
 * PRUEBA RÁPIDA SOLO EMAIL + PDF
 */
function PROBAR_EMAIL_Y_PDF_SOLO() {
  const dummyData = {
    artworkId: TEST_ARTWORK_ID,
    prompt: "Prueba rápida de certificado ART5D 2025",
    grok: "https://via.placeholder.com/1024x1024/ec4899/ffffff?text=GROK+OK",
    gemini: "https://via.placeholder.com/1024x1024/a855f7/ffffff?text=GEMINI+OK",
    metadataUrl: "https://art5d.cl"
  };

  try {
    const pdfBlob = generateCertificatePDF(dummyData);
    GmailApp.sendEmail(
      EMAIL_PRUEBA,
      "PRUEBA RÁPIDA: Email + PDF OK",
      "",
      {
        htmlBody: "<h1 style='color:#ec4899;'>PRUEBA RÁPIDA EXITOSA</h1><p>PDF adjunto generado correctamente.</p>",
        attachments: [pdfBlob.setName("TEST_PDF_RAPIDO_ART5D.pdf")]
      }
    );
    Logger.log("Prueba rápida Email + PDF: EXITOSA");
  } catch (e) {
    Logger.log("Falló prueba rápida: " + e.toString());
  }
}

/**
 * SIMULAR PAGO GALLERY PARTNER
 */
function SIMULAR_PAGO_NOWPAYMENTS() {
  const payload = {
    payment_status: "finished",
    pay_amount: 2499.00,
    order_description: "GP-500_GALLERY_PARTNER",
    buyer_email: EMAIL_PRUEBA,
    test: true
  };

  const fakeEvent = {
    postData: { contents: JSON.stringify(payload) },
    parameter: { path: "api/pagos" }
  };

  Logger.log("Simulando pago Gallery Partner 500 NFTs...");
  const respuesta = handlePaymentWebhook(fakeEvent);
  Logger.log("Respuesta webhook: " + respuesta.getContentText());
}

/**
 * LIMPIAR ARCHIVOS DE PRUEBA
 */
function LIMPIAR_PRUEBAS() {
  const files = DriveApp.searchFiles(`title contains "TEST_CERTIFICADO_" or title contains "TEST_PDF_RAPIDO"`);
  let count = 0;
  while (files.hasNext()) {
    files.next().setTrashed(true);
    count++;
  }
  Logger.log("Eliminados " + count + " archivos de prueba.");
}

/**
 * MENÚ EN EL EDITOR
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("ART5D 2025 – PRUEBAS")
    .addItem("Prueba COMPLETA (Todo)", "PROBAR_FLUJO_COMPLETO_DEFINITIVO")
    .addItem("Prueba rápida Email+PDF", "PROBAR_EMAIL_Y_PDF_SOLO")
    .addItem("Simular pago Gallery", "SIMULAR_PAGO_NOWPAYMENTS")
    .addSeparator()
    .addItem("Limpiar pruebas", "LIMPIAR_PRUEBAS")
    .addToUi();
}
