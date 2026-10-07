import { readJsonFile, writeJsonFile } from "@/lib/json-store";

interface SessionSecurity {
  version: number;
}

const DATA_PATH = "session-security.json";

export function getSessionVersion(): number {
  return readJsonFile<SessionSecurity>(DATA_PATH, { version: 1 }).version;
}

export function bumpSessionVersion(): number {
  const next = getSessionVersion() + 1;
  writeJsonFile<SessionSecurity>(DATA_PATH, { version: next });
  return next;
}
