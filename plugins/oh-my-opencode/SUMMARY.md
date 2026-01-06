# oh-my-opencode Plugin Extraction Summary

This directory contains the complete oh-my-opencode toolkit extracted as a Claude Code compatible plugin.

## Directory Structure

```
oh-my-opencode/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── agents/                      # 6 AI agent definitions
│   ├── oracle.md
│   ├── librarian.md
│   ├── explore.md
│   ├── frontend-ui-ux-engineer.md
│   ├── document-writer.md
│   └── multimodal-looker.md
├── commands/                    # (To be implemented - See TOOLS.md)
├── skills/                      # Skill definitions
│   └── playwright/
│       └── SKILL.md
├── hooks/
│   └── hooks.json              # Hook configurations
├── .mcp.json                   # MCP server configs (context7, grep_app)
├── README.md                   # Plugin overview
├── INSTALL.md                  # Installation and usage guide
├── TOOLS.md                    # Complete tools reference (26 tools)
├── HOOKS.md                    # Complete hooks reference (22 hooks)
└── SUMMARY.md                  # This file
```

## Extraction Completion Status

### ✅ Completed

1. **Plugin Structure** (100%)
   - ✅ `.claude-plugin/plugin.json` manifest
   - ✅ Directory structure created
   - ✅ README with comprehensive overview

2. **Agents** (85% - 6/7)
   - ✅ oracle.md (GPT 5.2)
   - ✅ librarian.md (Claude Sonnet 4.5)
   - ✅ explore.md (Grok Code)
   - ✅ frontend-ui-ux-engineer.md (Gemini 3 Pro)
   - ✅ document-writer.md (Gemini 3 Flash)
   - ✅ multimodal-looker.md (Gemini 3 Flash)
   - ⚠️ sisyphus.md (Primary orchestrator - simplified version recommended)

3. **Tools Documentation** (100%)
   - ✅ TOOLS.md with all 26 tools documented
   - LSP tools (11): hover, goto-definition, find-references, document-symbols, workspace-symbols, diagnostics, servers, prepare-rename, rename, code-actions, code-action-resolve
   - AST-Grep tools (2): search, replace
   - Session management (4): list, read, search, info
   - Background tasks (3): task, output, cancel
   - Other tools (6): look-at, interactive-bash, grep, glob, skill, skill-mcp

4. **Hooks Documentation** (100%)
   - ✅ HOOKS.md with all 22 hooks documented
   - ✅ hooks.json configuration template
   - Context management (5)
   - Error recovery (4)
   - Output control (4)
   - Workflow (7)
   - Notifications (2)
   - Environment (2)

5. **MCP Servers** (100%)
   - ✅ .mcp.json with context7 and grep_app configurations

6. **Skills** (100%)
   - ✅ playwright skill with SKILL.md

7. **Documentation** (100%)
   - ✅ INSTALL.md - Complete installation and usage guide
   - ✅ README.md - Plugin overview
   - ✅ TOOLS.md - Tools reference
   - ✅ HOOKS.md - Hooks reference
   - ✅ SUMMARY.md - This summary

### 📝 Notes

#### Sisyphus Agent
The Sisyphus agent (primary orchestrator) is 504 lines in the original source. For the plugin format, it's recommended to either:
1. Create a simplified version focusing on key orchestration patterns
2. Break it into multiple focused sub-agents
3. Extract core principles into agent guidelines

The current extraction includes 6 operational specialist agents which cover most use cases.

#### Command Files
Individual command files are not created. Instead, TOOLS.md provides comprehensive documentation for all 26 tools. In Claude Code plugin format, commands can be:
1. Used via the main plugin (oh-my-opencode npm package)
2. Invoked through slash commands
3. Accessed programmatically

The documentation approach was chosen because:
- Commands are tightly integrated with the oh-my-opencode npm package
- Creating 26 separate command files would duplicate implementation
- TOOLS.md provides better discoverability and cross-referencing

## Installation

### Quick Install

```bash
# Copy plugin to Claude plugins directory
mkdir -p ~/.claude/plugins
cp -r plugins/oh-my-opencode ~/.claude/plugins/

# Restart Claude Desktop
```

### Verify Installation

```bash
ls ~/.claude/plugins/oh-my-opencode/
# Should see: README.md, .claude-plugin/, agents/, hooks/, skills/, etc.
```

## Usage Quick Reference

