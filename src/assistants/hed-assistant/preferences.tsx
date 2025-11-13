import { useMemo } from "react";
import { Preferences } from "../../qpcommon/MainWindow";
import hedAssistantSystemPrompt from "./hedAssistantSystemPrompt";
import { getDocPages } from "./retrieveHedDocs";

// eslint-disable-next-line react-refresh/only-export-components
const AssistantDisplayInfo = () => {
  const hedUrl = "https://www.hedtags.org/";
  const hedSpecUrl = "https://www.hedtags.org/hed-specification";
  const hedResourcesUrl = "https://www.hedtags.org/hed-resources";
  const hedGithubUrl = "https://github.com/hed-standard";
  const hedSchemaBrowserUrl = "https://www.hedtags.org/display_hed.html";
  const docPages = useMemo(() => getDocPages(), []);

  // Get categories for displaying
  const categories = [
    "specification",
    "specification-details",
    "introductory",
    "quickstart",
    "core-concepts",
    "tools",
    "advanced",
    "integration",
    "reference",
  ];

  const categoryNames: { [key: string]: string } = {
    specification: "Specification",
    "specification-details": "Specification Details",
    introductory: "Introductory",
    quickstart: "Quick Starts",
    "core-concepts": "Core Concepts",
    tools: "Tools",
    advanced: "Advanced",
    integration: "Integration",
    reference: "Reference",
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <p>
        This is a technical assistant for{" "}
        <a href={hedUrl} target="_blank" rel="noopener noreferrer">
          Hierarchical Event Descriptors (HED)
        </a>
        , providing guidance, troubleshooting, and explanations based on the
        official{" "}
        <a href={hedSpecUrl} target="_blank" rel="noopener noreferrer">
          HED Specification
        </a>{" "}
        and{" "}
        <a href={hedResourcesUrl} target="_blank" rel="noopener noreferrer">
          HED Resources
        </a>
        .
      </p>
      <p>
        Additional resources:{" "}
        <a href={hedGithubUrl} target="_blank" rel="noopener noreferrer">
          HED GitHub Organization
        </a>{" "}
        |{" "}
        <a
          href={hedSchemaBrowserUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          HED Schema Browser
        </a>
      </p>
      <p>
        <strong>Available Documentation ({docPages.length} documents):</strong>
      </p>
      <details style={{ marginTop: "10px" }}>
        <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
          View all documentation categories
        </summary>
        <div style={{ marginLeft: "20px", marginTop: "10px" }}>
          {categories.map((category) => {
            const categoryDocs = docPages.filter(
              (doc) => doc.category === category,
            );
            if (categoryDocs.length === 0) return null;
            return (
              <div key={category} style={{ marginBottom: "10px" }}>
                <strong>{categoryNames[category]}:</strong> (
                {categoryDocs.length} docs)
                <ul style={{ marginTop: "5px", marginBottom: "5px" }}>
                  {categoryDocs.slice(0, 3).map((doc) => (
                    <li key={doc.url}>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {doc.title}
                      </a>
                      {doc.includeFromStart && " (preloaded)"}
                    </li>
                  ))}
                  {categoryDocs.length > 3 && (
                    <li>...and {categoryDocs.length - 3} more</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
};

const preferences: Preferences = {
  getAssistantSystemPrompt: async () => hedAssistantSystemPrompt,
  assistantDisplayInfo: <AssistantDisplayInfo />,
  suggestedPrompts: [
    "What is HED and how is it used?",
    "How do I annotate an event with HED tags?",
    "Explain the difference between HED short and long forms.",
    "How do I validate HED annotations?",
    "What tools are available for working with HED?",
  ],
  requiresJupyter: false,
};

export default preferences;
