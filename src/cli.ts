#!/usr/bin/env node

import { program } from "commander";
import { existsSync, mkdirSync, copyFileSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COMMANDS_DIR = ".claude/commands";
const PERSONAS_DIR = "personas";
const CONVERSATIONS_DIR = "conversations";

function getTemplatesDir(): string {
  // In dist: ../templates, in dev with tsx: ../templates
  const distTemplates = join(__dirname, "..", "templates");
  if (existsSync(distTemplates)) {
    return distTemplates;
  }
  // Fallback for development
  return join(process.cwd(), "templates");
}

function init(): void {
  const cwd = process.cwd();
  const commandsDir = join(cwd, COMMANDS_DIR);
  const personasDir = join(cwd, PERSONAS_DIR);
  const conversationsDir = join(cwd, CONVERSATIONS_DIR);
  const templatesDir = getTemplatesDir();

  console.log("Initializing clone-team...\n");

  // Create directories
  if (!existsSync(commandsDir)) {
    mkdirSync(commandsDir, { recursive: true });
    console.log(`Created ${COMMANDS_DIR}/`);
  }

  if (!existsSync(personasDir)) {
    mkdirSync(personasDir, { recursive: true });
    console.log(`Created ${PERSONAS_DIR}/`);
  }

  if (!existsSync(conversationsDir)) {
    mkdirSync(conversationsDir, { recursive: true });
    console.log(`Created ${CONVERSATIONS_DIR}/`);
  }

  // Copy command templates
  const commandTemplatesDir = join(templatesDir, "commands");
  if (existsSync(commandTemplatesDir)) {
    const templates = readdirSync(commandTemplatesDir);
    for (const template of templates) {
      const src = join(commandTemplatesDir, template);
      const dest = join(commandsDir, template);
      if (!existsSync(dest)) {
        copyFileSync(src, dest);
        console.log(`Added ${COMMANDS_DIR}/${template}`);
      } else {
        console.log(`Skipped ${COMMANDS_DIR}/${template} (already exists)`);
      }
    }
  }

  console.log(`
Done! Next steps:

1. Add a conversation file:
   Place your conversation in a .txt file (e.g., pete-chat.txt)

2. Generate a persona:
   In Claude Code, run:
   /analyze-persona pete-chat.txt

3. Use the persona for reviews:
   /[name]-review check the auth implementation

Tip: The persona files are saved in ${PERSONAS_DIR}/ and can be edited manually.
`);
}

function addPersonaCommand(name: string): void {
  const cwd = process.cwd();
  const commandsDir = join(cwd, COMMANDS_DIR);
  const templatesDir = getTemplatesDir();

  if (!existsSync(commandsDir)) {
    console.error(`Error: ${COMMANDS_DIR}/ not found. Run 'clone-team init' first.`);
    process.exit(1);
  }

  const reviewTemplate = join(templatesDir, "commands", "persona-review.md");
  if (!existsSync(reviewTemplate)) {
    console.error("Error: Review template not found.");
    process.exit(1);
  }

  const dest = join(commandsDir, `${name.toLowerCase()}-review.md`);
  if (existsSync(dest)) {
    console.log(`Command /${name.toLowerCase()}-review already exists.`);
    return;
  }

  // Read template and replace placeholder
  const content = require("node:fs")
    .readFileSync(reviewTemplate, "utf-8")
    .replace(/\{NAME\}/g, name)
    .replace(/\{NAME_LOWER\}/g, name.toLowerCase());

  require("node:fs").writeFileSync(dest, content);
  console.log(`Created /${name.toLowerCase()}-review command`);
}

function listConversations(): void {
  const cwd = process.cwd();
  const conversationsDir = join(cwd, CONVERSATIONS_DIR);

  if (!existsSync(conversationsDir)) {
    console.log(`No ${CONVERSATIONS_DIR}/ directory found. Run 'clone-team init' first.`);
    return;
  }

  const files = readdirSync(conversationsDir).filter((f) => f.endsWith(".txt"));

  if (files.length === 0) {
    console.log(`No .txt files found in ${CONVERSATIONS_DIR}/`);
    console.log(`\nAdd conversation files there, then run:`);
    console.log(`  /analyze-persona conversations/<filename>.txt`);
    return;
  }

  console.log(`Found ${files.length} conversation file(s):\n`);
  files.forEach((file, index) => {
    const name = file.replace(".txt", "");
    console.log(`  ${index + 1}. ${file}`);
    console.log(`     /analyze-persona ${CONVERSATIONS_DIR}/${file}`);
    console.log("");
  });
}

function sync(): void {
  const cwd = process.cwd();
  const commandsDir = join(cwd, COMMANDS_DIR);
  const conversationsDir = join(cwd, CONVERSATIONS_DIR);
  const templatesDir = getTemplatesDir();

  if (!existsSync(commandsDir)) {
    console.error(`Error: ${COMMANDS_DIR}/ not found. Run 'clone-team init' first.`);
    process.exit(1);
  }

  if (!existsSync(conversationsDir)) {
    mkdirSync(conversationsDir, { recursive: true });
    console.log(`Created ${CONVERSATIONS_DIR}/`);
  }

  const analyzeTemplate = join(templatesDir, "commands", "analyze-persona-template.md");
  if (!existsSync(analyzeTemplate)) {
    console.error("Error: Analyze template not found.");
    process.exit(1);
  }

  const templateContent = readFileSync(analyzeTemplate, "utf-8");
  const files = readdirSync(conversationsDir).filter((f) => f.endsWith(".txt"));

  if (files.length === 0) {
    console.log(`No .txt files found in ${CONVERSATIONS_DIR}/`);
    console.log(`Add conversation files there and run 'clone-team sync' again.`);
    return;
  }

  let created = 0;
  let skipped = 0;

  for (const file of files) {
    const name = file.replace(".txt", "");
    const commandFile = `analyze-${name.toLowerCase()}.md`;
    const dest = join(commandsDir, commandFile);

    if (existsSync(dest)) {
      skipped++;
      continue;
    }

    const content = templateContent
      .replace(/\{NAME\}/g, name)
      .replace(/\{NAME_LOWER\}/g, name.toLowerCase());

    writeFileSync(dest, content);
    console.log(`Created /analyze-${name.toLowerCase()}`);
    created++;
  }

  if (created > 0) {
    console.log(`\n${created} command(s) created.`);
  }
  if (skipped > 0) {
    console.log(`${skipped} command(s) already existed.`);
  }

  console.log(`\nAvailable commands:`);
  files.forEach((file) => {
    const name = file.replace(".txt", "");
    console.log(`  /analyze-${name.toLowerCase()}`);
  });
}

function listPersonas(): void {
  const cwd = process.cwd();
  const personasDir = join(cwd, PERSONAS_DIR);
  const commandsDir = join(cwd, COMMANDS_DIR);

  if (!existsSync(personasDir)) {
    console.log(`No ${PERSONAS_DIR}/ directory found. Run 'clone-team init' first.`);
    return;
  }

  const personas = readdirSync(personasDir).filter((f) => f.endsWith(".md"));

  if (personas.length === 0) {
    console.log(`No personas found in ${PERSONAS_DIR}/`);
    console.log(`\nGenerate one with:`);
    console.log(`  /analyze-persona conversations/<name>.txt`);
    return;
  }

  console.log(`Found ${personas.length} persona(s):\n`);
  personas.forEach((file) => {
    const name = file.replace(".md", "");
    const commandFile = `${name.toLowerCase()}-review.md`;
    const hasCommand = existsSync(join(commandsDir, commandFile));

    console.log(`  - ${name}`);
    if (hasCommand) {
      console.log(`    Command: /${name.toLowerCase()}-review`);
    } else {
      console.log(`    No command yet. Run: clone-team add "${name}"`);
    }
    console.log("");
  });
}

program
  .name("clone-team")
  .description("Generate AI personas from conversations for Claude Code")
  .version("0.3.0");

program
  .command("init")
  .description("Initialize clone-team in current project")
  .action(init);

program
  .command("add <name>")
  .description("Add a review command for a persona")
  .action(addPersonaCommand);

program
  .command("list")
  .description("List available conversations and personas")
  .action(() => {
    console.log("=== Conversations ===\n");
    listConversations();
    console.log("\n=== Personas ===\n");
    listPersonas();
  });

program
  .command("conversations")
  .alias("convos")
  .description("List conversation files ready for analysis")
  .action(listConversations);

program
  .command("personas")
  .description("List generated personas")
  .action(listPersonas);

program
  .command("sync")
  .description("Create /analyze-<name> commands for each conversation file")
  .action(sync);

program.parse();
