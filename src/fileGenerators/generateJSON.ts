import * as fs from "fs";
import path = require("path");

export function generateJSON(
  outputDirectory: string,
  scenario: string,
  dataset: {}[],
) {
  const outputFile = path.join(outputDirectory, `${scenario}.json`);
  fs.writeFile(outputFile, JSON.stringify(dataset), (err) => {
    if (err) {
      throw err;
    }
    console.log(`${scenario}: JSON file successfully written.`);
  });
}
