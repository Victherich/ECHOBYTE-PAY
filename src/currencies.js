
export const CURRENCIES = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA" },
  { code: "XOF", name: "West African CFA Franc", symbol: "CFA" },
  { code: "RWF", name: "Rwandan Franc", symbol: "RF" },
  { code: "MWK", name: "Malawian Kwacha", symbol: "MK" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
];

export const getCurrency = (code) =>
  CURRENCIES.find((item) => item.code === code) || {
    code,
    name: code,
    symbol: code,
  };
