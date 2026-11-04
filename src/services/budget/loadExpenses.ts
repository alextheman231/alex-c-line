import loadAlexCLineGlobalConfig from "src/services/configs/loadAlexCLineGlobalConfig";

async function loadExpenses(): Promise<Record<string, number> | null> {
  const config = await loadAlexCLineGlobalConfig();

  if (config === null) {
    return null;
  }

  if (config.budget === null) {
    return null;
  }

  return config.budget.expenses;
}

export default loadExpenses;
