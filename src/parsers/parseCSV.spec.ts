import { countDateColumns, countFixedColumns } from "./csvParser";

const headerTests = {
  test01: [
    "Account Name",
    "Account Code",
    "Level Name",
    '"Business_Unit"',
    "01/2022",
    "02/2022",
    "03/2022",
    "04/2022",
    "05/2022",
    "06/2022",
    "07/2022",
    "08/2022",
    "09/2022",
    "10/2022",
    "11/2022",
    "12/2022",
  ],
  test02: [
    "Account Name",
    "Account Code",
    "Level Name",
    '"Business_Unit"',
    "01/2018",
    "02/2018",
    "03/2018",
    "04/2018",
    "05/2018",
    "06/2018",
    "07/2018",
    "08/2018",
    "09/2018",
    "10/2018",
    "11/2018",
    "12/2018",
    "01/2019",
    "02/2019",
    "03/2019",
    "04/2019",
    "05/2019",
    "06/2019",
    "07/2019",
    "08/2019",
    "09/2019",
    "10/2019",
    "11/2019",
    "12/2019",
    "01/2020",
    "02/2020",
    "03/2020",
    "04/2020",
    "05/2020",
    "06/2020",
    "07/2020",
    "08/2020",
    "09/2020",
    "10/2020",
    "11/2020",
    "12/2020",
    "01/2021",
    "02/2021",
    "03/2021",
    "04/2021",
    "05/2021",
    "06/2021",
    "07/2021",
    "08/2021",
    "09/2021",
    "10/2021",
    "11/2021",
    "12/2021",
    "01/2022",
    "02/2022",
    "03/2022",
    "04/2022",
    "05/2022",
    "06/2022",
    "07/2022",
    "08/2022",
    "09/2022",
    "10/2022",
    "11/2022",
    "12/2022",
  ],
  test03: [
    "Account Name",
    "Account Code",
    "01/2018",
    "06/2018",
    "07/2018",
    "08/2018",
    "09/2018",
    "10/2018",
    "11/2018",
    "12/2018",
  ],
};

const testLines = [
  '"4052 Incentives","Bus_Unit_IS.4052","1100-10110 - Marketplace New Sales Reps","Marketplace",492147.18,527149.74,649643.45,639565.35,689449.86,783146.03,773920.79,964113.13,954192.3,1038881.8,1086164.6,1185581.48',
  '"4053 Incentive Fees - Veiled Points","Bus_Unit_IS.4053","1100-10110 - Marketplace New Sales Reps","Marketplace",250590.03,268412.53,330783.51,325651.98,351052.02,398759.96,394062.67,490904.24,485852.78,528974.73,553050.05,603670.83',
  '"5200 Fulfillment Cost","Bus_Unit_IS.5200","1100-10110 - Marketplace New Sales Reps","Marketplace",30902.9,32673.55,40365.13,39710.81,42931.68,48837.46,48100.82,60061.35,59470.24,64567.91,67368.89,73516.32',
  '"6602 Other (Rental car, Taxi, IT)","Bus_Unit_IS.6602","1100-10110 - Marketplace New Sales Reps","Marketplace",3000.0,3000.0,3000.0,3000.0,3000.0,3000.0,3000.0,3000.0,3000.0,3000.0,3000.0,3000.0',
];

describe("Test countDateColumns() function", () => {
  test("Various CSV scenarios should return appropriate column count.", async () => {
    expect(countDateColumns(headerTests.test01)).toEqual(12);
    expect(countDateColumns(headerTests.test02)).toEqual(60);
    expect(countDateColumns(headerTests.test03)).toEqual(8);
  });
});

describe("Test countDateColumns() function", () => {
  test("Various CSV scenarios should return appropriate column count.", async () => {
    expect(countDateColumns(headerTests.test01)).toEqual(12);
    expect(countDateColumns(headerTests.test02)).toEqual(60);
    expect(countDateColumns(headerTests.test03)).toEqual(8);
  });
});
