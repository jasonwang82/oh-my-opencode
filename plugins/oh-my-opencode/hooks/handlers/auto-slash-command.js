/**
 * Auto Slash Command Hook
 * 
 * Detects and executes slash command patterns automatically.
 * Converts /command patterns into command templates.
 */

// Track processed commands to avoid duplicates
const sessionProcessedCommands = new Set();

// Tags for marking processed commands
const AUTO_SLASH_COMMAND_TAG_OPEN = '[AUTO-SLASH-COMMAND-START]';
const AUTO_SLASH_COMMAND_TAG_CLOSE = '[AUTO-SLASH-COMMAND-END]';

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
 * Detect slash command in text
 * Returns {command, args, raw} or null
 */
function detectSlashCommand(text) {
  // Match /command or /command args
  const match = text.match(/^\/([a-z0-9-]+)(?:\s+(.*))?$/im);
  
  if (!match) {
    return null;
  }

  return {
    command: match[1],
    args: match[2] || '',
    raw: match[0]
  };
}

/**
 * UserPromptSubmit hook handler
 * Detects and processes slash commands
 */
module.exports.UserPromptSubmit = async function UserPromptSubmit({ sessionID, messageID, parts }) {
  const promptText = extractPromptText(parts);

  // Skip if already processed
  if (promptText.includes(AUTO_SLASH_COMMAND_TAG_OPEN) ||
      promptText.includes(AUTO_SLASH_COMMAND_TAG_CLOSE)) {
    return;
  }

  const parsed = detectSlashCommand(promptText);

  if (!parsed) {
    return;
  }

  // Avoid duplicate processing
  const commandKey = `${sessionID}:${messageID}:${parsed.command}`;
  if (sessionProcessedCommands.has(commandKey)) {
    return;
  }
  sessionProcessedCommands.add(commandKey);

  // Find text part to modify
  const idx = parts.findIndex(p => p.type === 'text' && p.text);
  if (idx < 0) {
    return;
  }

  // Note: In a real implementation, this would look up the command
  // and execute it. For now, we just mark it as detected.
  const message = `${AUTO_SLASH_COMMAND_TAG_OPEN}\n[Slash Command Detected]\nCommand: /${parsed.command}\nArgs: ${parsed.args || '(none)'}\n\nNote: Slash command execution requires command registry integration.\n${AUTO_SLASH_COMMAND_TAG_CLOSE}`;
  
  parts[idx].text = message;
};

/**
 * SessionEnd hook handler
 */
module.exports.SessionEnd = async function SessionEnd({ sessionID }) {
  // Clean up processed commands for this session
  for (const key of sessionProcessedCommands) {
    if (key.startsWith(`${sessionID}:`)) {
      sessionProcessedCommands.delete(key);
    }
  }
};
