/**
 * Non-Interactive Environment Hook
 * 
 * Adapts behavior for CI/headless environments.
 * Detects non-interactive mode and disables interactive features.
 */

/**
 * Check if running in non-interactive environment
 */
function isNonInteractive() {
  // Check CI environment variable
  if (process.env.CI === 'true' || process.env.CI === '1') {
    return true;
  }

  // Check TERM
  if (process.env.TERM === 'dumb') {
    return true;
  }

  // Check if stdin is not a TTY
  if (!process.stdin.isTTY) {
    return true;
  }

  return false;
}

/**
 * PreToolUse hook handler
 * Modifies tool behavior for non-interactive environments
 */
module.exports.PreToolUse = async function PreToolUse({ tool, args, context }) {
  if (!isNonInteractive()) {
    return; // Interactive mode, no changes needed
  }

  // In non-interactive mode, disable prompts and confirmations
  if (args && typeof args === 'object') {
    // Set auto-confirm flags
    if (args.hasOwnProperty('confirm')) {
      args.confirm = false;
    }
    if (args.hasOwnProperty('interactive')) {
      args.interactive = false;
    }
    if (args.hasOwnProperty('prompt')) {
      args.prompt = false;
    }
  }

  return {
    nonInteractive: true,
    message: '[Non-interactive mode] Confirmations disabled'
  };
};

/**
 * UserPromptSubmit hook handler
 * Adds non-interactive mode notice
 */
module.exports.UserPromptSubmit = async function UserPromptSubmit({ parts, context }) {
  if (!isNonInteractive()) {
    return;
  }

  // Add notice about non-interactive mode (only once per session)
  if (!context || !context._nonInteractiveNoticeShown) {
    if (parts) {
      parts.push({
        type: 'text',
        text: '\n\n[System] Running in non-interactive mode (CI detected). Interactive prompts are disabled.'
      });
    }
    
    if (context) {
      context._nonInteractiveNoticeShown = true;
    }
  }
};
