function doPost(e) {
  return handlePaymentWebhook(e);
}

function handlePaymentWebhook(e) {
  const payload = JSON.parse(e.postData.contents);
  const paymentStatus = payload.status;
  const amount = parseFloat(payload.price_amount);
  const email = payload.customer_email || payload.custom_fields?.email;
  const packId = payload.custom_fields?.pack || "pack_boceto";

  // Validación básica de seguridad
  if (!email || !paymentStatus) {
    return ContentService.createTextOutput("error");
  }

  const expectedAmount = {
    "pack_boceto": 4.99,
    "pack_nft": 9.99,
    "pack_gold": 69.99,
    "pack_platino": 129.99,
    "pack_diamante": 249.99
  }[packId] || 4.99;

  if (paymentStatus === "paid" && amount >= expectedAmount * 0.95) {
    const userRef = Firestore.getDocument(`users/${email}`);
    const updates = {
      activo: true,
      pack: packId,
      creditos: FieldValue.increment(getCreditosPack(packId)),
      fechaActivacion: new Date().toISOString()
    };
    userRef.update(updates);

    // === NUEVO: EMAIL DE BIENVENIDA AUTOMÁTICO ===
    sendWelcomeEmail(email, packId);

    return ContentService.createTextOutput("ok");
  }

  return ContentService.createTextOutput("pending");
}

// === ENVÍO DE EMAIL DE BIENVENIDA ===
function sendWelcomeEmail(userEmail, packId) {
  const packName = {
    "pack_boceto": "Boceto IA + Certificado",
    "pack_nft": "NFT Certificado Solana",
    "pack_gold": "Pack Gold",
    "pack_platino": "Pack Platino",
    "pack_diamante": "Pack Diamante"
  }[packId] || "Pack ART5D";

  const subject = "¡Bienvenido a ART5D! Tu pack está activo";
  const htmlBody = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#0f001a;color:white;padding:30px;border-radius:20px;">
      <h1 style="color:#ec4899;text-align:center;">¡Gracias por unirte a ART5D!</h1>
      <p>Tu pack <strong>${packName}</strong> ya está 100% activo.</p>
      <p>Ahora puedes generar obras maestras con IA y certificarlas al instante.</p>
      <div style="text-align:center;margin:30px 0;">
        <a href="https://art5d.cl" style="background:#ec4899;color:white;padding:15px 40px;border-radius:50px;text-decoration:none;font-size:18px;">
          ENTRAR A TU PANEL
        </a>
      </div>
      <p><strong>Soporte técnico / gerencia:</strong> redesegpro@gmail.com</p>
      <p><small>Desarrollo: freddy.vicencio@gmail.com</small></p>
      <hr style="border-color:#333;margin:30px 0;">
      <p style="text-align:center;color:#888;">ART5D © 2025 – Chile</p>
    </div>
  `;

  try {
    GmailApp.sendEmail(userEmail, subject, "", { htmlBody });
  } catch (err) {
    console.error("Error envío email bienvenida:", err);
  }
}

function getCreditosPack(packId) {
  const creditos = { pack_boceto: 1, pack_nft: 1, pack_gold: 15, pack_platino: 30, pack_diamante: 100 };
  return creditos[packId] || 1;
}
