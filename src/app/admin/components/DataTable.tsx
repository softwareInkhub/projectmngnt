'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import ResizableTable, { 
  ResizableTableHeader, 
  ResizableTableHeaderCell, 
  ResizableTableBody, 
  ResizableTableCell 
} from '../../components/ResizableTable';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  title: string;
  onCreateNew?: () => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onView?: (item: any) => void;
  searchPlaceholder?: string;
  itemsPerPage?: number;
}

export function DataTable({
  data,
  columns,
  title,
  onCreateNew,
  onEdit,
  onDelete,
  onView,
  searchPlaceholder = "Search...",
  itemsPerPage = 10
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Create New
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <ResizableTable 
          defaultColumnWidths={Object.fromEntries(columns.map(col => [col.key, 150]))}
          defaultRowHeight={50}
        >
          <table className="w-full resizable-table">
            <ResizableTableHeader>
              <tr>
                {columns.map((column) => (
                  <ResizableTableHeaderCell
                    key={column.key}
                    columnKey={column.key}
                    className={`text-base font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                  >
                    <div 
                      className="flex items-center space-x-1"
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <span>{column.label}</span>
                      {column.sortable && sortColumn === column.key && (
                        <span className="text-blue-600">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </ResizableTableHeaderCell>
                ))}
                <ResizableTableHeaderCell columnKey="actions" className="text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </ResizableTableHeaderCell>
              </tr>
            </ResizableTableHeader>
            <ResizableTableBody>
              {paginatedData.map((row, index) => (
                <motion.tr
                  key={row.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column) => (
                    <ResizableTableCell 
                      key={column.key} 
                      columnKey={column.key}
                      className="text-base text-gray-900"
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </ResizableTableCell>
                  ))}
                  <ResizableTableCell columnKey="actions" className="text-right text-base font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(row)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View"
                      >
                        <Eye size={20} />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Edit"
                      >
                        <Edit size={20} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                  </ResizableTableCell>
                </motion.tr>
              ))}
            </ResizableTableBody>
          </table>
        </ResizableTable>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedData.length)} of{' '}
              {filteredAndSortedData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {paginatedData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No data found</p>
        </div>
      )}
    </div>
  );
}
