import { stringify } from "csv";

function stringifyCsv(records: Record<string, unknown>): Promise<string> {
  return new Promise((resolve, reject) => {
    const stringifier = stringify();
    const data: Array<string> = [];

    stringifier.on("readable", () => {
      let row;
      while ((row = stringifier.read()) !== null) {
        data.push(row);
      }
    });

    stringifier.on("error", (error) => {
      reject(error);
    });

    stringifier.on("finish", () => {
      resolve(data.join(""));
    });

    stringifier.write(Object.keys(records));
    stringifier.write(Object.values(records));

    stringifier.end();
  });
}

export default stringifyCsv;
