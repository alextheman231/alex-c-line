import { omitProperties } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";

import loadAlexCLineGlobalConfig from "src/services/configs/loadAlexCLineGlobalConfig";
import upsertAlexCLineGlobalConfig from "src/services/configs/upsertAlexCLineGlobalConfig";

async function removeExpense(expenseName: string) {
  const config = await loadAlexCLineGlobalConfig();
  const existingExpenses = config?.budget?.expenses ?? {};

  if (expenseName in existingExpenses) {
    const newExpenses = omitProperties(existingExpenses, expenseName);
    await upsertAlexCLineGlobalConfig({
      budget: {
        ...config?.budget,
        expenses: newExpenses,
      },
    });
  } else {
    throw new DataError(
      { expenseName },
      "EXPENSE_NAME_NOT_FOUND",
      "Could not find the expense with the given expense name.",
    );
  }
}

export default removeExpense;
