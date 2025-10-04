import React, { useState } from 'react';
import { ArrowUpDown, Download, FileText, Edit, Trash2, Plus } from 'lucide-react';
import { InventoryItem } from '../../types';
import { formatDate, calculateAgeingDays, calculateDaysToExpiry } from '../../utils/dateHelpers';
import { exportToCSV, exportToPDF } from '../../utils/exportHelpers';
import apiService from '../../lib/api';

interface InventoryTableProps {
  data: InventoryItem[];
  totalCount?: number;
  onDataChange?: () => void;
}

type SortField = 'jwl_part' | 'customer_part' | 'mfg_date' | 'exp_date' | 'qty' | 'ageing' | 'days_to_exp';
type SortDirection = 'asc' | 'desc';

export default function InventoryTable({ data, totalCount, onDataChange }: InventoryTableProps) {
  const [sortField, setSortField] = useState<SortField>('exp_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;

    switch (sortField) {
      case 'ageing':
        aVal = calculateAgeingDays(a.mfg_date);
        bVal = calculateAgeingDays(b.mfg_date);
        break;
      case 'days_to_exp':
        aVal = calculateDaysToExpiry(a.exp_date);
        bVal = calculateDaysToExpiry(b.exp_date);
        break;
      default:
        aVal = a[sortField];
        bVal = b[sortField];
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const getDaysToExpiryColor = (days: number) => {
    if (days < 0) return 'text-red-600 font-semibold';
    if (days < 30) return 'text-red-600';
    if (days < 90) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getAgeingColor = (days: number) => {
    if (days > 60) return 'font-semibold text-gray-900';
    return 'text-gray-600';
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inventory item?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await apiService.deleteInventoryItem(id);
      onDataChange?.();
    } catch (err: any) {
      setError(err.message || 'Failed to delete inventory item');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (itemData: Partial<InventoryItem>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (editingItem) {
        await apiService.updateInventoryItem(editingItem.id, itemData);
      } else {
        await apiService.createInventoryItem(itemData);
      }
      
      setIsEditModalOpen(false);
      setIsCreateModalOpen(false);
      setEditingItem(null);
      onDataChange?.();
    } catch (err: any) {
      setError(err.message || 'Failed to save inventory item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Inventory Items</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
          <button
            onClick={() => exportToCSV(sortedData)}
            className="px-4 py-2 bg-[#1976D2] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => exportToPDF(sortedData)}
            className="px-4 py-2 bg-[#1976D2] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {[
                { field: 'jwl_part' as SortField, label: 'JWL Part' },
                { field: 'customer_part' as SortField, label: 'Customer Part' },
                { field: null, label: 'Description' },
                { field: null, label: 'UOM' },
                { field: null, label: 'Batch' },
                { field: 'mfg_date' as SortField, label: 'MFG Date' },
                { field: 'exp_date' as SortField, label: 'EXP Date' },
                { field: 'qty' as SortField, label: 'QTY' },
                { field: 'ageing' as SortField, label: 'Ageing (Days)' },
                { field: 'days_to_exp' as SortField, label: 'Days to EXP' },
                { field: null, label: 'Actions' },
              ].map((col, idx) => (
                <th key={idx} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  {col.field ? (
                    <button
                      onClick={() => handleSort(col.field!)}
                      className="flex items-center gap-1 hover:text-[#1976D2]"
                    >
                      {col.label}
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((item, idx) => {
              const ageingDays = calculateAgeingDays(item.mfg_date);
              const daysToExp = calculateDaysToExpiry(item.exp_date);
              const isExpired = daysToExp < 0;

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-25'} ${
                    isExpired ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">{item.jwl_part}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.customer_part}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.uom}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.batch}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(item.mfg_date)}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={getDaysToExpiryColor(daysToExp)}>
                      {formatDate(item.exp_date)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.qty}</td>
                  <td className={`px-4 py-3 text-sm ${getAgeingColor(ageingDays)}`}>
                    {ageingDays}
                  </td>
                  <td className={`px-4 py-3 text-sm ${getDaysToExpiryColor(daysToExp)}`}>
                    {daysToExp}
                    {isExpired && ' (EXPIRED)'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Delete"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {paginatedData.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">No inventory items found</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
            <option value={500}>500</option>
          </select>
          <span className="text-sm text-gray-600">
            {startIndex + 1}-{Math.min(startIndex + rowsPerPage, sortedData.length)} of{' '}
            {totalCount || sortedData.length}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {(isEditModalOpen || isCreateModalOpen) && (
        <InventoryEditModal
          item={editingItem}
          isOpen={isEditModalOpen || isCreateModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setIsCreateModalOpen(false);
            setEditingItem(null);
            setError(null);
          }}
          onSave={handleSave}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}

// Edit Modal Component
interface InventoryEditModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<InventoryItem>) => void;
  loading: boolean;
  error: string | null;
}

function InventoryEditModal({ item, isOpen, onClose, onSave, loading, error }: InventoryEditModalProps) {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    jwl_part: '',
    customer_part: '',
    description: '',
    uom: '',
    batch: '',
    mfg_date: '',
    exp_date: '',
    qty: 0,
    weight: 0,
  });

  // Initialize form data when item changes
  React.useEffect(() => {
    if (item) {
      setFormData({
        jwl_part: item.jwl_part,
        customer_part: item.customer_part,
        description: item.description,
        uom: item.uom,
        batch: item.batch,
        mfg_date: item.mfg_date.split('T')[0], // Convert to YYYY-MM-DD format
        exp_date: item.exp_date.split('T')[0],
        qty: item.qty,
        weight: item.weight,
      });
    } else {
      setFormData({
        jwl_part: '',
        customer_part: '',
        description: '',
        uom: '',
        batch: '',
        mfg_date: '',
        exp_date: '',
        qty: 0,
        weight: 0,
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {item ? 'Edit Inventory Item' : 'Add New Inventory Item'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  JWL Part *
                </label>
                <input
                  type="text"
                  name="jwl_part"
                  value={formData.jwl_part || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Part *
                </label>
                <input
                  type="text"
                  name="customer_part"
                  value={formData.customer_part || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UOM *
                </label>
                <input
                  type="text"
                  name="uom"
                  value={formData.uom || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch *
                </label>
                <input
                  type="text"
                  name="batch"
                  value={formData.batch || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manufacturing Date *
                </label>
                <input
                  type="date"
                  name="mfg_date"
                  value={formData.mfg_date || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  name="exp_date"
                  value={formData.exp_date || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="qty"
                  value={formData.qty || 0}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (Kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight || 0}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1976D2] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1976D2] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving...' : (item ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
