import { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import ReceiptForm from '../components/Receipts/ReceiptForm';
import ReceiptPreview from '../components/Receipts/ReceiptPreview';
import { InventorySummary, Receipt, ReceiptItem, Customer } from '../types';
import apiService from '../lib/api';

export default function ReceiptsPage() {
  const [inventorySummary, setInventorySummary] = useState<InventorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [currentItems, setCurrentItems] = useState<ReceiptItem[]>([]);

  useEffect(() => {
    loadInventorySummary();
  }, []);

  const loadInventorySummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const summary = await apiService.getInventorySummary();
      setInventorySummary(summary);
    } catch (err: any) {
      setError(err.message || 'Failed to load inventory summary');
      console.error('Error loading inventory summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReceipt = async (customer: Customer, items: ReceiptItem[]) => {
    try {
      // Convert ReceiptItem[] to the format expected by the backend
      const receiptItems = items.map(item => ({
        jwl_part: item.jwl_part,
        qty: item.qty,
        unit_price: item.unit_price
      }));

      const receiptData = {
        customer: {
          name: customer.name,
          address: customer.address,
          email: customer.email,
          phone: customer.phone
        },
        items: receiptItems,
        tax_rate: 10 // Default tax rate
      };

      const response = await apiService.generateReceipt(receiptData);

      // Calculate line_total for each item
      const itemsWithLineTotal = items.map(item => ({
        ...item,
        line_total: item.qty * item.unit_price
      }));

      // Create receipt object for preview
      const receipt: Receipt = {
        receipt_number: response.receipt_number,
        created_at: new Date().toISOString(),
        subtotal: response.totals.subtotal,
        tax: response.totals.tax_amount,
        total: response.totals.grand_total
      };

      setCurrentReceipt(receipt);
      setCurrentCustomer(customer);
      setCurrentItems(itemsWithLineTotal);
      setShowPreview(true);

      // Reload inventory summary to reflect updated quantities
      await loadInventorySummary();

      console.log('Receipt generated successfully:', receipt);
    } catch (error: any) {
      console.error('Error generating receipt:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred while generating the receipt';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1976D2]"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-red-600 text-lg font-medium mb-2">Error Loading Inventory</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <button 
              onClick={loadInventorySummary}
              className="px-4 py-2 bg-[#1976D2] text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customer Receipts</h2>
        <p className="text-gray-600 mt-1">Generate and manage customer sales receipts</p>
      </div>

      <ReceiptForm inventorySummary={inventorySummary} onGenerateReceipt={handleGenerateReceipt} />

      {showPreview && currentReceipt && currentCustomer && (
        <ReceiptPreview
          receipt={currentReceipt}
          customer={currentCustomer}
          items={currentItems}
          onClose={() => setShowPreview(false)}
        />
      )}
    </Layout>
  );
}
