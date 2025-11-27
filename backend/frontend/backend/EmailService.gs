// EmailService.gs – Emails automáticos ART5D (bienvenida + obra certificada con PDF)

function sendWelcomeEmail(email, packId, packNombre) {
  const subject = "¡Bienvenido a ART5D – Tu pack está activado!";
  const htmlBody = `
    <h1 style="color:#ec4899;">¡FELICIDADES, ARTISTA!</h1>
    <p>Tu <strong>${packNombre}</strong> ha sido activado exitosamente.</p>
    <p>Ya puedes generar hasta ${getLimitesPack(packId).ia + getLimitesPack(packId).propias} obras certificadas con IA + NFT en Solana.</p>
    <br>
    <p><a href="${ScriptApp.getService().getUrl()}" style="background:#ec4899;color:white;padding:15px 30px;text-decoration:none;border-radius:50px;font-weight:bold;">IR A CERTIFICAR OBRAS</a></p>
    <br>
    <p>— El equipo ART5D</p>
  `;
  GmailApp.sendEmail(email, subject, "", { htmlBody: htmlBody });
  Logger.log("Email de bienvenida enviado a " + email);
}

function sendCertifiedArtworkEmail(userEmail, artworkData) {
  // artworkData viene de generateArtwork(): {imageUrl, metadataUrl, prompt, artworkId, engine}
  const pdfBlob = generateCertificatePDF(artworkData); // función en PDFService.gs
  const subject = `🎨 Tu obra "${artworkData.prompt.substring(0,50)}..." ya está certificada – ART5D #${artworkData.artworkId}`;
  
  const htmlBody = `
    <h1 style="color:#ec4899;">¡OBRA CERTIFICADA CON ÉXITO!</h1>
    <p>Aquí tienes tu certificado oficial ART5D con tecnología blockchain.</p>
    <p><strong>Prompt:</strong> ${artworkData.prompt}</p>
    <p><strong>Motor IA:</strong> ${artworkData.engine.toUpperCase()}</p>
    <p><strong>ID de Obra:</strong> ${artworkData.artworkId}</p>
    <br>
    <p>Descarga tu certificado PDF adjunto y compártelo con el mundo.</p>
    <p>Pronto recibirás también tu NFT en Solana.</p>
    <br>
    <a href="${ScriptApp.getService().getUrl()}" style="background:#ec4899;color:white;padding:15px 30px;text-decoration:none;border-radius:50px;font-weight:bold;">VOLVER AL PANEL</a>
  `;

  GmailApp.sendEmail(userEmail, subject, "", {
    htmlBody: htmlBody,
    attachments: [pdfBlob.setName(`Certificado_ART5D_${artworkData.artworkId}.pdf`)]
  });
  
  Logger.log("Email con certificado PDF enviado a " + userEmail);
}
