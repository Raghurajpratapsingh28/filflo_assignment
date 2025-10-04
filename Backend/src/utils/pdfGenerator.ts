import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface ReceiptItem {
  jwl_part: string;
  description: string;
  qty: number;
  unit_price?: number;
  total_price?: number;
}

export interface CustomerInfo {
  name: string;
  address: string;
  email?: string;
  phone?: string;
}

export interface ReceiptData {
  receipt_number: string;
  date: Date;
  customer: CustomerInfo;
  items: ReceiptItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  grand_total: number;
  company_name?: string;
  company_address?: string;
}

/**
 * Generate PDF receipt and return as base64 string
 * @param receiptData - Receipt data
 * @returns Base64 encoded PDF string
 */
export const generateReceiptPDF = async (receiptData: ReceiptData): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', (buffer) => buffers.push(buffer));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        const base64String = pdfBuffer.toString('base64');
        resolve(base64String);
      });

      // Company Header
      doc.fontSize(20).font('Helvetica-Bold').text(receiptData.company_name || 'Inventory Management System', { align: 'center' });
      doc.moveDown(0.5);
      
      if (receiptData.company_address) {
        doc.fontSize(10).font('Helvetica').text(receiptData.company_address, { align: 'center' });
        doc.moveDown(1);
      }

      // Receipt Info
      doc.fontSize(14).font('Helvetica-Bold').text('RECEIPT', { align: 'center' });
      doc.moveDown(1);

      // Receipt Number and Date
      doc.fontSize(10).font('Helvetica');
      doc.text(`Receipt No: ${receiptData.receipt_number}`, 50, doc.y);
      doc.text(`Date: ${receiptData.date.toLocaleDateString()}`, 400, doc.y);
      doc.moveDown(1);

      // Customer Information
      doc.fontSize(12).font('Helvetica-Bold').text('Customer Information:', 50, doc.y);
      doc.moveDown(0.5);
      
      doc.fontSize(10).font('Helvetica');
      doc.text(`Name: ${receiptData.customer.name}`, 50, doc.y);
      doc.text(`Address: ${receiptData.customer.address}`, 50, doc.y + 15);
      
      if (receiptData.customer.email) {
        doc.text(`Email: ${receiptData.customer.email}`, 50, doc.y + 15);
      }
      if (receiptData.customer.phone) {
        doc.text(`Phone: ${receiptData.customer.phone}`, 50, doc.y + 15);
      }
      
      doc.moveDown(1);

      // Items Table Header
      const tableTop = doc.y;
      doc.fontSize(10).font('Helvetica-Bold');
      
      doc.text('Part Number', 50, tableTop);
      doc.text('Description', 150, tableTop);
      doc.text('Qty', 350, tableTop);
      doc.text('Unit Price', 400, tableTop);
      doc.text('Total', 480, tableTop);

      // Draw line under header
      doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();
      doc.moveDown(0.5);

      // Items
      let currentY = doc.y;
      doc.fontSize(9).font('Helvetica');
      
      receiptData.items.forEach((item, index) => {
        const itemY = currentY + (index * 20);
        
        doc.text(item.jwl_part, 50, itemY);
        doc.text(item.description.substring(0, 30) + (item.description.length > 30 ? '...' : ''), 150, itemY);
        doc.text(item.qty.toString(), 350, itemY);
        doc.text((item.unit_price || 0).toFixed(2), 400, itemY);
        doc.text((item.total_price || 0).toFixed(2), 480, itemY);
      });

      // Draw line under items
      const itemsEndY = currentY + (receiptData.items.length * 20) + 10;
      doc.moveTo(50, itemsEndY).lineTo(550, itemsEndY).stroke();

      // Totals
      doc.moveDown(2);
      doc.fontSize(10).font('Helvetica');
      
      doc.text('Subtotal:', 400, doc.y);
      doc.text(receiptData.subtotal.toFixed(2), 480, doc.y);
      
      doc.text(`Tax (${receiptData.tax_rate}%):`, 400, doc.y + 15);
      doc.text(receiptData.tax_amount.toFixed(2), 480, doc.y + 15);
      
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('Grand Total:', 400, doc.y + 30);
      doc.text(receiptData.grand_total.toFixed(2), 480, doc.y + 30);

      // Footer
      doc.moveDown(3);
      doc.fontSize(8).font('Helvetica').text('Thank you for your business!', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generate receipt number
 * @returns Unique receipt number
 */
export const generateReceiptNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `RCP-${timestamp}-${random}`;
};

