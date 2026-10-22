#!/usr/bin/env node
import { parseArgs } from "node:util";
import { describeProject, VERSION } from "./index.js";

const HELP = `verumap ${VERSION}
Deterministic code intelligence for TypeScript and JavaScript.

Usage:
  verumap [path]      Inspect the project at path (default: current directory)
  verumap --version   Print the version
  verumap --help      Show this help
`;

function main(argv: string[]): number {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      version: { type: "boolean", short: "v" },
      help: { type: "boolean", short: "h" },
    },
  });

  if (values.help) {
    process.stdout.write(HELP);
    return 0;
  }
  if (values.version) {
    process.stdout.write(`${VERSION}\n`);
    return 0;
  }

  const info = describeProject(positionals[0] ?? process.cwd());
  const runtime = "Bun" in globalThis ? "Bun" : `Node ${process.versions.node}`;
  process.stdout.write(
    `Hello from Verumap ${VERSION} (running on ${runtime})\n`,
  );

  if (!info.configPath) {
    process.stdout.write(
      `No tsconfig.json or jsconfig.json found at or above ${info.root}\n`,
    );
    return 1;
  }

  process.stdout.write(
    `Project:      ${info.root}\n` +
      `Config:       ${info.configPath}\n` +
      `Engine:       TypeScript ${info.compilerVersion}\n` +
      `Source files: ${info.sourceFiles}\n`,
  );
  return 0;
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (err) {
  process.stderr.write(
    `verumap: ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exitCode = 2;
}
