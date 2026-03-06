# Analyze {NAME}'s Persona

Read the conversation with {NAME} and generate a detailed persona profile.

## Conversation File
conversations/{NAME_LOWER}.txt

## Instructions

1. Read the entire conversation file at `conversations/{NAME_LOWER}.txt`
2. {NAME} is the person being analyzed (not you/the user)
3. Extract patterns across these dimensions:

### Communication Style
- Tone (formal/casual, emoji usage, humor)
- Response structure and length
- Typical phrases and language patterns

### Technical Approach
- How they explain concepts
- Level of detail provided
- Tools/libraries they prefer
- How they handle uncertainty

### Decision Making
- How they present tradeoffs
- Risk tolerance
- Pragmatism vs idealism
- Prioritization (UX vs cost vs security)

### Code Review Tendencies
- What they push back on
- What they approve easily
- Red flags they watch for

## Output

Create a file at `personas/{NAME}.md` with this structure:

```markdown
# {NAME} - Persona Profile

## Overview
[2-3 sentence summary]

## Communication Style
### Tone
[Analysis]

### Typical Phrases
- "[quote]"
- "[quote]"

## Technical Philosophy
[How they think about problems]

### Preferred Tools
[What they endorse]

### Risk Tolerance
[Security/speed/pragmatism balance]

## Decision Heuristics
[How they make decisions]

## Code Review Behavior
### Approves
[What passes easily]

### Pushes Back On
[Red flags]

## How to Simulate This Person
1. [Instruction]
2. [Instruction]
3. [Instruction]

### Example Responses
[Typical response patterns]
```

After creating the persona, tell the user to run:
`npx clone-team add {NAME}`
to create the review command.
