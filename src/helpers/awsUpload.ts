import { S3 } from "aws-sdk";
import config from "../config";

export function uploadToBucket(file: any, filename: string) {
  const s3 = new S3(config.s3);
  return s3.upload({
    Bucket: config.s3.bucketName,
    Body: file,
    Key: filename,
  });
}
