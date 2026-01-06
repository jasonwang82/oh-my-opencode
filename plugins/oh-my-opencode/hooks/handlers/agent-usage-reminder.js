/**
 * Agent Usage Reminder Hook
 * 
 * Reminds to use specialized agents for appropriate tasks.
 * Analyzes user prompts and suggests relevant agents.
 */

// Agent suggestions based on keywords
const AGENT_PATTERNS = [
  {
    keywords: ['ui', 'frontend', 'css', 'style', 'layout', 'design', 'animation'],
    agent: 'frontend-ui-ux-engineer',
    description: 'UI/UX changes'
  },
  {
    keywords: ['document', 'readme', 'api doc', 'guide', 'documentation', 'write doc'],
    agent: 'document-writer',
    description: 'Documentation'
  },
  {
    keywords: ['research', 'how does', 'library', 'github', 'open source', 'npm package'],
    agent: 'librarian',
    description: 'Library research'
  },
  {
    keywords: ['find', 'where is', 'search for', 'locate', 'which file'],
    agent: 'explore',
    description: 'Code search'
  },
  {
    keywords: ['architecture', 'design decision', 'review', 'best practice', 'tradeoff'],
    agent: 'oracle',
    description: 'Architecture advice'
  },
  {
    keywords: ['pdf', 'image', 'screenshot', 'diagram', 'picture'],
    agent: 'multimodal-looker',
    description: 'Visual analysis'
  }
];

// Track suggestions per session to avoid spam
const sessionSuggestions = new Map();

/**
 * Extract text from message parts
 */
function extractPromptText(parts) {
  if (!parts || !Array.isArray(parts)) return '';
  
  return parts
    .filter(part => part.type === 'text' && part.text)
    .map(part => part.text)
    .join(' ')
    .toLowerCase();
}

/**
 * Detect which agent might be useful
 */
function detectSuggestedAgent(promptText) {
  for (const pattern of AGENT_PATTERNS) {
    for (const keyword of pattern.keywords) {
      if (promptText.includes(keyword)) {
        return {
          agent: pattern.agent,
          description: pattern.description,
          keyword
        };
      }
    }
  }
  return null;
}

/**
 * UserPromptSubmit hook handler
 * Suggests agents based on user prompt content
 */
module.exports.UserPromptSubmit = async function UserPromptSubmit({ sessionID, message, parts }) {
  // Skip if already using an agent
  if (message?.agent && message.agent !== 'general') {
    return;
  }

  const promptText = extractPromptText(parts);
  const suggestion = detectSuggestedAgent(promptText);
  
  if (!suggestion) {
    return;
  }

  // Track suggestions to avoid repetition
  const sessionKey = `${sessionID}:${suggestion.agent}`;
  const lastSuggestion = sessionSuggestions.get(sessionKey);
  const now = Date.now();
  
  // Only suggest once per 10 minutes per agent
  if (lastSuggestion && (now - lastSuggestion < 600000)) {
    return;
  }
  
  sessionSuggestions.set(sessionKey, now);

  // Add suggestion message
  if (!parts) {
    return;
  }
  
  parts.push({
    type: 'text',
    text: `\n\n[Agent Suggestion] This task involves ${suggestion.description}. Consider using @oh-my-opencode:${suggestion.agent} for better results.`
  });
};

/**
 * SessionEnd hook handler
 * Clean up session suggestions
 */
module.exports.SessionEnd = async function SessionEnd({ sessionID }) {
  // Clean up all suggestions for this session
  for (const [key, _] of sessionSuggestions.entries()) {
    if (key.startsWith(`${sessionID}:`)) {
      sessionSuggestions.delete(key);
    }
  }
};
