import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const downloadInvoice = async (invoiceData) => {
  const lang = invoiceData.forceLang || localStorage.getItem("lang") || "en";
  // console.log("nnnnnnn",lang);
  const templateFile = `invoices/template_${lang}.html`;

  try {
    // Fetch the template
    const response = await fetch(templateFile);
    let template = await response.text();

    // Replace placeholders
    template = template
      .replace(/{{user}}/g, invoiceData.user)
      .replace(/{{contact}}/g, invoiceData.contact)
      .replace(/{{Address}}/g, invoiceData.address)
      .replace(/{{InvoiceNo}}/g, invoiceData.InvoiceNo)
      .replace(/{{Date}}/g, invoiceData.Date)
      .replace(/{{SubTtotal}}/g, invoiceData.SubTtotal)
      .replace(/{{Discount}}/g, invoiceData.Discount)
      .replace(/{{Total}}/g, invoiceData.Total)
      .replace(/{{services}}/g, generateServicesHtml(invoiceData.services));

    // Create temporary div to render HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template;
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.width = "210mm"; // Match A4 width
    document.body.appendChild(tempDiv);

    // Convert to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL("image/png");

    // PDF dimensions
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add extra pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`invoice_${invoiceData.InvoiceNo}_${lang}.pdf`);

    document.body.removeChild(tempDiv);
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (lang !== "en" && !invoiceData.forceLang) {
      downloadInvoice({ ...invoiceData, forceLang: "en" });
    }
  }
};

const generateServicesHtml = (services) => {
  return services
    .map(
      (service, i) => `
    <tr style="border-bottom:1px solid #ccc">
      <td style="padding:10px 0;">${i + 1}</td>
      <td style="padding:10px 0;">${service.package_name} - ${
        service.service_name
      }</td>
      <td style="padding:10px 0;">${service.package_sale_price}</td>
    </tr>
  `
    )
    .join("");
};

export default downloadInvoice;
