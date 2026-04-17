import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DeliveryReport } from "../types";

export function generateDeliveryPDF(report: DeliveryReport) {
  const doc = new jsPDF();
  const dateStr = format(new Date(report.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: ptBR });

  // Add Background Color for Header
  doc.setFillColor(25, 25, 112); // matches MidnightBlue #191970
  doc.rect(0, 0, 210, 40, 'F');

  // Title
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text("Comprovante de Entrega", 20, 25);

  // Content Area
  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFontSize(12);

  let y = 60;
  const lineSpacing = 10;
  const labelX = 20;
  const valueX = 70;

  const addField = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, labelX, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, valueX, y);
    y += lineSpacing;
  };

  addField("Empresa", report.companyName);
  addField("Recebedor", report.recipientName);
  addField("Tipo", report.equipmentType);
  addField("TAG", report.tag);
  addField("Chamado", report.ticketNumber);
  addField("Data/Hora", dateStr);

  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Assinatura do Cliente:", labelX, y);

  y += 10;
  if (report.signature) {
    try {
      doc.addImage(report.signature, 'PNG', labelX, y, 80, 40);
    } catch (e) {
      console.error("Error adding signature to PDF:", e);
      doc.text("[Erro ao processar assinatura]", labelX, y + 10);
    }
  }

  // Footer
  const footerY = 280;
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text("Documento gerado digitalmente pela equipe técnica.", 105, footerY, { align: "center" });

  const fileName = `entrega_${report.tag}_${report.ticketNumber}.pdf`;
  doc.save(fileName);
  return fileName;
}
