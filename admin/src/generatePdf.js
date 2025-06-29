import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateStockPDF(report) {
  const doc = new jsPDF();

  const addFooter = (currentPage, totalPages) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20); // Footer line

    const footerText = `Page ${currentPage} of ${totalPages}`;
    doc.setFontSize(10);
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" });
  };

  doc.setFontSize(20);
  doc.text("Stock Report", 14, 15);
  doc.setFontSize(10);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 20);

  let yOffset = 25;

  report.forEach((cat) => {
    yOffset += 5; // Add some space before the category title
    doc.setFontSize(16);
    doc.text(`Category: ${cat.category}`, 14, yOffset);
    yOffset += 8;

    cat.productCategory.forEach((prodCat) => {
      doc.setFontSize(14);
      doc.text(`Product Category: ${prodCat.productCategory}`, 14, yOffset);
      yOffset += 6;

      if (!prodCat.products || prodCat.products.length === 0) {
        doc.setFontSize(12);
        doc.text("No products available", 14, yOffset);
        yOffset += 10; // Add some space before the next category
        if (yOffset > 250) {
          doc.addPage();
          yOffset = 20;
        }
        return;
      }

      const rows = prodCat.products.map((p) => [p.product, p.size, p.quantity]);

      autoTable(doc, {
        startY: yOffset,
        head: [["Product", "Size", "Quantity"]],
        body: rows,
        theme: "striped",
        margin: { left: 14, right: 14 },
        styles: { fontSize: 10 },
        didDrawPage: (data) => {
          yOffset = data.cursor.y + 10;
        },
      });

      yOffset = doc.lastAutoTable.finalY + 5; // Update Y offset for the next table
      
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }
    });
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  doc.save("stock_report.pdf");
}

export function generateSalesPDF(report) {
  const doc = new jsPDF();

  const addFooter = (currentPage, totalPages) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);

    const footerText = `Page ${currentPage} of ${totalPages}`;
    doc.setFontSize(10);
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" });
  };

  doc.setFontSize(20);
  doc.text("Sales Report", 14, 15);
  doc.setFontSize(10);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 20);

  let yOffset = 30;

  report.forEach((section) => {
    doc.setFontSize(16);
    doc.text(`Order Type: ${section.type}`, 14, yOffset);
    yOffset += 8;

    if (!section.orders || section.orders.length === 0) {
      doc.setFontSize(12);
      doc.text("No orders available", 14, yOffset);
      yOffset += 10;
      return;
    }

    const headers =
      section.type === "Normal Order"
        ? ["Order Number", "Customer", "Time", "Status", "Total Amount"]
        : ["Order Number", "Customer", "Date", "Time", "Status", "Total Amount"];

    const rows = section.orders.map((order) =>
      section.type === "Normal Order"
        ? [
            order.orderNumber,
            order.customerName,
            order.time,
            order.status,
            order.totalAmount,
          ]
        : [
            order.orderNumber,
            order.customerName,
            order.date,
            order.time,
            order.status,
            order.totalAmount,
          ]
    );

    autoTable(doc, {
      startY: yOffset,
      head: [headers],
      body: rows,
      theme: "striped",
      // margin: { left: 14, right: 14 },
      margin: { top: 10, bottom: 25, left: 14, right: 14 },
      styles: { fontSize: 10 },
      didDrawPage: (data) => {
        yOffset = data.cursor.y + 10;
      },
    });

    if (yOffset > 250) {
      doc.addPage();
      yOffset = 30;
    }
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  doc.save("sales_report.pdf");
}

