/**
 * ==============================================================================
 * Precios.gs → MATRIZ OFICIAL DE PRECIOS ART5D 2025 (FUENTE ÚNICA DE VERDAD)
 * Versión FINAL DEFINITIVA – DICIEMBRE 2025 – DOMINIO GLOBAL
 * ==============================================================================
 */

const PRECIOS_ART5D_2025 = {

  // ==========================================================================
  // 1. PACKS PÚBLICOS (art5d.cl)
  // ==========================================================================
  "SC-01_BOCETO_IA": {
    precio: 4.99,
    nombre: "Boceto IA + Certificado NFT",
    limiteIA: 3,
    limitePropias: 0,
    totalCertificados: 3,
    incluyeNFT: true
  },

  "SC-02_NFT_SOLO": {
    precio: 9.99,
    nombre: "Certificado NFT Único (obra propia)",
    limiteIA: 0,
    limitePropias: 1,
    totalCertificados: 1,
    incluyeNFT: true
  },

  "PP-01_PLATINO": {
    precio: 59.99,
    nombre: "Pack Platino",
    limiteIA: 10,
    limitePropias: 10,
    totalCertificados: 20,
    incluyeNFT: true
  },

  "PP-02_GOLD": {
    precio: 129.99,
    nombre: "Pack Gold",
    limiteIA: 15,
    limitePropias: 20,
    totalCertificados: 35,
    incluyeNFT: true,
    destacado: true
  },

  "PP-03_DIAMANTE": {
    precio: 249.99,
    nombre: "Pack Diamante (Anual)",
    limiteIA: 50,
    limitePropias: 50,
    totalCertificados: 100,
    incluyeNFT: true,
    incluyeVault: true
  },

  // ==========================================================================
  // 2. PACK EXCLUSIVO PARA GALERÍAS – 500 NFTs REALES EN SOLANA
  // ==========================================================================
  "GP-500_GALLERY_PARTNER": {
    precio: 2499.00,
    nombre: "Gallery Partner – 500 NFTs Certificados",
    limiteIA: 250,
    limitePropias: 250,
    totalCertificados: 500,
    incluyeNFT: true,
    incluyeVault: true,
    incluyeGaleriaDestacada: true,
    incluyeBadgeVerificado: true,
    incluyeRevenueShare: "5% en reventas secundarias (opcional)",
    plazasLimitadas: 77,
    descripcion: "Acceso exclusivo como socio estratégico ART5D"
  },

  // ==========================================================================
  // 3. PACKS EDUCATIVOS
  // ==========================================================================
  "PE-01_APRENDIZ_PLATINO": {
    precio: 57.56,
    nombre: "Aprendiz Platino",
    limiteIA: 5,
    limitePropias: 5,
    totalCertificados: 10
  },

  "PE-02_GOLD_CLAS": {
    precio: 69.99,
    nombre: "Pack Gold Institucional",
    limiteIA: 10,
    limitePropias: 10,
    totalCertificados: 20
  },

  "PE-03_ARTISTA_CERTIFICADO": {
    precio: 99.99,
    nombre: "Artista Certificado Anual",
    limiteIA: 15,
    limitePropias: 20,
    totalCertificados: 35
  },

  // ==========================================================================
  // 4. REGALOS / COLABORACIONES
  // ==========================================================================
  "REGALO_PLATINO": {
    precio: 0,
    nombre: "Regalo Pack Platino",
    limiteIA: 10,
    limitePropias: 10
  },

  "REGALO_GOLD": {
    precio: 0,
    nombre: "Regalo Pack Gold",
    limiteIA: 15,
    limitePropias: 20
  },

  "REGALO_DIAMANTE": {
    precio: 0,
    nombre: "Regalo Pack Diamante",
    limiteIA: 50,
    limitePropias: 50
  },

  "REGALO_GALLERY_PARTNER": {
    precio: 0,
    nombre: "Regalo Gallery Partner",
    limiteIA: 250,
    limitePropias: 250
  },

  // ==========================================================================
  // 5. EXTRAS
  // ==========================================================================
  "EXTRA_NFT": {
    precio: 9.99,
    nombre: "NFT Adicional",
    limiteIA: 0,
    limitePropias: 1,
    totalCertificados: 1
  }
};

/**
 * ========================================================================
 * FUNCIONES OFICIALES – USADAS EN TODO EL SISTEMA
 * ========================================================================
 */
function getPrecio(packId) {
  const pack = PRECIOS_ART5D_2025[packId];
  return pack ? pack.precio : null;
}

function getNombrePack(packId) {
  const pack = PRECIOS_ART5D_2025[packId];
  return pack ? pack.nombre : "Pack Desconocido";
}

function getLimitesPack(packId) {
  const pack = PRECIOS_ART5D_2025[packId];
  if (!pack) return { ia: 0, propias: 0 };
  return {
    ia: pack.limiteIA || 0,
    propias: pack.limitePropias || 0
  };
}

function getTotalCertificados(packId) {
  const pack = PRECIOS_ART5D_2025[packId];
  return pack ? (pack.totalCertificados || (pack.limiteIA + pack.limitePropias)) : 0;
}

function esPackConNFT(packId) {
  const pack = PRECIOS_ART5D_2025[packId];
  return pack ? pack.incluyeNFT === true : false;
}

function listarPacksPublicos() {
  return Object.entries(PRECIOS_ART5D_2025)
    .filter(([id, p]) => p.precio > 0 && !id.startsWith('REGALO') && !id.startsWith('PE-'))
    .map(([id, p]) => ({
      id,
      nombre: p.nombre,
      precio: p.precio,
      totalCertificados: getTotalCertificados(id),
      destacado: p.destacado || false,
      descripcion: p.descripcion || `${getTotalCertificados(id)} certificados NFT incluidos`
    }));
}

// ========================================================================
// TEST RÁPIDO
// ========================================================================
function testPrecios() {
  Logger.log("MATRIZ ART5D 2025 CARGADA CORRECTAMENTE – DOMINIO GLOBAL");
  Logger.log("Gallery Partner 500 → $" + getPrecio("GP-500_GALLERY_PARTNER"));
  Logger.log("Total certificados → " + getTotalCertificados("GP-500_GALLERY_PARTNER"));
  Logger.log("Packs públicos → " + listarPacksPublicos().length);
}
