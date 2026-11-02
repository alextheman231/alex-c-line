import migrationOne from "src/configs/migrations/1";
import runMigrations from "src/configs/migrations/helpers/runMigrations";

async function migrate() {
  await runMigrations({
    1: migrationOne,
  });
}

export default migrate;
