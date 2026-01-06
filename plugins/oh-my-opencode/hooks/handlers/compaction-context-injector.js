/**
 * Compaction Context Injector Hook
 * 
 * Preserves critical context during message compaction/summarization.
 * Injects structured prompt to guide summarization.
 */

const SUMMARIZE_CONTEXT_PROMPT = `[COMPACTION CONTEXT INJECTION]

When summarizing this session, you MUST include the following sections in your summary:

## 1. User Requests (As-Is)
- List all original user requests exactly as they were stated
- Preserve the user's exact wording and intent

## 2. Final Goal
- What the user ultimately wanted to achieve
- The end result or deliverable expected

## 3. Work Completed
- What has been done so far
- Files created/modified
- Features implemented
- Problems solved

## 4. Remaining Tasks
- What still needs to be done
- Pending items from the original request
- Follow-up tasks identified during the work

## 5. MUST NOT Do (Critical Constraints)
- Things that were explicitly forbidden
- Approaches that failed and should not be retried
- User's explicit restrictions or preferences
- Anti-patterns identified during the session

This context is critical for maintaining continuity after compaction.
`;

/**
 * PreCompact hook handler
 * Injects context preservation prompt before compaction
 */
module.exports.PreCompact = async function PreCompact({ sessionID, context }) {
  // In a real implementation, this would inject the message
  // into the session context before compaction happens
  
  // For now, we log that we would inject this
  if (context && Array.isArray(context)) {
    context.push(SUMMARIZE_CONTEXT_PROMPT);
  }
  
  return {
    contextInjected: true,
    prompt: SUMMARIZE_CONTEXT_PROMPT
  };
};
