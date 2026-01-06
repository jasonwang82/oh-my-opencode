# Claude Code Hook Handlers

This directory contains JavaScript hook handlers for the oh-my-opencode Claude Code plugin.

## Available Hooks

### Context Injection Hooks

#### directory-agents-injector.js
Auto-injects AGENTS.md files from current directory hierarchy.

**Events:** PreToolUse, PostToolUse, SessionEnd
**Description:** Finds AGENTS.md files up the directory tree and injects them once per session when files are read.

#### directory-readme-injector.js
Auto-injects README.md files from current directory hierarchy.

**Events:** PreToolUse, PostToolUse, SessionEnd
**Description:** Finds README.md files up the directory tree and injects them once per session when files are read.

### Output Control Hooks

#### tool-output-truncator.js
Truncates excessively long tool outputs.

**Events:** PostToolUse
**Thresholds:**
- grep: 10,000 chars
- bash: 50,000 chars
- read: 100,000 chars
- glob: 5,000 chars
- view: 50,000 chars
- default: 20,000 chars

#### comment-checker.js
Prevents excessive AI-generated comments in code.

**Events:** PostToolUse
**Description:** Warns if more than 30% of code lines are comments after write/edit operations.

### Workflow Enhancement Hooks

#### agent-usage-reminder.js
Reminds to use specialized agents for appropriate tasks.

**Events:** UserPromptSubmit, SessionEnd
**Detects:**
- UI/frontend work → suggests frontend-ui-ux-engineer
- Documentation → suggests document-writer
- Research/libraries → suggests librarian
- Code search → suggests explore
- Architecture → suggests oracle
- Visual analysis → suggests multimodal-looker

#### keyword-detector.js
Detects special keywords and triggers behaviors.

**Events:** UserPromptSubmit, SessionEnd
**Keywords:**
- `ultrawork`: Activates maximum precision mode
- `search <topic>`: Suggests parallel search agents

#### empty-message-sanitizer.js
Sanitizes empty or whitespace-only messages.

**Events:** UserPromptSubmit
**Description:** Blocks submission of empty messages with error message.

## Hook Format

Each hook handler exports functions corresponding to hook events:

```javascript
/**
 * PreToolUse hook handler
 * Executes before tool is called
 */
module.exports.PreToolUse = async function PreToolUse({ tool, sessionID, callID, args, context }) {
  // Hook logic here
};

/**
 * PostToolUse hook handler
 * Executes after tool completes
 */
module.exports.PostToolUse = async function PostToolUse({ tool, sessionID, callID, args, result, context }) {
  // Hook logic here
  // Can modify result.output
};

/**
 * UserPromptSubmit hook handler
 * Executes when user submits a prompt
 */
module.exports.UserPromptSubmit = async function UserPromptSubmit({ sessionID, agent, message, parts, context }) {
  // Hook logic here
  // Can modify parts or throw error to block
};

/**
 * SessionEnd hook handler
 * Cleanup when session ends
 */
module.exports.SessionEnd = async function SessionEnd({ sessionID }) {
  // Cleanup logic here
};
```

## Configuration

Hooks are registered in `hooks.json`:

```json
{
  "PreToolUse": [
    {
      "handler": "${CLAUDE_PLUGIN_ROOT}/hooks/handlers/directory-agents-injector.js",
      "config": {}
    }
  ],
  "PostToolUse": [
    {
      "handler": "${CLAUDE_PLUGIN_ROOT}/hooks/handlers/tool-output-truncator.js",
      "config": {
        "enabled": true
      }
    }
  ]
}
```

## Adding New Hooks

1. Create a new `.js` file in this directory
2. Export functions for the events you want to handle
3. Add to `hooks.json` configuration
4. Document in this README

## Best Practices

### Performance
- Keep hooks lightweight
- Cache expensive computations
- Use async/await appropriately
- Clean up in SessionEnd

### Error Handling
- Use try/catch for file operations
- Fail gracefully (don't crash session)
- Log errors for debugging

### State Management
- Use Map/Set for session state
- Clean up in SessionEnd handler
- Avoid memory leaks

### Context Injection
- Check cache to avoid duplicate injection
- Truncate large content
- Add truncation notices

## Testing

Test hooks locally:

```bash
# Copy plugin to Claude plugins directory
mkdir -p ~/.claude/plugins
cp -r plugins/oh-my-opencode ~/.claude/plugins/

# Restart Claude Desktop
# Test each hook by triggering its event
```

## See Also

- [Parent HOOKS.md](../HOOKS.md) - Complete hooks reference
- [Plugin README](../README.md) - Plugin overview
- [INSTALL.md](../INSTALL.md) - Installation guide
