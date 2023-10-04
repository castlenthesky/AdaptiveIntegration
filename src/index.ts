import { processAllRequests } from "./AdaptiveRequest";
import { collectRequestsFromDirectories } from "./fileHandeling";
// import { uploadFolderContentsToBucket } from "./helpers/awsUpload";
// import * as path from "path";

// 1. Gather List of Requests for Submission to Adaptive API
const targetDirectoryList = ["financialData", "metaData"];
let adaptiveRequestSet = collectRequestsFromDirectories(targetDirectoryList);

// 2. Process each request
processAllRequests(adaptiveRequestSet);
