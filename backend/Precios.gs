/**
 * ==============================================================================
 * ARCHIVO: Precios.gs → MATRIZ OFICIAL DE PRECIOS ART5D 2025 (FUENTE ÚNICA DE VERDAD)
 * ==============================================================================
 * 
 * Esta es la ÚNICA fuente de precios del sistema.
 * Se usa en:
 *   • INPUT_CLIENTE → Cálculo automático de costo total
 *   • Webhook NOWPayments → Validación de pago recibido
 *   • Manager.html → Límites de obras por pack
 *   • Emails automáticos y certificados
 * 
 * © 2025 ART5D.cl – Portal Global de Arte Digital Certificado
 */

const PRECIOS_ART5D_2025 = {

  // ========================================================================
  // 1. PACKS PRINCIPALES (los que vendes en art5d.cl)
  // ========================================================================
  "SC-01_BOCETO_IA":               { precio: 4.99,   nombre: "Boceto IA + Certificado",               limiteIA: 1,  limitePropias: 0 },
  "SC-02_NFT_SOLANA":              { precio: 9.99,   nombre: "NFT Certificado Solana",                limiteIA: 1,  limitePropias: 0 },

  "PP-01_PLATINO":                 { precio: 59.99,  nombre: "Pack Platino",                          limiteIA: 5,  limitePropias: 5 },
  "PP-02_GOLD":                    { precio: 129.99, nombre: "Pack Gold",                             limiteIA: 5,  limitePropias: 10 },
  "PP-03_DIAMANTE":                { precio: 249.99, nombre: "Pack Diamante (Anual)",                 limiteIA: 30, limitePropias: 30 },

  // ========================================================================
  // 2. PACKS EDUCATIVOS
  // ========================================================================
  "PE-01_APRENDIZ_PLATINO":        { precio: 57.56,  nombre: "Aprendiz Platino (6 talleres)",         limiteIA: 0,  limitePropias: 0 },
  "PE-02_GOLD_CLAS":               { precio: 69.99,  nombre: "Pack Gold Clas",                        limiteIA: 0,  limitePropias: 0 },
  "PE-03_ARTISTA_CERTIFICADO":     { precio: 99.99,  nombre: "Artista Certificado (Anual)",           limiteIA: 5,  limitePropias: 10 },

  // ========================================================================
  // 3. REGALOS / COLABORACIONES / INFLUENCERS (costo 0)
  // ========================================================================
  "REGALO_PLATINO":                { precio: 0,      nombre: "Regalo Pack Platino",                   limiteIA: 5,  limitePropias: 5 },
  "REGALO_GOLD":                   { precio: 0,      nombre: "Regalo Pack Gold",                      limiteIA: 5,  limitePropias: 10 },
  "REGALO_DIAMANTE":               { precio: 0,      nombre: "Regalo Pack Diamante",                  limiteIA: 30, limitePropias: 30 },
  "REGALO_ARTISTA_CERTIFICADO":    { precio: 0,      nombre: "Regalo Artista Certificado",            limiteIA: 5,  limitePropias: 10 },

  // ========================================================================
  // 4. EXTRAS
  // ========================================================================
  "EXTRA_NFT":                     { precio: 9.99,   nombre: "NFT adicional",                         limiteIA: 0,  limitePropias: 0 }
};

/**
 * OBTIENE EL PRECIO DE UN PACK
 * @param {string} packId 
 * @return {number} Precio en USD (0 si es regalo)
 */
function getPrecio(packId) {
  const pack = PRECIOS_ART5D_2025[packId];
  if (!pack) {
    Logger.log(`ADVERTENCIA: Pack no encontrado → ${packId}`);
    return null;
  }
  return pack.precio;
}

/**
 * OBTIENE EL NOMBRE LEGIBLE DEL PACK
 * @param {string} packId 
 * @return {string}
 */
function getNombrePack(packId) {
  const pack = PRECIOS_ART5D_2025[packId];
  return pack ? pack.nombre : "Pack Desconocido";
}

/**
 * OBTIENE LÍMITES DEL PACK (para el Manager y el Webhook)
 * @param {string} packId 
 * @return {{ia: number, propias: number}}
 */
function getLimitesPack(packId) {
  const pack = PRECIOS_ART5D_2025[packId];
  if (!pack) return { ia: 0, propias: 0 };
  return {
    ia: pack.limiteIA || 0,
    propias: pack.limitePropias || 0
  };
}

/**
 * LISTA TODOS LOS PACKS CON PRECIO > 0 (útil para reportes)
 * @return {Array}
 */
function listarPacksPagados() {
  return Object.entries(PRECIOS_ART5D_2025)
    .filter(([id, data]) => data.precio > 0)
    .map(([id, data]) => ({ id, ...data }));
}

// ==============================================================================
// FUNCIÓN DE PRUEBA RÁPIDA (ejecuta una vez para verificar que todo esté OK)
// ==============================================================================
function testPrecios() {
  Logger.log("=== MATRIZ DE PRECIOS ART5D 2025 CARGADA CORRECTAMENTE ===");
  Logger.log("Pack Gold → $" + getPrecio("PP-02_GOLD") + " | Límites → IA: " + getLimitesPack("PP-02_GOLD").ia + " | Propias: " + getLimitesPack("PP-02_GOLD").propias);
  Logger.log("Pack Diamante → $" + getPrecio("PP-03_DIAMANTE") + " | Límites → " + JSON.stringify(getLimitesPack("PP-03_DIAMANTE")));
  Logger.log("===================================================");
}
