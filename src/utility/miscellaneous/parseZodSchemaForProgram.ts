import type z from "zod";
import type { ZodType } from "zod";

import { az } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";

import convertDataErrorToProgramError from "src/utility/errors/convertDataErrorToProgramError";

function parseZodSchemaForProgram<SchemaType extends ZodType>(
  schema: SchemaType,
  data: unknown,
): z.infer<SchemaType> {
  try {
    return az.with<SchemaType>(schema).parse(data);
  } catch (error) {
    if (DataError.checkWithCode(error, "ZOD_ERROR")) {
      convertDataErrorToProgramError(error);
    }
    throw error;
  }
}

export default parseZodSchemaForProgram;
