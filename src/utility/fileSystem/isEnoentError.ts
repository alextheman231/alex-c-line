function isEnoentError(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}

export default isEnoentError;
