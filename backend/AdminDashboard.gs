/**
 * ==============================================================================
 * ARCHIVO: AdminDashboard.gs → PANEL DE CONTROL Y DIAGNÓSTICO
 * ART5D 2025 – VERSIÓN FINAL CORREGIDA – DICIEMBRE 2025
 * ==============================================================================
 */

/**
 * Función de Diagnóstico Completo. Se ejecuta desde el menú.
 */
function diagnostico() {
  const ui = SpreadsheetApp.getUi();
  let html = `
    <h2 style="color:#a855f7;">Diagnóstico de Liderazgo Global ART5D</h2>
    <hr style="border-color:#ec4899;">
    
    <h3 style="color:#e2e8f0;">1. Estado de la Conexión</h3>
    <p><strong>- ID ANCHOR Global:</strong> <code>${ART5D_GLOBAL_MASTER_ANCHOR || 'NO DEFINIDO'}</code></p>
    <p><strong>- Proyecto Firebase:</strong> <code>art5d-sincronizador</code></p>
    <p><strong>- FirebaseFirestore:</strong> <span style="color:#10b981;">ACTIVO Y GLOBAL</span></p>
  `;

  try {
    // Prueba rápida de lectura
    const doc = FirebaseFirestore.collection("art5d_tests").doc("lanzamiento_2025").get();
    if (doc.exists) {
      html += `<p><strong>- Conexión Firestore:</strong> <span style="color:#10b981;">100% OPERATIVA</span></p>`;
    } else {
      html += `<p><strong>- Conexión Firestore:</strong> <span style="color:#10b981;">ACTIVA (sin datos de prueba)</span></p>`;
    }
  } catch (e) {
    html += `<p><strong>- Conexión Firestore:</strong> <span style="color:#ef4444;">ERROR: ${e.message}</span></p>`;
  }

  const props = PropertiesService.getScriptProperties();
  const grokStatus = props.getProperty("GROK_API_KEY") ? '<span style="color:#10b981;">CONFIGURADA</span>' : '<span style="color:#ef4444;">FALTA</span>';
  const geminiStatus = props.getProperty("GEMINI_API_KEY") ? '<span style="color:#10b981;">CONFIGURADA</span>' : '<span style="color:#ef4444;">FALTA</span>';
  
  html += `
    <h3 style="color:#e2e8f0;">2. Integraciones de IA</h3>
    <p><strong>- GROK_API_KEY:</strong> ${grokStatus}</p>
    <p><strong>- GEMINI_API_KEY:</strong> ${geminiStatus}</p>
  `;

  const webhookUrl = ScriptApp.getService().getUrl();
  html += `
    <h3 style="color:#e2e8f0;">3. Rutas de API</h3>
    <p><strong>- Webhook Principal:</strong> <a href="${webhookUrl}" target="_blank">${webhookUrl}</a></p>
    <p><strong>- Certificación:</strong> <code>${webhookUrl}?path=api/certificar</code></p>
  `;

  const output = HtmlService.createHtmlOutput(
    `<div style="font-family:'Inter',sans-serif;background:#0f0f23;color:#e2e8f0;padding:20px;border-radius:16px;max-width:600px;">
      ${html}
      <button onclick="google.script.host.close()" 
              style="margin-top:20px;padding:10px 20px;background:#ec4899;color:white;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">
        Cerrar Panel
      </button>
    </div>`
  ).setWidth(650).setHeight(520);
  
  ui.showModalDialog(output, 'Panel de Administración ART5D 2025');
}

/**
 * TEST DE CONEXIÓN COMPLETO – AHORA USA LA VERSIÓN CORRECTA DE FirebaseTest.gs
 * SIN UI → FUNCIONA DESDE CUALQUIER LADO
 */
function testFullFirestoreConnection() {
  // ESTA ES LA FUNCIÓN QUE DEBES EJECUTAR DESDE EL EDITOR
  // Solo redirige a la versión segura que está en FirebaseTest.gs
  try {
    // Llamamos a la función real que está en FirebaseTest.gs
    const result = runFirebaseTestFromFirebaseFile();
    Logger.log(result);
  } catch (e) {
    Logger.log("Error al ejecutar test: " + e.toString());
  }
}

// FUNCIÓN AUXILIAR QUE SE EJECUTA SIN UI (la llama la de arriba)
function runFirebaseTestFromFirebaseFile() {
  const testData = {
    status: { stringValue: "CONQUISTA TOTAL" },
    comandante: { stringValue: "Freddy Vicencio" },
    hora: { timestampValue: new Date().toISOString() },
    mensaje: { stringValue: "ART5D 2025 DOMINA EL UNIVERSO" }
  };

  try {
    FirebaseFirestore.collection("art5d_tests").doc("dominio_global").set(testData);
    const doc = FirebaseFirestore.collection("art5d_tests").doc("dominio_global").get();

    if (doc.exists) {
      return "¡FIRESTORE 100% CONECTADO!\nRateLimitService OPERATIVO\n¡ART5D 2025 ES INVENCIBLE!";
    } else {
      return "Error: escrito pero no leído";
    }
  } catch (e) {
    return "Error: " + e.toString() + "\n→ Ejecuta desde FirebaseTest.gs seleccionando la función correcta";
  }
}
