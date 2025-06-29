// Import jsPDF for PDF creation and autoTable for generating tables in the PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Function to generate Stock Report PDF
export function generateStockPDF(report) {
  const doc = new jsPDF(); // Create a new PDF document

  // Helper function to add footer with page numbers
  const addFooter = (currentPage, totalPages) => {
    const pageWidth = doc.internal.pageSize.getWidth();     // Get width of the PDF page
    const pageHeight = doc.internal.pageSize.getHeight();   // Get height of the PDF page

    doc.setDrawColor(0);        // Set border color for footer line
    doc.setLineWidth(0.5);      // Set line thickness
    doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20); // Draw footer line

    const footerText = `Page ${currentPage} of ${totalPages}`;
    doc.setFontSize(10);        // Set footer text size
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" }); // Centered footer text
  };

  // Set title and date of generation
  doc.setFontSize(20);
  doc.text("Stock Report", 14, 15);
  doc.setFontSize(10);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 20);

  let yOffset = 25; // Start vertical position for content

  // Iterate through each main category
  report.forEach((cat) => {
    yOffset += 5; // Add spacing
    doc.setFontSize(16);
    doc.text(`Category: ${cat.category}`, 14, yOffset);
    yOffset += 8;

    // Iterate through each product category in the main category
    cat.productCategory.forEach((prodCat) => {
      doc.setFontSize(14);
      doc.text(`Product Category: ${prodCat.productCategory}`, 14, yOffset);
      yOffset += 6;

      // If no products exist under this category
      if (!prodCat.products || prodCat.products.length === 0) {
        doc.setFontSize(12);
        doc.text("No products available", 14, yOffset);
        yOffset += 10;

        // If space runs out, create new page
        if (yOffset > 250) {
          doc.addPage();
          yOffset = 20;
        }
        return;
      }

      // Prepare rows of product data
      const rows = prodCat.products.map((p) => [p.product, p.size, p.quantity]);

      // Generate table with headers and rows
      autoTable(doc, {
        startY: yOffset,
        head: [["Product", "Size", "Quantity"]],
        body: rows,
        theme: "striped",
        margin: { left: 14, right: 14 },
        styles: { fontSize: 10 },
        didDrawPage: (data) => {
          yOffset = data.cursor.y + 10; // Update yOffset for the next section
        },
      });

      yOffset = doc.lastAutoTable.finalY + 5;

      // Add new page if space runs out
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }
    });
  });

  // After generating all pages, loop to add footers
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  // Save the file as stock_report.pdf
  doc.save("stock_report.pdf");
}

// Function to generate Sales Report PDF
export function generateSalesPDF(report) {
  const doc = new jsPDF(); // Create a new PDF document

  // Helper function to add footer
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

  // Set title and date
  doc.setFontSize(20);
  doc.text("Sales Report", 14, 15);
  doc.setFontSize(10);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 20);

  let yOffset = 30; // Vertical position to start

  // Iterate through Normal Orders and Pre Orders
  report.forEach((section) => {
    doc.setFontSize(16);
    doc.text(`Order Type: ${section.type}`, 14, yOffset);
    yOffset += 8;

    // If there are no orders under this type
    if (!section.orders || section.orders.length === 0) {
      doc.setFontSize(12);
      doc.text("No orders available", 14, yOffset);
      yOffset += 10;
      return;
    }

    // Define column headers based on order type
    const headers =
      section.type === "Normal Order"
        ? ["Order Number", "Customer", "Time", "Status", "Total Amount"]
        : ["Order Number", "Customer", "Date", "Time", "Status", "Total Amount"];

    // Map order data into rows
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

    // Generate the table using autoTable
    autoTable(doc, {
      startY: yOffset,
      head: [headers],
      body: rows,
      theme: "striped",
      margin: { top: 10, bottom: 25, left: 14, right: 14 },
      styles: { fontSize: 10 },
      didDrawPage: (data) => {
        yOffset = data.cursor.y + 10;
      },
    });

    // Create new page if bottom of page is reached
    if (yOffset > 250) {
      doc.addPage();
      yOffset = 30;
    }
  });

  // Add footers to all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(i, totalPages);
  }

  // Save the file as sales_report.pdf
  doc.save("sales_report.pdf");
}
