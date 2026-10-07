import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

function dataPath(filename: string): string {
  return path.join(process.cwd(), "src", "data", filename);
}

/**
 * Reads a data file. Pass a fallback for files that are git-ignored (they
 * hold secrets or customer data), so a fresh checkout works before the
 * file has been created.
 */
export function readJsonFile<T>(filename: string, fallback?: T): T {
  let raw: string;
  try {
    raw = fs.readFileSync(dataPath(filename), "utf-8");
  } catch (err) {
    if (fallback !== undefined && (err as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw err;
  }
  return JSON.parse(raw) as T;
}

export function writeJsonFile<T>(filename: string, data: T): void {
  const fullPath = dataPath(filename);
  // Write to a temp file and rename it into place, so a crash or a
  // concurrent read never sees a half-written (unparseable) JSON file.
  const tempPath = `${fullPath}.${crypto.randomUUID()}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
  try {
    fs.renameSync(tempPath, fullPath);
  } catch (err) {
    fs.rmSync(tempPath, { force: true });
    throw err;
  }
}
