import { stat } from "fs";
import {
  newLine,
  outsideQuotesComma,
  dateTest,
  unsafeCharacters,
} from "../helpers/regexp";

export function parseCSV(csvString: string, scenario: string): string {
  const { csvHeaders, csvDataArray } = splitHeadersFromData(csvString);
  const attributeColumnCount = countFixedColumns(csvHeaders);
  const processedData = unpivotDateColumns(
    csvHeaders,
    csvDataArray,
    attributeColumnCount,
    scenario,
  );
  return processedData;
}

export function splitHeadersFromData(csvString: string): any {
  const csvRowArray = csvString.split(newLine);
  const csvHeaders = csvRowArray[0].split(outsideQuotesComma);
  const csvDataArray = csvRowArray.slice(1);
  return { csvHeaders, csvDataArray };
}

// This function returns the count of columns which match the following date format MM/YYYY
export function countDateColumns(headers: string[]): number {
  let dateColumnCount = 0;
  headers.forEach((element) => {
    if (dateTest.test(element)) {
      dateColumnCount++;
    }
  });
  return dateColumnCount;
}

// This function evaluates the length of an array, and subtracts the count of columns with dates in them.
export function countFixedColumns(headers: string[]): number {
  return headers.length - countDateColumns(headers);
}

export function unpivotDateColumns(
  headerArray: string[],
  dataArray: string[],
  staticColumnCount: number,
  scenario: string,
) {
  let unPivotedData: string = `Scenario, Account, Department, Account Name, Business Unit, Month, Amount
`;
  dataArray.forEach((dataRow) => {
    const rowAttributes = getRowAttributes(dataRow, staticColumnCount);
    const dateValues = getHeaderDates(headerArray, staticColumnCount);
    const rowValues = getRowValues(dataRow, staticColumnCount);
    // TODO: refactor to dynamically include scenario for each SOAP post
    const dataScenario = scenario;
    for (let valueIndex = 0; valueIndex < rowValues.length; valueIndex++) {
      let entry = `${dataScenario.split(".")[0]}, ${
        rowAttributes[1].split(".")[1]
      }, ${rowAttributes[2].split(" - ")[1]}, ${rowAttributes[0]}, ${
        rowAttributes[3]
      }, ${dateValues[valueIndex]}, ${rowValues[valueIndex]}
`;
      unPivotedData = unPivotedData.concat(entry);
    }
  });
  return unPivotedData;
}

export function getRowAttributes(
  csvRow: string,
  staticColumnCount: number,
): string[] {
  const rowElements = csvRow.split(outsideQuotesComma);
  const rowAttributes = [];
  for (let i = 0; i < staticColumnCount; i++) {
    let standardizedEntry = rowElements[i].replace(unsafeCharacters, "");
    rowAttributes.push(standardizedEntry);
  }
  return rowAttributes;
}

export function getRowValues(
  csvRow: string,
  staticColumnCount: number,
): string[] {
  const rowElements = csvRow.split(outsideQuotesComma);
  const rowValues = [];
  for (let i = staticColumnCount; i < rowElements.length; i++) {
    rowValues.push(rowElements[i]);
  }
  return rowValues;
}

export function getHeaderDates(
  headerData: string[],
  staticColumnCount: number,
): string[] {
  const dateArray = [];
  for (let i = staticColumnCount; i < headerData.length; i++) {
    let [month, year] = headerData[i].split("/");
    dateArray.push(`${year}-${month}-01`);
  }
  return dateArray;
}
