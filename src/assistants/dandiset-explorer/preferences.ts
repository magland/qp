import { Preferences } from "../../qpcommon/MainWindow";
import getDandisetExplorerSystemPrompt, {
  dandisetId,
} from "./dandisetExplorerSystemPrompt";

const suggestedPrompts: string[] = ["Tell me about this Dandiset."];

const preferences: Preferences = {
  getAssistantSystemPrompt: getDandisetExplorerSystemPrompt,
  assistantDisplayInfo: `Assistant for exploring a Dandiset ${dandisetId}`,
  suggestedPrompts,
  requiresJupyter: true,
};

export default preferences;
