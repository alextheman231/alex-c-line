import type { Command } from "commander";
import type z from "zod";
import type { ZodType } from "zod";

import { az } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";

import convertDataErrorToProgramError from "src/utility/errors/convertDataErrorToProgramError";

function parseZodSchemaForProgram<SchemaType extends ZodType>(
  program: Command,
  schema: SchemaType,
  data: unknown,
): z.infer<SchemaType> {
  try {
    return az.with<SchemaType>(schema).parse(data);
  } catch (error) {
    if (DataError.check(error)) {
      convertDataErrorToProgramError(error, program);
    }
    throw error;
  }
}

export default parseZodSchemaForProgram;
