/**
 * Empty Message Sanitizer Hook
 * 
 * Sanitizes empty or whitespace-only messages.
 * Prevents submission of messages with no content.
 */

/**
 * Check if message is empty or whitespace
 */
function isEmptyMessage(parts) {
  if (!parts || !Array.isArray(parts) || parts.length === 0) {
    return true;
  }

  for (const part of parts) {
    if (part.type === 'text' && part.text) {
      const trimmed = part.text.trim();
      if (trimmed.length > 0) {
        return false;
      }
    }
  }

  return true;
}

/**
 * UserPromptSubmit hook handler
 * Blocks empty messages with helpful error
 */
module.exports.UserPromptSubmit = async function UserPromptSubmit({ parts }) {
  if (isEmptyMessage(parts)) {
    // Block empty message
    throw new Error('Cannot submit empty message. Please provide some content.');
  }
};
