import type { BudgetInputs } from "src/services/budget/BudgetInputs";

import { writeFile } from "node:fs/promises";
import path from "node:path";

import calculateBudget from "src/services/budget/calculateBudget";
import stringifyCsv from "src/utility/miscellaneous/stringifyCsv";

async function createBudgetCsv({ salary, balanceForward, expenses }: BudgetInputs, output: string) {
  const { totalExpenditure, totalSavings } = calculateBudget(
    salary + balanceForward,
    Object.values(expenses),
  );

  const csv = await stringifyCsv({
    Salary: salary,
    "Balance forward": balanceForward,
    ...expenses,
    "Total expenditure": totalExpenditure,
    "Total savings": totalSavings,
  });

  await writeFile(path.resolve(output), csv);
}

export default createBudgetCsv;
