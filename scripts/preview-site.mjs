import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const files = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
]);
const port = Number(process.env.PORT || 4173);
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  const entry = files.get(pathname);
  if (!entry) {
    response.writeHead(404).end("Not found");
    return;
  }
  try {
    const body = await readFile(fileURLToPath(new URL(`../_site/${entry[0]}`, import.meta.url)));
    response.writeHead(200, { "Content-Type": entry[1] }).end(body);
  } catch (error) {
    console.error(error);
    response.writeHead(500).end("Cannot read the site. Run npm run build:site first.");
  }
});
server.listen(port, "127.0.0.1", () => console.log(`Workshop preview: http://127.0.0.1:${port}`));
server.on("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});
