/**
 * SAHAYA AI — Cold-Start Mitigation & Ping Warmup Script
 * Run this script 5 minutes before hackathon presentation/demo to warm up
 * Catalyst serverless functions and mitigate cold start latency.
 */

const http = require("http");
const https = require("https");

const ENDPOINTS = [
  process.env.CATALYST_API_URL || "http://localhost:3000/api/health",
  "http://localhost:3001/api/health",
];

async function pingEndpoint(url) {
  return new Promise((resolve) => {
    const start = Date.now();
    const client = url.startsWith("https") ? https : http;
    
    const req = client.get(url, (res) => {
      const elapsed = Date.now() - start;
      console.log(`[PING] ${url} → HTTP ${res.statusCode} (${elapsed}ms)`);
      resolve({ status: res.statusCode, elapsed });
    });

    req.on("error", (err) => {
      console.log(`[PING] ${url} → Error: ${err.message}`);
      resolve({ status: 0, elapsed: 0 });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`[PING] ${url} → Timeout (5s)`);
      resolve({ status: 0, elapsed: 5000 });
    });
  });
}

async function main() {
  console.log("==================================================");
  console.log("⚡ SAHAYA AI — Serverless Cold-Start Warmup Ping");
  console.log("==================================================");
  
  for (const endpoint of ENDPOINTS) {
    await pingEndpoint(endpoint);
  }

  console.log("==================================================");
  console.log("✅ Catalyst API Gateway functions warmed up!");
}

if (require.main === module) {
  main();
}
