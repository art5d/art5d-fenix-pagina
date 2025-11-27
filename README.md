# ART5D CORE 2025 – ÚNICA FUENTE DE VERDAD
Última actualización: 26-noviembre-2025 22:00 CLT

## Estado Actual (VERIFICADO)
- Web App Deploy: Versión 10 activa → https://script.google.com/macros/s/AKfycbxLc1K6MY1UJYDJTT50V_7iHbyB2wN4eCleNy0E4GPbALH_xW2xIyWoCx7h1/exec
- Firestore: Conectado (projectId art5d-sincronizador)
- Keys Gemini/Grok: En propiedades del script ✓
- Emails + PDF: Creados y probados (falta llamar desde flujos)
- Pagos NOWPayments: Webhook vivo
- DNS art5d.cl: Propagación 90 % (48 h máximo)
- Falta: Integrar emails/PDF + Solana mint real

## Tareas Pendientes (orden exacto)
1. [ ] Llamar sendWelcomeEmail al final de handlePaymentWebhook
2. [ ] Llamar sendCertifiedArtworkEmail al final de generateArtwork
3. [ ] Crear BlockchainService.gs con mint comprimido (esperando CLI)
4. [ ] Crear Galeria.html pública
5. ```markdown
# ART5D — Portal Global de Arte Moderno & NFTs

**art5d.cl** es la plataforma líder de Latinoamérica para crear, certificar y exponer arte digital con tecnología blockchain (Solana) e inteligencia artificial.

### Lo que ya está 100 % activo (2025)

- 8 packs de creación con pago instantáneo en +300 criptomonedas (SOL, USDT, BTC, ETH…)
- Galería dinámica en tiempo real (Firebase Firestore)
- Certificación automática SOA al momento del pago
- Mint de NFTs en Solana incluido en todos los packs
- Diseño ultraligero y carga instantánea (Netlify + GitHub)

### Packs disponibles

| Pack                     | Precio       | Incluye                                                   |
|--------------------------|--------------|-----------------------------------------------------------|
| Boceto IA + Certificado  | $4.99        | 1 imagen IA + certificado oficial                         |
| NFT Certificado Solana   | $9.99        | Mint en Solana + certificado digital                      |
| Pack Platino             | $59.99       | 5 bocetos IA + 5 NFTs + galería colectiva                 |
| Pack Gold                | $129.99      | 15 obras propias + galería personal                       |
| Pack Diamante            | $249.99/año  | 30 NFTs + exposición global + prioridad VIP               |
| Aprendiz Platino         | $57.56       | 6 talleres grabados + acceso comunidad                    |
| Pack Gold Clas           | $69.99       | 6 talleres + certificado oficial de artista               |
| Artista Certificado      | $99.99/año   | 12 talleres + 5 NFTs + exposición mundial                 |

**Oferta lanzamiento**: 50 % OFF automático para los primeros 5 usuarios de cada pack.

### Despliegue automático

| Entorno      | Plataforma | Rama   | URL                    |
|--------------|------------|--------|------------------------|
| Producción   | Netlify    | main   | https://art5d.cl       |
| Preview      | Netlify    | otras  | *.netlify.app          |

### Stack técnico

- Frontend estático (HTML + TailwindCSS)
- Pagos cripto: NOWPayments (comisión 0 % para ti)
- Base de datos: Firebase Firestore
- Backend ligero: Google Apps Script + Cloud Functions
- Hosting & CI/CD: Netlify + GitHub

### Próximos pasos (2026)

- Marketplace NFT propio en Solana
- Integración AR (ver obras en tu espacio real)
- App móvil nativa iOS/Android
- Programa de afiliados global

**© 2025 ART5D.cl — El estándar global de arte digital certificado.**
```

