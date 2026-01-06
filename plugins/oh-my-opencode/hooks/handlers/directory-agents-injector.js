/**
 * Directory Agents Injector Hook
 * 
 * Auto-injects AGENTS.md files from current directory hierarchy.
 * Finds AGENTS.md files up the directory tree and injects them once per session.
 */

const fs = require('fs');
const path = require('path');

// Storage for injected paths per session
const sessionCaches = new Map();
const pendingBatchReads = new Map();

/**
 * Get or create session cache
 */
function getSessionCache(sessionID) {
  if (!sessionCaches.has(sessionID)) {
    sessionCaches.set(sessionID, new Set());
  }
  return sessionCaches.get(sessionID);
}

/**
 * Find AGENTS.md files up the directory tree
 * @param {string} startDir - Starting directory
 * @param {string} workspaceRoot - Workspace root directory
 * @returns {string[]} Array of AGENTS.md file paths
 */
function findAgentsMdUp(startDir, workspaceRoot) {
  const found = [];
  let current = startDir;
  const AGENTS_FILENAME = 'AGENTS.md';

  while (true) {
    // Skip root AGENTS.md - it's already loaded by the system
    const isRootDir = current === workspaceRoot;
    if (!isRootDir) {
      const agentsPath = path.join(current, AGENTS_FILENAME);
      if (fs.existsSync(agentsPath)) {
        found.push(agentsPath);
      }
    }

    if (isRootDir) break;
    const parent = path.dirname(current);
    if (parent === current) break;
    if (!parent.startsWith(workspaceRoot)) break;
    current = parent;
  }

  return found.reverse();
}

/**
 * Process file path and inject AGENTS.md if found
 */
async function processFilePathForInjection(filePath, sessionID, output, workspaceRoot) {
  if (!filePath || !path.isAbsolute(filePath)) {
    return;
  }

  const dir = path.dirname(filePath);
  const cache = getSessionCache(sessionID);
  const agentsPaths = findAgentsMdUp(dir, workspaceRoot);

  for (const agentsPath of agentsPaths) {
    const agentsDir = path.dirname(agentsPath);
    if (cache.has(agentsDir)) continue;

    try {
      const content = fs.readFileSync(agentsPath, 'utf-8');
      
      // Truncate if too long (max 10000 chars)
      const maxLength = 10000;
      let result = content;
      let truncated = false;
      
      if (content.length > maxLength) {
        result = content.substring(0, maxLength);
        truncated = true;
      }
      
      const truncationNotice = truncated
        ? `\n\n[Note: Content was truncated to save context window space. For full context, please read the file directly: ${agentsPath}]`
        : '';
        
      output.output += `\n\n[Directory Context: ${agentsPath}]\n${result}${truncationNotice}`;
      cache.add(agentsDir);
    } catch (error) {
      // Silently ignore errors
    }
  }
}

/**
 * PostToolUse hook handler
 * Injects AGENTS.md after reading files
 */
module.exports.PostToolUse = async function PostToolUse({ tool, sessionID, callID, args, result, context }) {
  const toolName = (tool || '').toLowerCase();
  const workspaceRoot = context?.workspaceRoot || process.cwd();

  // Handle read tool
  if (toolName === 'read' && result?.title) {
    const output = { output: result.output || '' };
    await processFilePathForInjection(result.title, sessionID, output, workspaceRoot);
    result.output = output.output;
    return;
  }

  // Handle batch tool with read calls
  if (toolName === 'batch') {
    const filePaths = pendingBatchReads.get(callID);
    if (filePaths) {
      const output = { output: result?.output || '' };
      for (const filePath of filePaths) {
        await processFilePathForInjection(filePath, sessionID, output, workspaceRoot);
      }
      if (result) {
        result.output = output.output;
      }
      pendingBatchReads.delete(callID);
    }
  }
};

/**
 * PreToolUse hook handler
 * Tracks batch tool calls that contain read operations
 */
module.exports.PreToolUse = async function PreToolUse({ tool, sessionID, callID, args }) {
  const toolName = (tool || '').toLowerCase();
  
  if (toolName === 'batch' && args?.tool_calls) {
    const readFilePaths = [];
    for (const call of args.tool_calls) {
      if (call.tool?.toLowerCase() === 'read' && call.parameters?.filePath) {
        readFilePaths.push(call.parameters.filePath);
      }
    }
    
    if (readFilePaths.length > 0) {
      pendingBatchReads.set(callID, readFilePaths);
    }
  }
};

/**
 * SessionEnd hook handler
 * Cleanup session cache
 */
module.exports.SessionEnd = async function SessionEnd({ sessionID }) {
  sessionCaches.delete(sessionID);
  
  // Clean up any pending batch reads for this session
  for (const [callID, _] of pendingBatchReads.entries()) {
    if (callID.startsWith(sessionID)) {
      pendingBatchReads.delete(callID);
    }
  }
};
