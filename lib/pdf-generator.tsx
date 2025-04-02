import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface Product {
  id: string;
  name: string;
  price: number;
  date: string;
}

export const generatePDF = (products: Product[]) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Configuración inicial del documento
  doc.setFont("helvetica");
  doc.setTextColor(60, 60, 60);

  // Título
  doc.setFontSize(20);
  doc.text("Lista de Compras", 105, 20, { align: "center" });

  // Fecha
  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, 105, 30, { align: "center" });

  // Datos de la tabla
  const tableData = products.map((product) => [
    product.name,
    `$${product.price.toFixed(2)}`,
    new Date(product.date).toLocaleDateString("es-ES"),
  ]);

  // Total
  const total = products.reduce((sum, product) => sum + product.price, 0);

  // Generar tabla - ¡ESTA ES LA PARTE CLAVE!
  autoTable(doc, {
    startY: 40,
    head: [["Producto", "Precio", "Fecha"]],
    body: tableData,
    foot: [["Total", `$${total.toFixed(2)}`, ""]],
    theme: "grid",
    headStyles: {
      fillColor: [39, 174, 96],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 10,
    },
  });

  doc.save("lista-de-compras.pdf");
};