import * as path from "path";
import axios from "axios";
import config from "./config";
import { parseXML, parseCDATA } from "./parsers";
import {
  processAccountAttributes,
  processAccounts,
} from "./parsers/parseMetadata";
import ObjectsToCsv = require("objects-to-csv");

export interface IAdaptiveCData {
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
  outputFilename: string;

  adaptiveEndpoint: string = config.adaptive.endpoint;
  adaptiveUsername: string = config.adaptive.username;
  adaptivePassword: string = config.adaptive.password;

  directory: string;
  filename: string;
  rawXML: string;
  dataset: string;
  scenario: string;
  requestBody: string;
  adaptiveResponse: string;
  adaptiveCDATA: string;
  dataStructure: {
    headers: string[];
    data: IAdaptiveCData[];
  };

  constructor(directory: string, xmlFilename: string, rawXML: string) {
    this.directory = directory;
    this.filename = xmlFilename;
    this.dataset = xmlFilename.split("_")[0];
    this.outputFilename = xmlFilename.split(".")[0];
    this.scenario = xmlFilename.split("_")[1];
    this.requestBody = this.prepareRequestBody(
      rawXML,
      this.adaptiveUsername,
      this.adaptivePassword,
    );
  }

  prepareRequestBody(xmlString: string, username: string, password: string) {
    return xmlString
      .replace("<<USERNAME>>", username)
      .replace("<<PASSWORD>>", password);
  }

  async getData() {
    console.log(`${this.filename}: Posting Request to Adaptive API...`);
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
        this.filename,
      ));
    } else {
      await this.getData();
      this.processResponse();
    }
  }
}

export async function processAllRequests(
  requestSet: {
    directory: string;
    filename: string;
    body: string;
  }[],
) {
  requestSet.forEach(async (request) => {
    let req = new AdaptiveRequest(
      request.directory,
      request.filename,
      request.body,
    );

    // 1: Retrieve data from api endpoint
    await req.getData();

    // 2: Process responses from api
    switch (req.filename) {
      case "account_list_.xml":
        const rawAccountList = await parseXML(req.adaptiveResponse);
        let accountObjects = await processAccounts(rawAccountList);
        const accountCSV = new ObjectsToCsv(accountObjects);
        accountCSV.toDisk(
          `${path.resolve(req.outputPath, req.outputFilename)}.csv`,
        );
        break;
      case "account_attributes_.xml":
        const rawAccountAttributes = await parseXML(req.adaptiveResponse);
        let accountAttributes = await processAccountAttributes(
          rawAccountAttributes,
        );
        const accountAttributesCSV = new ObjectsToCsv(accountAttributes);
        accountAttributesCSV.toDisk(
          `${path.resolve(req.outputPath, req.outputFilename)}.csv`,
        );
        break;
      default:
        await req.processResponse();
        // 3: Write Results to CSV
        const reqCSV = new ObjectsToCsv(req.dataStructure.data);
        reqCSV.toDisk(
          `${path.resolve(req.outputPath, req.outputFilename)}.csv`,
        );
        break;
    }
  });
  return;
}
