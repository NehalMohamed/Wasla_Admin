import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const downloadInvoice = async (invoiceData) => {
  const lang = localStorage.getItem("language") || "en";
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

    // Create a temporary div to render HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = template;
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    // Convert to PDF
    const canvas = await html2canvas(tempDiv, {
      scale: 2, // Higher quality
      useCORS: true, // For external images
      allowTaint: true,
      scrollX: 0,
      scrollY: 0,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
    });

    // Calculate PDF dimensions
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`invoice_${invoiceData.InvoiceNo}_${lang}.pdf`);

    // Clean up
    document.body.removeChild(tempDiv);
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Fallback to English if preferred language fails
    if (lang !== "en") {
      downloadInvoice({ ...invoiceData, forceLang: "en" });
    }
  }
};

const generateServicesHtml = (services) => {
  return services
    .map(
      (service, i) => `
    <tr>
      <td style="padding:10px 0;">${i}</td>
      <td style="padding:10px 0;">${service.package_name}</td>
      <td style="padding:10px 0;">${service.package_sale_price}</td>
    </tr>
  `
    )
    .join("");
};

export default downloadInvoice;
