# oh-my-opencode Tools Reference

This document describes all 26 tools available in the oh-my-opencode plugin. These tools are accessible as commands in Claude Code.

## LSP Tools (11)

Language Server Protocol integration for code intelligence.

### lsp-hover
Get type information, documentation, and signature for a symbol at a specific position.

**Usage:**
```
/oh-my-opencode:lsp-hover <filePath> <line> <character>
```

**Parameters:**
- `filePath`: Absolute path to file
- `line`: Line number (1-based)
- `character`: Character position (0-based)

**Example:**
```
/oh-my-opencode:lsp-hover /workspace/src/index.ts 10 5
```

### lsp-goto-definition
Jump to symbol definition. Find WHERE something is defined.

**Usage:**
```
/oh-my-opencode:lsp-goto-definition <filePath> <line> <character>
```

### lsp-find-references
Find ALL usages/references of a symbol across the entire workspace.

**Usage:**
```
/oh-my-opencode:lsp-find-references <filePath> <line> <character> [maxReferences]
```

**Parameters:**
- `maxReferences`: Maximum references to return (default: 100)

### lsp-document-symbols
List all symbols (functions, classes, variables) in a document.

**Usage:**
```
/oh-my-opencode:lsp-document-symbols <filePath> [maxSymbols]
```

**Parameters:**
- `maxSymbols`: Maximum symbols to return (default: 500)

### lsp-workspace-symbols
Search for symbols across the entire workspace by query string.

**Usage:**
```
/oh-my-opencode:lsp-workspace-symbols <query> [maxSymbols]
```

**Example:**
```
/oh-my-opencode:lsp-workspace-symbols "createUser"
```

### lsp-diagnostics
Get diagnostics (errors, warnings, hints) for a file.

**Usage:**
```
/oh-my-opencode:lsp-diagnostics <filePath> [severity]
```

**Parameters:**
- `severity`: Filter by severity (Error, Warning, Information, Hint)

### lsp-servers
List all active LSP servers and their status.

**Usage:**
```
/oh-my-opencode:lsp-servers
```

### lsp-prepare-rename
Check if a symbol can be renamed and get preview.

**Usage:**
```
/oh-my-opencode:lsp-prepare-rename <filePath> <line> <character>
```

### lsp-rename
Rename a symbol across the entire workspace.

**Usage:**
```
/oh-my-opencode:lsp-rename <filePath> <line> <character> <newName>
```

**Parameters:**
- `newName`: New name for the symbol

**Example:**
```
/oh-my-opencode:lsp-rename /workspace/src/user.ts 10 5 "getActiveUser"
```

### lsp-code-actions
Get available code actions (quick fixes, refactorings) for a range.

**Usage:**
```
/oh-my-opencode:lsp-code-actions <filePath> <startLine> <startChar> <endLine> <endChar>
```

### lsp-code-action-resolve
Resolve and get full details of a specific code action.

**Usage:**
```
/oh-my-opencode:lsp-code-action-resolve <filePath> <actionIndex>
```

---

## AST-Grep Tools (2)

AST-aware code search and modification using Abstract Syntax Tree pattern matching.

### ast-grep-search
Search for code patterns using AST-based pattern matching.

**Usage:**
```
/oh-my-opencode:ast-grep-search <pattern> [options]
```

**Parameters:**
- `pattern`: AST pattern with meta-variables ($VAR, $$$)
- `lang`: Language (typescript, javascript, python, go, rust, etc.)
- `path`: Directory or file to search
- `strictness`: Matching strictness (ast, smart, cst, relaxed, signature)

**Example:**
```
/oh-my-opencode:ast-grep-search "function $NAME($$$PARAMS) { $$$ }" --lang typescript
```

**Meta-variables:**
- `$VAR`: Single node (expression, statement)
- `$$$`: Multiple nodes (zero or more)

### ast-grep-replace
Replace code patterns using AST-based pattern matching.

**Usage:**
```
/oh-my-opencode:ast-grep-replace <pattern> <replacement> [options]
```

**Parameters:**
- `pattern`: AST pattern to find
- `replacement`: Replacement pattern (can use captured meta-variables)
- `dryRun`: Preview changes without applying (default: true)

**Example:**
```
/oh-my-opencode:ast-grep-replace "console.log($MSG)" "logger.info($MSG)" --lang typescript
```

---

## Session Management (4)

Navigate and search through OpenCode session files.

### session-list
List all available OpenCode sessions.

**Usage:**
```
/oh-my-opencode:session-list [limit]
```

**Parameters:**
- `limit`: Maximum sessions to list (default: 20)

### session-read
Read full content of a specific session.

**Usage:**
```
/oh-my-opencode:session-read <sessionId>
```

### session-search
Search across all sessions for specific content.

**Usage:**
```
/oh-my-opencode:session-search <query> [options]
```

**Parameters:**
- `query`: Search query string
- `maxResults`: Maximum results to return

**Example:**
```
/oh-my-opencode:session-search "authentication bug"
```

### session-info
Get metadata about a specific session.

**Usage:**
```
/oh-my-opencode:session-info <sessionId>
```

---

## Background Tasks (3)

