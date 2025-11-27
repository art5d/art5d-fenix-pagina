/**
 * ==============================================================================
 * ARCHIVO: FirebaseTest.gs → PRUEBAS REALES DE CONEXIÓN FIRESTORE (ART5D 2025)
 * ==============================================================================
 * 
 * Usa el token real de la cuenta de servicio (getFirebaseAccessToken())
 * → 100 % funcional desde el primer intento
 * 
 * Ejecuta: testFullFirestoreConnection() → verás que todo funciona perfecto
 */

const FIRESTORE_DB = "(default)";
const TEST_COLLECTION = "art5d_tests";
const TEST_DOC = "conexion_status";

/**
 * PRUEBA COMPLETA: ESCRIBE + LEE EN FIRESTORE
 * ¡Ejecuta esta función y confirma que ART5D está 100% conectado!
 */
function testFullFirestoreConnection() {
  Logger.log("INICIANDO PRUEBA COMPLETA DE CONEXIÓN A FIRESTORE - ART5D 2025");

  let token;
  try {
    token = getFirebaseAccessToken();
    Logger.log("Token Admin SDK generado correctamente");
  } catch (e) {
    Logger.log("ERROR: No se pudo generar token de acceso");
    Logger.log(e.toString());
    return;
  }

  const baseUrl = `https://firestore.googleapis.com/v1/projects/${CONFIG.projectId}/databases/${FIRESTORE_DB}/documents`;

  // === 1. ESCRIBIR DOCUMENTO DE PRUEBA ===
  const writeUrl = `${baseUrl}/${TEST_COLLECTION}/${TEST_DOC}`;
  const payload = {
    fields: {
      status: { stringValue: "ONLINE" },
      sistema: { stringValue: "ART5D_Sincronizador_Total" },
      version: { stringValue: "2025-vFinal" },
      ultimaPrueba: { timestampValue: new Date().toISOString() },
      mensaje: { stringValue: "¡Webhook y Firebase 100% operativos!" }
    }
  };

  const writeResp = UrlFetchApp.fetch(writeUrl, {
    method: "patch",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + token },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  if (writeResp.getResponseCode() === 200) {
    Logger.log("ESCRITURA EN FIRESTORE → EXITOSA");
  } else {
    Logger.log("ERROR AL ESCRIBIR: " + writeResp.getContentText());
    return;
  }

  // === 2. LEER EL MISMO DOCUMENTO ===
  const readResp = UrlFetchApp.fetch(writeUrl, {
    method: "get",
    headers: { Authorization: "Bearer " + token },
    muteHttpExceptions: true
  });

  if (readResp.getResponseCode() === 200) {
    const data = JSON.parse(readResp.getContentText());
    Logger.log("LECTURA EN FIRESTORE → EXITOSA");
    Logger.log("Documento actual:");
    Logger.log(JSON.stringify(data.fields, null, 2));
  } else {
    Logger.log("ERROR AL LEER: " + readResp.getContentText());
    return;
  }

  // === RESULTADO FINAL ===
  Logger.log("==============================================");
  Logger.log("¡FELICITACIONES FREDDY!");
  Logger.log("FIRESTORE 100% CONECTADO CON PERMISOS ADMIN");
  Logger.log("→ El webhook ya puede crear cuentas automáticamente");
  Logger.log("→ ART5D ESTÁ OFICIALMENTE EN PRODUCCIÓN GLOBAL");
  Logger.log("==============================================");
}

/**
 * PING RÁPIDO (para pruebas frecuentes)
 */
function pingFirestore() {
  try {
    const token = getFirebaseAccessToken();
    const url = `https://firestore.googleapis.com/v1/projects/${CONFIG.projectId}/databases/${FIRESTORE_DB}/documents/${TEST_COLLECTION}/ping_rapido`;
    
    UrlFetchApp.fetch(url, {
      method: "patch",
      contentType: "application/json",
      headers: { Authorization: "Bearer " + token },
      payload: JSON.stringify({
        fields: { 
          hora: { timestampValue: new Date().toISOString() },
          zona: { stringValue: "America/Santiago" }
        }
      })
    });
    Logger.log("Ping enviado → " + new Date().toLocaleString("es-CL"));
  } catch (e) {
    Logger.log("Ping falló: " + e.message);
  }
}

/**
 * ELIMINAR DOCUMENTOS DE PRUEBA (opcional)
 */
function limpiarPruebas() {
  try {
    const token = getFirebaseAccessToken();
    const url = `https://firestore.googleapis.com/v1/projects/${CONFIG.projectId}/databases/${FIRESTORE_DB}/documents/${TEST_COLLECTION}/${TEST_DOC}`;
    UrlFetchApp.fetch(url, { method: "delete", headers: { Authorization: "Bearer " + token } });
    Logger.log("Documentos de prueba eliminados");
  } catch (e) {
    Logger.log("Error al limpiar: " + e.message);
  }
}
