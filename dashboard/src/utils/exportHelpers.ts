import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InventoryItem } from '../types';
import { formatDate, calculateAgeingDays, calculateDaysToExpiry } from './dateHelpers';

export function exportToCSV(data: InventoryItem[], filename: string = 'inventory-export.csv') {
  const csvData = data.map(item => ({
    'JWL Part': item.jwl_part,
    'Customer Part': item.customer_part,
    'Description': item.description,
    'UOM': item.uom,
    'Batch': item.batch,
    'MFG Date': formatDate(item.mfg_date),
    'EXP Date': formatDate(item.exp_date),
    'Quantity': item.qty,
    'Ageing Days': calculateAgeingDays(item.mfg_date),
    'Days to Expiry': calculateDaysToExpiry(item.exp_date),
  }));

  const headers = Object.keys(csvData[0] || {});
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(data: InventoryItem[], filename: string = 'inventory-export.pdf') {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Inventory Report', 14, 22);

  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  const tableData = data.map(item => [
    item.jwl_part,
    item.customer_part,
    item.description.substring(0, 30) + (item.description.length > 30 ? '...' : ''),
    item.batch,
    formatDate(item.mfg_date),
    formatDate(item.exp_date),
    item.qty.toString(),
    calculateAgeingDays(item.mfg_date).toString(),
    calculateDaysToExpiry(item.exp_date).toString(),
  ]);

  autoTable(doc, {
    head: [['JWL Part', 'Cust Part', 'Description', 'Batch', 'MFG Date', 'EXP Date', 'QTY', 'Age', 'Days Left']],
    body: tableData,
    startY: 35,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [25, 118, 210], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(filename);
}
