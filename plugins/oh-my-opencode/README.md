# oh-my-opencode Claude Code Plugin

Complete extraction of oh-my-opencode as a Claude Code compatible plugin.

## 📦 Components

### 🤖 Agents (7)
Multi-model AI orchestration with specialized agents:
- **sisyphus** - Primary orchestrator (Claude Opus 4.5)
- **oracle** - Strategic advisor (GPT 5.2)
- **librarian** - Multi-repo research (Claude Sonnet 4.5)
- **explore** - Fast codebase grep (Grok Code)
- **frontend-ui-ux-engineer** - UI generation (Gemini 3 Pro)
- **document-writer** - Technical docs (Gemini 3 Pro)
- **multimodal-looker** - Visual analysis (Gemini 3 Flash)

### 🛠️ Commands (26)
#### LSP Tools (11)
Code intelligence via Language Server Protocol:
- `lsp-hover` - Type information and documentation
- `lsp-goto-definition` - Navigate to definitions
- `lsp-find-references` - Find all references
- `lsp-document-symbols` - List symbols in document
- `lsp-workspace-symbols` - Search symbols in workspace
- `lsp-diagnostics` - Get diagnostics (errors/warnings)
- `lsp-servers` - List active LSP servers
- `lsp-prepare-rename` - Prepare symbol rename
- `lsp-rename` - Rename symbol
- `lsp-code-actions` - Get available code actions
- `lsp-code-action-resolve` - Resolve code action details

#### AST Tools (2)
AST-aware code search and modification:
- `ast-grep-search` - Pattern-based code search
- `ast-grep-replace` - Pattern-based code replacement

#### Session Management (4)
Navigate and search OpenCode sessions:
- `session-list` - List all sessions
- `session-read` - Read session content
- `session-search` - Search across sessions
- `session-info` - Get session metadata

#### Background Tasks (3)
Parallel execution support:
- `background-task` - Start background task
- `background-output` - Get task output
- `background-cancel` - Cancel running task

#### Other Tools (6)
- `look-at` - Multimodal analysis (PDF, images)
- `interactive-bash` - Tmux session management
- `grep` - Fast content search with ripgrep
- `glob` - File pattern matching
- `skill` - Execute skill
- `skill-mcp` - Execute skill with MCP

### 📚 Skills (1)
- **playwright** - Browser automation with Playwright MCP

### 🪝 Hooks (22)
Lifecycle hooks for context management, error recovery, and workflow enhancement:

**Context Management:**
- `context-window-monitor` - Monitor token usage
- `compaction-context-injector` - Preserve context during compaction
- `directory-agents-injector` - Auto-inject AGENTS.md
- `directory-readme-injector` - Auto-inject README.md
- `rules-injector` - Conditional rules injection

**Error Recovery:**
- `session-recovery` - Recover from errors
- `anthropic-context-window-limit-recovery` - Auto-compact at token limit
- `edit-error-recovery` - Recover from edit failures
- `preemptive-compaction` - Pre-emptive compaction at 85%

**Output Control:**
- `tool-output-truncator` - Truncate verbose outputs
- `empty-message-sanitizer` - Sanitize empty messages
- `thinking-block-validator` - Validate thinking blocks
- `comment-checker` - Prevent excessive comments

**Workflow:**
- `auto-slash-command` - Detect and execute /commands
- `todo-continuation-enforcer` - Force TODO completion
- `ralph-loop` - Self-referential dev loop
- `keyword-detector` - Keyword activation
- `agent-usage-reminder` - Remind to use specialists

**Notifications:**
- `session-notification` - OS notify on idle
- `background-notification` - OS notify on task complete
- `auto-update-checker` - Version notifications

**Environment:**
- `non-interactive-env` - CI/headless handling
- `interactive-bash-session` - Tmux management
- `think-mode` - Auto-detect thinking triggers
- `empty-task-response-detector` - Detect empty responses

### 🔌 MCP Servers (2)
- **context7** - Enhanced context management
- **grep_app** - Advanced grep capabilities

## 📖 Usage

### In Claude Desktop
This plugin follows Claude Code plugin structure. Install via:
```bash
# Copy to Claude plugins directory
cp -r plugins/oh-my-opencode ~/.claude/plugins/

# Or use the Claude CLI (if available)
claude plugin install ./plugins/oh-my-opencode
```

### Using Agents
```
Use @oh-my-opencode:sisyphus for orchestration
Use @oh-my-opencode:oracle for architecture review
Use @oh-my-opencode:librarian for documentation research
```

### Using Commands
Commands are available as slash commands in Claude:
```
/oh-my-opencode:lsp-hover <file> <line> <character>
/oh-my-opencode:ast-grep-search <pattern> [options]
/oh-my-opencode:session-search <query>
```

## 🏗️ Structure

```
oh-my-opencode/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── agents/                  # 7 AI agent definitions
├── commands/                # 26 command definitions
├── skills/                  # Skill definitions
├── hooks/
│   └── hooks.json          # 22 hook configurations
├── .mcp.json               # MCP server configs
└── README.md               # This file
```

## 🔧 Requirements

- Claude Desktop with plugin support
- For LSP tools: Language servers installed (typescript-language-server, pylsp, gopls, rust-analyzer)
- For AST-Grep: @ast-grep/napi or @ast-grep/cli
- For interactive-bash: tmux

## 📝 License

MIT - Same as oh-my-opencode

## 🔗 Links

- [Original oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode)
- [Documentation](https://github.com/code-yeongyu/oh-my-opencode/blob/master/README.md)
