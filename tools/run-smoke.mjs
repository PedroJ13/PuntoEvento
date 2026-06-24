import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PUNTO_EVENTO_SMOKE_PORT || 4174);
const baseUrl = `http://127.0.0.1:${port}`;
const serverPath = resolve(repoRoot, "tools/local-static-server.mjs");
const playwrightCli = resolve(repoRoot, "node_modules/@playwright/test/cli.js");

function startServer() {
  return spawn(process.execPath, [serverPath, String(port)], {
    cwd: repoRoot,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
}

async function waitForServer(timeoutMs = 10_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // Keep polling until the server is ready or the deadline is reached.
    }
    await new Promise((resolveWait) => {
      setTimeout(resolveWait, 200);
    });
  }
  throw new Error(`Servidor local no respondio en ${baseUrl}`);
}

function runPlaywright() {
  return new Promise((resolveRun) => {
    const child = spawn(
      process.execPath,
      [playwrightCli, "test", "tests/smoke"],
      {
        cwd: repoRoot,
        env: { ...process.env, PLAYWRIGHT_BASE_URL: baseUrl },
        stdio: "inherit",
        windowsHide: true,
      },
    );
    child.on("exit", (code, signal) => {
      resolveRun(code ?? (signal ? 1 : 0));
    });
  });
}

function stopServer(server) {
  return new Promise((resolveStop) => {
    if (server.exitCode !== null || server.killed) {
      resolveStop();
      return;
    }

    const timeout = setTimeout(() => {
      server.kill("SIGKILL");
      resolveStop();
    }, 2000);

    server.once("exit", () => {
      clearTimeout(timeout);
      resolveStop();
    });
    server.kill("SIGTERM");
  });
}

const server = startServer();
server.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
});
server.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
});

let exitCode = 1;
try {
  await waitForServer();
  exitCode = await runPlaywright();
} catch (error) {
  console.error(error);
} finally {
  await stopServer(server);
}

process.exit(exitCode);