/**
 * Calculate receipt totals
 * @param items - Receipt items
 * @param taxRate - Tax rate percentage
 * @returns Calculated totals
 */
export const calculateReceiptTotals = (items: ReceiptItem[], taxRate: number = 0) => {
  const subtotal = items.reduce((sum, item) => sum + (item.total_price || 0), 0);
  const tax_amount = (subtotal * taxRate) / 100;
  const grand_total = subtotal + tax_amount;

  return {
    subtotal,
    tax_amount,
    grand_total
  };
};

/**
 * Save PDF to file and return file path
 * @param receiptData - Receipt data
 * @param filePath - File path to save PDF
 * @returns File path
 */
export const generateReceiptPDFFile = async (receiptData: ReceiptData, filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);
      
      // Same PDF generation logic as generateReceiptPDF
      // Company Header
      doc.fontSize(20).font('Helvetica-Bold').text(receiptData.company_name || 'Inventory Management System', { align: 'center' });
      doc.moveDown(0.5);
      
      if (receiptData.company_address) {
        doc.fontSize(10).font('Helvetica').text(receiptData.company_address, { align: 'center' });
        doc.moveDown(1);
      }

      // Receipt Info
      doc.fontSize(14).font('Helvetica-Bold').text('RECEIPT', { align: 'center' });
      doc.moveDown(1);

      // Receipt Number and Date
      doc.fontSize(10).font('Helvetica');
      doc.text(`Receipt No: ${receiptData.receipt_number}`, 50, doc.y);
      doc.text(`Date: ${receiptData.date.toLocaleDateString()}`, 400, doc.y);
      doc.moveDown(1);

      // Customer Information
      doc.fontSize(12).font('Helvetica-Bold').text('Customer Information:', 50, doc.y);
      doc.moveDown(0.5);
      
      doc.fontSize(10).font('Helvetica');
      doc.text(`Name: ${receiptData.customer.name}`, 50, doc.y);
      doc.text(`Address: ${receiptData.customer.address}`, 50, doc.y + 15);
      
      if (receiptData.customer.email) {
        doc.text(`Email: ${receiptData.customer.email}`, 50, doc.y + 15);
      }
      if (receiptData.customer.phone) {
        doc.text(`Phone: ${receiptData.customer.phone}`, 50, doc.y + 15);
      }
      
      doc.moveDown(1);

      // Items Table Header
      const tableTop = doc.y;
      doc.fontSize(10).font('Helvetica-Bold');
      
      doc.text('Part Number', 50, tableTop);
      doc.text('Description', 150, tableTop);
      doc.text('Qty', 350, tableTop);
      doc.text('Unit Price', 400, tableTop);
      doc.text('Total', 480, tableTop);

      // Draw line under header
      doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();
      doc.moveDown(0.5);

      // Items
      let currentY = doc.y;
      doc.fontSize(9).font('Helvetica');
      
      receiptData.items.forEach((item, index) => {
        const itemY = currentY + (index * 20);
        
        doc.text(item.jwl_part, 50, itemY);
        doc.text(item.description.substring(0, 30) + (item.description.length > 30 ? '...' : ''), 150, itemY);
        doc.text(item.qty.toString(), 350, itemY);
        doc.text((item.unit_price || 0).toFixed(2), 400, itemY);
        doc.text((item.total_price || 0).toFixed(2), 480, itemY);
      });

      // Draw line under items
      const itemsEndY = currentY + (receiptData.items.length * 20) + 10;
      doc.moveTo(50, itemsEndY).lineTo(550, itemsEndY).stroke();

      // Totals
      doc.moveDown(2);
      doc.fontSize(10).font('Helvetica');
      
      doc.text('Subtotal:', 400, doc.y);
      doc.text(receiptData.subtotal.toFixed(2), 480, doc.y);
      
      doc.text(`Tax (${receiptData.tax_rate}%):`, 400, doc.y + 15);
      doc.text(receiptData.tax_amount.toFixed(2), 480, doc.y + 15);
      
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('Grand Total:', 400, doc.y + 30);
      doc.text(receiptData.grand_total.toFixed(2), 480, doc.y + 30);

      // Footer
      doc.moveDown(3);
      doc.fontSize(8).font('Helvetica').text('Thank you for your business!', { align: 'center' });

      doc.end();
      
      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};
