export function parseCSV(csvData: string): string {
  const rowData = csvData.split(/\n/);
  const headers = rowData[0].split(/,/);

  const testRow = [
    "7020 Conferences & Events",
    "Bus_Unit_IS.7020",
    "60900-6000 - Executive",
    "Shared Services",
    10000.0,
    10000.0,
    10000.0,
    10000.0,
    10000.0,
    10000.0,
    10000.0,
    10000.0,
    10000.0,
    10000.0,
    10000.0,
    10000.0,
  ];
  // Parse data rows

  const pivotedHeaders = [
    "Account",
    "Account Code",
    "Department",
    "Business Unit",
    "Date",
    "Amount",
  ];

  for (let rowIndex = 1; rowIndex < rowData.length; rowIndex++) {
    unpivotColumns(rowData[rowIndex].split(/,/), headers, 4);
    // const rowText = rows[rowIndex];
  }

  return csvData;
}

function unpivotColumns(
  dataArray: (string | number)[],
  headerArray: (string | number)[],
  staticColumnCount: number,
) {
  let unpivotedData = [];
  for (let i = staticColumnCount; i < dataArray.length; i++) {
    let entry = [];
    for (
      let staticColumnIndex = 0;
      staticColumnIndex < staticColumnCount;
      staticColumnIndex++
    ) {
      entry.push(dataArray[staticColumnIndex]);
    }
    entry.push(headerArray[i]);
    entry.push(dataArray[i]);
    unpivotedData.push(entry);
  }
  console.log(unpivotedData);
  return unpivotedData;
}
