import { Parser } from "xml2js";
const parser = new Parser();

export function parseXML(xmlString: string): string {
  let results = "";
  parser.parseString(xmlString, (error, result) => {
    if (result.response["$"].success == "false") {
      result.response.messages.forEach((message: any) => {
        results = message.message[0]._;
      });
    }
    results = result.response.output[0];
  });
  return results;
}
