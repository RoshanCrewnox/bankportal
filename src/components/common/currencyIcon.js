const getCurrencySymbol = (currencyCode) => {
    return (0).toLocaleString('en', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).replace(/\d/g, '').trim();
};

export default getCurrencySymbol;