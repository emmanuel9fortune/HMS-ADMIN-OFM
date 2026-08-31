// === Imports (always at the very top) ===
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// === Main export function ===
export const DataReport = (
  diagnos, 
  getPatient, 
  summary
) => {
  // === Initialize PDF ===
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
    compress: true,
  });

  // === Title ===
  doc.setFontSize(14);
  doc.text("OFM MEDICAL CENTER DIAGNOSTICS REPORT", 40, 30);

  // === Totals Section ===
  doc.setDrawColor(195, 195, 195);
  doc.setLineWidth(0.3);
  doc.line(40, 40, doc.internal.pageSize.getWidth() - 40, 40);

  doc.setFontSize(10);
  doc.setTextColor(52, 73, 94);

  let yPos = 60;

  // === Show totals based on sortType ===
    // Default totals for all
    doc.text(`${summary}. ${diagnos?.length} in total`, 40, yPos);

  // === Separator line ===
  doc.setDrawColor(195, 195, 195);
  doc.setLineWidth(0.3);
  doc.line(40, yPos + 10, doc.internal.pageSize.getWidth() - 40, yPos + 10);

  // === Table headers ===
  const headers = [["DATE | TIME", "SEX", "AGE", "PATIENT NAME", "ADDRESS", "DIAGNOSIS", "MODE OF CONFIRMATION"]];
  const rows = [];

  // === Build rows ===
  diagnos
    .sort((a, b) => b.timeStamp - a.timeStamp)
    .forEach((item) => {
      const date = new Date(Number(item?.timeStamp));
      const timeString = `${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${date.toLocaleDateString()}`;
      const getPatientInfo = getPatient?.find((pat) => pat?._id === item?.uid);

      const agetype = getPatientInfo?.AgeType ? getPatientInfo?.AgeType : 'years'
      const sex = getPatientInfo?.sex
      const age = getPatientInfo?.age + " " + agetype
      const name = getPatientInfo?.name
      const address = getPatientInfo?.address
      const diagnos = item?.name
      const type = item?.address

        rows.push([
          timeString,
          sex,
          age,
          name,
          address,
          diagnos,
          type,
        ]);
    });

  // === Generate table ===
  autoTable(doc, {
    head: headers,
    body: rows,
    startY: yPos + 30,
    theme: "grid",
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: {
      fillColor: [52, 73, 94],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(9);
      doc.text(
        `Page ${pageCount}`,
        doc.internal.pageSize.getWidth() - 60,
        doc.internal.pageSize.getHeight() - 10
      );
    },
  });

  // === Save file ===
  doc.save("Payment_Report.pdf");
};
