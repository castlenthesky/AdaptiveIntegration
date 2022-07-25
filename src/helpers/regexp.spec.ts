import { newLine, outsideQuotesComma, dateTest } from "./regexp";

const testArray = [
  '"4052 Incentives","Bus_Unit_IS.4052","1100-10110 - Marketplace New Sales Reps","Marketplace",492147.18,527149.74,649643.45,639565.35,689449.86,783146.03,773920.79,964113.13,954192.3,1038881.8,1086164.6,1185581.48',
  '"4053 Incentive Fees - Veiled Points","Bus_Unit_IS.4053","1100-10110 - Marketplace New Sales Reps","Marketplace",250590.03,268412.53,330783.51,325651.98,351052.02,398759.96,394062.67,490904.24,485852.78,528974.73,553050.05,603670.83',
  '"5200 Fulfillment Cost","Bus_Unit_IS.5200","1100-10110 - Marketplace New Sales Reps","Marketplace",30902.9,32673.55,40365.13,39710.81,42931.68,48837.46,48100.82,60061.35,59470.24,64567.91,67368.89,73516.32',
  '"6602 Other (Rental car, Taxi, IT)","Bus_Unit_IS.6602","1100-10110 - Marketplace New Sales Reps","Marketplace",3000.0,3000.0,3000.0,3000.0,3000.0,3000.0,3000.0,3000.0,3000.0,3000.0,3000.0,3000.0',
];

const answerArray = [
  [
    '"4052 Incentives"',
    '"Bus_Unit_IS.4052"',
    '"1100-10110 - Marketplace New Sales Reps"',
    '"Marketplace"',
    "492147.18",
    "527149.74",
    "649643.45",
    "639565.35",
    "689449.86",
    "783146.03",
    "773920.79",
    "964113.13",
    "954192.3",
    "1038881.8",
    "1086164.6",
    "1185581.48",
  ],
  [
    '"4053 Incentive Fees - Veiled Points"',
    '"Bus_Unit_IS.4053"',
    '"1100-10110 - Marketplace New Sales Reps"',
    '"Marketplace"',
    "250590.03",
    "268412.53",
    "330783.51",
    "325651.98",
    "351052.02",
    "398759.96",
    "394062.67",
    "490904.24",
    "485852.78",
    "528974.73",
    "553050.05",
    "603670.83",
  ],
  [
    '"5200 Fulfillment Cost"',
    '"Bus_Unit_IS.5200"',
    '"1100-10110 - Marketplace New Sales Reps"',
    '"Marketplace"',
    "30902.9",
    "32673.55",
    "40365.13",
    "39710.81",
    "42931.68",
    "48837.46",
    "48100.82",
    "60061.35",
    "59470.24",
    "64567.91",
    "67368.89",
    "73516.32",
  ],
  [
    '"6602 Other (Rental car, Taxi, IT)"',
    '"Bus_Unit_IS.6602"',
    '"1100-10110 - Marketplace New Sales Reps"',
    '"Marketplace"',
    "3000.0",
    "3000.0",
    "3000.0",
    "3000.0",
    "3000.0",
    "3000.0",
    "3000.0",
    "3000.0",
    "3000.0",
    "3000.0",
    "3000.0",
    "3000.0",
  ],
];

describe("Seperate string using commas as delimiter", () => {
  test("Values in a string should be seperated using a comma as a delimiter:", () => {
    expect(testArray[0].split(outsideQuotesComma)).toEqual(answerArray[0]);
    expect(testArray[1].split(outsideQuotesComma)).toEqual(answerArray[1]);
    expect(testArray[2].split(outsideQuotesComma)).toEqual(answerArray[2]);
    expect(testArray[3].split(outsideQuotesComma)).toEqual(answerArray[3]);
  });
});
