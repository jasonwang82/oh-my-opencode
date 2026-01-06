# oh-my-opencode Hooks Reference

This document describes all 22 lifecycle hooks available in oh-my-opencode. These hooks intercept and modify agent behavior throughout the session lifecycle.

## Overview

Hooks provide powerful interception points for:
- **Context Management**: Inject relevant documentation and project context
- **Error Recovery**: Automatically recover from failures and token limits
- **Output Control**: Truncate verbose outputs and sanitize empty messages
- **Workflow Enhancement**: Enforce TODO completion, keyword detection, and more
- **Notifications**: OS-level notifications for session events
- **Environment Handling**: Adapt behavior for CI/headless environments

## Hook Events

| Event | Timing | Can Block | Use Case |
|-------|--------|-----------|----------|
| **PreToolUse** | Before tool execution | Yes | Validate, modify input, block execution |
| **PostToolUse** | After tool execution | No | Add context, warnings, annotations |
| **UserPromptSubmit** | On user prompt | Yes | Inject messages, modify prompt, block |
| **Stop** | Session idle/paused | No | Inject follow-ups, cleanup |
| **onSummarize** | During compaction | No | Preserve context, inject metadata |

---

## Context Management Hooks (5)

### 1. context-window-monitor
Monitors token usage and warns when approaching limits.

**Event:** `PreToolUse`, `PostToolUse`
**Config:** None
**Behavior:**
- Tracks token usage across messages
- Warns at 75%, 85%, 95% thresholds
- Suggests compaction when near limit

---

### 2. directory-agents-injector
Auto-injects AGENTS.md files from current directory.

**Event:** `UserPromptSubmit`
**Config:** None
**Behavior:**
- Scans for `AGENTS.md` in current working directory
- Injects once per session per directory
- Provides agent-specific knowledge base
- Works hierarchically (subdirs inherit parent AGENTS.md)

**File Example:** `AGENTS.md`
```markdown
# Project-Specific Agent Knowledge

## Custom Agents
- use-agent-x for Y tasks
- Avoid agent-z for P operations

## Tool Preferences
- Prefer AST-grep for refactoring
- Use LSP for navigation
```

---

### 3. directory-readme-injector
Auto-injects README.md files from current directory.

**Event:** `UserPromptSubmit`
**Config:** None
**Behavior:**
- Scans for `README.md` in current working directory
- Injects once per session per directory
- Provides project context
- Useful for understanding project structure

---

### 4. compaction-context-injector
Preserves critical context during message compaction.

**Event:** `onSummarize`
**Config:** None
**Behavior:**
- Injects preserved context before compaction
- Maintains project conventions
- Keeps critical decisions from being summarized away
- Ensures consistency across compaction boundaries

---

### 5. rules-injector
Conditionally injects rules from `.claude/rules/` directory.

**Event:** `UserPromptSubmit`
**Config:** None
**Behavior:**
- Scans `.claude/rules/` for rule files
- Injects based on filename conditions
- Supports pattern matching
- Example: `typescript-strict.md` only injected for TS files

**File Structure:**
```
.claude/
└── rules/
    ├── typescript-strict.md
    ├── python-style.md
    └── security-checks.md
```

---

## Error Recovery Hooks (3)

### 6. session-recovery
Recovers from various session errors automatically.

**Event:** `PreToolUse`, `PostToolUse`
**Config:**
```json
{
  "experimental": {
    "session_recovery": true
  }
}
```
**Behavior:**
- Detects error patterns (timeouts, rate limits, tool failures)
- Implements retry logic with exponential backoff
- Recovers gracefully without user intervention
- Logs recovery attempts for debugging

---

### 7. anthropic-context-window-limit-recovery
Auto-compacts when Anthropic context limit is reached.

**Event:** `PreToolUse`, `PostToolUse`
**Config:**
```json
{
  "experimental": {
    "anthropic_context_recovery": true,
    "dcp_for_compaction": true
  }
}
```
**Behavior:**
- Detects `context_length_exceeded` errors
- Automatically triggers compaction
- Preserves recent context
- Continues execution after compaction

**Multi-stage Recovery:**
1. First attempt: Standard compaction
2. Second attempt: Aggressive compaction
3. Third attempt: Emergency compaction (keep only last 5 messages)

---

### 8. edit-error-recovery
Recovers from file edit failures automatically.

**Event:** `PostToolUse`
**Config:** None
**Behavior:**
- Detects edit tool errors
- Suggests fixes for common patterns
- Retries with corrected input
- Preserves user intent

