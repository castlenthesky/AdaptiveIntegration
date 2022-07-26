import * as path from "path";
import { ParquetSchema, ParquetWriter } from "parquetjs";

var schema = new ParquetSchema({
  scenario: { type: "UTF8" },
  accountName: { type: "UTF8" },
  accountNumber: { type: "UTF8" },
  department: { type: "UTF8" },
  businessUnit: { type: "UTF8" },
  month: { type: "UTF8" },
  value: { type: "DOUBLE" },
});

export async function generateParquet(
  outputDirectory: string,
  filename: string,
  dataset: {}[],
) {
  console.log("Generating Parquet File...");
  const writer = await ParquetWriter.openFile(
    schema,
    `${path.resolve("exports", filename.split(".")[0] + ".parquet")}`,
  );
  dataset.forEach((object) => {
    writeParquetData(writer, object);
  });
  writer.close();
  return;
}

async function writeParquetData(writer: ParquetWriter, object: {}) {
  return await writer.appendRow(object);
}
