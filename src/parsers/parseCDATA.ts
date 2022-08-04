import {
  newLine,
  outsideQuotesComma,
  dateTest,
  unsafeCharacters,
} from "../helpers/regexp";

export async function parseCDATA(rawCDATA: string, filename: string) {
  console.log(`${filename}: Processing CDATA`);
  const { rawHeaderString, rawDataArray } = splitHeaderFromData(rawCDATA);
  const processedHeaders = processHeaders(rawHeaderString);
  const fixedHeaderColumnCount = countFixedColumns(processedHeaders);
  const processedData = processData(
    processedHeaders,
    rawDataArray,
    fixedHeaderColumnCount,
    filename.split(".")[0],
  );
  return {
    headers: processedHeaders,
    data: processedData,
  };
}

function splitHeaderFromData(rawData: string) {
  const rowArray = rawData.split(newLine);
  const rawHeaderString = rowArray[0];
  const rawDataArray = rowArray.slice(1);
  return { rawHeaderString, rawDataArray };
}

function processHeaders(rawHeaderString: string) {
  let processedHeaderArray: string[] = [];
  let rawHeaderArray = rawHeaderString.split(outsideQuotesComma);
  rawHeaderArray.forEach((header) => {
    processedHeaderArray.push(header.replace(unsafeCharacters, ""));
  });
  return processedHeaderArray;
}

// This function returns the count of columns which match the following date format MM/YYYY
function countDateColumns(headers: string[]): number {
  let dateColumnCount = 0;
  headers.forEach((element) => {
    if (dateTest.test(element)) {
      dateColumnCount++;
    }
  });
  return dateColumnCount;
}

// This function evaluates the length of an array, and subtracts the count of columns with dates in them.
function countFixedColumns(headers: string[]): number {
  return headers.length - countDateColumns(headers);
}

function processDataRow(
  rawRowString: string,
  scenario: string,
  headers: string[],
  fixedHeaderColumnCount: number,
) {
  let rowObjects = [];
  let rowElements = rawRowString.split(outsideQuotesComma);
  for (
    let index = fixedHeaderColumnCount;
    index < rowElements.length;
    index++
  ) {
    if (parseFloat(rowElements[index]) == 0.0) {
      continue;
    }
    rowObjects.push({
      scenario: scenario,
      accountName: rowElements[0].replace(/["]/g, ""),
      accountNumber: rowElements[1].split(".")[1].replace(/["]/g, ""),
      department: cleanDepartmentName(rowElements[2]),
      businessUnit: rowElements[3].replace(/["]/g, ""),
      month: convertDateHeader(headers[index]),
      value: parseFloat(rowElements[index]),
    });
  }
  return rowObjects;
}

function cleanDepartmentName(departmentString: string): string {
  const departmentName = departmentString.split(" - ")[1] || departmentString;
  return departmentName.replace(/["]/g, "");
}

function processData(
  headers: string[],
  rawDataArray: string[],
  fixedHeaderCount: number,
  scenario: string,
) {
  const finalDataArray: any = [];
  rawDataArray.forEach((rawRowString) => {
    let rowObjects = processDataRow(
      rawRowString,
      scenario,
      headers,
      fixedHeaderCount,
    );
    rowObjects.forEach((object) => {
      finalDataArray.push(object);
    });
  });
  return finalDataArray;
}

function convertDateHeader(dateString: string): string {
  let [month, year] = dateString.split("/");
  return `${year}-${month}-01`;
}
