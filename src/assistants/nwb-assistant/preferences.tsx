import { Preferences } from "../../qpcommon/MainWindow";
import nwbAssistantSystemPrompt from "./nwbAssistantSystemPrompt";

// eslint-disable-next-line react-refresh/only-export-components
const AssistantDisplayInfo = () => (
  <div style={{ maxWidth: "600px", margin: "0 auto" }}>
    This is a technical assistant for Neurodata Without Borders (NWB) that provides guidance, troubleshooting, and explanations for NWB, PyNWB, and related tools based on official documentation.
  </div>
);

const preferences: Preferences = {
  assistantSystemPrompt: nwbAssistantSystemPrompt,
  assistantDisplayInfo: <AssistantDisplayInfo />,
  suggestedPrompts: [],
};

export default preferences;
