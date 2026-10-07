import readFileSafe from "src/utility/fileSystem/readFileSafe";

async function readJsonFile(path: string): Promise<ReturnType<typeof JSON.parse> | null> {
  const rawFileContents = await readFileSafe(path);

  return rawFileContents === null ? null : JSON.parse(rawFileContents);
}

export default readJsonFile;
