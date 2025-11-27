/**
 * ==============================================================================
 * ARCHIVO: AdminDashboard.gs → PANEL DE CONTROL Y DIAGNÓSTICO
 * * Funciones de Liderazgo y Soporte
 * ==============================================================================
 */

// NOTA: ART5D_GLOBAL_MASTER_ANCHOR se define en Code.gs

/**
 * Función de Diagnóstico Completo. Se ejecuta desde el menú.
 * Muestra el estado de la conexión, las propiedades y los límites del sistema.
 */
function diagnostico() {
  const ui = SpreadsheetApp.getUi();
  let html = `
    <h2 style="color:#a855f7;">✨ Diagnóstico de Liderazgo Global ART5D ✨</h2>
    <hr style="border-color:#ec4899;">
    
    <h3 style="color:#e2e8f0;">1. Estado de la Conexión</h3>
    <p><strong>- ID ANCHOR Global:</strong> <code>${ART5D_GLOBAL_MASTER_ANCHOR}</code></p>
    <p><strong>- Proyecto Firebase:</strong> <code>${CONFIG.projectId}</code></p>
    <p><strong>- Configuración Firebase:</strong> ${FIREBASE_CONFIG_READY ? '<span style="color:#10b981;">✅ LISTA</span>' : '<span style="color:#ef4444;">❌ INCOMPLETA</span>'}</p>
  `;

  try {
    // 1. Test de Conexión a Firebase
    const db = FirebaseApp.getDatabaseByName(CONFIG.projectId);
    // Intenta leer un documento ficticio para confirmar la conexión
    db.collection("diagnostics").doc("test").get(); 
    html += `<p><strong>- Conexión Firestore:</strong> <span style="color:#10b981;">✅ OK</span> (Lectura exitosa)</p>`;
  } catch (e) {
    html += `<p><strong>- Conexión Firestore:</strong> <span style="color:#ef4444;">❌ FALLIDA</span> (${e.message})</p>`;
  }

  // 2. Revisión de Propiedades de API Keys
  const props = PropertiesService.getScriptProperties();
  const grokStatus = props.getProperty("GROK_API_KEY") ? '<span style="color:#10b981;">✅ Configurada</span>' : '<span style="color:#ef4444;">❌ FALTA</span>';
  const geminiStatus = props.getProperty("GEMINI_API_KEY") ? '<span style="color:#10b981;">✅ Configurada</span>' : '<span style="color:#ef4444;">❌ FALTA</span>';
  
  html += `
    <h3 style="color:#e2e8f0;">2. Integraciones de IA</h3>
    <p><strong>- GROK_API_KEY:</strong> ${grokStatus}</p>
    <p><strong>- GEMINI_API_KEY:</strong> ${geminiStatus}</p>
  `;

  // 3. URLs de Servicio
  const webhookUrl = ScriptApp.getService().getUrl();
  html += `
    <h3 style="color:#e2e8f0;">3. Rutas de API</h3>
    <p><strong>- Webhook de Pagos / Root:</strong> <a href="${webhookUrl}" target="_blank">${webhookUrl}</a></p>
    <p><strong>- API de Certificación:</strong> <code>${webhookUrl}?path=api/certificar</code></p>
  `;

  // 4. Mostrar el HTML
  const output = HtmlService.createHtmlOutput(
    `<div style="font-family:'Inter',sans-serif;background:#0f0f23;color:#e2e8f0;padding:20px;border-radius:16px;max-width:600px;">
      ${html}
      <button onclick="google.script.host.close()" 
              style="margin-top:20px;padding:10px 20px;background:#ec4899;color:white;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">
        Cerrar
      </button>
    </div>`
  ).setWidth(650).setHeight(500);
  
  ui.showModalDialog(output, 'Panel de Administración ART5D');
}

/**
 * Test de Conexión Completo a Firestore
 * Intenta leer, escribir y eliminar un documento temporal.
 */
function testFullFirestoreConnection() {
  const ui = SpreadsheetApp.getUi();
  const testId = "test_liderazgo_" + Utilities.getUuid();
  let log = "";
  let success = true;

  try {
    const db = FirebaseApp.getDatabaseByName(CONFIG.projectId);

    // 1. Escritura (SET)
    db.collection("diagnostics").doc(testId).set({
      timestamp: new Date().toISOString(),
      status: "INIT",
      anchorId: ART5D_GLOBAL_MASTER_ANCHOR
    });
    log += "✅ Escritura (SET) Exitosa.\n";

    // 2. Lectura (GET)
    const doc = db.collection("diagnostics").doc(testId).get();
    if (doc.exists && doc.data().status === "INIT") {
      log += "✅ Lectura (GET) Exitosa.\n";
    } else {
      throw new Error("Lectura fallida o datos incorrectos.");
    }

    // 3. Actualización (UPDATE)
    db.collection("diagnostics").doc(testId).update({ status: "UPDATED" });
    log += "✅ Actualización (UPDATE) Exitosa.\n";
    
    // 4. Eliminación (DELETE)
    db.collection("diagnostics").doc(testId).delete();
    log += "✅ Eliminación (DELETE) Exitosa.\n";
    
    // 5. Verificación de Eliminación
    const finalCheck = db.collection("diagnostics").doc(testId).get();
    if (!finalCheck.exists) {
        log += "✅ Verificación de Eliminación OK.\n";
    } else {
        throw new Error("Documento no eliminado correctamente.");
    }

  } catch (e) {
    log += `❌ FALLO DE CONEXIÓN: ${e.message}\n`;
    log += `Asegúrate de que la librería FirebaseApp está en la versión correcta y las credenciales están bien cargadas en ServiceAccount.gs`;
    success = false;
  }

  const title = success ? "🎉 Test Firestore OK" : "❌ Error en Test Firestore";
  const color = success ? "#10b981" : "#ef4444";
  
  ui.showModalDialog(
    HtmlService.createHtmlOutput(
      `<div style="font-family:'Inter',sans-serif;background:#0f0f23;color:#e2e8f0;padding:20px;border-radius:16px;">
        <h3 style="color:${color};">${title}</h3>
        <pre style="background:#1a1a2e;padding:10px;border-radius:8px;overflow:auto;max-height:300px;">${log}</pre>
        <p style="margin-top:10px;">Documento de prueba: <code>diagnostics/${testId}</code></p>
        <button onclick="google.script.host.close()" 
                style="margin-top:20px;padding:10px 20px;background:#ec4899;color:white;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">
          Aceptar
        </button>
      </div>`
    ).setWidth(500).setHeight(450), 
    title
  );
}
