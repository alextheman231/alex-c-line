import { parseBoolean } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";

function parseBooleanArgument(value: string): boolean {
  try {
    return parseBoolean(value);
  } catch (error) {
    if (DataError.checkWithCode(error, "INVALID_BOOLEAN_STRING")) {
      const normalisedValue = value.toLowerCase();

      if (normalisedValue === "t" || normalisedValue === "f") {
        return { t: true, f: false }[normalisedValue];
      }
      if (normalisedValue === "y" || normalisedValue === "n") {
        return { y: true, n: false }[normalisedValue];
      }
      if (normalisedValue === "yes" || normalisedValue === "no") {
        return { yes: true, no: false }[normalisedValue];
      }

      throw new DataError(
        { inputString: value },
        "INVALID_BOOLEAN_STRING",
        "The provided argument must be one of `true | false | yes | no | t | f | y | n`",
      );
    } else {
      throw error;
    }
  }
}

export default parseBooleanArgument;
