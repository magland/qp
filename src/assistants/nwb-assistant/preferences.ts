import { Preferences } from "../../qpcommon/MainWindow";
import nwbAssistantSystemPrompt from "./nwbAssistantSystemPrompt";

const preferences: Preferences = {
  assistantSystemPrompt: nwbAssistantSystemPrompt,
  assistantDisplayInfo: "Technical assistant for Neurodata Without Borders (NWB) that provides guidance, troubleshooting, and explanations for NWB, pynwb, and related tools based on official documentation.",
  suggestedPrompts: [],
};

export default preferences;
