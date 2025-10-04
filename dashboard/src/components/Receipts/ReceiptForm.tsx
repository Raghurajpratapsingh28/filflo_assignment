import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';
import { InventorySummary, ReceiptItem, Customer } from '../../types';

interface ReceiptFormProps {
  inventorySummary: InventorySummary[];
  onGenerateReceipt: (customer: Customer, items: ReceiptItem[]) => void;
}

export default function ReceiptForm({ inventorySummary, onGenerateReceipt }: ReceiptFormProps) {
  const [customer, setCustomer] = useState<Customer>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [selectedItems, setSelectedItems] = useState<ReceiptItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInventory, setSelectedInventory] = useState<InventorySummary | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredInventory = inventorySummary.filter(item =>
    item.jwl_part.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate available quantity for selected inventory item
  const getAvailableQuantity = (inventoryItem: InventorySummary) => {
    const existingItem = selectedItems.find(item => item.jwl_part === inventoryItem.jwl_part);
    if (existingItem) {
      return inventoryItem.available_qty - existingItem.qty;
    }
    return inventoryItem.available_qty;
  };

  const handleAddItem = () => {
    if (!selectedInventory || quantity <= 0 || unitPrice < 0) return;

    // Check if item already exists in selected items
    const existingItemIndex = selectedItems.findIndex(item => item.jwl_part === selectedInventory.jwl_part);
    
    if (existingItemIndex !== -1) {
      // Calculate total quantity including existing item
      const totalQuantity = selectedItems[existingItemIndex].qty + quantity;
      
      if (totalQuantity > selectedInventory.available_qty) {
        alert(`Cannot add ${quantity} more units. Total would be ${totalQuantity}, but only ${selectedInventory.available_qty} units available`);
        return;
      }
      
      // Update existing item
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        qty: totalQuantity,
        line_total: totalQuantity * unitPrice,
        unit_price: unitPrice // Update to latest price
      };
      setSelectedItems(updatedItems);
    } else {
      // Check stock availability for new item
      if (quantity > selectedInventory.available_qty) {
        alert(`Only ${selectedInventory.available_qty} units available`);
        return;
      }

      const newItem: ReceiptItem = {
        jwl_part: selectedInventory.jwl_part,
        description: selectedInventory.description,
        qty: quantity,
        unit_price: unitPrice,
        line_total: quantity * unitPrice,
      };

      setSelectedItems([...selectedItems, newItem]);
    }

    setSelectedInventory(null);
    setQuantity(1);
    setUnitPrice(0);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const subtotal = selectedItems.reduce((sum, item) => sum + item.line_total, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name || !customer.address || selectedItems.length === 0) {
      alert('Please fill in customer details (name and address are required) and add at least one item');
      return;
    }

    onGenerateReceipt(customer, selectedItems);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={customer.address}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Products</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-2 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Product
            </label>
            <input
              type="text"
              placeholder="Search by part number or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              onFocus={() => setShowDropdown(searchTerm.length > 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
            />
            {showDropdown && searchTerm && filteredInventory.length > 0 && (
              <div ref={dropdownRef} className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredInventory.slice(0, 10).map((item, index) => {
                  const availableQty = getAvailableQuantity(item);
                  const isOutOfStock = availableQty <= 0;
                  
                  return (
                    <button
                      key={item.id || `${item.jwl_part}-${index}`}
                      type="button"
                      onClick={() => {
                        if (!isOutOfStock) {
                          setSelectedInventory(item);
                          setSearchTerm(item.jwl_part + ' - ' + item.description);
                          setShowDropdown(false);
                        }
                      }}
                      disabled={isOutOfStock}
                      className={`w-full text-left px-4 py-2 border-b border-gray-200 last:border-b-0 ${
                        isOutOfStock 
                          ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <p className={`text-sm font-medium ${isOutOfStock ? 'text-gray-400' : 'text-gray-900'}`}>
                        {item.jwl_part}
                      </p>
                      <p className={`text-xs ${isOutOfStock ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.description}
                      </p>
                      <p className={`text-xs ${isOutOfStock ? 'text-red-500' : 'text-gray-500'}`}>
                        {isOutOfStock ? 'Out of Stock' : `Available: ${availableQty}`}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
              {selectedInventory && (
                <span className="text-xs text-gray-500 ml-1">
                  (Max: {getAvailableQuantity(selectedInventory)})
                </span>
              )}
            </label>
            <input
              type="number"
              min="1"
              max={selectedInventory ? getAvailableQuantity(selectedInventory) : 999999}
              value={quantity}
              onChange={(e) => {
                const newQuantity = Number(e.target.value);
                const maxQty = selectedInventory ? getAvailableQuantity(selectedInventory) : 999999;
                if (newQuantity <= maxQty) {
                  setQuantity(newQuantity);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
              disabled={!selectedInventory || getAvailableQuantity(selectedInventory) <= 0}
            />
            {selectedInventory && getAvailableQuantity(selectedInventory) <= 0 && (
              <p className="text-xs text-red-600 mt-1">No more units available</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Price ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          disabled={!selectedInventory || quantity <= 0 || (selectedInventory && getAvailableQuantity(selectedInventory) <= 0)}
          className="px-4 py-2 bg-[#1976D2] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>

        {selectedItems.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Selected Items</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Part #</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Qty</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Price</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Total</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-700"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedItems.map((item, index) => {
                    const inventoryItem = inventorySummary.find(inv => inv.jwl_part === item.jwl_part);
                    const remainingStock = inventoryItem ? inventoryItem.available_qty - item.qty : 0;
                    
                    return (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">{item.jwl_part}</td>
                        <td className="px-4 py-2 text-sm text-gray-600 max-w-xs truncate">
                          {item.description}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          {item.qty}
                          {remainingStock >= 0 && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({remainingStock} left)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          ${item.unit_price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right font-medium">
                          ${item.line_total.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Subtotal:</span>
          <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Tax (10%):</span>
          <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total:</span>
            <span className="text-lg font-bold text-[#1976D2]">${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={selectedItems.length === 0 || !customer.name || !customer.address}
          className="w-full mt-6 px-6 py-3 bg-[#1976D2] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="w-5 h-5" />
          Generate Receipt
        </button>
      </div>
    </form>
  );
}
