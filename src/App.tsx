import { BrowserRouter } from "react-router-dom";
import MainWindow from "./qpcommon/MainWindow";
import getTools from "./tools/getTools";
import stanAssistantDescription from "./assistantDescriptions/stanAssistantDescription";
import { useMemo } from "react";
import getAppName from "./qpcommon/getAppName";
import nwbAssistantDescription from "./assistantDescriptions/nwbAssistantDescription";
import neurosiftChatAssistantDescription from "./assistantDescriptions/neurosiftChatDescription";

function App() {
  const preferences = useMemo(() => {
    const appName = getAppName();
    if (appName === "stan-assistant") {
      return {
        assistantDescription: stanAssistantDescription,
        newChatTitle: "Ask about Stan."
      };
    }
    else if (appName === "nwb-assistant") {
      return {
        assistantDescription: nwbAssistantDescription,
        newChatTitle: "Ask about NWB."
      };
    }
    else if (appName === "neurosift-chat") {
      return {
        assistantDescription: neurosiftChatAssistantDescription,
        newChatTitle: "Query DANDI, OpenNeuro, and EBRAINS.",
      };
    }
    else {
      return {
        assistantDescription: "Unknown assistant",
        newChatTitle: "Unknown assistant",
      };
    }
  }, []);
  return (
    <BrowserRouter>
      <MainWindow
        getTools={getTools}
        preferences={preferences}
      />
    </BrowserRouter>
  );
}


export default App;
