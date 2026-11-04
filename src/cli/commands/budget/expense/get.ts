import type { Command } from "commander";

import loadExpenses from "src/services/budget/loadExpenses";

function budgetExpenseGet(program: Command) {
  program
    .command("get")
    .description("View your expenses.")
    .argument("[name]", "The expense name to get. If left blank it will get all expenses.")
    .action(async (name) => {
      const expenses = await loadExpenses();

      if (expenses === null) {
        console.info(
          "You have not yet set any expenses. Add an expense using `alex-c-line budget expense add`",
        );
        return;
      }

      if (name === undefined) {
        console.info(
          Object.entries(expenses)
            .map(([name, value]) => {
              return `${name}: £${value}`;
            })
            .join("\n"),
        );
        return;
      }

      if (name in expenses) {
        const value = expenses[name];
        console.info(`${name}: £${value}`);
        return;
      }

      console.info(`No expense for ${name} found.`);
    });
}

export default budgetExpenseGet;
