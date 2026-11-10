import type { Options } from "execa";

function setDirectory(directory: string, env?: Record<string, string>): Options {
  return {
    cwd: directory,
    env: {
      HOME: directory,
      ...env,
    },
  };
}

export default setDirectory;
