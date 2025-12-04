function getCertifiedArtworkHtml(data, pdfUrl) {
  const imageUrl = data.grok || data.gemini || "";
  return `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;background:#0f001a;color:white;padding:40px;border-radius:20px;text-align:center;">
      <h1 style="color:#ec4899;font-size:32px;">¡OBRA MAESTRA CERTIFICADA!</h1>
      <p style="font-size:18px;">ID único: <strong>${data.artworkId}</strong></p>
      <img src="${imageUrl}" style="max-width:100%;border-radius:16px;margin:20px 0;border:4px solid #ec4899;" />
      <br><br>
      <a href="${pdfUrl}" style="background:#ec4899;color:white;padding:18px 50px;border-radius:50px;text-decoration:none;font-size:22px;font-weight:bold;">
        DESCARGAR CERTIFICADO OFICIAL PDF
      </a>
      <br><br><br>
      <p>Este certificado es inmutable y verificable para siempre.</p>
      <hr style="border-color:#333;margin:40px 0;">
      <p><strong>Soporte / Gerencia:</strong> redesegpro@gmail.com</p>
      <p><small>Desarrollo: freddy.vicencio@gmail.com</small></p>
      <p style="color:#888;margin-top:30px;">ART5D © 2025 – Chile</p>
    </div>
  `;
}
