/* eslint-disable @typescript-eslint/no-explicit-any */
import { ORToolCall } from "../../qpcommon/completion/openRouterTypes";
import { ChatMessage, QPFunctionDescription } from "../../qpcommon/types";

export const toolFunction: QPFunctionDescription = {
  name: "retrieve_bids_docs",
  description: "Retrieve content from a list of BIDS specification documents.",
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

type RetrieveBidsDocsParams = {
  urls: string[];
};

export type DocPage = {
  title: string;
  url: string;
  sourceUrl: string;
  includeFromStart: boolean;
};

export const getDocPages = (): DocPage[] => {
  return [
    {
      title: "Introduction",
      url: "https://bids-specification.readthedocs.io/en/stable/introduction.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/introduction.md",
      includeFromStart: true,
    },
    {
      title: "Common Principles",
      url: "https://bids-specification.readthedocs.io/en/stable/common-principles.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/common-principles.md",
      includeFromStart: true,
    },
    {
      title: "Modality Agnostic Files",
      url: "https://bids-specification.readthedocs.io/en/stable/modality-agnostic-files.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/modality-agnostic-files.md",
      includeFromStart: true,
    },
    {
      title: "Modality Specific Files - MRI",
      url: "https://bids-specification.readthedocs.io/en/stable/modality-specific-files/magnetic-resonance-imaging-data.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/modality-specific-files/magnetic-resonance-imaging-data.md",
      includeFromStart: false,
    },
    {
      title: "Modality Specific Files - MEG",
      url: "https://bids-specification.readthedocs.io/en/stable/modality-specific-files/magnetoencephalography.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/modality-specific-files/magnetoencephalography.md",
      includeFromStart: false,
    },
    {
      title: "Modality Specific Files - EEG",
      url: "https://bids-specification.readthedocs.io/en/stable/modality-specific-files/electroencephalography.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/modality-specific-files/electroencephalography.md",
      includeFromStart: false,
    },
    {
      title: "Modality Specific Files - iEEG",
      url: "https://bids-specification.readthedocs.io/en/stable/modality-specific-files/intracranial-electroencephalography.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/modality-specific-files/intracranial-electroencephalography.md",
      includeFromStart: false,
    },
    {
      title: "Modality Specific Files - Behavioral",
      url: "https://bids-specification.readthedocs.io/en/stable/modality-specific-files/behavioral-experiments.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/modality-specific-files/behavioral-experiments.md",
      includeFromStart: false,
    },
    {
      title: "Modality Specific Files - PET",
      url: "https://bids-specification.readthedocs.io/en/stable/modality-specific-files/positron-emission-tomography.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/modality-specific-files/positron-emission-tomography.md",
      includeFromStart: false,
    },
    {
      title: "Modality Specific Files - Microscopy",
      url: "https://bids-specification.readthedocs.io/en/stable/modality-specific-files/microscopy.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/modality-specific-files/microscopy.md",
      includeFromStart: false,
    },
    {
      title: "Modality Specific Files - NIRS",
      url: "https://bids-specification.readthedocs.io/en/stable/modality-specific-files/near-infrared-spectroscopy.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/modality-specific-files/near-infrared-spectroscopy.md",
      includeFromStart: false,
    },
    {
      title: "Modality Specific Files - Motion",
      url: "https://bids-specification.readthedocs.io/en/stable/modality-specific-files/motion.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/modality-specific-files/motion.md",
      includeFromStart: false,
    },
    {
      title: "Longitudinal and Multi-Site Studies",
      url: "https://bids-specification.readthedocs.io/en/stable/longitudinal-and-multi-site-studies.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/longitudinal-and-multi-site-studies.md",
      includeFromStart: false,
    },
    {
      title: "Derivatives",
      url: "https://bids-specification.readthedocs.io/en/stable/derivatives/introduction.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/derivatives/introduction.md",
      includeFromStart: false,
    },
    {
      title: "Derivatives - Common Data Types",
      url: "https://bids-specification.readthedocs.io/en/stable/derivatives/common-data-types.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/derivatives/common-data-types.md",
      includeFromStart: false,
    },
    {
      title: "Derivatives - Imaging",
      url: "https://bids-specification.readthedocs.io/en/stable/derivatives/imaging.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/derivatives/imaging.md",
      includeFromStart: false,
    },
    {
      title: "Schema README",
      url: "https://github.com/bids-standard/bids-specification/blob/master/src/schema/README.md",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/schema/README.md",
      includeFromStart: false,
    },
    {
      title: "Appendix I - Entity Table",
      url: "https://bids-specification.readthedocs.io/en/stable/appendices/entity-table.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/appendices/entity-table.md",
      includeFromStart: false,
    },
    {
      title: "Appendix II - Licenses",
      url: "https://bids-specification.readthedocs.io/en/stable/appendices/licenses.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/appendices/licenses.md",
      includeFromStart: false,
    },
    {
      title: "Appendix III - Hierarchical Event Descriptors",
      url: "https://bids-specification.readthedocs.io/en/stable/appendices/hed.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/appendices/hed.md",
      includeFromStart: false,
    },
    {
      title: "Appendix IV - Entity Metadata",
      url: "https://bids-specification.readthedocs.io/en/stable/appendices/entity-metadata.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/appendices/entity-metadata.md",
      includeFromStart: false,
    },
    {
      title: "Appendix V - Units",
      url: "https://bids-specification.readthedocs.io/en/stable/appendices/units.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/appendices/units.md",
      includeFromStart: false,
    },
    {
      title: "Appendix VI - MEG File Formats",
      url: "https://bids-specification.readthedocs.io/en/stable/appendices/meg-file-formats.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/appendices/meg-file-formats.md",
      includeFromStart: false,
    },
    {
      title: "Appendix VII - MEG Systems",
      url: "https://bids-specification.readthedocs.io/en/stable/appendices/meg-systems.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/appendices/meg-systems.md",
      includeFromStart: false,
    },
    {
      title: "Appendix VIII - Coordinate Systems",
      url: "https://bids-specification.readthedocs.io/en/stable/appendices/coordinate-systems.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/appendices/coordinate-systems.md",
      includeFromStart: false,
    },
    {
      title: "Appendix IX - Entities",
      url: "https://bids-specification.readthedocs.io/en/stable/appendices/entities.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/appendices/entities.md",
      includeFromStart: false,
    },
    {
      title: "Appendix X - File Collections",
      url: "https://bids-specification.readthedocs.io/en/stable/appendices/file-collections.html",
      sourceUrl:
        "https://raw.githubusercontent.com/bids-standard/bids-specification/master/src/appendices/file-collections.md",
      includeFromStart: false,
    },
  ];
};

export const execute = async (
  params: RetrieveBidsDocsParams,
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
    console.warn("Error in retrieve_bids_docs:", error);
    return { result: error instanceof Error ? error.message : "Unknown error" };
  }
};

const getSourceUrl = async (url: string): Promise<string> => {
  const docPages = getDocPages();
  const doc = docPages.find((d) => d.url === url);
  if (!doc) throw new Error(`Unsupported URL: ${url}`);
  return doc.sourceUrl;
};

export const getDetailedDescription = async () => {
  const docPages = getDocPages();

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
  retLines.push("Retrieve content from a list of BIDS specification document URLs.");
  retLines.push("");

  retLines.push(
    "The tool first validates that all provided URLs are in the allowed list",
  );
  retLines.push("");

  retLines.push("The output is a JSON array where each element has the form:");
  retLines.push("{");
  retLines.push(`  "url": "BIDS document URL"`);
  retLines.push(` "content": "BIDS document content"`);
  retLines.push("}");
  retLines.push("");

  retLines.push(
    "Here is the list of all available BIDS specification documents:",
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
