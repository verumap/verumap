import { describe, expect, it } from "bun:test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describeProject } from "../src/project.ts";

describe("describeProject", () => {
  it("finds this repository's tsconfig and its source files", () => {
    const info = describeProject(path.resolve(import.meta.dirname, ".."));
    expect(info.configPath).toMatch(/tsconfig\.json$/);
    expect(info.sourceFiles).toBeGreaterThan(0);
  });

  it("reports no config for a folder without one", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "verumap-"));
    expect(describeProject(dir).configPath).toBeUndefined();
  });
});
