export const formatAmount =   (amount, locale = 'en-NG', currencyCode = 'NGN') => {
  const formattedAmount =  amount.toLocaleString(locale, {
    style: "currency",
    currency: currencyCode,
  });
  return formattedAmount;
}
