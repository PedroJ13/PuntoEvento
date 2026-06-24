import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const root = process.cwd();
const port = Number(process.argv[2] || 4173);
const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".xml", "application/xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
]);

function resolveRequestPath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0] || "/");
  const relativePath =
    cleanPath === "/" ? "index.html" : cleanPath.replace(/^\/+/, "");
  const absolutePath = resolve(root, normalize(relativePath));
  if (absolutePath !== root && !absolutePath.startsWith(`${root}${sep}`)) {
    return null;
  }
  if (existsSync(absolutePath) && statSync(absolutePath).isDirectory()) {
    return join(absolutePath, "index.html");
  }
  return absolutePath;
}

const server = createServer((request, response) => {
  const filePath = resolveRequestPath(request.url || "/");
  if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "Content-Type":
      contentTypes.get(extname(filePath).toLowerCase()) ||
      "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
});

server.keepAliveTimeout = 1000;
server.headersTimeout = 2000;

server.listen(port, "127.0.0.1", () => {
  console.log(`Local static server listening on http://127.0.0.1:${port}`);
});

function shutdown() {
  server.closeAllConnections?.();
  server.close(() => {
    process.exit(0);
  });
  setTimeout(() => {
    process.exit(0);
  }, 1000).unref();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
