/**
 * ==============================================================================
 * ARCHIVO: Utilidades.gs → Herramientas de diagnóstico y soporte (ART5D 2025)
 * ==============================================================================
 * 
 * Funciones útiles para:
 *   • Verificar conectividad externa
 *   • Forzar permisos OAuth cuando Google se pone terco
 *   • Diagnósticos rápidos en producción
 *   • Depuración del webhook y Firebase
 * 
 * © 2025 ART5D.cl – El futuro del arte digital certificado
 */

const UTIL = {

  /**
   * PRUEBA BÁSICA DE CONECTIVIDAD EXTERNA
   * Verifica que UrlFetchApp funcione (necesario para NOWPayments, Firebase, etc.)
   */
  testConexionExterna() {
    Logger.log("PROBANDO CONEXIÓN A INTERNET (UrlFetchApp)...");

    try {
      const response = UrlFetchApp.fetch("https://httpbin.org/get", { muteHttpExceptions: true });
      const code = response.getResponseCode();

      if (code === 200) {
        Logger.log("CONEXIÓN EXTERNA 100 % FUNCIONAL");
        Logger.log("Respuesta del servidor: OK");
        return true;
      } else {
        Logger.log(`Error HTTP ${code}`);
        Logger.log(response.getContentText());
        return false;
      }
    } catch (e) {
      Logger.log("FALLO CRÍTICO DE CONECTIVIDAD:");
      Logger.log(e.toString());
      return false;
    }
  },

  /**
   * FORZAR DIÁLOGO DE PERMISOS (cuando Google no muestra los scopes avanzados)
   * Ejecuta esta función una vez si te sale el mensaje de "permisos insuficientes"
   */
  forzarPermisosOAuth() {
    Logger.log("EJECUTANDO FUNCIÓN PARA FORZAR DIÁLOGO DE AUTORIZACIÓN...");
    // Esta función no hace nada más que no sea existir → Google la detecta como nueva y vuelve a pedir permisos
    DriveApp.getRootFolder(); // Forzamos un scope que casi siempre está permitido
    Logger.log("Diálogo de autorización debería haber aparecido. Acepta todos los permisos y vuelve a probar.");
  },

  /**
   * DIAGNÓSTICO COMPLETO DEL SISTEMA (ejecuta esta en cualquier momento)
   */
  diagnosticoCompleto() {
    Logger.log("DIAGNÓSTICO COMPLETO ART5D 2025");
    Logger.log("========================================");

    Logger.log("1. Conectividad externa → " + (this.testConexionExterna() ? "OK" : "FALIDO"));
    
    try {
      Logger.log("2. Firebase Config cargada → " + (CONFIG?.projectId || "NO DISPONIBLE"));
      Logger.log("   Email de servicio → " + (CONFIG?.clientEmail || "NO DISPONIBLE"));
    } catch (e) {
      Logger.log("2. Firebase Config → ERROR al cargar ServiceAccount.gs");
    }

    try {
      const token = getFirebaseAccessToken();
      Logger.log("3. Token Admin SDK → GENERADO CORRECTAMENTE (" + token.substring(0, 30) + "...)");
    } catch (e) {
      Logger.log("3. Token Admin SDK → FALLÓ");
      Logger.log("   Causa: " + e.toString());
    }

    Logger.log("4. Zona horaria → " + ScriptApp.getProjectTimeZone());
    Logger.log("5. Usuario ejecutando → " + Session.getActiveUser().getEmail());

    Logger.log("========================================");
    Logger.log("Si todo dice OK → ¡EL SISTEMA ESTÁ LISTO PARA RECIBIR PAGOS!");
  },

  /**
   * LIMPIAR LOGS (útil cuando hay mucho ruido)
   */
  limpiarLogs() {
    console.clear(); // Solo funciona en el nuevo editor
    Logger.log("Logs limpiados manualmente");
  }
};

/**
 * FUNCIONES PÚBLICAS RÁPIDAS (para ejecutar desde el menú)
 */
function testConexion() { UTIL.testConexionExterna(); }
function forzarPermisos() { UTIL.forzarPermisosOAuth(); }
function diagnostico() { UTIL.diagnosticoCompleto(); }
function limpiarLogs() { UTIL.limpiarLogs(); }
