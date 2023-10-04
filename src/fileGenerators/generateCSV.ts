import * as fs from "fs";
import * as path from "path";
import { stringify } from "csv-stringify";

export function generateCSV(
  outputDirectory: string,
  filename: string,
  headers: string[],
  dataset: {}[],
) {
  const targetFilename = `${path.resolve(outputDirectory, filename)}.csv`;
  console.log("Generating CSV...", targetFilename);

  // (C) CREATE CSV FILE
}
