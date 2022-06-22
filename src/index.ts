import config from "./config";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";

const outputPath = path.join(__dirname, "test.txt");

const content = "some content!";

const reqURL = "https://api.adaptiveinsights.com/api/v32";
const reqBody = `<?xml version="1.0" encoding="UTF-8"?>\
<call method="exportData" callerName="Amazon S3 Export - Budget">\
  <credentials login="finance.integrations@lendio.com" password="W0X!Hu4nD4P!gu" />\
  <version name="Working Budget" isDefault="false"/>\
  <format useInternalCodes="true" includeUnmappedItems="false" />\
  <filters>\
    <accounts>\
      <account code="Bus_Unit_IS.Income" isAssumption="false" includeDescendants="true"/>\
      <account code="Bus_Unit_IS.COGS" isAssumption="false" includeDescendants="true"/>\
      <account code="Bus_Unit_IS.Payroll_Loan_Specialist" isAssumption="false" includeDescendants="true"/>\
      <account code="Bus_Unit_IS.Expenses" isAssumption="false" includeDescendants="true"/>\
      <account code="Bus_Unit_IS.Expenses_Allocated" isAssumption="false" includeDescendants="true"/>\
      <account code="Bus_Unit_IS.Expenses_Capitalized" isAssumption="false" includeDescendants="true"/>\
      <account code="Bus_Unit_IS.Depr_Amort" isAssumption="false" includeDescendants="true"/>\
      <account code="Bus_Unit_IS.Non_Operating_Income" isAssumption="false" includeDescendants="true"/>\
      <account code="Bus_Unit_IS.Non_Operating_Expense" isAssumption="false" includeDescendants="true"/>\
      <account code="Bus_Unit_IS.9110" isAssumption="false" includeDescendants="true"/>\
      <account code="Bus_Unit_IS.GAAP_Adj" isAssumption="false" includeDescendants="true"/>\
    </accounts>\
    <levels>\
      <level name="Lendio Inc Consolidated" isRollup="true" includeDescendants="true"/>\
    </levels>\
    <timeSpan start="01/2022" end="12/2022"/>\
  </filters>\
  <dimensions>\
    <dimension name="Business_Unit"/>\
  </dimensions>\
  <rules includeZeroRows="false" markInvalidValues="false" markBlanks="false">\
    <currency useCorporate="true" useLocal="false"/>\
  </rules>\
</call>`;

const reqConfig = {
  headers: { "Content-Type": "text/xml" },
};

async function postRequest() {
  const response = await (await axios.post(reqURL, reqBody, reqConfig)).data;
  fs.writeFile("test.txt", response, (err) => {
    console.log("File written successfully.");
    console.log(`File path: ${outputPath}`);
  });
}

postRequest();
