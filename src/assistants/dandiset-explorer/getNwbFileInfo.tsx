import { useState } from "react";
import { ORToolCall } from "../../qpcommon/completion/openRouterTypes";
import MarkdownContent from "../../qpcommon/components/MarkdownContent";
import PythonSessionClient from "../../qpcommon/jupyter/PythonSessionClient";
import {
  ChatMessage,
  QPFunctionDescription,
  ToolExecutionContext,
} from "../../qpcommon/types";

export const toolFunction: QPFunctionDescription = {
  name: "get_nwbfile_info",
  description:
    "Retrieve information about a specific NWB file, including how to load it using Python.",
  parameters: {
    type: "object",
    properties: {
      dandisetId: {
        type: "string",
        description: "The ID of the dandiset that contains the NWB file.",
      },
      dandisetVersion: {
        type: "string",
        description: "The version of the dandiset that contains the NWB file.",
      },
      assetPath: {
        type: "string",
        description: "The path of the NWB file asset.",
      },
    },
    required: ["dandisetId", "dandisetVersion", "assetPath"],
  },
};

type GetNwbFileInfoParams = {
  dandisetId: string;
  dandisetVersion: string;
  assetPath: string;
};

export const execute = async (
  params: GetNwbFileInfoParams,
  o?: ToolExecutionContext,
) => {
  const { dandisetId, dandisetVersion, assetPath } = params;

  try {
    if (assetPath === "*.nwb") {
      // in this case the LLM got confused
      return {
        result: "Please provide a specific asset path, not just *.nwb.",
      };
    }

    if (!o?.jupyterConnectivity.jupyterServerIsAvailable) {
      throw new Error(
        "Jupyter server is not available. Please configure a Jupyter server to use this tool.",
      );
    }
    const client = new PythonSessionClient(o.jupyterConnectivity);
    const outputLines: string[] = [];
    client.onOutputItem((item) => {
      if (
        item.type === "iopub" &&
        "name" in item.iopubMessage.content &&
        (item.iopubMessage.content.name === "stdout" ||
          item.iopubMessage.content.name === "stderr")
      ) {
        if ("text" in item.iopubMessage.content) {
          outputLines.push(item.iopubMessage.content.text as string);
        }
      }
    });

    let finished = false;
    let canceled = false;
    if (o.onCancelRef) {
      o.onCancelRef.onCancel = () => {
        if (finished) {
          console.info("Not cancelling execution, already finished");
          return;
        }
        console.info("Cancelling execution");
        client.cancelExecution();
        canceled = true;
      };
    }

    const code = `
try:
  from get_nwbfile_info import get_nwbfile_usage_script
except ImportError:
  print("get_nwbfile_info module not found. Please install it first: pip install git+https://github.com/rly/get-nwbfile-info.git")
  raise

usage_script = get_nwbfile_usage_script("DANDI:${dandisetId}:${dandisetVersion}:${assetPath}")

print("\`\`\`python")
print(usage_script)
print("\`\`\`")
`;
    console.info("Running code:");
    console.info(code);
    await client.initiate();
    await client.runCode(code);
    await client.waitUntilIdle();
    await client.shutdown();

    finished = true;

    if (canceled) {
      return {
        result: "Execution was canceled.",
      };
    }

    return { result: outputLines.join("\n") };
  } catch (error) {
    return {
      result: JSON.stringify(
        { error: error instanceof Error ? error.message : "Unknown error" },
        null,
        2,
      ),
    };
  }
};

export const getDetailedDescription = async () => {
  return `Retrieve information about an NWB file in a dandiset.

Includes information about what data is in the file, how to load it using Python, and any other relevant details.

If you get a message like "get_nwbfile_info module not found. Please install it first.",
you need to tell the user that they need to install the get-nwbfile-info package from source using
"pip install git+https://github.com/rly/get-nwbfile-info". In this case, don't make up usage information.
`;
};

export const createToolCallView = (
  toolCall: ORToolCall,
  toolOutput: (ChatMessage & { role: "tool" }) | undefined,
): React.JSX.Element => {
  const args = JSON.parse(toolCall.function.arguments || "{}");
  const dandisetId: string = args.dandisetId || "";
  const assetPath: string = args.assetPath || "";
  const mdContent = `**Retrieving info for NWB file ${assetPath} in Dandiset ${dandisetId}**`;
  const md = <MarkdownContent content={mdContent} />;
  if (!toolOutput) {
    return <>{md}</>;
  } else {
    return (
      <>
        {md}
        {toolOutput.content && (
          <ToolOutputExpander content={toolOutput.content} />
        )}
      </>
    );
  }
};

const ToolOutputExpander: React.FC<{ content: string }> = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ marginTop: "10px" }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: "8px 12px",
          cursor: "pointer",
          backgroundColor: "gray",
          color: "white",
          border: "none",
          borderRadius: "4px",
          marginBottom: "10px",
          fontWeight: "500",
        }}
      >
        {isExpanded ? "▼ Hide Output" : "▶ Show Output"}
      </button>
      {isExpanded && (
        <div>
          <MarkdownContent content={content} />
        </div>
      )}
    </div>
  );
};

export const requiresPermission = false;

export const isCancelable = true;
