import { Preferences } from "../../qpcommon/MainWindow";
import stanAssistantSystemPrompt from "./stanAssistantSystemPrompt";

const preferences: Preferences = {
  assistantSystemPrompt: stanAssistantSystemPrompt,
  assistantDisplayInfo: "Technical assistant for Stan software that provides guidance, troubleshooting, and explanations based on the official Stan user's guide.",
  suggestedPrompts: [],
};

export default preferences;
