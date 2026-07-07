import { parseBoolean } from "@alextheman/utility";

const shouldShowNotifications = !(
  process.env.NODE_ENV === "test" ||
  parseBoolean(process.env.RUN_END_TO_END ?? "false") ||
  parseBoolean(process.env.CI ?? "false")
);

export default shouldShowNotifications;
