export const fetchCountries = async () => {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,cca2,currencies",
  );

  if (!res.ok) {
    throw new Error("Failed to fetch countries");
  }

  const data = await res.json();

  return data.map((c: unknown) => {
    const currencyCode = (c as { currencies: Record<string, unknown> })
      .currencies
      ? Object.keys(
          (c as { currencies: Record<string, unknown> }).currencies,
        )[0]
      : null;

    return {
      name: (c as { name: { common: string } }).name.common,
      countryCode: (c as { cca2: string }).cca2,
      currencyCode,
      currencyName: currencyCode
        ? (c as { currencies: Record<string, { name: string }> }).currencies[
            currencyCode
          ].name
        : null,
      currencySymbol: currencyCode
        ? (c as { currencies: Record<string, { symbol: string }> }).currencies[
            currencyCode
          ].symbol
        : null,
    };
  });
};