---

### 9. preemptive-compaction
Pre-emptively compacts at 85% token usage.

**Event:** `PreToolUse`
**Config:**
```json
{
  "experimental": {
    "preemptive_compaction": true
  }
}
```
**Behavior:**
- Monitors token usage continuously
- Triggers compaction at 85% threshold
- Prevents hitting hard limits
- Maintains conversation flow

---

## Output Control Hooks (4)

### 10. tool-output-truncator
Truncates verbose tool outputs to save context.

**Event:** `PostToolUse`
**Config:**
```json
{
  "experimental": {
    "tool_output_truncation": true
  }
}
```
**Behavior:**
- Detects excessively long tool outputs
- Truncates with summary
- Preserves first and last portions
- Adds truncation notice

**Thresholds:**
- `grep`: Max 10,000 characters
- `bash`: Max 50,000 characters
- `read`: Max 100,000 characters

---

### 11. empty-message-sanitizer
Sanitizes empty or whitespace-only messages.

**Event:** `UserPromptSubmit`
**Config:** None
**Behavior:**
- Detects empty messages
- Prevents submission
- Suggests valid input
- Prevents wasted API calls

---

### 12. thinking-block-validator
Validates thinking block format and structure.

**Event:** `PostToolUse`
**Config:** None
**Behavior:**
- Checks for proper `<thinking>` tags
- Validates thinking block structure
- Warns about malformed blocks
- Ensures thinking is not leaked to user

---

### 13. comment-checker
Prevents excessive AI-generated comments in code.

**Event:** `PostToolUse`
**Config:**
```json
{
  "comment_checker": {
    "enabled": true,
    "filters": ["docstring", "directive", "bdd", "single_line"]
  }
}
```
**Behavior:**
- Analyzes code changes
- Detects AI comment patterns
- Blocks excessive commenting
- Allows necessary documentation

