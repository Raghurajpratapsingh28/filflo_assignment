import { X, Download, Printer } from 'lucide-react';
import { Receipt, ReceiptItem, Customer } from '../../types';
import { generateReceiptPDF, printReceipt, downloadReceipt } from '../../utils/receiptGenerator';

interface ReceiptPreviewProps {
  receipt: Receipt;
  customer: Customer;
  items: ReceiptItem[];
  onClose: () => void;
}

export default function ReceiptPreview({
  receipt,
  customer,
  items,
  onClose,
}: ReceiptPreviewProps) {
  const handlePrint = () => {
    const doc = generateReceiptPDF(receipt, customer, items);
    printReceipt(doc);
  };

  const handleDownload = () => {
    const doc = generateReceiptPDF(receipt, customer, items);
    downloadReceipt(doc, `receipt-${receipt.receipt_number}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Receipt Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1976D2] mb-2">SALES RECEIPT</h1>
              <div className="text-sm text-gray-600">
                <p>Receipt #: {receipt.receipt_number}</p>
                <p>Date: {new Date(receipt.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Customer Information
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Name: {customer.name}</p>
                {customer.email && <p>Email: {customer.email}</p>}
                {customer.phone && <p>Phone: {customer.phone}</p>}
                {customer.address && <p>Address: {customer.address}</p>}
              </div>
            </div>

            <div className="mb-8">
              <table className="w-full">
                <thead className="bg-[#1976D2] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Part Number</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                    <th className="px-4 py-3 text-center text-sm font-medium">Quantity</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Unit Price</th>
                    <th className="px-4 py-3 text-right text-sm font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.jwl_part}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.qty}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        ${(item.unit_price || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                        ${(item.line_total || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-900 font-medium">${(receipt.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="text-gray-900 font-medium">${(receipt.tax || 0).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-[#1976D2]">
                      ${(receipt.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Thank you for your business!</p>
              <p className="mt-2 text-xs">Inventory Management Dashboard | Internal Use Only</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={handleDownload}
            className="px-6 py-2 bg-[#1976D2] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
