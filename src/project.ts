import path from "node:path";
import ts from "typescript";

export interface ProjectInfo {
  root: string;
  configPath?: string;
  compilerVersion: string;
  sourceFiles: number;
}

function findConfig(root: string): string | undefined {
  return (
    ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json") ??
    ts.findConfigFile(root, ts.sys.fileExists, "jsconfig.json")
  );
}

export function describeProject(target: string): ProjectInfo {
  const root = path.resolve(target);
  const configPath = findConfig(root);
  if (!configPath) return { root, compilerVersion: ts.version, sourceFiles: 0 };

  const read = ts.readConfigFile(configPath, ts.sys.readFile);
  if (read.error)
    throw new Error(
      ts.flattenDiagnosticMessageText(read.error.messageText, "\n"),
    );

  const parsed = ts.parseJsonConfigFileContent(
    read.config,
    ts.sys,
    path.dirname(configPath),
  );
  return {
    root,
    configPath,
    compilerVersion: ts.version,
    sourceFiles: parsed.fileNames.length,
  };
}
