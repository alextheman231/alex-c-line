interface CalculateBudgetOutput {
  totalExpenditure: number;
  totalSavings: number;
}

function calculateBudget(paydayTotal: number, expenses: Array<number>): CalculateBudgetOutput {
  const totalExpenditure = expenses.reduce((previous, current) => {
    return previous + current;
  }, 0);

  return { totalExpenditure, totalSavings: paydayTotal - totalExpenditure };
}

export default calculateBudget;
