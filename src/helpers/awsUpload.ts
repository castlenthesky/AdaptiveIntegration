import { S3 } from "aws-sdk";
import config from "../config";
import { readFolderContents } from "./readFiles";

const s3 = new S3(config.s3);

export async function uploadFolderContentsToBucket(targetDirectory: string) {
  console.log(`Uploading files in ${targetDirectory}`);
  const targetFiles = await readFolderContents(targetDirectory);
  targetFiles.forEach((fileData) => {
    uploadFileToBucket(fileData);
  });
}

export async function uploadFileToBucket(fileData: {
  filename: string;
  body: string;
}) {
  console.log(`${fileData.filename}: Uplaoding to S3 bucket...`);
  return s3.upload({
    Bucket: config.s3.bucketName,
    Key: fileData.filename,
    Body: fileData.body,
  });
}
