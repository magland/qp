/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ORToolCall } from "../../qpcommon/completion/openRouterTypes";
import { ChatMessage, QPFunctionDescription } from "../../qpcommon/types";
import { JobRunnerClient } from "./jobRunnerClient";
import MarkdownContent from "../../qpcommon/components/MarkdownContent";

export const toolFunction: QPFunctionDescription = {
  name: "execute_javascript",
  description: "Execute a JavaScript script for probing databases",
  parameters: {
    type: "object",
    properties: {
      script: {
        type: "string",
        description: "JavaScript code to execute",
      }
    },
    required: ["script"],
  },
};

// Singleton instance of JobRunnerClient
let jobRunnerClient: JobRunnerClient | null = null;

const getJobRunner = () => {
  if (!jobRunnerClient) {
    jobRunnerClient = new JobRunnerClient();
  }
  return jobRunnerClient;
};

type ExecuteJavaScriptParams = {
  script: string;
};

export const execute = async (
  params: ExecuteJavaScriptParams,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _o: any,
): Promise<string> => {
  const { script } = params;

  console.info("Executing script:");
  console.info(script);

  try {
    const scriptOutput = await getJobRunner().executeScript(script);

    console.info("Script output:");
    console.info(scriptOutput);
    return scriptOutput;
  } catch (error) {
    console.error('Error executing script:', error);
    return `Script execution failed: ${error instanceof Error ? error.message : String(error)}`;
  }
};

export const getDetailedDescription = async () => {
    return `Execute a JavaScript script for probing databases`;
};

export const requiresPermission = false;

// eslint-disable-next-line react-refresh/only-export-components
const ExecuteJavaScriptToolCallView = ({
  toolCall,
  toolOutput,
}: {
  toolCall: ORToolCall;
  toolOutput: (ChatMessage & { role: "tool" }) | undefined;
}): React.JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Parse the script from tool call arguments
  const args = JSON.parse(toolCall.function.arguments || "{}");
  const script: string = args.script || "";
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!toolOutput) {
    return (
      <div className="tool-call-message">
        <div style={{ cursor: "pointer" }} onClick={toggleExpand}>
          <span style={{ marginRight: "8px" }}>{isExpanded ? "▼" : "▶"}</span>
          Executing script...
        </div>
        {isExpanded && script && (
          <div style={{ marginTop: "8px" }}>
            <MarkdownContent content={`\`\`\`javascript\n${script}\n\`\`\``} />
          </div>
        )}
      </div>
    );
  } else {
    const output = toolOutput.content || "";
    return (
      <div className="tool-call-message">
        <div style={{ cursor: "pointer" }} onClick={toggleExpand}>
          <span style={{ marginRight: "8px" }}>{isExpanded ? "▼" : "▶"}</span>
          Executed script.
        </div>
        {isExpanded && (
          <div style={{ marginTop: "8px" }}>
            {script && (
              <div>
                <strong>Script:</strong>
                <MarkdownContent content={`\`\`\`javascript\n${script}\n\`\`\``} />
              </div>
            )}
            {output && (
              <div style={{ marginTop: "12px" }}>
                <strong>Output:</strong>
                <MarkdownContent content={`\`\`\`\n${output}\n\`\`\``} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
};

export const createToolCallView = (
  toolCall: ORToolCall,
  toolOutput: (ChatMessage & { role: "tool" }) | undefined
): React.JSX.Element => {
  return <ExecuteJavaScriptToolCallView toolCall={toolCall} toolOutput={toolOutput} />;
};
