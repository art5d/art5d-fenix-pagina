// Config.gs – VERSIÓN FINAL 100% SEGURA – DICIEMBRE 2025
const CONFIG = {
  get NFT_STORAGE_KEY() { return PropertiesService.getScriptProperties().getProperty('NFT_STORAGE_KEY'); },
  get SOLANA_CREATOR_ADDRESS() { return PropertiesService.getScriptProperties().getProperty('SOLANA_CREATOR_ADDRESS'); },
  get SOLANA_NETWORK() { return PropertiesService.getScriptProperties().getProperty('SOLANA_NETWORK') || 'mainnet-beta'; },

  MAX_OWN_UPLOADS: 10,
  MAX_AI_CERTIFIED: 5,
  MAX_TOTAL_GOLD: 15,

  PACKS: { gold: 59.99, platinum: 99.99, artista_anual: 149.99 },

  HTML_FILES: { APP: "App", MANAGER: "manager", CERTIFICADO: "Certificado" },

  ADMIN_EMAIL: "freddy.vicencio@gmail.com",
  SUPPORT_EMAIL: "redesegpro@gmail.com"
};
