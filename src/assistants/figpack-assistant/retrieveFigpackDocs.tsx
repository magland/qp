/* eslint-disable @typescript-eslint/no-explicit-any */
import { ORToolCall } from "../../qpcommon/completion/openRouterTypes";
import { ChatMessage, QPFunctionDescription } from "../../qpcommon/types";

export const toolFunction: QPFunctionDescription = {
  name: "retrieve_figpack_docs",
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

type RetrieveFigpackDocsParams = {
  urls: string[];
};

export type DocPage = {
  title: string;
  url: string;
  sourceUrl: string;
  includeFromStart: boolean;
};

// let cachedDocPages: DocPage[] | null = null;

export const execute = async (
  params: RetrieveFigpackDocsParams,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _o: any,
): Promise<{ result: string }> => {
  const { urls } = params;

  try {
    // Fetch content for each URL
    const results = await Promise.all(
      urls.map(async (url) => {
        const sourceUrl = await getSourceUrl(url);
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
    console.warn("Error in retrieve_figpack_docs:", error);
    return { result: error instanceof Error ? error.message : "Unknown error" };
  }
};

const getSourceUrl = async (url: string): Promise<string> => {
  const docPages = await getDocPages();
  const doc = docPages.find((d) => d.url === url);
  if (!doc) throw new Error(`Unsupported URL: ${url}`);
  return doc.sourceUrl;
};

const DOC_PAGES_URL =
  "https://flatironinstitute.github.io/figpack/doc-pages.json";

let docPagesCache: DocPage[] | null = null;

const getDocPages = async (): Promise<DocPage[]> => {
  if (docPagesCache) return docPagesCache;

  const response = await fetch(DOC_PAGES_URL);
  if (!response.ok) {
    throw new Error(`Error fetching doc pages: ${response.statusText}`);
  }
  const docPages: DocPage[] = (await response.json()).docPages;
  docPagesCache = docPages;
  return docPages;
};

export const getDetailedDescription = async () => {
  const docPages = await getDocPages();
  console.log("docPages:", docPages);

  const preloadedContent: { [url: string]: string } = {};
  for (const doc of docPages) {
    if (doc.includeFromStart) {
      try {
        const response = await fetch(doc.sourceUrl);
        if (response.ok) {
          preloadedContent[doc.url] = await response.text();
        } else {
          preloadedContent[doc.url] =
            `Error fetching document: ${response.statusText}`;
        }
      } catch (error) {
        preloadedContent[doc.url] = `Error fetching document: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      }
    }
  }
  const list: string[] = [];
  for (const doc of docPages) {
    const additionalInfo = doc.includeFromStart
      ? " (already included below)"
      : "";
    list.push(`- ${doc.title}: ${doc.url}${additionalInfo}`);
  }
  const retLines: string[] = [];
  retLines.push("Retrieve content from a list of Figpack document URLs.");
  retLines.push("");

  retLines.push(
    "The tool first validates that all provided URLs are in the allowed list",
  );
  retLines.push("");

  retLines.push("The output is a JSON array where each element has the form:");
  retLines.push("{");
  retLines.push(`  "url": "Figpack document URL"`);
  retLines.push(` "content": "Figpack document content"`);
  retLines.push("}");
  retLines.push("");

  retLines.push(
    "Here is the list of all available Figpack documents with descriptions:",
  );
  for (const a of list) {
    retLines.push(a);
  }
  retLines.push("");

  if (docPages.filter((doc) => doc.includeFromStart).length > 0) {
    retLines.push(
      "Here are the contents of some of those documents which have been preloaded:",
    );
    for (const doc of docPages.filter((doc) => doc.includeFromStart)) {
      retLines.push("");
      retLines.push(`### ${doc.title}`);
      retLines.push("");
      retLines.push(doc.url);
      retLines.push("");
      retLines.push("```");
      retLines.push(preloadedContent[doc.url]);
      retLines.push("```");
      retLines.push("");
    }
  }

  return retLines.join("\n");
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
