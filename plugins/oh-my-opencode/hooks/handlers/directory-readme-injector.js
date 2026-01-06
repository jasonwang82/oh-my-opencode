/**
 * Directory README Injector Hook
 * 
 * Auto-injects README.md files from current directory hierarchy.
 * Finds README.md files up the directory tree and injects them once per session.
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
 * Find README.md files up the directory tree
 * @param {string} startDir - Starting directory
 * @param {string} workspaceRoot - Workspace root directory
 * @returns {string[]} Array of README.md file paths
 */
function findReadmeMdUp(startDir, workspaceRoot) {
  const found = [];
  let current = startDir;
  const README_FILENAME = 'README.md';

  while (true) {
    const readmePath = path.join(current, README_FILENAME);
    if (fs.existsSync(readmePath)) {
      found.push(readmePath);
    }

    if (current === workspaceRoot) break;
    const parent = path.dirname(current);
    if (parent === current) break;
    if (!parent.startsWith(workspaceRoot)) break;
    current = parent;
  }

  return found.reverse();
}

/**
 * Process file path and inject README.md if found
 */
async function processFilePathForInjection(filePath, sessionID, output, workspaceRoot) {
  if (!filePath || !path.isAbsolute(filePath)) {
    return;
  }

  const dir = path.dirname(filePath);
  const cache = getSessionCache(sessionID);
  const readmePaths = findReadmeMdUp(dir, workspaceRoot);

  for (const readmePath of readmePaths) {
    const readmeDir = path.dirname(readmePath);
    if (cache.has(readmeDir)) continue;

    try {
      const content = fs.readFileSync(readmePath, 'utf-8');
      
      // Truncate if too long (max 15000 chars for README)
      const maxLength = 15000;
      let result = content;
      let truncated = false;
      
      if (content.length > maxLength) {
        result = content.substring(0, maxLength);
        truncated = true;
      }
      
      const truncationNotice = truncated
        ? `\n\n[Note: Content was truncated to save context window space. For full context, please read the file directly: ${readmePath}]`
        : '';
        
      output.output += `\n\n[Project README: ${readmePath}]\n${result}${truncationNotice}`;
      cache.add(readmeDir);
    } catch (error) {
      // Silently ignore errors
    }
  }
}

/**
 * PostToolUse hook handler
 */
module.exports.PostToolUse = async function PostToolUse({ tool, sessionID, callID, result, context }) {
  const toolName = (tool || '').toLowerCase();
  const workspaceRoot = context?.workspaceRoot || process.cwd();

  if (toolName === 'read' && result?.title) {
    const output = { output: result.output || '' };
    await processFilePathForInjection(result.title, sessionID, output, workspaceRoot);
    result.output = output.output;
    return;
  }

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
 */
module.exports.SessionEnd = async function SessionEnd({ sessionID }) {
  sessionCaches.delete(sessionID);
  
  for (const [callID, _] of pendingBatchReads.entries()) {
    if (callID.startsWith(sessionID)) {
      pendingBatchReads.delete(callID);
    }
  }
};
