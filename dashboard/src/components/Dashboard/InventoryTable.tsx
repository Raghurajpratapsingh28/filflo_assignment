import { useState } from 'react';
import { ArrowUpDown, Download, FileText } from 'lucide-react';
import { InventoryItem } from '../../types';
import { formatDate, calculateAgeingDays, calculateDaysToExpiry } from '../../utils/dateHelpers';
import { exportToCSV, exportToPDF } from '../../utils/exportHelpers';

interface InventoryTableProps {
  data: InventoryItem[];
}

type SortField = 'jwl_part' | 'customer_part' | 'mfg_date' | 'exp_date' | 'qty' | 'ageing' | 'days_to_exp';
type SortDirection = 'asc' | 'desc';

export default function InventoryTable({ data }: InventoryTableProps) {
  const [sortField, setSortField] = useState<SortField>('exp_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Inventory Items</h3>
        <div className="flex gap-2">
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
          </select>
          <span className="text-sm text-gray-600">
            {startIndex + 1}-{Math.min(startIndex + rowsPerPage, sortedData.length)} of{' '}
            {sortedData.length}
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
    </div>
  );
}