Manage parallel agent execution for improved throughput.

### background-task
Start an agent task in the background.

**Usage:**
```
/oh-my-opencode:background-task <agent> <prompt>
```

**Parameters:**
- `agent`: Agent name (explore, librarian, oracle, etc.)
- `prompt`: Task description for the agent

**Returns:** Task ID for tracking

**Example:**
```
/oh-my-opencode:background-task explore "Find all authentication implementations"
```

### background-output
Get output from a running or completed background task.

**Usage:**
```
/oh-my-opencode:background-output <taskId>
```

**Returns:** Task status and output (if completed)

### background-cancel
Cancel a running background task or all tasks.

**Usage:**
```
/oh-my-opencode:background-cancel <taskId|all>
```

**Examples:**
```
/oh-my-opencode:background-cancel task_123
/oh-my-opencode:background-cancel all
```

---

## Other Tools (6)

### look-at
Analyze media files (PDFs, images, diagrams) with multimodal AI.

**Usage:**
```
/oh-my-opencode:look-at <filePath> <goal>
```

**Parameters:**
- `filePath`: Path to image, PDF, or diagram
- `goal`: What to extract or analyze

**Example:**
```
/oh-my-opencode:look-at /workspace/architecture.pdf "Explain the data flow diagram"
```

### interactive-bash
Manage interactive terminal sessions with tmux.

**Usage:**
```
/oh-my-opencode:interactive-bash <action> [sessionName] [command]
```

**Actions:**
- `list`: List all tmux sessions
- `create`: Create new session
- `send`: Send command to session
- `capture`: Capture session output

### grep
Fast content search across files using ripgrep.

**Usage:**
```
/oh-my-opencode:grep <pattern> [options]
```

**Parameters:**
- `pattern`: Search pattern (regex supported)
- `path`: Directory to search
- `glob`: File pattern filter (*.ts, *.{js,jsx})
- `caseInsensitive`: Ignore case
- `contextLines`: Lines of context

**Example:**
```
/oh-my-opencode:grep "async function" --glob "*.ts" --contextLines 2
```

### glob
Find files by name patterns.

**Usage:**
```
/oh-my-opencode:glob <pattern> [path]
```

**Parameters:**
- `pattern`: Glob pattern (**/*.ts, src/**/*.{js,jsx})
- `path`: Base directory (default: workspace root)

**Example:**
```
/oh-my-opencode:glob "**/*test*.ts"
```

### skill
Execute a registered skill.

**Usage:**
```
/oh-my-opencode:skill <skillName> [arguments]
```

**Example:**
```
/oh-my-opencode:skill playwright "Take screenshot of homepage"
```

### skill-mcp
Execute a skill with embedded MCP server.

**Usage:**
```
/oh-my-opencode:skill-mcp <skillName> [arguments]
```

---

## Tool Categories Summary

| Category | Count | Purpose |
|----------|-------|---------|
| **LSP** | 11 | Code navigation, refactoring, diagnostics |
| **AST-Grep** | 2 | Pattern-based code search and modification |
| **Session** | 4 | OpenCode session file operations |
| **Background** | 3 | Parallel agent task management |
| **Multimodal** | 1 | PDF/image analysis |
| **Terminal** | 1 | Interactive shell management |
| **File Ops** | 2 | Content and pattern searching |
| **Skills** | 2 | Skill execution |

**Total: 26 tools**

---

## Requirements

### LSP Tools
Requires language servers to be installed:
- **TypeScript/JavaScript**: `typescript-language-server`
- **Python**: `pylsp`
- **Go**: `gopls`
- **Rust**: `rust-analyzer`

### AST-Grep
Requires either:
- `@ast-grep/napi` (preferred, faster)
- `@ast-grep/cli` (fallback)

### Interactive Bash
Requires `tmux` to be installed

### Background Tasks
Works out of the box with OpenCode plugin system

---

## Best Practices

### When to Use LSP vs AST-Grep vs Grep

| Use Case | Tool | Why |
|----------|------|-----|
| Find definition of symbol | `lsp-goto-definition` | Semantic understanding |
| Find all references | `lsp-find-references` | Cross-file accuracy |
| Search for code patterns | `ast-grep-search` | Structural matching |
| Search for text/strings | `grep` | Speed, simple patterns |
| Refactor code safely | `lsp-rename` | Respects scope |
| Find files by name | `glob` | Fast, simple |

### Parallel Execution

For exploratory tasks, launch multiple tools simultaneously:

```typescript
// GOOD: Parallel searches
background_task(agent="explore", prompt="Find auth patterns")
background_task(agent="explore", prompt="Find error handlers")
grep("jwt", glob="*.ts")
lsp_workspace_symbols("authenticate")

// Collect results when needed
background_output(task_id)
```

### Error Handling

All tools return structured errors. Check tool output before proceeding:

```typescript
result = lsp_diagnostics("/workspace/src/file.ts", severity="Error")
if "Error:" in result:
    # Handle error condition
```

---

## See Also

- [Agents Documentation](../agents/)
- [Skills Documentation](../skills/)
- [Hooks Documentation](../hooks/)
- [MCP Servers Documentation](../.mcp.json)
