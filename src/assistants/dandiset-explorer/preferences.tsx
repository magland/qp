import { Preferences } from "../../qpcommon/MainWindow";
import getDandisetExplorerSystemPrompt, {
  dandisetId,
} from "./dandisetExplorerSystemPrompt";

const suggestedPrompts: string[] = ["Tell me about this Dandiset."];

const AssistantDisplayInfo = () => (
  <div style={{ maxWidth: "600px", margin: "0 auto" }}>
    Assistant for exploring Dandiset {dandisetId}.
    <br />
    You can learn about the NWB data standard and the PyNWB software through the
    <br />
    <a href="https://pynwb.readthedocs.io/en/stable/tutorials/index.html">
      PyNWB tutorials
    </a>
    .
  </div>
);

const preferences: Preferences = {
  getAssistantSystemPrompt: getDandisetExplorerSystemPrompt,
  assistantDisplayInfo: <AssistantDisplayInfo />,
  suggestedPrompts,
  requiresJupyter: true,
};

export default preferences;
