import { readRequestFiles } from "./helpers";
import { processRequest } from "./AdaptiveRequest";

async function main() {
  const requestSet = await readRequestFiles();
  requestSet.forEach((request) => {
    processRequest(request);
  });
}

main();