### Agents
```
@oh-my-opencode:oracle Review this architecture
@oh-my-opencode:librarian How does React Query work?
@oh-my-opencode:explore Find authentication code
@oh-my-opencode:frontend-ui-ux-engineer Create login page
@oh-my-opencode:document-writer Update README
@oh-my-opencode:multimodal-looker Analyze this diagram
```

### Commands (via main plugin)
```
/oh-my-opencode:lsp-hover <file> <line> <char>
/oh-my-opencode:ast-grep-search <pattern>
/oh-my-opencode:session-search <query>
/oh-my-opencode:background-task <agent> <prompt>
```

### Skills
```
/oh-my-opencode:skill playwright "Screenshot example.com"
```

## Component Summary

| Component | Count | Status |
|-----------|-------|--------|
| Agents | 6 | ✅ Extracted (7th optional) |
| Tools | 26 | ✅ Documented |
| Hooks | 22 | ✅ Documented |
| MCP Servers | 2 | ✅ Configured |
| Skills | 1 | ✅ Extracted |

## Key Features Preserved

1. **Multi-Model Orchestration**
   - 6 specialist agents covering different domains
   - Automatic model selection and fallback
   - Parallel execution support

2. **Code Intelligence**
   - 11 LSP tools for semantic code operations
   - AST-aware search and replace
   - Cross-file refactoring support

3. **Session Management**
   - Full session history navigation
   - Content search across sessions
   - Session metadata tracking

4. **Lifecycle Hooks**
   - 22 hooks for customization
   - Context injection
   - Error recovery
   - Output control

5. **MCP Integration**
   - Context7 for documentation
   - Grep.app for GitHub search
   - Extensible server configuration

## Design Decisions

### 1. Documentation-First Approach
Rather than creating 26 individual command files, we created comprehensive documentation (TOOLS.md, HOOKS.md) that:
- Provides better discoverability
- Enables cross-referencing
- Maintains consistency
- Easier to maintain

### 2. Agent Extraction
Extracted agents as standalone markdown files with frontmatter metadata:
- Preserves original prompts
- Adds Claude Code compatible metadata
- Enables plugin loader to register them

### 3. Hooks as Configuration
Hooks are documented rather than implemented as separate files because:
- Hooks are tightly integrated with oh-my-opencode core
- Configuration allows enabling/disabling
- Documentation provides understanding of behavior

### 4. Skills with Embedded MCP
The playwright skill demonstrates the skill-MCP pattern:
- MCP configuration in YAML frontmatter
- Self-contained with dependencies
- Easy to distribute and reuse

## Next Steps (Optional Enhancements)

### 1. Sisyphus Agent
Create simplified Sisyphus agent focusing on:
- Core orchestration principles
- Delegation patterns
- Verification requirements

### 2. Additional Skills
Extract builtin skills from oh-my-opencode:
- init-deep (hierarchical AGENTS.md)
- ralph-loop (self-referential development)
- refactor (intelligent refactoring)

### 3. Command Wrappers
Create thin command wrappers that:
- Invoke oh-my-opencode npm package
- Provide plugin-compatible interface
- Enable standalone usage

### 4. Hook Implementations
Implement hooks as plugin-compatible JS modules:
- PreToolUse validators
- PostToolUse enhancers
- Context injectors

## Compatibility

### Claude Code Plugin Loader
This plugin structure is compatible with the Claude Code plugin loader:
- Manifest in `.claude-plugin/plugin.json`
- Agents as markdown files with frontmatter
- Skills with SKILL.md and MCP config
- Hooks in hooks.json
- MCP servers in .mcp.json

### Original oh-my-opencode
This plugin can coexist with the original oh-my-opencode npm package:
- Agents provide additional entry points
- Tools are documented (not duplicated)
- Hooks are configuration-based
- MCP servers are references (not embedded)

## References

- **Source**: https://github.com/code-yeongyu/oh-my-opencode
- **Documentation**: https://github.com/code-yeongyu/oh-my-opencode/blob/master/README.md
- **License**: MIT

## Maintenance

To keep this plugin updated with oh-my-opencode changes:

1. **Agent Updates**: Sync agent prompts from `src/agents/*.ts`
2. **Tool Changes**: Update TOOLS.md when tools are added/changed
3. **Hook Changes**: Update HOOKS.md and hooks.json
4. **Version Sync**: Update `.claude-plugin/plugin.json` version

## Credits

Extracted from [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) by code-yeongyu and contributors.

Plugin structure created following Claude Code plugin format conventions.

---

**Last Updated**: 2026-01-06
**oh-my-opencode Version**: 2.13.2
**Plugin Version**: 1.0.0 (initial extraction)
