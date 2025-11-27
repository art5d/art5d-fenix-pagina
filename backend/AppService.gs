/**
 * ==============================================================================
 * ARCHIVO: AppService.gs → LÓGICA DE PUENTE ENTRE EL FRONEND Y EL BACKEND
 * * Contiene funciones que App.html llama usando google.script.run
 * * (Permite la comunicación segura del navegador a Google Apps Script)
 * ==============================================================================
 */

// NOTA: Se asume que CONFIG y FIREBASE_CONFIG_READY están definidos en ServiceAccount.gs
// Se asume que ART5D_GLOBAL_MASTER_ANCHOR está definido en Code.gs

/**
 * Muestra el archivo HTML principal (App.html).
 * Esta función es la que ejecuta la aplicación web para mostrar la interfaz.
 */
function getHtml() {
  return HtmlService.createTemplateFromFile('App').evaluate();
}

/**
 * Función llamada por App.html (google.script.run) para cargar el estado inicial.
 * Simula el "inicio de sesión" usando el email de Google del usuario y consulta 
 * su límite de IA en Firestore.
 * * @returns {object} {success: boolean, userEmail: string, iaLimit: number, anchorId: string, error: string}
 */
function getInitialData() {
  try {
    // Obtiene el correo electrónico del usuario activo de Google.
    const userEmail = Session.getActiveUser().getEmail();
    
    // 1. Conexión a Firebase
    // Verificamos si la configuración de Firebase está lista (desde ServiceAccount.gs).
    if (typeof FIREBASE_CONFIG_READY === 'undefined' || !FIREBASE_CONFIG_READY) {
      throw new Error("Configuración de Firebase incompleta. Revisar ServiceAccount.gs");
    }
    
    // Conexión a la instancia de la base de datos de Firebase.
    const db = FirebaseApp.getDatabaseByName(CONFIG.projectId);
    
    // 2. Obtener el documento del usuario (la clave del documento es el email)
    // El email actúa como el ID del documento en la colección 'users'.
    const doc = db.collection("users").doc(userEmail).get();
    
    let iaLimit = 0; // Inicializar límite en 0 (Starter Pack)
    
    if (doc.exists) {
      // Usuario encontrado en Firestore. Cargar su límite.
      const data = doc.data();
      iaLimit = data.limiteIA || 0; 
      Logger.log(`Datos iniciales cargados para ${userEmail}. Límite IA: ${iaLimit}`);
    } else {
      // Nuevo usuario. Crear documento inicial con límite 0.
      const initialDoc = {
        email: userEmail,
        packId: "starter",
        packNombre: "Pack Starter (0 imágenes)",
        activo: false,
        fechaCreacion: new Date().toISOString(),
        limiteIA: 0,
        limitePropias: 0,
        montoUsd: 0.00
      };
      // Crear el documento en la colección 'users'
      db.collection("users").doc(userEmail).set(initialDoc);
      Logger.log(`Nuevo usuario creado: ${userEmail} con límite 0.`);
    }

    // 3. Devolver los datos al Frontend
    return {
      success: true,
      userEmail: userEmail,
      iaLimit: iaLimit,
      // Obtener el ANCHOR global de la constante definida en Code.gs
      anchorId: typeof ART5D_GLOBAL_MASTER_ANCHOR !== 'undefined' ? ART5D_GLOBAL_MASTER_ANCHOR : "ID NO DEFINIDO EN CODE.GS"
    };

  } catch (e) {
    Logger.log("ERROR en getInitialData: " + e.message);
    return {
      success: false,
      userEmail: "ERROR",
      iaLimit: 0,
      anchorId: "ERROR",
      error: e.message
    };
  }
}

/**
 * Función llamada por App.html (google.script.run) para iniciar el proceso de
 * generación de arte, certificación y débito de límite.
 * Llama a la lógica central 'generarCertificado' definida en Code.gs.
 * * @param {string} prompt - Descripción del arte a generar.
 * @param {string} engine - Motor IA a usar ('grok', 'gemini', 'both').
 * @param {string} artworkId - ID único generado por el Frontend para la obra.
 * @returns {object} {success: boolean, metadataUrl: string, grokUrl: string, geminiUrl: string, error: string}
 */
function generateArtworkAndMetadata(prompt, engine, artworkId) {
  try {
    const userEmail = Session.getActiveUser().getEmail();
    
    // La función 'generarCertificado' está definida en Code.gs y maneja la lógica compleja
    const result = generarCertificado(prompt, userEmail, engine, artworkId); 

    if (result.success) {
      Logger.log(`Certificado exitoso para ${userEmail}. Metadatos: ${result.metadataUrl}`);
      
      return {
        success: true,
        metadataUrl: result.metadataUrl,
        grokUrl: result.grokUrl || "", 
        geminiUrl: result.geminiUrl || "" 
      };
    } else {
      Logger.log(`Fallo de Certificación: ${result.error}`);
      return { success: false, error: result.error };
    }

  } catch (e) {
    Logger.log("ERROR en generateArtworkAndMetadata: " + e.message);
    return { success: false, error: "Error interno del sistema de certificación: " + e.message };
  }
}
