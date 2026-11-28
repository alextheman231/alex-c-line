import type Decimal from "decimal.js";

export interface BudgetInputs {
  salary: Decimal;
  balanceForward: Decimal;
  expenses: Record<string, Decimal>;
}
