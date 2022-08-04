import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import config from "./config";
import { parseXML, parseCDATA } from "./parsers";
import * as generateFile from "./fileGenerators";
import { uploadFileToBucket } from "./helpers/awsUpload";

export interface IAdaptiveData {
  scenario: string;
  accountName: string;
  accountNumber: string;
  department: string;
  businessUnit: string;
  month: string;
  value: number;
}

export class AdaptiveRequest {
  outputPath: string = path.resolve("exports");

  adaptiveEndpoint: string = config.adaptive.endpoint;
  adaptiveUsername: string = config.adaptive.username;
  adaptivePassword: string = config.adaptive.password;

  scenario: string;
  requestBody: string;
  adaptiveResponse: string;
  adaptiveCDATA: string;
  dataStructure: {
    headers: string[];
    data: IAdaptiveData[];
  };

  constructor(public rawXML: string, public xmlFilename: string) {
    this.xmlFilename = xmlFilename;
    this.scenario = xmlFilename.split(".")[0];
    this.requestBody = this.generateRequestBody(
      rawXML,
      this.adaptiveUsername,
      this.adaptivePassword,
    );
  }

  generateRequestBody(xmlString: string, username: string, password: string) {
    return xmlString
      .replace("<<USERNAME>>", username)
      .replace("<<PASSWORD>>", password);
  }

  async getData() {
    console.log(`${this.scenario}: Getting Adaptive Data`);
    return (this.adaptiveResponse = await (
      await axios.post(config.adaptive.endpoint, this.requestBody, {
        headers: { "Content-Type": "text/xml" },
      })
    ).data);
  }

  async processResponse() {
    if (this.adaptiveResponse != null) {
      this.adaptiveCDATA = await parseXML(this.adaptiveResponse);
      return (this.dataStructure = await parseCDATA(
        this.adaptiveCDATA,
        this.scenario,
      ));
    } else {
      await this.getData();
      this.processResponse();
    }
  }

  async uploadSnowflakeFile() {
    console.log(`${this.scenario}: Uploading to S3 Bucket`);
    return uploadFileToBucket({
      filename: this.scenario + ".json",
      body: await generateFile.writeSnowflakeString(this.dataStructure.data),
    });
  }
}

export async function processAllRequests(
  requestSet: {
    filename: string;
    body: string;
  }[],
) {
  requestSet.forEach((request) => {
    processRequest(request);
  });
  return;
}

export async function processRequest(request: {
  filename: string;
  body: string;
}) {
  let req = new AdaptiveRequest(request.body, request.filename);
  await req.getData();
  await req.processResponse();
  // await req.writeSnowflakeFile();
  await req.uploadSnowflakeFile();
}

// function ensureDirectoryExistence(directory: string) {
//   if (fs.existsSync(directory)) {
//     return true;
//   } else {
//     fs.mkdirSync(directory);
//   }
// }
