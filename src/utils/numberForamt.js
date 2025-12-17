// export function formatNumberIndian(num) {
//   if (num === null || num === undefined || isNaN(num)) return "0";
//   let trueNum = (num / 100).toFixed(2)
//   // let trueNum = num
//   const [integer, fraction] = trueNum.toString().split(".");
//   const lastThree = integer.slice(-3);
//   const otherNumbers = integer.slice(0, -3);
//   const formatted =
//     otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
//     (otherNumbers ? "," : "") +
//     lastThree;
//   return fraction ? `${formatted}.${fraction}` : formatted;
// }


export function formatNumberIndian(num) {
  if (num === null || num === undefined || isNaN(num)) return "0";

  const sign = num < 0 ? "-" : "";
  const absNum = Math.abs(num);

  const trueNum = (absNum / 100).toFixed(2);
  const [integer, fraction] = trueNum.split(".");

  const lastThree = integer.slice(-3);
  const otherNumbers = integer.slice(0, -3);

  const formatted =
    (otherNumbers
      ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + ","
      : "") + lastThree;

  return `${sign}${formatted}.${fraction}`;
}

// Example:
