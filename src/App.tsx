import { BrowserRouter } from "react-router-dom";
import MainWindow from "./qpcommon/MainWindow";
import getTools from "./tools/getTools";
import { useMemo } from "react";
import getAppName from "./qpcommon/getAppName";
import stanAssistantPreferences from "./assistants/stan-assistant/preferences";
import neurosiftChatPreferences from "./assistants/neurosift-chat/preferences";
import nwbAssistantPreferences from "./assistants/nwb-assistant/preferences";
import testChatPreferences from "./assistants/test-chat/preferences";
import dandisetExplorerPreferences from "./assistants/dandiset-explorer/preferences";

function App() {
  const preferences = useMemo(() => {
    const appName = getAppName();
    if (appName === "stan-assistant") {
      return stanAssistantPreferences;
    } else if (appName === "nwb-assistant") {
      return nwbAssistantPreferences;
    } else if (appName === "neurosift-chat") {
      return neurosiftChatPreferences;
    } else if (appName === "test-chat") {
      return testChatPreferences;
    } else if (appName === "dandiset-explorer") {
      return dandisetExplorerPreferences;
    } else {
      return {
        getAssistantSystemPrompt: async () => "Unknown assistant",
        assistantDisplayInfo: "Unknown assistant",
        suggestedPrompts: [],
        requiresJupyter: false,
      };
    }
  }, []);
  return (
    <BrowserRouter>
      <MainWindow getTools={getTools} preferences={preferences} />
    </BrowserRouter>
  );
}

export default App;
