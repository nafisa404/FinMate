#!/usr/bin/env node

/**
 * FinMate Deployment Verification Script
 * Checks if the application is ready for production deployment
 */

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

console.log("🚀 FinMate Deployment Verification\n");

// Check if build files exist
const buildChecks = [
  { path: "dist/spa/index.html", name: "Frontend build" },
  { path: "dist/server/node-build.mjs", name: "Backend build" },
  { path: "netlify/functions/api.ts", name: "Netlify function" },
];

let allChecksPass = true;

console.log("📦 Build Files Check:");
buildChecks.forEach((check) => {
  const exists = existsSync(join(rootDir, check.path));
  console.log(`  ${exists ? "✅" : "❌"} ${check.name}: ${check.path}`);
  if (!exists) allChecksPass = false;
});

// Check package.json configuration
console.log("\n📋 Package Configuration:");
const packageJson = JSON.parse(
  readFileSync(join(rootDir, "package.json"), "utf8"),
);
const requiredDeps = [
  "express",
  "better-sqlite3",
  "@huggingface/inference",
  "drizzle-orm",
  "dotenv",
  "cors",
];

requiredDeps.forEach((dep) => {
  const exists = packageJson.dependencies && packageJson.dependencies[dep];
  console.log(`  ${exists ? "✅" : "❌"} ${dep}: ${exists || "Missing"}`);
  if (!exists) allChecksPass = false;
});

// Check Netlify configuration
console.log("\n🌐 Netlify Configuration:");
const netlifyToml = readFileSync(join(rootDir, "netlify.toml"), "utf8");
const hasRedirects = netlifyToml.includes("[[redirects]]");
const hasFunctions = netlifyToml.includes("[functions]");
const hasApiRedirect = netlifyToml.includes("/api/*");

console.log(`  ${hasRedirects ? "✅" : "❌"} API redirects configured`);
console.log(`  ${hasFunctions ? "✅" : "❌"} Functions configuration`);
console.log(`  ${hasApiRedirect ? "✅" : "❌"} API routing setup`);

if (!hasRedirects || !hasFunctions || !hasApiRedirect) allChecksPass = false;

// Check environment variables setup
console.log("\n🔐 Environment Configuration:");
const envExample = existsSync(join(rootDir, ".env.example"));
const envLocal = existsSync(join(rootDir, ".env"));

console.log(`  ${envExample ? "✅" : "❌"} Environment example file`);
console.log(`  ${envLocal ? "✅" : "❌"} Local environment file`);

if (envLocal) {
  const envContent = readFileSync(join(rootDir, ".env"), "utf8");
  const hasHuggingFaceKey =
    envContent.includes("HUGGINGFACE_API_KEY=") &&
    !envContent.includes("HUGGINGFACE_API_KEY=\n");
  console.log(
    `  ${hasHuggingFaceKey ? "✅" : "⚠️"} Hugging Face API key ${hasHuggingFaceKey ? "configured" : "not set (will use fallbacks)"}`,
  );
}

// Final verdict
console.log("\n" + "=".repeat(50));
if (allChecksPass) {
  console.log("🎉 All checks passed! Ready for deployment.");
  console.log("\n📝 Deployment Steps:");
  console.log(
    '1. Commit your changes: git add . && git commit -m "Deploy FinMate"',
  );
  console.log("2. Push to your repository: git push");
  console.log("3. Deploy to Netlify (auto-deploy if connected)");
  console.log("4. Set HUGGINGFACE_API_KEY in Netlify environment variables");
  console.log("5. Verify deployment at your Netlify URL");
  process.exit(0);
} else {
  console.log(
    "❌ Some checks failed. Please fix the issues above before deploying.",
  );
  process.exit(1);
}
