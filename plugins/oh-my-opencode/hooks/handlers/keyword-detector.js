/**
 * Keyword Detector Hook
 * 
 * Detects special keywords and triggers appropriate behaviors.
 * - "ultrawork": Enhanced work mode
 * - "search <topic>": Parallel search agents
 */

// Detected keywords tracking
const sessionKeywords = new Map();

/**
 * Extract text from message parts
 */
function extractPromptText(parts) {
  if (!parts || !Array.isArray(parts)) return '';
  
  return parts
    .filter(part => part.type === 'text' && part.text)
    .map(part => part.text)
    .join(' ');
}

/**
 * Remove code blocks from text
 */
function removeCodeBlocks(text) {
  return text.replace(/```[\s\S]*?```/g, '');
}

/**
 * Detect keywords in prompt
 */
function detectKeywords(promptText) {
  const text = removeCodeBlocks(promptText).toLowerCase();
  const detected = [];

  // Check for ultrawork
  if (text.includes('ultrawork')) {
    detected.push({ type: 'ultrawork', value: 'ultrawork' });
  }

  // Check for search pattern
  const searchMatch = text.match(/\bsearch\s+(.+?)(?:\n|$)/i);
  if (searchMatch) {
    detected.push({ type: 'search', value: searchMatch[1].trim() });
  }

  return detected;
}

/**
 * UserPromptSubmit hook handler
 * Detects and processes keywords
 */
module.exports.UserPromptSubmit = async function UserPromptSubmit({ sessionID, agent, message, parts }) {
  const promptText = extractPromptText(parts);
  const keywords = detectKeywords(promptText);

  if (keywords.length === 0) {
    return;
  }

  // Track keywords for this session
  if (!sessionKeywords.has(sessionID)) {
    sessionKeywords.set(sessionID, []);
  }
  sessionKeywords.get(sessionID).push(...keywords);

  // Process ultrawork
  const hasUltrawork = keywords.some(k => k.type === 'ultrawork');
  if (hasUltrawork && message) {
    // Set to maximum variant
    message.variant = 'max';
    
    // Add notification
    if (parts) {
      parts.push({
        type: 'text',
        text: '\n\n[Ultrawork Mode Activated] Maximum precision engaged. All agents at your disposal.'
      });
    }
  }

  // Process search
  const searchKeywords = keywords.filter(k => k.type === 'search');
  if (searchKeywords.length > 0 && parts) {
    const searchTopics = searchKeywords.map(k => k.value).join(', ');
    parts.push({
      type: 'text',
      text: `\n\n[Search Mode] Consider using @oh-my-opencode:explore and @oh-my-opencode:librarian in parallel for: ${searchTopics}`
    });
  }
};

/**
 * SessionEnd hook handler
 */
module.exports.SessionEnd = async function SessionEnd({ sessionID }) {
  sessionKeywords.delete(sessionID);
};
