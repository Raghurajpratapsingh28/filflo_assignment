import {
  generateReceiptPDF,
  generateReceiptNumber,
  calculateReceiptTotals,
  ReceiptData,
  ReceiptItem
} from '../utils/pdfGenerator';

describe('PDF Generator', () => {
  describe('generateReceiptNumber', () => {
    it('should generate unique receipt numbers', () => {
      const receipt1 = generateReceiptNumber();
      const receipt2 = generateReceiptNumber();
      
      expect(receipt1).toMatch(/^RCP-\d+-\d+$/);
      expect(receipt2).toMatch(/^RCP-\d+-\d+$/);
      expect(receipt1).not.toBe(receipt2);
    });
  });

  describe('calculateReceiptTotals', () => {
    it('should calculate totals correctly without tax', () => {
      const items: ReceiptItem[] = [
        { jwl_part: 'PART1', description: 'Item 1', qty: 2, unit_price: 10, total_price: 20 },
        { jwl_part: 'PART2', description: 'Item 2', qty: 1, unit_price: 15, total_price: 15 }
      ];
      
      const totals = calculateReceiptTotals(items, 0);
      
      expect(totals.subtotal).toBe(35);
      expect(totals.tax_amount).toBe(0);
      expect(totals.grand_total).toBe(35);
    });

    it('should calculate totals correctly with tax', () => {
      const items: ReceiptItem[] = [
        { jwl_part: 'PART1', description: 'Item 1', qty: 2, unit_price: 10, total_price: 20 },
        { jwl_part: 'PART2', description: 'Item 2', qty: 1, unit_price: 15, total_price: 15 }
      ];
      
      const totals = calculateReceiptTotals(items, 10);
      
      expect(totals.subtotal).toBe(35);
      expect(totals.tax_amount).toBe(3.5);
      expect(totals.grand_total).toBe(38.5);
    });

    it('should handle empty items array', () => {
      const totals = calculateReceiptTotals([], 10);
      
      expect(totals.subtotal).toBe(0);
      expect(totals.tax_amount).toBe(0);
      expect(totals.grand_total).toBe(0);
    });
  });

  describe('generateReceiptPDF', () => {
    it('should generate PDF as base64 string', async () => {
      const receiptData: ReceiptData = {
        receipt_number: 'RCP-123456-789',
        date: new Date('2024-06-01'),
        customer: {
          name: 'John Doe',
          address: '123 Main St, City, State 12345',
          email: 'john@example.com',
          phone: '555-1234'
        },
        items: [
          { jwl_part: 'PART1', description: 'Test Part 1', qty: 2, unit_price: 10, total_price: 20 },
          { jwl_part: 'PART2', description: 'Test Part 2', qty: 1, unit_price: 15, total_price: 15 }
        ],
        subtotal: 35,
        tax_rate: 10,
        tax_amount: 3.5,
        grand_total: 38.5,
        company_name: 'Test Company',
        company_address: '456 Business Ave, City, State 54321'
      };

      const pdfBase64 = await generateReceiptPDF(receiptData);
      
      expect(pdfBase64).toBeDefined();
      expect(typeof pdfBase64).toBe('string');
      expect(pdfBase64.length).toBeGreaterThan(0);
      
      // Verify it's valid base64
      expect(() => Buffer.from(pdfBase64, 'base64')).not.toThrow();
    });

    it('should handle receipt without optional fields', async () => {
      const receiptData: ReceiptData = {
        receipt_number: 'RCP-123456-789',
        date: new Date('2024-06-01'),
        customer: {
          name: 'Jane Doe',
          address: '789 Oak St, City, State 67890'
        },
        items: [
          { jwl_part: 'PART1', description: 'Test Part', qty: 1, unit_price: 25, total_price: 25 }
        ],
        subtotal: 25,
        tax_rate: 0,
        tax_amount: 0,
        grand_total: 25
      };

      const pdfBase64 = await generateReceiptPDF(receiptData);
      
      expect(pdfBase64).toBeDefined();
      expect(typeof pdfBase64).toBe('string');
      expect(pdfBase64.length).toBeGreaterThan(0);
    });
  });
});
