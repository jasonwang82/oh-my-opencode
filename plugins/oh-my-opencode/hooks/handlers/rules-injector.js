/**
 * Rules Injector Hook
 * 
 * Conditionally injects rules from .claude/rules/ directory
 * based on file patterns and conditions.
 */

const fs = require('fs');
const path = require('path');

// Cache of injected rules per session
const sessionRulesCache = new Map();

/**
 * Find rules files in .claude/rules directory
 */
function findRulesFiles(workspaceRoot) {
  const rulesDir = path.join(workspaceRoot, '.claude', 'rules');
  
  if (!fs.existsSync(rulesDir)) {
    return [];
  }

  try {
    const files = fs.readdirSync(rulesDir);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(rulesDir, file));
  } catch (error) {
    return [];
  }
}

/**
 * Check if rule should be applied based on context
 */
function shouldApplyRule(rulePath, context) {
  const fileName = path.basename(rulePath, '.md');
  
  // Example rule matching logic:
  // - typescript-strict.md -> apply if working with .ts files
  // - python-style.md -> apply if working with .py files
  // - security-checks.md -> always apply
  
  if (fileName.includes('typescript') || fileName.includes('ts')) {
    return context.fileExtensions?.includes('.ts') || 
           context.fileExtensions?.includes('.tsx');
  }
  
  if (fileName.includes('python') || fileName.includes('py')) {
    return context.fileExtensions?.includes('.py');
  }
  
  if (fileName.includes('security')) {
    return true; // Always apply security rules
  }
  
  // Default: apply all other rules
  return true;
}

/**
 * UserPromptSubmit hook handler
 * Injects applicable rules from .claude/rules/
 */
module.exports.UserPromptSubmit = async function UserPromptSubmit({ sessionID, parts, context }) {
  const workspaceRoot = context?.workspaceRoot || process.cwd();
  
  // Get or create cache for this session
  if (!sessionRulesCache.has(sessionID)) {
    sessionRulesCache.set(sessionID, new Set());
  }
  const cache = sessionRulesCache.get(sessionID);
  
  // Find all rule files
  const rulesFiles = findRulesFiles(workspaceRoot);
  
  if (rulesFiles.length === 0) {
    return;
  }

  // Inject applicable rules that haven't been injected yet
  let injectedCount = 0;
  for (const rulePath of rulesFiles) {
    if (cache.has(rulePath)) {
      continue; // Already injected
    }
    
    if (!shouldApplyRule(rulePath, context || {})) {
      continue; // Not applicable
    }

    try {
      const content = fs.readFileSync(rulePath, 'utf-8');
      const ruleName = path.basename(rulePath);
      
      // Truncate if too long
      const maxLength = 5000;
      let ruleContent = content;
      if (content.length > maxLength) {
        ruleContent = content.substring(0, maxLength) + 
          `\n\n[Note: Rule truncated. Full version at: ${rulePath}]`;
      }
      
      if (parts) {
        parts.push({
          type: 'text',
          text: `\n\n[Rule: ${ruleName}]\n${ruleContent}`
        });
      }
      
      cache.add(rulePath);
      injectedCount++;
    } catch (error) {
      // Silently ignore errors
    }
  }
  
  if (injectedCount > 0) {
    // Log or notify about injected rules
    // console.log(`Injected ${injectedCount} rule(s) for session ${sessionID}`);
  }
};

/**
 * SessionEnd hook handler
 */
module.exports.SessionEnd = async function SessionEnd({ sessionID }) {
  sessionRulesCache.delete(sessionID);
};
