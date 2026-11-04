import type { BudgetInputs } from "src/services/budget/BudgetInputs";

import calculateBudget from "src/services/budget/calculateBudget";

function logBudget({ salary, balanceForward, expenses }: BudgetInputs) {
  const { totalExpenditure, totalSavings } = calculateBudget(
    salary + balanceForward,
    Object.values(expenses),
  );

  console.info(`
Salary: £${salary}
Balance forward: £${balanceForward}
Expenses:
${Object.entries(expenses)
  .map(([name, value]) => {
    return `  ${name}: £${value}`;
  })
  .join("\n")}
Total expenditure: £${totalExpenditure}
Total saving: £${totalSavings}
            `);
}

export default logBudget;
