import * as fs from "fs";
import * as path from "path";

export async function readRequestFiles() {
  const requestData: { filename: string; body: string }[] = [];
  const requestDirectory = path.resolve("requests");
  const requestFiles = fs.readdirSync(requestDirectory);

  for (let index = 0; index < requestFiles.length; index++) {
    const requestFilename = requestFiles[index];
    requestData[index] = {
      filename: requestFilename,
      body: await readFileContents(requestDirectory, requestFilename),
    };
  }

  return requestData;
}

async function readFileContents(directory: string, filename: string) {
  return fs.readFileSync(path.join(directory, filename), "utf-8");
}
