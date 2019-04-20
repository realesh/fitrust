export default function numberFormatter(value: number | string) {
  if (value != null) {
    let stringValue = value
      .toString()
      .split(',')
      .join('');
    let isNegative = Number(value) < 0;

    if (isNaN(Number(stringValue))) {
      return value.toString();
    } else {
      if (isNegative) {
        stringValue = stringValue.slice(1);
      }
      let separator = ',';
      let decimalSeparator = '.';

      let isDecimalSeparated = stringValue.includes('.');
      let [frontValue, backValue] = stringValue.split('.');

      let separatedFront = frontValue
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, separator);

      let convertedNumber = `${
        isNegative ? '-' + separatedFront : separatedFront
      }${isDecimalSeparated ? decimalSeparator + backValue : ''}`;

      return convertedNumber;
    }
  }
  return '';
}
