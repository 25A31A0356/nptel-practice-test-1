import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import os from "node:os";
import { createApiRouter } from "./api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // Mount official Contest REST API
  app.use("/api", createApiRouter());

  // Serve static files from dist/public in production
  const possiblePaths = [
    path.resolve(__dirname, "public"),
    path.resolve(__dirname, "..", "dist", "public"),
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "public"),
  ];
  const staticPath = possiblePaths.find((p) => fs.existsSync(p)) || possiblePaths[0];

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Frontend build not found. Please run npm run build.");
    }
  });
  const port = Number(process.env.PORT) || 3000;

  server.listen(port, "0.0.0.0", () => {
    const interfaces = os.networkInterfaces();
    const ips: string[] = [];
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === "IPv4" && !iface.internal) {
          ips.push(iface.address);
        }
      }
    }

    console.log(`===================================================================`);
    console.log(`🎓 NPTEL PRACTICE TEST 1: METAL ADDITIVE MANUFACTURING`);
    console.log(`===================================================================`);
    console.log(`- Local Host (This PC): http://localhost:${port}/`);
    console.log(`- Host Admin Console:   http://localhost:${port}/host (Passkey: 738637)`);
    console.log(`-------------------------------------------------------------------`);
    console.log(`📶 Network URLs for Students (100 candidates on LAN/Wi-Fi):`);
    if (ips.length > 0) {
      ips.forEach((ip) => {
        console.log(`   👉 http://${ip}:${port}/`);
      });
    } else {
      console.log(`   👉 http://localhost:${port}/`);
    }
    console.log(`===================================================================`);
  });
}

startServer().catch(console.error);

