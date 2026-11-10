// Test-only: resolve the app's `@/` import alias (tsconfig paths) inside the compiled test build,
// so tests can server-render windows that import from "@/...". Import it before anything else.
import { join } from "node:path";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Module = require("node:module") as { _resolveFilename: (request: string, ...rest: unknown[]) => string };
const root = join(__dirname, "..");
const resolve = Module._resolveFilename;

Module._resolveFilename = function (request: string, ...rest: unknown[]) {
  return resolve.call(this, request.startsWith("@/") ? join(root, request.slice(2)) : request, ...rest);
};
