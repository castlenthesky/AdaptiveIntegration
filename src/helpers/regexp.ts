const newLine = new RegExp(/[\n\r]+/g);
const outsideQuotesComma = new RegExp(/(?!\B"[^"]*),(?![^"]*"\B)/g);
const allButCommasAndQuotes = new RegExp(/(?!\B"[^"]*),(?![^"]*"\B)/g);
const dateTest = new RegExp(/[0-9]+\/[0-9]+/);
const unsafeCharacters = new RegExp(/["',]/g);
const whiteSpace = new RegExp(/\s/g);
const isNumberedValue = new RegExp(/\d{4}/g);

export {
  newLine,
  outsideQuotesComma,
  dateTest,
  unsafeCharacters,
  whiteSpace,
  isNumberedValue,
};
