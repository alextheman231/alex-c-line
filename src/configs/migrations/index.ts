import migrationOne from "src/configs/migrations/1";
import migrationTwo from "src/configs/migrations/2";
import runMigrations from "src/configs/migrations/helpers/runMigrations";

async function migrate() {
  await runMigrations({
    1: migrationOne,
    2: migrationTwo,
  });
}

export default migrate;
