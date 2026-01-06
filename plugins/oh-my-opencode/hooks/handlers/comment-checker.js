/**
 * Comment Checker Hook
 * 
 * Prevents excessive AI-generated comments in code.
 * Analyzes code changes and blocks if too many comments are added.
 */

/**
 * Count comment lines in code
 */
function countComments(code) {
  if (!code) return 0;
  
  let count = 0;
  const lines = code.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Single-line comments
    if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('*')) {
      count++;
    }
    // JSDoc/docstring starts
    if (trimmed.startsWith('/**') || trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
      count++;
    }
  }
  
  return count;
}

/**
 * Detect if code has excessive comments (>30% of lines)
 */
function hasExcessiveComments(code) {
  if (!code) return false;
  
  const lines = code.split('\n');
  const totalLines = lines.filter(line => line.trim().length > 0).length;
  const commentLines = countComments(code);
  
  if (totalLines === 0) return false;
  
  const commentRatio = commentLines / totalLines;
  return commentRatio > 0.3; // More than 30% comments
}

/**
 * PostToolUse hook handler
 * Checks for excessive comments after edit/write operations
 */
module.exports.PostToolUse = async function PostToolUse({ tool, args, result }) {
  const toolName = (tool || '').toLowerCase();
  
  // Only check on write and edit tools
  if (toolName !== 'write' && toolName !== 'edit') {
    return;
  }

  // Get the code content
  let code = null;
  if (args?.file_text) {
    code = args.file_text;
  } else if (args?.new_str) {
    code = args.new_str;
  }

  if (!code) {
    return;
  }

  // Check for excessive comments
  if (hasExcessiveComments(code)) {
    // Add warning to result
    if (result) {
      const originalOutput = result.output || '';
      result.output = originalOutput + 
        '\n\n[Warning] Code contains excessive comments (>30% of lines). Consider reducing comments and letting the code be self-documenting.';
      
      if (!result.metadata) {
        result.metadata = {};
      }
      result.metadata.commentWarning = true;
    }
  }
};
