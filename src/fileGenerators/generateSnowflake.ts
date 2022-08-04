import * as fs from "fs";
import path = require("path");

export async function generateSnowflake(
  outputDirectory: string,
  scenario: string,
  dataset: {}[],
) {
  return writeSnowflakeString(dataset);
  // const outputString = writeSnowflakeString(dataset);
  // const outputFile = path.join(outputDirectory, `${scenario}.json`);
  // fs.writeFile(outputFile, outputString, (err) => {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log(`${scenario}: snowflake file successfully written.`);
  // });
  // return outputString;
}

export async function writeSnowflakeString(dataset: {}[]): Promise<string> {
  let outputString = "";
  dataset.forEach((entry) => {
    outputString = outputString + JSON.stringify(entry);
  });
  return outputString;
}
