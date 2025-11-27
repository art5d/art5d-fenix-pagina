function generateArtworkAndMetadata(prompt, userEmail, engine = "both") {
  // ... todo tu código existente de generación con Grok y Gemini ...
  // (lo dejo tal cual hasta la parte final donde ya tienes las URLs)

  const artworkId = Utilities.getUuid();
  const grokUrl = generarConGrok(prompt);
  const geminiUrl = generarConGemini(prompt);

  // Guardar en Drive y Firestore (tu código existente)
  // ...

  const result = {
    grok: grokUrl,
    gemini: geminiUrl,
    artworkId: artworkId,
    metadataUrl: `https://drive.google.com/file/d/${metadataId}/view`,
    prompt: prompt
  };

  // === NUEVO: GENERAR PDF + EMAIL CON CERTIFICADO ===
  try {
    const pdfBlob = generateCertificatePDF(result);
    const pdfFile = DriveApp.getFolderById("TU_CARPETA_ID_AQUI").createFile(pdfBlob.setName(`Certificado_${artworkId}.pdf`));
    const pdfUrl = pdfFile.getUrl();

    GmailApp.sendEmail(
      userEmail,
      `¡Tu obra "${prompt.substring(0,50)}..." está CERTIFICADA! – ART5D`,
      "",
      {
        htmlBody: getCertifiedArtworkHtml(result, pdfUrl),
        attachments: [pdfBlob]
      }
    );

    result.pdfUrl = pdfUrl;
  } catch (err) {
    console.error("Error al generar/enviar PDF:", err);
  }

  return { success: true, data: result };
}