**Filter Types:**
- `docstring`: Function/class documentation
- `directive`: Special instructions (TODO, FIXME)
- `bdd`: Test comments (#given, #when, #then)
- `single_line`: Inline comments

---

## Workflow Hooks (7)

### 14. todo-continuation-enforcer
Forces completion of TODO items before starting new work.

**Event:** `UserPromptSubmit`
**Config:** None
**Behavior:**
- Tracks TODO list state
- Blocks new work if TODOs incomplete
- Suggests completing current task
- Maintains focus and prevents scope creep

**System Message:**
```
[SYSTEM REMINDER - TODO CONTINUATION]
You have incomplete TODO items. Complete them before starting new work.
```

---

### 15. ralph-loop
Self-referential development loop for continuous improvement.

**Event:** `Stop`
**Config:**
```json
{
  "experimental": {
    "ralph_loop": true
  }
}
```
**Behavior:**
- Analyzes current state
- Identifies improvement opportunities
- Proposes next iteration
- Continues until completion criteria met

---

### 16. keyword-detector
Detects special keywords and triggers appropriate behaviors.

**Event:** `UserPromptSubmit`
**Config:** None
**Behavior:**
- Detects "ultrawork" keyword → enhanced work mode
- Detects "search" patterns → parallel search agents
- Triggers specialized workflows
- Context-aware activation

**Keywords:**
- `ultrawork`: Intensive, thorough work mode
- `search <topic>`: Parallel explore + librarian agents

---

### 17. agent-usage-reminder
Reminds to use specialized agents for appropriate tasks.

**Event:** `UserPromptSubmit`
**Config:** None
**Behavior:**
- Analyzes task type
- Suggests appropriate agent
- Prevents misuse of primary agent
- Improves delegation patterns

**Example:**
```
Task involves UI changes → Suggests @frontend-ui-ux-engineer
Task needs documentation → Suggests @document-writer
Task needs research → Suggests @librarian
```

---

### 18. auto-slash-command
Detects and executes slash command patterns.

**Event:** `UserPromptSubmit`
**Config:** None
**Behavior:**
- Parses messages for `/command` patterns
- Extracts command and arguments
- Executes matched commands
- Fallback to normal processing if no match

---

### 19. empty-task-response-detector
Detects when agent produces no actionable response.

**Event:** `PostToolUse`
**Config:** None
**Behavior:**
- Analyzes response content
- Detects empty or non-actionable responses
- Prompts for clarification
- Prevents wasted interactions

---

### 20. think-mode
Auto-detects when deep thinking is beneficial.

**Event:** `UserPromptSubmit`
**Config:** None
**Behavior:**
- Analyzes task complexity
- Enables thinking mode for complex tasks
- Allocates thinking budget
- Improves reasoning quality

**Triggers:**
- Complex architectural questions
- Multi-step planning
- Novel problem solving
- Ambiguous requirements

---

## Notification Hooks (2)

### 21. session-notification
OS notifications for session events.

**Event:** `Stop`
**Config:** None
**Behavior:**
- Desktop notification when session idle
- Includes session ID and last message
- Platform-specific (macOS, Linux, Windows)
- Respects system notification settings

---

### 22. background-notification
OS notifications for background task completion.

**Event:** `PostToolUse` (background tasks)
**Config:** None
**Behavior:**
- Notifies when background tasks complete
- Shows task ID and status
- Includes error messages if failed
- Helps track long-running operations

---

## Environment Hooks (2)

### 23. non-interactive-env
Adapts behavior for CI/headless environments.

**Event:** `PreToolUse`
**Config:** None
**Behavior:**
- Detects non-interactive environment (CI=true)
- Disables interactive prompts
- Uses default choices
- Prevents blocking on user input

**Detection:**
- `CI=true` environment variable
- `TERM=dumb`
- No TTY attached

---

### 24. interactive-bash-session
Manages tmux sessions for interactive commands.

**Event:** `PreToolUse`, `PostToolUse`
**Config:** None
**Behavior:**
- Creates tmux sessions on demand
- Manages session lifecycle
- Captures output
- Cleans up stale sessions

---

## Hook Configuration

Hooks are configured in `hooks.json` and `oh-my-opencode.json`:

### Global Configuration (`oh-my-opencode.json`)
```json
{
  "disabled_hooks": [
    "hook-name-to-disable"
  ],
  "comment_checker": {
    "enabled": true,
    "filters": ["docstring", "directive"]
  },
  "experimental": {
    "session_recovery": true,
    "anthropic_context_recovery": true,
    "preemptive_compaction": true,
    "dcp_for_compaction": true,
    "tool_output_truncation": true,
    "ralph_loop": false
  }
}
```

### Plugin Hooks Configuration (`hooks.json`)
```json
{
  "PreToolUse": [
    {
      "handler": "${CLAUDE_PLUGIN_ROOT}/hooks/validation.js",
      "config": {}
    }
  ],
  "PostToolUse": [],
  "UserPromptSubmit": [],
  "Stop": [],
  "onSummarize": []
}
```

---

## Best Practices

### When to Disable Hooks

Disable hooks when they interfere with specific workflows:

```json
{
  "disabled_hooks": [
    "todo-continuation-enforcer",  // For exploratory sessions
    "comment-checker",             // When documentation is needed
    "agent-usage-reminder"         // When working directly
  ]
}
```

### Custom Hook Order

Hooks execute in registration order. Order matters for:
- Context injection (inject before processing)
- Error recovery (handle errors before notification)
- Output modification (truncate before logging)

### Hook Performance

Keep hook logic lightweight:
- Cache expensive computations
- Avoid blocking operations in PreToolUse
- Use async operations appropriately
- Log performance metrics

---

## Hook Development

To create custom hooks for Claude Code plugins:

### 1. Create Hook Handler (`hooks/my-hook.js`)
```javascript
export async function PreToolUse({ tool, args, context }) {
  // Hook logic here
  return {
    blocked: false,  // Block execution?
    message: "",     // Message to user
    modifiedArgs: args  // Modified arguments
  }
}
```

### 2. Register in `hooks.json`
```json
{
  "PreToolUse": [
    {
      "handler": "${CLAUDE_PLUGIN_ROOT}/hooks/my-hook.js",
      "config": {
        "option": "value"
      }
    }
  ]
}
```

### 3. Test Hook Behavior
```bash
# Enable debug logging
export OH_MY_OPENCODE_DEBUG=1

# Run OpenCode with hook
opencode
```

---

## Troubleshooting

### Hook Not Firing
- Check `disabled_hooks` configuration
- Verify hook registration in hooks.json
- Check event type matches expected behavior
- Enable debug logging

### Hook Errors
- Check hook handler file exists
- Verify handler function signature
- Check for runtime errors in logs
- Test hook independently

### Performance Issues
- Profile hook execution time
- Cache expensive operations
- Move heavy logic to background
- Consider disabling costly hooks

---

## See Also

- [Agents Documentation](../agents/)
- [Tools Documentation](../TOOLS.md)
- [MCP Servers](../.mcp.json)
- [Configuration Schema](../../src/config/schema.ts)
