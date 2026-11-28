import type { BudgetInputs } from "src/services/budget/BudgetInputs";

import { writeFile } from "node:fs/promises";
import path from "node:path";

import calculateBudget from "src/services/budget/calculateBudget";
import stringifyCsv from "src/utility/miscellaneous/stringifyCsv";

async function createBudgetCsv({ salary, balanceForward, expenses }: BudgetInputs, output: string) {
  const { totalExpenditure, totalSavings } = calculateBudget(
    salary.add(balanceForward),
    Object.values(expenses),
  );

  const csv = await stringifyCsv({
    Salary: salary.toFixed(2),
    "Balance forward": balanceForward.toFixed(2),
    ...Object.fromEntries(
      Object.entries(expenses).map(([name, value]) => {
        return [name, value.toFixed(2)];
      }),
    ),
    "Total expenditure": totalExpenditure.toFixed(2),
    "Total savings": totalSavings.toFixed(2),
  });

  await writeFile(path.resolve(output), csv);
}

export default createBudgetCsv;
