import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Download,
  Trash2
} from 'lucide-react';
import Button from './Button.jsx';
import { EmptyState } from './States.jsx';
import { exportToCSV } from '../../utils/formatters.js';

export function DataTable({
  columns = [],
  data = [],
  keyField = 'id',
  searchPlaceholder = 'Search records...',
  filterComponent,
  bulkActions,
  onRowClick,
  exportFilename = 'Sahara_Export',
  isLoading = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState(() => new Set(columns.map(c => c.key)));
  const [showColMenu, setShowColMenu] = useState(false);

  // 1. Search Filter
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const query = searchTerm.toLowerCase();

    return data.filter(item => {
      return columns.some(col => {
        let val = typeof col.accessor === 'function' ? col.accessor(item) : item[col.key];
        if (val === undefined || val === null) return false;
        return String(val).toLowerCase().includes(query);
      });
    });
  }, [data, searchTerm, columns]);

  // 2. Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    const { key, direction } = sortConfig;
    const col = columns.find(c => c.key === key);

    return [...filteredData].sort((a, b) => {
      let aVal = typeof col?.accessor === 'function' ? col.accessor(a) : a[key];
      let bVal = typeof col?.accessor === 'function' ? col.accessor(b) : b[key];

      if (aVal === undefined || aVal === null) aVal = '';
      if (bVal === undefined || bVal === null) bVal = '';

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortConfig, columns]);

  // 3. Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Handle Sort Toggle
  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Row Selection Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(paginatedData.map(item => item[keyField]));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Column Visibility Toggle
  const toggleColumn = (key) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const displayedCols = columns.filter(c => visibleColumns.has(c.key));

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          {filterComponent}
        </div>

        <div className="flex items-center gap-2 justify-end">
          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => exportToCSV(exportFilename, columns, sortedData)}
            title="Download CSV"
          >
            Export
          </Button>

          {/* Column Visibility Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              icon={SlidersHorizontal}
              onClick={() => setShowColMenu(!showColMenu)}
            >
              Columns
            </Button>
            {showColMenu && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-30"
                onClick={e => e.stopPropagation()}
              >
                <div className="text-xs font-bold text-slate-400 uppercase px-2 py-1">Toggle Columns</div>
                {columns.map(c => (
                  <label
                    key={c.key}
                    className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(c.key)}
                      onChange={() => toggleColumn(c.key)}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    {c.header || c.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 px-4 py-2.5 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 no-print">
          <span className="font-semibold">{selectedIds.size} row(s) selected</span>
          <div className="flex items-center gap-2">
            {bulkActions ? (
              bulkActions(Array.from(selectedIds), () => setSelectedIds(new Set()))
            ) : (
              <Button
                size="sm"
                variant="danger"
                icon={Trash2}
                onClick={() => alert(`Bulk action on: ${Array.from(selectedIds).join(', ')}`)}
              >
                Delete Selected
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="p-3.5 pl-4 w-10">
                <input
                  type="checkbox"
                  checked={paginatedData.length > 0 && paginatedData.every(item => selectedIds.has(item[keyField]))}
                  onChange={handleSelectAll}
                  className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
              </th>
              {displayedCols.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`p-3.5 ${col.sortable !== false ? 'cursor-pointer select-none hover:text-slate-900 dark:hover:text-white' : ''} ${col.className || ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header || col.label}</span>
                    {col.sortable !== false && (
                      <span className="text-slate-400">
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-amber-600" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-amber-600" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            {paginatedData.length > 0 ? (
              paginatedData.map(item => {
                const isSelected = selectedIds.has(item[keyField]);
                return (
                  <tr
                    key={item[keyField]}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`transition-colors ${
                      isSelected ? 'bg-amber-50/50 dark:bg-amber-950/20' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    <td className="p-3.5 pl-4" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={e => handleSelectRow(item[keyField], e)}
                        className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                    </td>
                    {displayedCols.map(col => (
                      <td key={col.key} className={`p-3.5 text-slate-700 dark:text-slate-200 ${col.cellClassName || ''}`}>
                        {col.render
                          ? col.render(item)
                          : typeof col.accessor === 'function'
                          ? col.accessor(item)
                          : item[col.key] !== undefined && item[col.key] !== null
                          ? String(item[col.key])
                          : '—'}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={displayedCols.length + 1} className="p-0">
                  <EmptyState />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="px-4 py-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 no-print">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs text-slate-700 dark:text-slate-200"
          >
            {[5, 10, 25, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <span className="ml-2">
            Showing {sortedData.length ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="px-3 font-semibold text-slate-700 dark:text-slate-200">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
