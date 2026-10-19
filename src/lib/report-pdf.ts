import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

export type ReportData = {
  bidId: string; quoteId: string; status: string; address: string; city: string;
  postalCode: string; propertyType: string; volumeM3: number; recycling: string;
  date: string; before: string[]; after: string[];
};

export async function buildReportPdf(data: ReportData) {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const fontResponse = await fetch("/fonts/report-sans.ttf");
  if (!fontResponse.ok) throw new Error("Impossible de charger la police du rapport.");
  const font = await pdf.embedFont(await fontResponse.arrayBuffer(), { subset: true });
  const ink = rgb(0.12, 0.19, 0.16);
  const green = rgb(0.08, 0.38, 0.24);
  const pages = () => {
    const page = pdf.addPage([595.28, 841.89]);
    page.drawText("Débarras France", { x: 42, y: 789, size: 20, font, color: green });
    page.drawText("Rapport de fin de chantier · Succession", { x: 42, y: 766, size: 11, font, color: ink });
    return page;
  };
  let page = pages();
  let y = 724;
  const write = (text: string, size = 11) => {
    for (const paragraph of text.split("\n")) {
      let line = "";
      for (const word of paragraph.split(/\s+/)) {
        // Split long unbroken input too, without allowing text beyond margins.
        const pieces: string[] = [];
        let piece = "";
        for (const char of word) {
          if (font.widthOfTextAtSize(piece + char, size) > 490) { pieces.push(piece); piece = char; } else piece += char;
        }
        pieces.push(piece);
        for (const part of pieces) {
          const candidate = line ? `${line} ${part}` : part;
          if (font.widthOfTextAtSize(candidate, size) > 510 && line) {
            if (y < 65) { page = pages(); y = 724; }
            page.drawText(line, { x: 42, y, size, font, color: ink }); y -= 18; line = part;
          } else line = candidate;
        }
      }
      if (y < 65) { page = pages(); y = 724; }
      if (line) page.drawText(line, { x: 42, y, size, font, color: ink });
      y -= 22;
    }
  };
  write(`Dossier : ${data.quoteId}`);
  write(`Bien : ${data.propertyType} — ${data.address}, ${data.postalCode} ${data.city}`);
  write(`Fin de chantier déclarée le ${new Date(data.date).toLocaleDateString("fr-FR")}`);
  write(data.status === "completed" ? "Statut : chantier validé par le client" : "Statut : fin déclarée par le professionnel, validation client en attente");
  y -= 12;
  write(`Volume réellement évacué : ${data.volumeM3} m³`, 14);
  write("Filières de recyclage, dons et destinations déclarés par le professionnel :", 12);
  write(data.recycling);
  y -= 15;
  write("Document de suivi destiné au notaire. Les volumes et destinations sont déclaratifs ; ce rapport ne remplace pas un bordereau réglementaire de déchets ni une expertise de valeur.", 9);
  for (const [label, urls] of [["Avant le débarras", data.before], ["Après le débarras", data.after]] as const) {
    for (let i = 0; i < urls.length; i += 2) {
      page = pages();
      page.drawText(label, { x: 42, y: 722, font, size: 16, color: ink });
      for (const [offset, url] of urls.slice(i, i + 2).entries()) {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Une photo n'a pas pu être chargée. Réessayez.");
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width; canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { bitmap.close(); throw new Error("Photo illisible"); }
        ctx.drawImage(bitmap, 0, 0); bitmap.close();
        const png = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error("Photo illisible")), "image/png"));
        const image = await pdf.embedPng(await png.arrayBuffer());
        const dims = image.scale(Math.min(510 / image.width, 280 / image.height));
        const bottom = offset === 0 ? 410 : 88;
        page.drawImage(image, { x: 42 + (510 - dims.width) / 2, y: bottom + (280 - dims.height) / 2, width: dims.width, height: dims.height });
        page.drawText(`Photo ${i + offset + 1}`, { x: 42, y: bottom - 15, font, size: 9, color: ink });
      }
    }
  }
  pdf.getPages().forEach((p, i, all) => p.drawText(`${i + 1} / ${all.length} · debarrasfrance.fr`, { x: 42, y: 32, font, size: 8, color: ink }));
  pdf.setTitle("Rapport de débarras après succession — Débarras France");
  const bytes = await pdf.save();
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}

export async function deliverReport(blob: Blob, filename: string) {
  const file = new File([blob], filename, { type: "application/pdf" });
  if (matchMedia("(pointer: coarse)").matches && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: filename }); return; }
    catch (e) { if ((e as DOMException).name === "AbortError") return; }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a"); link.href = url; link.download = filename;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}