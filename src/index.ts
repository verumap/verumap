import { readFileSync } from "node:fs";

export { describeProject, type ProjectInfo } from "./project.js";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { version: string };
export const VERSION: string = pkg.version;
