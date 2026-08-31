// ExpensesReport

// === Imports (always at the very top) ===
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// === Main export function ===
export const ExpensesReport = (
  getexpens, 
  getstaff, 
  Total
) => {
  // === Initialize PDF ===
    const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

  // Helper function: convert ₦ safely (avoid broken symbol)
  const safeCurrency = (val) =>
    formatted.format(val).replace("₦", "NGN ");

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
    compress: true,
  });

  // === Title ===
  doc.setFontSize(14);
  doc.text("EXPENSES REPORT", 40, 30);

  // === Totals Section ===
  doc.setDrawColor(195, 195, 195);
  doc.setLineWidth(0.3);
  doc.line(40, 40, doc.internal.pageSize.getWidth() - 40, 40);

  doc.setFontSize(10);
  doc.setTextColor(52, 73, 94);

  let yPos = 60;

  // === Show totals based on sortType ===
    // Default totals for all
    doc.text(`Total Expenses ${safeCurrency(Total)}`, 40, yPos);

  // === Separator line ===
  doc.setDrawColor(195, 195, 195);
  doc.setLineWidth(0.3);
  doc.line(40, yPos + 10, doc.internal.pageSize.getWidth() - 40, yPos + 10);

  // === Table headers ===
  const headers = [["DATE", "STAFF NAME", "PURPOSE OF REQUEST", "AMOUNT REQUESTED", "AMOUNT APPROVED", "ALLOWANCE", "RECEIVER NAME", "STAFF NAME"]];
  const rows = [];

  // === Build rows ===
  getexpens
    .sort((a, b) => b.timeStamp - a.timeStamp)
    .forEach((item) => {
      const getPatientInfo = getstaff?.find((pat) => pat?._id === item?.staffID);

      const date = item?.date
      const name = item?.name
      const purpose = item?.purpose
      const amount = item?.amount
      const approve = item?.approve
      const allowance = item?.allowance
      const receiver = item?.receiver
      const staffname = getPatientInfo?.name

        rows.push([
          date,
          name,
          purpose,
          safeCurrency(amount),
          safeCurrency(approve),
          allowance,
          receiver,
          staffname,
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
