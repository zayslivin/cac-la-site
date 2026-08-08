---
name: compact
description: Use when the user says "COMPACT" (or asks to compact/summarize the conversation so far for continuing in a new chat). Produces a portable summary of the current session.
---

# Compact

When triggered, summarize the entire conversation so far into **5–7 bullet
points** covering:

- What was decided (scope, approach, any explicit user preferences/rejections)
- Key files touched or referenced, with paths (and line numbers if relevant)
- Any code/config snippets that matter for resuming the work
- Open next steps or unresolved questions

Format the output as plain markdown meant to be copy-pasted as the **first
message of a brand-new chat** — write it so a fresh session with no memory of
this conversation can pick up exactly where it left off. Do not include
narration about the summarization process itself, just the summary.
