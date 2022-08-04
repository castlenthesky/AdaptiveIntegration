import { readFolderContents } from "./helpers";
import { processAllRequests } from "./AdaptiveRequest";
import { uploadFolderContentsToBucket } from "./helpers/awsUpload";
import * as path from "path";

async function main() {
  const requestSet = await readFolderContents("adaptiveRequests");
  await processAllRequests(requestSet);
  // await uploadFolderContentsToBucket(path.resolve("exports", "snowflake"));
  // await uploadFolderContentsToBucket("exports");
}

main();
