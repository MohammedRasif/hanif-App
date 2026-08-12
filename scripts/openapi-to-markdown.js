import { createMarkdownFromOpenApi } from "@scalar/openapi-to-markdown";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openApiPath = path.join(__dirname, "openapi.json");
const outputPath = path.join(__dirname, "api-docs.md");

const openApi = JSON.parse(fs.readFileSync(openApiPath, "utf-8"));

const markdown = await createMarkdownFromOpenApi(openApi);

fs.writeFileSync(outputPath, markdown);
