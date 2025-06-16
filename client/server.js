import { createServer } from "http";
import { Server } from "next/dist/server/next-server.js";
import { join } from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const port = parseInt(process.env.PORT || "3001", 10);
const hostname = process.env.HOSTNAME || "localhost";
const dir = join(process.cwd());

const app = new Server({
  hostname,
  port,
  dir,
  dev: false,
  conf: {
    env: {},
    output: 'standalone',
  },
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
})
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
