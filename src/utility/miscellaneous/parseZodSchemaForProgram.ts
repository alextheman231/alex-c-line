import type { Command } from "commander";
import type { ZodType } from "zod";
import type z from "zod";

import { DataError, parseZodSchema } from "@alextheman/utility";

import convertDataErrorToProgramError from "src/utility/errors/convertDataErrorToProgramError";

function parseZodSchemaForProgram<SchemaType extends ZodType>(
  programError: Command["error"],
  schema: SchemaType,
  data: unknown,
): z.infer<SchemaType> {
  try {
    return parseZodSchema<SchemaType>(schema, data);
  } catch (error) {
    if (DataError.check(error)) {
      convertDataErrorToProgramError(error, programError);
    }
    throw error;
  }
}

export default parseZodSchemaForProgram;
