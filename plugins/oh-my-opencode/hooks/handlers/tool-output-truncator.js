/**
 * Tool Output Truncator Hook
 * 
 * Truncates excessively long tool outputs to save context window space.
 * Preserves first and last portions with truncation notice.
 */

// Truncation thresholds per tool
const TOOL_THRESHOLDS = {
  grep: 10000,
  bash: 50000,
  read: 100000,
  glob: 5000,
  view: 50000,
  default: 20000
};

/**
 * Truncate content intelligently
 * @param {string} content - Content to truncate
 * @param {number} maxLength - Maximum length
 * @returns {Object} {result: string, truncated: boolean}
 */
function truncateContent(content, maxLength) {
  if (!content || content.length <= maxLength) {
    return { result: content, truncated: false };
  }

  // Keep first 60% and last 20%
  const firstPart = Math.floor(maxLength * 0.6);
  const lastPart = Math.floor(maxLength * 0.2);
  
  const truncatedLength = content.length - maxLength;
  const result = 
    content.substring(0, firstPart) +
    `\n\n[... ${truncatedLength} characters truncated for context efficiency ...]\n\n` +
    content.substring(content.length - lastPart);

  return { result, truncated: true };
}

/**
 * PostToolUse hook handler
 * Truncates tool outputs if they exceed thresholds
 */
module.exports.PostToolUse = async function PostToolUse({ tool, sessionID, result }) {
  if (!result || !result.output) {
    return;
  }

  const toolName = (tool || '').toLowerCase();
  const threshold = TOOL_THRESHOLDS[toolName] || TOOL_THRESHOLDS.default;
  
  const { result: truncatedOutput, truncated } = truncateContent(result.output, threshold);
  
  if (truncated) {
    result.output = truncatedOutput;
    
    // Add metadata about truncation
    if (!result.metadata) {
      result.metadata = {};
    }
    result.metadata.truncated = true;
    result.metadata.originalLength = result.output.length + (truncatedOutput.length - threshold);
  }
};
