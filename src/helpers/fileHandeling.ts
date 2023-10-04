import * as fs from "fs";
import * as path from "path";

export function collectRequestsFromDirectories(targetDirectoryList: string[]) {
  const requestList: {
    directory: string;
    filename: string;
    body: string;
  }[] = [];
  targetDirectoryList.forEach((directory) => {
    requestList.push(...readFolderContents(directory));
  });
  return requestList;
}

export function readFolderContents(targetDirectory: string) {
  const folderData: {
    directory: string;
    filename: string;
    body: string;
  }[] = [];
  const directory = path.resolve("adaptiveRequests", targetDirectory);
  const directoryFiles = fs.readdirSync(directory);

  directoryFiles.forEach((file) => {
    folderData.push(readFileContents(targetDirectory, file));
  });
  return folderData;
}

export function readFileContents(directory: string, filename: string) {
  const fileData = {
    directory,
    filename,
    body: fs.readFileSync(
      path.resolve("adaptiveRequests", directory, filename),
      "utf-8",
    ),
  };
  return fileData;
}
