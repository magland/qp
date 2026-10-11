// Per-assistant model settings. Assistants not listed here use the global
// default model and send no reasoning setting.

export type ReasoningEffort = "low" | "medium" | "high";

export const ASSISTANT_DEFAULT_MODELS: Record<string, string> = {
  "neurosift-chat": "openai/gpt-6-luna",
};

export const ASSISTANT_REASONING_EFFORT: Record<string, ReasoningEffort> = {
  "neurosift-chat": "medium",
};
