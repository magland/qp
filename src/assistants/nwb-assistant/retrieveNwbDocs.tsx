/* eslint-disable @typescript-eslint/no-explicit-any */
import { ORToolCall } from "../../qpcommon/completion/openRouterTypes";
import { ChatMessage, QPFunctionDescription } from "../../qpcommon/types";

export const toolFunction: QPFunctionDescription = {
  name: "retrieve_docs",
  description: "Retrieve content from a list of documents.",
  parameters: {
    type: "object",
    properties: {
      urls: {
        type: "array",
        items: {
          type: "string",
        },
        description: "List of document URLs to retrieve",
      },
    },
    required: ["urls"],
  },
};

type RetrieveNwbDocsParams = {
  urls: string[];
};

// const DOC_PAGES_URL =
//   "https://flatironinstitute.github.io/figpack/doc-pages.json";

export type DocPage = {
  title: string;
  url: string;
  sourceUrl: string;
  includeFromStart: boolean;
};

// let cachedDocPages: DocPage[] | null = null;

let cachedDocIndex: string | null = null;

async function getDocIndex(): Promise<string> {
  if (cachedDocIndex) return cachedDocIndex;

  const response = await fetch(
    "https://raw.githubusercontent.com/magland/nwb-doc-index/refs/heads/main/index.md",
  );
  if (!response.ok) {
    throw new Error(`Error fetching doc index: ${response.statusText}`);
  }
  const text = await response.text();
  cachedDocIndex = text;
  return text;
}

export const execute = async (
  params: RetrieveNwbDocsParams,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _o: any,
): Promise<{ result: string }> => {
  const { urls } = params;

  try {
    // Fetch content for each URL
    const results = await Promise.all(
      urls.map(async (url) => {
        const sourceUrl = getSourceUrl(url);
        const response = await fetch(sourceUrl);
        if (!response.ok) {
          return { url, content: `Error: ${response.statusText}` };
        }
        const content = await response.text();
        return { url, content };
      }),
    );

    return { result: JSON.stringify(results, null, 2) };
  } catch (error) {
    console.warn("Error in retrieve nwb docs:", error);
    return { result: error instanceof Error ? error.message : "Unknown error" };
  }
};

const getSourceUrl = (url: string): string => {
  // https://neuroconv.readthedocs.io/en/main/conversion_examples_gallery/behavior/audio.html
  // goes to
  // https://raw.githubusercontent.com/catalystneuro/neuroconv/refs/heads/main/docs/conversion_examples_gallery/behavior/audio.rst
  if (url.startsWith("https://neuroconv.readthedocs.io/")) {
    let relpart = url.slice("https://neuroconv.readthedocs.io/en/main/".length);
    relpart = relpart.replace(/\.html$/, ".rst");
    return `https://raw.githubusercontent.com/catalystneuro/neuroconv/refs/heads/main/docs/${relpart}`;
  }

  // https://pynwb.readthedocs.io/en/latest/tutorials/general/plot_file.html
  // goes to
  // https://raw.githubusercontent.com/NeurodataWithoutBorders/pynwb/refs/heads/dev/docs/gallery/general/plot_file.py
  if (url.startsWith("https://pynwb.readthedocs.io/")) {
    let relpart = url.slice("https://pynwb.readthedocs.io/en/latest/".length);
    relpart = relpart.replace(/\.html$/, ".py");
    relpart = relpart.replace(/tutorials\//, "gallery/");
    return `https://raw.githubusercontent.com/NeurodataWithoutBorders/pynwb/refs/heads/dev/docs/${relpart}`;
  }

  // https://nwbinspector.readthedocs.io/en/dev/best_practices/behavior.html
  // goes to
  // https://raw.githubusercontent.com/catalystneuro/nwbinspector/refs/heads/dev/docs/best_practices/behavior.rst
  if (url.startsWith("https://nwbinspector.readthedocs.io/")) {
    let relpart = url.slice(
      "https://nwbinspector.readthedocs.io/en/dev/".length,
    );
    relpart = relpart.replace(/\.html$/, ".rst");
    return `https://raw.githubusercontent.com/catalystneuro/nwbinspector/refs/heads/dev/docs/${relpart}`;
  }

  // https://hdmf.readthedocs.io/en/stable/tutorials/multicontainerinterface.html
  // goes to
  // https://raw.githubusercontent.com/hdmf-dev/hdmf/refs/heads/dev/docs/gallery/multicontainerinterface.py
  if (url.startsWith("https://hdmf.readthedocs.io/")) {
    let relpart = url.slice("https://hdmf.readthedocs.io/en/stable/".length);
    relpart = relpart.replace(/\.html$/, ".py");
    relpart = relpart.replace(/tutorials\//, "gallery/");
    return `https://raw.githubusercontent.com/hdmf-dev/hdmf/refs/heads/dev/docs/${relpart}`;
  }

  throw new Error(`Unsupported URL: ${url}`);
};

export const getDetailedDescription = async () => {
  const docIndex = await getDocIndex();
  return `Retrieve content from a list of document URLs.

The tool first validates that all provided URLs are in the allowed list

The output is a JSON array where each element has the form:
{
  "url": "document URL",
  "content": "document content"
}

Here is the list of all available documents with descriptions:

${docIndex}`;
};

export const requiresPermission = false;

export const createToolCallView = (
  toolCall: ORToolCall,
  toolOutput: (ChatMessage & { role: "tool" }) | undefined,
): React.JSX.Element => {
  const args = JSON.parse(toolCall.function.arguments || "{}");
  const urls: string[] = args.urls || [];
  if (!toolOutput) {
    return (
      <div className="tool-call-message">
        Calling {toolCall.function.name} to retrieve {urls.length} document
        {urls.length === 1 ? "" : "s"}...
      </div>
    );
  } else {
    return (
      <div className="tool-call-message">
        retrieved{" "}
        {urls.map((url) => {
          const parts = url.split("/");
          const fileName = parts[parts.length - 1];
          return (
            <span key={url}>
              <a href={url} target="_blank" rel="noreferrer">
                {fileName}
              </a>
              &nbsp;
            </span>
          );
        })}
      </div>
    );
  }
};
