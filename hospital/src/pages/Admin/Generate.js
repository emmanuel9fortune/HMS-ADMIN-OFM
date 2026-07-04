// === Imports (always at the very top) ===
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// === Main export function ===
export const generatePaymentReportPDF = (
  data,
  patients,
  sortType = "",
  totalFormatted,
  cardTotal, 
  consultationTotal,
  othersTotal,
  utilsTotal,
  consumeTotal,
  docTotal,
  churchTotal,
  income,
  expense,
  profit
) => {
  // === Currency formatter (inside or outside, both fine) ===
  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Helper function: convert ₦ safely (avoid broken symbol)
  const safeCurrency = (val) =>
    formatted.format(val).replace("₦", "NGN ");

  // === Initialize PDF ===
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
    compress: true,
  });

  // === Title ===
  doc.setFontSize(14);
  doc.text("PAYMENT REPORT", 40, 30);

  // === Totals Section ===
  doc.setDrawColor(195, 195, 195);
  doc.setLineWidth(0.3);
  doc.line(40, 40, doc.internal.pageSize.getWidth() - 40, 40);

  doc.setFontSize(10);
  doc.setTextColor(0, 100, 0);

  let yPos = 60;

  // === Show totals based on sortType ===
  if (sortType === "cards") {
    doc.text(`Total Income Made ${safeCurrency(cardTotal)}`, 40, yPos);
  } else if (sortType === "consultation") {
    doc.text(`Total Income Made ${safeCurrency(consultationTotal)}`, 40, yPos);
  } else if (sortType === "drugs") {
    doc.text(`Total Income Made ${safeCurrency(othersTotal)}`, 40, yPos);
  } else if (sortType === "utils") {
    doc.text(`Total Income Made ${safeCurrency(utilsTotal)}`, 40, yPos);
  } else if (sortType === "consumables") {
    doc.text(`Total Income Made ${safeCurrency(consumeTotal)}`, 40, yPos);
  } else if (sortType === "doc") {
    doc.text(`Total Income Made ${safeCurrency(docTotal)}`, 40, yPos);
  } else {
    // Default totals for all
    doc.text(`Total Income Made ${safeCurrency(income)}`, 40, yPos);
    doc.setTextColor(200, 0, 0);
    doc.text(`Total Expenses ${safeCurrency(expense)}`, 300, yPos);
    doc.setTextColor(0, 100, 0);
    doc.text(`Total Profit ${safeCurrency(profit)}`, 520, yPos);
  }

  // === Separator line ===
  doc.setDrawColor(195, 195, 195);
  doc.setLineWidth(0.3);
  doc.line(40, yPos + 10, doc.internal.pageSize.getWidth() - 40, yPos + 10);

  // === Table headers ===
  const headers = [["TIME", "Patient Name", "PURPOSE OF PAYMENT", "AMOUNT PAID", "MODE OF PAID"]];
  const rows = [];

  // === Build rows ===
  data
    .sort((a, b) => b.timeStamp - a.timeStamp)
    .forEach((item) => {
      const date = new Date(Number(item?.timeStamp));
      const timeString = `${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${date.toLocaleDateString()}`;
      const patient = patients?.find((pat) => pat?._id === item?.uid);
      const patientName = item?.name || patient?.name || "N/A";

      const isLab = item?.type === "lab";
      const isScan = item?.type === "scan";

      let purpose = "";
      let amount = 0;
      const getBill = JSON.parse(item?.services);

      if (isLab || isScan) {
        const getTotal = Array.isArray(getBill)
          ? getBill.reduce((sum, i) => sum + (i.price || 0), 0)
          : getBill.price || 0;
        purpose = Array.isArray(getBill)
          ? getBill.map((i) => i.testname).join(", ")
          : getBill.testname || "";
        amount = getTotal;
      } else {
        const getBill = JSON.parse(item?.services);
        purpose = getBill?.items?.map((x) => x.name || x.drugs).join(", ");
        amount = getBill?.totalPrice || getBill?.items?.[0]?.totalPrice || 0;
      }

      const mode = item?.mode || "";

      if (
        sortType === "" ||
        (sortType === "cards" && purpose.toLowerCase().includes("card")) ||
        (sortType === "consultation" && purpose.toLowerCase().includes("consultation")) ||
        (sortType === "utils"  && getBill?.profit === 0) ||
        (sortType === "consumables" && getBill?.profit !== 0) ||
        (sortType === "CHURCH" ) ||
        (sortType === "payout" ) ||
        (sortType === "drugs" &&
          !purpose.toLowerCase().includes("card") &&
          !purpose.toLowerCase().includes("consultation")) ||
        (sortType === "lab" && isLab) ||
        (sortType === "scan" && isScan)
      ) {
        rows.push([
          timeString,
          patientName,
          purpose,
          safeCurrency(amount),
          mode,
        ]);
      }
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
