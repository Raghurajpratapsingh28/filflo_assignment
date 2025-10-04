import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Receipt, ReceiptItem, Customer } from '../types';

export function generateReceiptPDF(
  receipt: Receipt,
  customer: Customer,
  items: ReceiptItem[]
): jsPDF {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setTextColor(25, 118, 210);
  doc.text('SALES RECEIPT', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Receipt #: ${receipt.receipt_number}`, 14, 35);
  doc.text(`Date: ${new Date(receipt.created_at).toLocaleDateString()}`, 14, 41);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Customer Information:', 14, 52);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Name: ${customer.name}`, 14, 59);
  if (customer.email) doc.text(`Email: ${customer.email}`, 14, 65);
  if (customer.phone) doc.text(`Phone: ${customer.phone}`, 14, 71);
  if (customer.address) {
    const addressLines = doc.splitTextToSize(`Address: ${customer.address}`, 180);
    doc.text(addressLines, 14, 77);
  }

  const tableData = items.map(item => [
    item.jwl_part,
    item.description.substring(0, 40) + (item.description.length > 40 ? '...' : ''),
    item.qty.toString(),
    `$${item.unit_price.toFixed(2)}`,
    `$${item.line_total.toFixed(2)}`,
  ]);

  autoTable(doc, {
    head: [['Part Number', 'Description', 'Quantity', 'Unit Price', 'Total']],
    body: tableData,
    startY: 90,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [25, 118, 210], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 80 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 90;

  doc.setDrawColor(200, 200, 200);
  doc.line(130, finalY + 10, 195, finalY + 10);

  doc.setFontSize(10);
  doc.text('Subtotal:', 130, finalY + 18);
  doc.text(`$${receipt.subtotal.toFixed(2)}`, 195, finalY + 18, { align: 'right' });

  doc.text('Tax (10%):', 130, finalY + 25);
  doc.text(`$${receipt.tax.toFixed(2)}`, 195, finalY + 25, { align: 'right' });

  doc.line(130, finalY + 28, 195, finalY + 28);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', 130, finalY + 36);
  doc.text(`$${receipt.total.toFixed(2)}`, 195, finalY + 36, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for your business!', 105, finalY + 50, { align: 'center' });

  doc.setFontSize(8);
  const footer = 'Inventory Management Dashboard | Internal Use Only';
  doc.text(footer, 105, 285, { align: 'center' });

  return doc;
}

export function printReceipt(doc: jsPDF) {
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const printWindow = window.open(pdfUrl);
  if (printWindow) {
    printWindow.addEventListener('load', () => {
      printWindow.print();
    });
  }
}

export function downloadReceipt(doc: jsPDF, filename: string) {
  doc.save(filename);
}
