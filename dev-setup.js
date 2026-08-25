/**
 * dev-setup.js  � run once before npm run android
 * 1. Starts TCP proxy: localhost:8200 -> 10.10.29.119:8200
 * 2. Sets ADB reverse: phone:8200 -> dev-PC:8200
 */
const net = require("net");
const { execSync } = require("child_process");

const LISTEN_PORT = 8200;
const TARGET_HOST = "10.10.29.119";
const TARGET_PORT = 8200;
const ADB =
  "C:\\\\Users\\\\Md Rasif\\\\AppData\\\\Local\\\\Android\\\\Sdk\\\\platform-tools\\\\adb.exe";

const server = net.createServer((clientSocket) => {
  const serverSocket = net.createConnection(TARGET_PORT, TARGET_HOST, () => {
    console.log("[PROXY] Relaying ->", TARGET_HOST + ":" + TARGET_PORT);
  });
  clientSocket.pipe(serverSocket);
  serverSocket.pipe(clientSocket);
  clientSocket.on("error", () => serverSocket.destroy());
  serverSocket.on("error", (err) => {
    console.error("[PROXY] Server error:", err.message);
    clientSocket.destroy();
  });
  clientSocket.on("close", () => serverSocket.destroy());
  serverSocket.on("close", () => clientSocket.destroy());
});

function setupAdb() {
  try {
    const r = execSync(
      `"${ADB}" reverse tcp:${LISTEN_PORT} tcp:${LISTEN_PORT}`,
      { encoding: "utf8", timeout: 5000 },
    );
    console.log("ADB reverse tcp:" + LISTEN_PORT + " OK ->", r.trim());
  } catch (e) {
    console.error("[ADB] Failed:", e.message);
  }
}

server.listen(LISTEN_PORT, "127.0.0.1", () => {
  console.log(
    "\nProxy: 127.0.0.1:" +
      LISTEN_PORT +
      " -> " +
      TARGET_HOST +
      ":" +
      TARGET_PORT,
  );
  setupAdb();
  console.log("\nDev setup complete. Now run: npm run android\n");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(
      "Port " +
        LISTEN_PORT +
        " in use (proxy may already be running). Re-running ADB reverse...",
    );
    setupAdb();
  } else {
    console.error("Proxy error:", err.message);
  }
});
