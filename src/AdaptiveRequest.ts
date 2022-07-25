import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import config from "./config";
import { parseXML, parseCSV } from "./parsers";

export class AdaptiveRequest {
  adaptiveEndpoint: string = config.adaptive.endpoint;
  adaptiveUsername: string = config.adaptive.username;
  adaptivePassword: string = config.adaptive.password;

  xmlString: string;
  rawResponse: string;
  rawData: string;
  unpivotedData: string;

  constructor(public rawXML: string, public filename: string) {
    this.filename = filename;
    this.xmlString = this.generateXML(
      rawXML,
      this.adaptiveUsername,
      this.adaptivePassword,
    );
  }

  generateXML(xmlString: string, username: string, password: string) {
    return xmlString
      .replace("<<USERNAME>>", username)
      .replace("<<PASSWORD>>", password);
  }

  async getData() {
    console.log("Getting Adaptive Data");
    this.rawResponse = await (
      await axios.post(config.adaptive.endpoint, this.xmlString, {
        headers: { "Content-Type": "text/xml" },
      })
    ).data;
    console.log("Response Received");
  }

  async processResponse() {
    if (this.rawResponse != null) {
      console.log("Processing XML Response");
      this.rawData = parseXML(this.rawResponse);
      console.log("XML Response Processed");
    } else {
      await this.getData();
      this.processResponse();
    }
  }

  async unpivotData() {
    this.unpivotedData = parseCSV(this.rawData, this.filename);
  }

  async writeFile(filename: string) {
    ensureDirectoryExistence(path.resolve("exports"));
    const csvFilename = filename.split(".")[0] + ".csv";
    const outputFile = path.resolve("exports", csvFilename);
    console.log(`Writing Data to: ${outputFile}`);
    fs.writeFile(outputFile, this.unpivotedData, () => {});
  }

  async uploadFile(filename: string) {
    console.log("Uploading file to Amazon S3");
    // TODO: Setup S3 Push logic here.
  }
}

export async function processRequest(request: {
  filename: string;
  body: string;
}) {
  let req = new AdaptiveRequest(request.body, request.filename);
  await req.getData();
  await req.processResponse();
  await req.unpivotData();
  await req.writeFile(request.filename);
}

function ensureDirectoryExistence(directory: string) {
  if (fs.existsSync(directory)) {
    return true;
  } else {
    fs.mkdirSync(directory);
  }
}
