import type { BudgetInputs } from "src/services/budget/BudgetInputs";

import calculateBudget from "src/services/budget/calculateBudget";

function logBudget({ salary, balanceForward, expenses }: BudgetInputs) {
  const { totalExpenditure, totalSavings } = calculateBudget(
    salary.add(balanceForward),
    Object.values(expenses),
  );

  console.info(`
Salary: £${salary.toFixed(2)}
Balance forward: £${balanceForward.toFixed(2)}
Expenses:
${Object.entries(expenses)
  .map(([name, value]) => {
    return `  ${name}: £${value.toFixed(2)}`;
  })
  .join("\n")}
Total expenditure: £${totalExpenditure.toFixed(2)}
Total saving: £${totalSavings.toFixed(2)}
            `);
}

export default logBudget;
