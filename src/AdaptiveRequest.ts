import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import config from "./config";
import { parseXML, parseCDATA } from "./parsers";
import * as generateFile from "./fileGenerators";
import { uploadToBucket } from "./helpers/awsUpload";

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

  outputFile: string;
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
    console.log("Getting Adaptive Data");
    this.adaptiveResponse = await (
      await axios.post(config.adaptive.endpoint, this.requestBody, {
        headers: { "Content-Type": "text/xml" },
      })
    ).data;
    console.log("Response Received");
  }

  async processResponse() {
    if (this.adaptiveResponse != null) {
      this.adaptiveCDATA = parseXML(this.adaptiveResponse);
      this.dataStructure = await parseCDATA(this.adaptiveCDATA, this.scenario);
    } else {
      await this.getData();
      this.processResponse();
    }
  }

  async writeFile(outputFormatArray: string[]) {
    ensureDirectoryExistence(this.outputPath);
    for (let i = 0; i < outputFormatArray.length; i++) {
      switch (outputFormatArray[i]) {
        case "csv":
          generateFile.generateCSV(
            this.outputPath,
            this.scenario,
            this.dataStructure.data,
          );
          break;
        case "parquet":
          console.log("Generating .parquet file...");
          generateFile.generateParquet(
            this.outputPath,
            this.scenario,
            this.dataStructure.data,
          );
          // await this.uploadFile();
          break;
        case "json":
          generateFile.generateJSON(
            this.outputPath,
            this.scenario,
            this.dataStructure.data,
          );
          break;
        default:
          generateFile.generateCSV(
            this.outputPath,
            this.scenario,
            this.dataStructure.data,
          );
          break;
      }
    }
  }

  async uploadFile(filename: string) {
    console.log(`Uploading ${this.outputFile} to Amazon S3`);
    uploadToBucket(this.outputFile, `${this.scenario}.parquet`);
  }
}

export async function processRequest(request: {
  filename: string;
  body: string;
}) {
  let req = new AdaptiveRequest(request.body, request.filename);
  await req.getData();
  await req.processResponse();
  await req.writeFile(["json", "csv"]);
  await req.uploadFile(this.outputFile);
}

function ensureDirectoryExistence(directory: string) {
  if (fs.existsSync(directory)) {
    return true;
  } else {
    fs.mkdirSync(directory);
  }
}
