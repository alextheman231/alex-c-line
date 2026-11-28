import Decimal from "decimal.js";

interface CalculateBudgetOutput {
  totalExpenditure: Decimal;
  totalSavings: Decimal;
}

function calculateBudget(paydayTotal: Decimal, expenses: Array<Decimal>): CalculateBudgetOutput {
  const totalExpenditure = expenses.reduce((previous, current) => {
    return previous.add(current);
  }, new Decimal("0"));

  return { totalExpenditure, totalSavings: paydayTotal.minus(totalExpenditure) };
}

export default calculateBudget;
