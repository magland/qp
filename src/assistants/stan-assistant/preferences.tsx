import { useMemo } from "react";
import { Preferences } from "../../qpcommon/MainWindow";
import stanAssistantSystemPrompt from "./stanAssistantSystemPrompt";
import { getDocPages } from "./retrieveStanDocs";

// eslint-disable-next-line react-refresh/only-export-components
const AssistantDisplayInfo = () => {
  const stanUrl = "https://mc-stan.org/";
  const stanUsersGuideUrl =
    "https://mc-stan.org/docs/stan-users-guide/index.html";
  const docPages = useMemo(() => getDocPages(), []);
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <p>
          This is a technical assistant for <a href={stanUrl} target="_blank" rel="noopener noreferrer">Stan</a> that provides
          guidance, troubleshooting, and explanations based on the official{" "}
          <a href={stanUsersGuideUrl} target="_blank" rel="noopener noreferrer">
            Stan User's Guide
          </a>
      </p>
      <p>
        {docPages.map((doc, index) => (
          <span key={doc.url}>
            <a href={doc.url} target="_blank" rel="noopener noreferrer">
              {doc.title}
            </a>
            {index < docPages.length - 1 ? " | " : ""}
          </span>
        ))}
      </p>
      .
    </div>
  );
};

const preferences: Preferences = {
  assistantSystemPrompt: stanAssistantSystemPrompt,
  assistantDisplayInfo: <AssistantDisplayInfo />,
  suggestedPrompts: [],
};

export default preferences;
