function calculateSavings(paydayTotal: number, expenses: Array<number>): number {
  const totalExpenditure = expenses.reduce((previous, current) => {
    return previous + current;
  }, 0);

  return paydayTotal - totalExpenditure;
}

export default calculateSavings;
