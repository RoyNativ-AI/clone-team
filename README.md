<p align="center">
  <h1 align="center">Clone Team</h1>
</p>

<p align="center">
  <strong>Generate AI personas from conversations for Claude Code review simulation.</strong>
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#how-it-works">How It Works</a> •
  <a href="#usage">Usage</a> •
  <a href="#examples">Examples</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/clone-team"><img src="https://img.shields.io/npm/v/clone-team?style=flat-square" alt="npm"></a>
  <a href="https://github.com/RoyNativ-AI/clone-team/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License"></a>
</p>

---

## The Problem

You want code review feedback in your teammate's voice:
- **"What would Alex say about this?"**
- **"How would Sarah critique this architecture?"**
- **Onboarding** - new devs can get feedback in senior's style

## The Solution

Clone Team turns Slack/chat conversations into AI personas:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Slack Chat  ──────►  AI Persona  ──────►  Code Reviews       │
│                                                                 │
│   "Alex: I prefer       Captures Alex's      /alex-review      │
│    explicit error       style, preferences,   gives feedback    │
│    handling..."         and patterns          as Alex would     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

```bash
# Initialize in your project
npx clone-team@latest init

# Generate a persona from conversation
/analyze-persona conversations/alex-chat.txt

# Create a review command
npx clone-team add Alex

# Get reviews in Alex's voice
/alex-review check src/api/auth.ts
```

---

## How It Works

### 1. Conversation Analysis

Export a Slack/chat conversation:

```
[2024-03-10 14:22]
You: Should we use Redis or in-memory caching?

[2024-03-10 14:35]
Alex: Depends on your scale. For a single instance, in-memory is fine.
But if you're planning to scale horizontally, Redis from day one.
I've been burned by premature optimization AND by late migrations.
The sweet spot is usually "use Redis, but don't over-engineer the caching strategy."
```

### 2. Persona Generation

Claude extracts patterns:

```markdown
# Alex Chen - Persona Profile

## Communication Style
- Direct but friendly
- Uses concrete examples
- Acknowledges trade-offs before making recommendations

## Technical Philosophy
- Prefers explicit over implicit
- Values operational simplicity
- "Boring technology" advocate

## Code Review Patterns
- First checks: error handling, edge cases
- Pushes back on: unnecessary abstractions
- Appreciates: clear naming, good tests

## Typical Phrases
- "I've been burned by..."
- "The sweet spot is usually..."
- "Depends on your scale"
```

### 3. Review Simulation

```
/alex-review check the caching implementation

Alex (simulated): Looking at this cache implementation...
The TTL logic is solid, but I'd add explicit error handling
for Redis connection failures. I've been burned by silent
failures in production. Also, why the custom serialization?
JSON.stringify works fine for 99% of cases.
```

---

## Usage

### Initialize

```bash
npx clone-team@latest init
```

Creates:
```
.claude/commands/
  analyze-persona.md    # Command to generate personas
  persona-review.md     # Template for review commands
```

### Generate Persona

In Claude Code:
```
/analyze-persona path/to/conversation.txt
```

Output: `personas/Name.md`

### Create Review Command

```bash
npx clone-team add Alex
```

Creates: `.claude/commands/alex-review.md`

### Get Reviews

```
/alex-review check the auth middleware
/alex-review review src/api/payments.ts
/alex-review what do you think about this approach?
```

---

## Tips

| Tip | Why |
|-----|-----|
| More conversation = better | More data = more accurate persona |
| Include technical discussions | Small talk doesn't reveal code preferences |
| Edit generated personas | Add context Claude couldn't infer |
| Works best with distinct styles | Subtle differences are harder to capture |

---

## Privacy

- Conversations stay local
- Personas are just markdown files
- Share or gitignore as needed
- No data sent anywhere except your AI provider

---

## Examples

See [`templates/examples/`](templates/examples/) for:
- Sample conversation format
- Generated persona example
- Review command template

---

## Architecture

```
clone-team/
├── src/
│   └── cli.ts              # CLI for init/add commands
├── templates/
│   ├── commands/           # Slash command templates
│   └── examples/           # Sample conversation + persona
└── package.json
```

---

## License

MIT - See [LICENSE](LICENSE)

---

<p align="center">
  <strong>Code reviews in your teammate's voice.</strong>
</p>
