import { fillArray } from "@alextheman/utility";

function redact(secretString: string): string {
  return `<${fillArray(() => {
    return "*";
  }, secretString.length).join("")} (redacted for security)>`;
}

export default redact;
