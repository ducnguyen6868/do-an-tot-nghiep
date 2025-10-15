export const formatCurrency = (amount, locale = 'en-US', currency = 'USD') => {
  if (isNaN(amount)) return '0 USD';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};
