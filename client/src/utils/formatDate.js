/**
 * @param {Date|number|string} date - Date object, timestamp, hoặc ISO string
 * @param {string} format - ví dụ: 'DD/MM/YYYY HH:mm:ss' hoặc 'YYYY-MM-DD'
 * @returns {string}
 */
export const  formatDate= (date, format = 'YYYY-MM-DD HH:mm')=> {
  const d = (date instanceof Date) ? date : new Date(date);
  if (isNaN(d)) return 'Invalid Date';

  const pad = (n, z = 2) => String(n).padStart(z, '0');

  const replacements = {
    YYYY: d.getFullYear(),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
  };

  return format.replace(/YYYY|MM|DD|HH|mm/g, match => replacements[match]);
}

