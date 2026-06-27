import { getRandomNumber } from "@alextheman/utility";
import { faker } from "@faker-js/faker";
import { temporaryDirectoryTask } from "tempy";
import { describe, expect, test } from "vitest";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import alexCLineTestClient from "tests/testClients/alexCLineTestClient";

import resolveBasename from "src/cli/commands/template/changeRequest/helpers/resolveBasename";

function getTestFixtures() {
  return {
    projectName: faker.company.name(),
    reason: faker.lorem.sentence(),
    description: faker.lorem.sentences(getRandomNumber(0, 3)),
    requestedBy: faker.internet.username(),
  } as const;
}

describe("template change-request create", () => {
  test("Creates a change request document", async () => {
    const { projectName, reason, description, requestedBy } = getTestFixtures();
    const outputDirectory = path.join("docs", "changes");

    await temporaryDirectoryTask(async (temporaryPath) => {
      const { exitCode } = await alexCLineTestClient({
        cwd: temporaryPath,
      })`template change-request create --project-name ${projectName} --reason ${reason} --description ${description} --requested-by ${requestedBy} --output-directory ${outputDirectory}`;
      expect(exitCode).toBe(0);

      const contents = await readFile(
        path.join(temporaryPath, outputDirectory, `${resolveBasename(reason)}.md`),
        "utf-8",
      );
      expect(contents).toContain(projectName);
      expect(contents).toContain(reason);
      expect(contents).toContain(description);
      expect(contents).toContain(requestedBy);
    });
  });
  test("If no --output-directory specified, default to `docs/changeRequests`", async () => {
    const { projectName, reason, description, requestedBy } = getTestFixtures();

    await temporaryDirectoryTask(async (temporaryPath) => {
      const { exitCode } = await alexCLineTestClient({
        cwd: temporaryPath,
      })`template change-request create --project-name ${projectName} --reason ${reason} --description ${description} --requested-by ${requestedBy}`;
      expect(exitCode).toBe(0);

      const contents = await readFile(
        path.join(temporaryPath, "docs", "changeRequests", `${resolveBasename(reason)}.md`),
        "utf-8",
      );
      expect(contents).toContain(projectName);
      expect(contents).toContain(reason);
      expect(contents).toContain(description);
      expect(contents).toContain(requestedBy);
    });
  });
  test("Using the same reason more than once gives incremental file names", async () => {
    const { projectName, reason, description, requestedBy } = getTestFixtures();

    await temporaryDirectoryTask(async (temporaryPath) => {
      const { exitCode: firstExitCode } = await alexCLineTestClient({
        cwd: temporaryPath,
      })`template change-request create --project-name ${projectName} --reason ${reason} --description ${description} --requested-by ${requestedBy}`;
      expect(firstExitCode).toBe(0);

      const { exitCode: secondExitCode } = await alexCLineTestClient({
        cwd: temporaryPath,
      })`template change-request create --project-name ${projectName} --reason ${reason} --description ${description} --requested-by ${requestedBy}`;
      expect(secondExitCode).toBe(0);

      const { exitCode: thirdExitCode } = await alexCLineTestClient({
        cwd: temporaryPath,
      })`template change-request create --project-name ${projectName} --reason ${reason} --description ${description} --requested-by ${requestedBy}`;
      expect(thirdExitCode).toBe(0);

      const directoryContents = await readdir(path.join(temporaryPath, "docs", "changeRequests"));
      expect(directoryContents).toContain(`${resolveBasename(reason)}.md`);
      expect(directoryContents).toContain(`${resolveBasename(reason)}_1.md`);
      expect(directoryContents).toContain(`${resolveBasename(reason)}_2.md`);
    });
  });
});
