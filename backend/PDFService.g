// PDFService.gs – Generación de PDF oficial ART5D

function generateCertificatePDF(artworkData) {
  const template = HtmlService.createTemplateFromFile('Certificado');
  template.data = artworkData;
  const html = template.evaluate().getContent();
  
  const blob = Utilities.newBlob(html, 'text/html')
    .getAs('application/pdf')
    .setName(`Certificado_ART5D_${artworkData.artworkId}.pdf`);
  
  return blob;
}
