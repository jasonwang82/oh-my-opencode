# Installation & Usage Guide

Complete guide for installing and using the oh-my-opencode Claude Code plugin.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Installation Methods](#installation-methods)
3. [Configuration](#configuration)
4. [Using Agents](#using-agents)
5. [Using Commands](#using-commands)
6. [Using Skills](#using-skills)
7. [Hooks Configuration](#hooks-configuration)
8. [MCP Servers](#mcp-servers)
9. [Troubleshooting](#troubleshooting)
10. [Advanced Usage](#advanced-usage)

---

## Quick Start

### Prerequisites

- Claude Desktop with plugin support
- (Optional) Language servers for LSP tools
- (Optional) tmux for interactive bash
- (Optional) @ast-grep/napi or @ast-grep/cli

### 5-Minute Setup

```bash
# 1. Copy plugin to Claude plugins directory
mkdir -p ~/.claude/plugins
cp -r plugins/oh-my-opencode ~/.claude/plugins/

# 2. Restart Claude Desktop

# 3. Verify plugin loaded
# In Claude Desktop, type:
# /oh-my-opencode:lsp-servers
```

---

## Installation Methods

### Method 1: Manual Installation (Recommended)

```bash
# Clone repository
git clone https://github.com/code-yeongyu/oh-my-opencode.git
cd oh-my-opencode

# Copy plugin to Claude plugins directory
mkdir -p ~/.claude/plugins
cp -r plugins/oh-my-opencode ~/.claude/plugins/

# Verify installation
ls ~/.claude/plugins/oh-my-opencode/
# Should see: README.md, .claude-plugin/, agents/, commands/, hooks/, skills/
```

### Method 2: Symlink (Development)

For active development, use symlinks:

```bash
# Clone and build
git clone https://github.com/code-yeongyu/oh-my-opencode.git
cd oh-my-opencode
bun install
bun run build

# Create symlink
mkdir -p ~/.claude/plugins
ln -s "$(pwd)/plugins/oh-my-opencode" ~/.claude/plugins/oh-my-opencode

# Changes to plugin files will be reflected immediately
```

### Method 3: Claude CLI (If Available)

```bash
# Using Claude CLI
claude plugin install ./plugins/oh-my-opencode

# Or from remote
claude plugin install code-yeongyu/oh-my-opencode
```

---

## Configuration

### Plugin Manifest

The plugin manifest is at `.claude-plugin/plugin.json`:

```json
{
  "name": "oh-my-opencode",
  "version": "2.13.2",
  "description": "Complete oh-my-opencode toolkit",
  "components": {
    "agents": 7,
    "commands": 26,
    "skills": 1,
    "hooks": 22,
    "mcpServers": 2
  }
}
```

### Enabling/Disabling Components

In Claude Desktop settings (`~/.claude/settings.json`):

```json
{
  "enabledPlugins": {
    "oh-my-opencode": true
  },
  "pluginConfig": {
    "oh-my-opencode": {
      "disabledAgents": [],
      "disabledCommands": [],
      "disabledHooks": [
        "todo-continuation-enforcer"  // Disable specific hooks
      ]
    }
  }
}
```

---

## Using Agents

### Agent Invocation

Agents are invoked with the `@` symbol:

```
@oh-my-opencode:oracle Review this architecture and suggest improvements
@oh-my-opencode:librarian How does React Query handle caching?
@oh-my-opencode:explore Find all authentication implementations
```

### Available Agents

| Agent | Usage | Best For |
|-------|-------|----------|
| `@oh-my-opencode:oracle` | Strategic advice | Architecture, complex decisions |
| `@oh-my-opencode:librarian` | Research | Library docs, open source research |
| `@oh-my-opencode:explore` | Code search | Finding code patterns, structure |
| `@oh-my-opencode:frontend-ui-ux-engineer` | UI work | Visual changes, styling |
| `@oh-my-opencode:document-writer` | Documentation | READMEs, API docs, guides |
| `@oh-my-opencode:multimodal-looker` | Media analysis | PDFs, images, diagrams |

### Agent Examples

#### Oracle - Architecture Review

```
@oh-my-opencode:oracle

I'm implementing a caching layer for our API. 
Current approach: Redis with 5-minute TTL.
Expected load: 1000 req/s, 100k users.

Review and suggest improvements.
```

#### Librarian - Library Research

```
@oh-my-opencode:librarian

How does TypeScript's type narrowing work with discriminated unions?
Show me examples from the TypeScript source code.
```

#### Explore - Code Discovery

```
@oh-my-opencode:explore

Find all places where we handle user authentication.
I need to understand the complete auth flow.
```

#### Frontend Engineer - UI Implementation

```
@oh-my-opencode:frontend-ui-ux-engineer

Create a modern, minimalist login page with:
- Email/password fields
- "Remember me" checkbox
- Smooth animations
- Mobile responsive

Theme: Brutalist, high contrast
```

---

## Using Commands

### Command Invocation

Commands are invoked with `/` slash commands:

```
/oh-my-opencode:lsp-hover /workspace/src/index.ts 10 5
/oh-my-opencode:ast-grep-search "function $NAME($$$PARAMS)"
/oh-my-opencode:session-search "bug fix"
```

### Command Categories

#### LSP Commands (Code Intelligence)

```bash
# Get type information
/oh-my-opencode:lsp-hover /workspace/src/user.ts 25 10

# Find definition
/oh-my-opencode:lsp-goto-definition /workspace/src/user.ts 25 10

# Find all references
/oh-my-opencode:lsp-find-references /workspace/src/user.ts 25 10

# Get diagnostics (errors/warnings)
/oh-my-opencode:lsp-diagnostics /workspace/src/user.ts

# Rename symbol
/oh-my-opencode:lsp-rename /workspace/src/user.ts 25 10 "getActiveUser"

# List all symbols in file
/oh-my-opencode:lsp-document-symbols /workspace/src/user.ts

# Search symbols in workspace
/oh-my-opencode:lsp-workspace-symbols "User"
```

#### AST-Grep Commands (Pattern Matching)

```bash
# Search for patterns
/oh-my-opencode:ast-grep-search "console.log($MSG)" --lang typescript

# Replace patterns (dry run)
/oh-my-opencode:ast-grep-replace "console.log($MSG)" "logger.info($MSG)" --dryRun

# Search function declarations
/oh-my-opencode:ast-grep-search "function $NAME($$$PARAMS) { $$$ }" --lang javascript

# Find async functions
/oh-my-opencode:ast-grep-search "async function $NAME($$$PARAMS) { $$$ }"
```

#### Session Commands

```bash
# List recent sessions
/oh-my-opencode:session-list 20

# Read specific session
/oh-my-opencode:session-read abc123def

# Search across sessions
/oh-my-opencode:session-search "authentication bug"

# Get session info
/oh-my-opencode:session-info abc123def
```

#### Background Task Commands

```bash
# Start background task
/oh-my-opencode:background-task explore "Find error handling patterns"

# Get task output
/oh-my-opencode:background-output task_123

# Cancel task
/oh-my-opencode:background-cancel task_123

# Cancel all tasks
/oh-my-opencode:background-cancel all
```

#### File Search Commands

```bash
# Grep for content
/oh-my-opencode:grep "async function" --glob "*.ts" --contextLines 2

# Find files by pattern
/oh-my-opencode:glob "**/*test*.ts"

# Case-insensitive search
/oh-my-opencode:grep "authentication" --caseInsensitive --glob "*.{ts,js}"
```

---

## Using Skills

### Available Skills

Currently includes 1 builtin skill:

#### Playwright (Browser Automation)

```
/oh-my-opencode:skill playwright Take screenshot of https://example.com
/oh-my-opencode:skill playwright Test login flow on staging
/oh-my-opencode:skill playwright Extract data from table
```

### Skill Features

- Embedded MCP server configuration
- Automatic dependency management
- Context-aware execution

---

## Hooks Configuration

### Global Hook Control

Disable specific hooks in `~/.claude/settings.json`:

```json
{
  "pluginConfig": {
    "oh-my-opencode": {
      "disabledHooks": [
        "todo-continuation-enforcer",
        "comment-checker",
        "agent-usage-reminder"
      ],
      "comment_checker": {
        "enabled": false
      },
      "experimental": {
        "session_recovery": true,
        "preemptive_compaction": true,
        "anthropic_context_recovery": true
      }
    }
  }
}
```

### Hook Scenarios

#### Scenario 1: Exploratory Session
```json
{
  "disabledHooks": [
    "todo-continuation-enforcer",  // Don't enforce TODOs
    "agent-usage-reminder"         // Don't suggest agents
  ]
}
```

#### Scenario 2: Production Work
```json
{
  "disabledHooks": [],
  "experimental": {
    "session_recovery": true,
    "preemptive_compaction": true
  }
}
```

#### Scenario 3: Documentation Work
```json
{
  "disabledHooks": [
    "comment-checker"  // Allow documentation comments
  ]
}
```

---

## MCP Servers

### Included MCP Servers

The plugin includes 2 MCP servers:

#### 1. Context7
- **URL**: https://mcp.context7.com/mcp
- **Purpose**: Library documentation access
- **Usage**: Automatic (used by librarian agent)

#### 2. Grep.app
- **URL**: https://mcp.grep.app
- **Purpose**: GitHub code search
- **Usage**: Automatic (used by librarian agent)

### Configuration

MCP servers are configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "description": "Enhanced context management"
    },
    "grep_app": {
      "type": "remote",
      "url": "https://mcp.grep.app",
      "description": "GitHub code search"
    }
  }
}
```

---

## Troubleshooting

### Common Issues

#### Plugin Not Loading

**Symptom**: Plugin not visible in Claude Desktop

**Solution**:
```bash
# Verify plugin location
ls ~/.claude/plugins/oh-my-opencode/

# Check manifest
cat ~/.claude/plugins/oh-my-opencode/.claude-plugin/plugin.json

# Restart Claude Desktop completely
killall "Claude Desktop"
open -a "Claude Desktop"
```

#### LSP Commands Not Working

**Symptom**: LSP commands return errors

**Solution**:
```bash
# Install language servers
npm install -g typescript-language-server
pip install 'python-lsp-server[all]'
go install golang.org/x/tools/gopls@latest

# Verify installation
which typescript-language-server
which pylsp
which gopls
```

#### Agents Not Responding

**Symptom**: Agent invocation has no effect

**Solution**:
1. Check agent name spelling
2. Verify plugin is enabled
3. Check Claude Desktop logs
4. Restart Claude Desktop

#### Hooks Not Firing

**Symptom**: Expected hook behavior not occurring

**Solution**:
```json
// Check disabled_hooks in settings.json
{
  "pluginConfig": {
    "oh-my-opencode": {
      "disabledHooks": []  // Should be empty or not include the hook
    }
  }
}
```

---

## Advanced Usage

### Parallel Agent Execution

For complex tasks, use background tasks:

```typescript
// Start multiple searches in parallel
background_task(agent="explore", prompt="Find auth patterns in src/")
background_task(agent="explore", prompt="Find error handlers in src/")
background_task(agent="librarian", prompt="How does JWT work in Express?")

// Continue working...

// Collect results when needed
background_output(task_id="task_1")
background_output(task_id="task_2")
background_output(task_id="task_3")
```

### Custom Workflow with Multiple Agents

```
Step 1: @oh-my-opencode:explore Find the user authentication module

Step 2: @oh-my-opencode:oracle Review the auth implementation for security issues

Step 3: @oh-my-opencode:librarian Find JWT best practices and compare with our implementation

Step 4: Implement fixes based on oracle's recommendations

Step 5: @oh-my-opencode:document-writer Update auth documentation
```

### AST-Grep Advanced Patterns

```bash
# Find all React hooks
/oh-my-opencode:ast-grep-search "use$HOOK($$$ARGS)" --lang typescript

# Find class methods
/oh-my-opencode:ast-grep-search "class $CLASS { $$$ $METHOD($$$PARAMS) { $$$ } $$$ }"

# Find async/await patterns
/oh-my-opencode:ast-grep-search "const $VAR = await $PROMISE"

# Replace with transformation
/oh-my-opencode:ast-grep-replace "var $VAR = $VALUE" "const $VAR = $VALUE" --lang javascript
```

### Session Management Workflow

```bash
# 1. List recent sessions
/oh-my-opencode:session-list 50

# 2. Search for specific topic
/oh-my-opencode:session-search "refactoring database layer"

# 3. Read relevant session
/oh-my-opencode:session-read abc123def

# 4. Extract learnings and apply to current task
```

---

## Performance Tips

### 1. Use Parallel Execution

```typescript
// GOOD: Parallel
background_task(agent="explore", ...)
background_task(agent="explore", ...)
grep("pattern1", ...)
grep("pattern2", ...)

// BAD: Sequential
task(agent="explore", ...)  // Wait
task(agent="explore", ...)  // Wait
```

### 2. Cache Expensive Operations

```typescript
// Cache LSP results
const symbols = lsp_workspace_symbols("User")
// Reuse symbols instead of re-querying
```

### 3. Disable Unnecessary Hooks

```json
{
  "disabledHooks": [
    "agent-usage-reminder",  // If you know when to use agents
    "keyword-detector"       // If not using keywords
  ]
}
```

### 4. Use Appropriate Tools

| Task | Best Tool | Why |
|------|-----------|-----|
| Find symbol definition | `lsp-goto-definition` | Semantic understanding |
| Find code pattern | `ast-grep-search` | Structural matching |
| Find text/string | `grep` | Speed |
| Find file | `glob` | Fast pattern matching |

---

## Best Practices

### 1. Agent Selection

- **Oracle**: Complex decisions, architecture review
- **Librarian**: External research, library docs
- **Explore**: Internal code search
- **Frontend Engineer**: UI changes only
- **Document Writer**: All documentation tasks

### 2. Tool Selection

- **LSP**: Semantic operations (definitions, references, rename)
- **AST-Grep**: Structural refactoring, pattern-based changes
- **Grep**: Text search, log analysis
- **Session**: Learning from past conversations

### 3. Hook Configuration

- Enable `session-recovery` in production
- Enable `preemptive-compaction` for long sessions
- Disable `todo-continuation-enforcer` during exploration
- Enable `comment-checker` to maintain code quality

---

## Support & Resources

- **Documentation**: [README.md](./README.md)
- **Agents Guide**: [agents/](./agents/)
- **Tools Reference**: [TOOLS.md](./TOOLS.md)
- **Hooks Reference**: [HOOKS.md](./HOOKS.md)
- **Source Code**: https://github.com/code-yeongyu/oh-my-opencode
- **Issues**: https://github.com/code-yeongyu/oh-my-opencode/issues

---

## Next Steps

1. **Basic Usage**: Start with simple commands like `lsp-hover` and `grep`
2. **Agent Exploration**: Try each agent with different tasks
3. **Advanced Patterns**: Experiment with parallel execution
4. **Custom Configuration**: Tailor hooks and settings to your workflow
5. **Contribute**: Share your usage patterns and improvements

Happy coding! 🚀
