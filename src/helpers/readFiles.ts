import * as fs from "fs";
import * as path from "path";

export async function readFolderContents(directory: string) {
  const fileData: { filename: string; body: string }[] = [];
  const targetDirectory = path.resolve(directory);
  const directoryFiles = fs.readdirSync(targetDirectory);

  for (let index = 0; index < directoryFiles.length; index++) {
    const requestFilename = directoryFiles[index];
    fileData[index] = {
      filename: requestFilename,
      body: await readFileContents(targetDirectory, requestFilename),
    };
  }

  return fileData;
}

export async function readFileContents(directory: string, filename: string) {
  return fs.readFileSync(path.resolve(directory, filename), "utf-8");
}
