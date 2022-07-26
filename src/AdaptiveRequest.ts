import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import config from "./config";
import { parseXML, parseCDATA } from "./parsers";
import * as generateFile from "./fileGenerators";

export class AdaptiveRequest {
  adaptiveEndpoint: string = config.adaptive.endpoint;
  adaptiveUsername: string = config.adaptive.username;
  adaptivePassword: string = config.adaptive.password;

  requestBody: string;
  rawResponse: string;
  rawData: string;
  dataStructure: {
    headers: string[];
    data: {
      scenario: string;
      accountName: string;
      accountNumber: string;
      department: string;
      businessUnit: string;
      month: string;
      value: number;
    }[];
  };
  unpivotedData: string;

  constructor(public rawXML: string, public filename: string) {
    this.filename = filename;
    this.requestBody = this.generateXML(
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
      await axios.post(config.adaptive.endpoint, this.requestBody, {
        headers: { "Content-Type": "text/xml" },
      })
    ).data;
    console.log("Response Received");
  }

  async processResponse() {
    if (this.rawResponse != null) {
      this.rawData = parseXML(this.rawResponse);
      this.dataStructure = await parseCDATA(this.rawData, this.filename);
    } else {
      await this.getData();
      this.processResponse();
    }
  }

  async unpivotData() {
    // this.unpivotedData = parseCSV(this.rawData, this.filename);
  }

  async writeFile(outputDirectory: string) {
    ensureDirectoryExistence(path.resolve(outputDirectory));
    // console.log(this.dataStructure);
    await generateFile.generateParquet(
      outputDirectory,
      this.filename,
      this.dataStructure.data,
    );
    // ensureDirectoryExistence(path.resolve("exports"));
    // const csvFilename = filename.split(".")[0] + ".csv";
    // const outputFile = path.resolve("exports", csvFilename);
    // console.log(`Writing Data to: ${outputFile}`);
    // fs.writeFile(outputFile, this.unpivotedData, () => {});
  }

  async uploadFile(filename: string) {
    const csvFilename = filename.split(".")[0] + ".csv";
    console.log(`Uploading ${csvFilename} to Amazon S3`);
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
  // await req.unpivotData();
  await req.writeFile("exports");
  // await req.uploadFile(request.filename);
}

function ensureDirectoryExistence(directory: string) {
  if (fs.existsSync(directory)) {
    return true;
  } else {
    fs.mkdirSync(directory);
  }
}
