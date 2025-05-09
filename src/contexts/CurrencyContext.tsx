import React, { createContext, useContext, useState, ReactNode } from "react";

type Currency = "BRL" | "USD" | "EUR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  format: (valueInBaseCurrency: number) => string;
  convert: (valueInBaseCurrency: number) => number;
  reverseConvert: (valueInurrency: number) => number;
}

const currencyLocales: Record<Currency, string> = {
  BRL: "pt-BR",
  USD: "en-US",
  EUR: "de-DE", // ou 'pt-PT', 'fr-FR' dependendo do estilo desejado
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>("USD");

  const exchangeRates: Record<Currency, number> = {
    BRL: 1, // moeda base
    USD: 0.2,
    EUR: 0.18,
  };

  const convert = (valueInBaseCurrency: number): number => {
    return valueInBaseCurrency * exchangeRates[currency];
  };

  const reverseConvert = (valueInCurrency: number): number => valueInCurrency / exchangeRates[currency];

  const format = (valueInBaseCurrency: number): string => {
    const converted = convert(valueInBaseCurrency);
    const locale = currencyLocales[currency];
  
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, format, convert, reverseConvert }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context)
    throw new Error("useCurrency must be used within a CurrencyProvider");
  return context;
};
