export function formatNumberIndian(num) {
  if (num === null || num === undefined || isNaN(num)) return "0";
  const [integer, fraction] = num.toString().split(".");
  const lastThree = integer.slice(-3);
  const otherNumbers = integer.slice(0, -3);
  const formatted =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (otherNumbers ? "," : "") +
    lastThree;
  return fraction ? `${formatted}.${fraction}` : formatted;
}

// Example:
