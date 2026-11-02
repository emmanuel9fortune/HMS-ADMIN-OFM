import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadStaffPDF = (staff) => {
  const doc = new jsPDF();

  // Report heading
  doc.setFontSize(18);
  doc.text("HOSPITAL STAFF RECORD", 14, 20);

  doc.setFontSize(10);
  doc.text(`Total Staff: ${staff.length}`, 14, 28);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 34);

  // Table
  autoTable(doc, {
    startY: 42,
    head: [
      ["S/N", "Staff Name", "Position"]
    ],
    body: staff.map((item, index) => [
      index + 1,
      item.name || "N/A",
      item.title || "N/A",
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [20, 38, 74],
      textColor: 255
    },
    styles: {
      fontSize: 8,
      cellPadding: 3
    }
  });

  // Download
  doc.save("Hospital-Staff-Records.pdf");
};