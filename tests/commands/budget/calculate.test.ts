import { az } from "@alextheman/utility";
import { parse } from "csv/sync";
import { temporaryDirectoryTask } from "tempy";
import { describe, expect, test } from "vitest";
import z from "zod";

import { readFile } from "node:fs/promises";
import path from "node:path";

import setDirectory from "tests/helpers/setDirectory";
import alexCLineTestClient from "tests/testClients/alexCLineTestClient";

describe("budget calculate", () => {
  test("Generates a CSV with the correct calculations", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      const testClient = alexCLineTestClient(setDirectory(temporaryPath));
      await testClient`budget calculate --salary 3000 --balance-forward 100 --expense ${"AWS=100"} --expense ${"Captain Kevin's next adventure=250"} --expense ${"Concert to promote Lexicon=500"} --output budget.csv`;

      const csv = await readFile(path.join(temporaryPath, "budget.csv"), "utf-8");
      const results = parse(csv, { columns: true });
      expect(results.length).toBe(1);

      const [result] = results;
      const report = az.with(z.record(z.string(), z.coerce.number())).parse(result);

      expect(report.Salary).toBe(3000);
      expect(report["Balance forward"]).toBe(100);

      expect(report.AWS).toBe(100);
      expect(report["Captain Kevin's next adventure"]).toBe(250);
      expect(report["Concert to promote Lexicon"]).toBe(500);

      expect(report["Total expenditure"]).toBe(850);
      expect(report["Total savings"]).toBe(2250);
    });
  });
  test("Accounts for expenses in the global configuration, prioritising the CLI expense", async () => {
    await temporaryDirectoryTask(async (temporaryPath) => {
      const testClient = alexCLineTestClient(setDirectory(temporaryPath));

      await testClient`budget expense add ${"AWS"} 100`;
      await testClient`budget expense add ${"KaraFun"} 20`;

      await testClient`budget calculate --salary 3000 --balance-forward 100 --expense ${"Therapy after a long session of debugging GitHub Actions=500"} --expense ${"Why is the Steam Frame so damn expensive?!=1000"} --expense ${"AWS=150"} --output budget.csv`;

      const csv = await readFile(path.join(temporaryPath, "budget.csv"), "utf-8");
      const results = parse(csv, { columns: true });
      expect(results.length).toBe(1);

      const [result] = results;
      const report = az.with(z.record(z.string(), z.coerce.number())).parse(result);

      expect(report.Salary).toBe(3000);
      expect(report["Balance forward"]).toBe(100);

      expect(report.KaraFun).toBe(20);

      // Should be 150 as per the CLI invocation rather than global config.
      expect(report.AWS).toBe(150);

      expect(report["Therapy after a long session of debugging GitHub Actions"]).toBe(500);
      expect(report["Why is the Steam Frame so damn expensive?!"]).toBe(1000);
      expect(report["Total expenditure"]).toBe(1670);
      expect(report["Total savings"]).toBe(1430);
    });
  });
});
