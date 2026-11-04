import loadAlexCLineGlobalConfig from "src/services/configs/loadAlexCLineGlobalConfig";
import upsertAlexCLineGlobalConfig from "src/services/configs/upsertAlexCLineGlobalConfig";

async function addExpenses(expenses: Record<string, number>) {
  const config = await loadAlexCLineGlobalConfig();
  const existingExpenses = config?.budget?.expenses ?? {};

  const newExpenses = { ...existingExpenses, ...expenses };

  await upsertAlexCLineGlobalConfig({
    budget: {
      ...config?.budget,
      expenses: newExpenses,
    },
  });

  return newExpenses;
}

export default addExpenses;
