import { Parser } from "xml2js";
const parser = new Parser();

export async function parseXML(xmlString: string): Promise<string> {
  console.log("Processing XML Response: Extracting CDATA");
  let results = "";
  parser.parseString(xmlString, (error, result) => {
    if (result.response["$"].success == "false") {
      result.response.messages.forEach((message: any) => {
        results = message.message[0]._;
        console.log("Failed to retreive response from Adaptive Server...");
      });
    }
    results = result.response.output[0];
  });
  console.log("Successfully extracted CDATA from XML response.");
  return results;
}
