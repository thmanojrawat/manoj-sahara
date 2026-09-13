/**
 * Indian Rupee Currency Formatter
 * Supports Lakhs (Lac) and Crores (Cr)
 */
export function formatCurrency(amount, compact = true) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Number(amount);
  
  if (!compact) {
    return '₹' + num.toLocaleString('en-IN');
  }

  const absNum = Math.abs(num);
  if (absNum >= 10000000) {
    const cr = num / 10000000;
    return `₹${cr.toFixed(cr % 1 === 0 ? 0 : 2)} Cr`;
  }
  if (absNum >= 100000) {
    const lac = num / 100000;
    return `₹${lac.toFixed(lac % 1 === 0 ? 0 : 2)} Lac`;
  }
  if (absNum >= 1000) {
    const k = num / 1000;
    return `₹${k.toFixed(k % 1 === 0 ? 0 : 1)}k`;
  }
  return '₹' + num.toLocaleString('en-IN');
}

/**
 * Standard Indian Date Formatter (DD/MM/YYYY)
 */
export function formatDate(dateString, includeTime = false) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    if (!includeTime) {
      return `${day}/${month}/${year}`;
    }
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
  } catch {
    return dateString;
  }
}

/**
 * CSV Export Generator
 */
export function exportToCSV(filename, columns, data) {
  if (!data || !data.length) {
    alert('No data available to export.');
    return;
  }
  
  // Headers
  const headerRow = columns.map(c => `"${(c.label || c.header || c.key).replace(/"/g, '""')}"`).join(',');
  
  // Rows
  const rows = data.map(item => {
    return columns.map(c => {
      let val = typeof c.accessor === 'function' ? c.accessor(item) : item[c.key];
      if (val === undefined || val === null) val = '';
      val = String(val).replace(/"/g, '""');
      return `"${val}"`;
    }).join(',');
  });

  const csvContent = [headerRow, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Print window trigger
 */
export function triggerPrint() {
  window.print();
}
