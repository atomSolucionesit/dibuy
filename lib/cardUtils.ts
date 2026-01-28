export function detectCardBrand(cardNumber: string): string {
  const bin = cardNumber.replace(/\s/g, "").substring(0, 6);

  console.log(bin);

  const first1 = parseInt(bin[0]);
  const first2 = parseInt(bin.substring(0, 2));
  const first4 = parseInt(bin.substring(0, 4));

  if (first1 === 4) return "VISA";

  if ((first2 >= 51 && first2 <= 55) || (first4 >= 2221 && first4 <= 2720)) {
    return "MASTERCARD";
  }

  if (first2 === 34 || first2 === 37) return "AMEX";

  // Payway sandbox AMEX
  if (bin.startsWith("589657")) return "AMEX";

  if (first1 === 6) return "CABAL";

  return "UNKNOWN";
}

export function getPaymentMethodId(cardNumber: string): number {
  const brand = detectCardBrand(cardNumber);

  switch (brand) {
    case "VISA":
      return 1;
    case "MASTERCARD":
      return 104;
    case "AMEX":
      return 65;
    case "CABAL":
      return 63;
    default:
      return 1;
  }
}

export function getCardBrand(cardNumber: string): string {
  return detectCardBrand(cardNumber);
}
