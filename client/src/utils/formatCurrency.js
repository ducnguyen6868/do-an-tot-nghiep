export const formatCurrency = (amount, locale , currency ) => {
  if (isNaN(amount)) return '0';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};
