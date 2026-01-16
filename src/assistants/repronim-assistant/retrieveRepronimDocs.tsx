/* eslint-disable @typescript-eslint/no-explicit-any */
import { ORToolCall } from "../../qpcommon/completion/openRouterTypes";
import { ChatMessage, QPFunctionDescription } from "../../qpcommon/types";

export const toolFunction: QPFunctionDescription = {
  name: "retrieve_repronim_docs",
  description:
    "Retrieve content from a list of ReproNim and related tool documentation URLs.",
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

type RetrieveRepronimDocsParams = {
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
    // =====================================================
    // PRIMARY: ReproNim.org website content (from Hugo site)
    // These are the authoritative resources and should be consulted first
    // =====================================================

    // About & Core Concepts
    {
      title: "ReproNim - Why Reproducible Neuroimaging",
      url: "https://repronim.org/about/why/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/about/why.md",
      includeFromStart: true,
    },
    {
      title: "ReproNim - The ReproNim Approach",
      url: "https://repronim.org/about/repronim-approach/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/about/repronim-approach.md",
      includeFromStart: true,
    },
    {
      title: "ReproNim - Getting Started",
      url: "https://repronim.org/resources/getting-started/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/getting-started/_index.md",
      includeFromStart: true,
    },
    {
      title: "ReproNim - Tools Overview",
      url: "https://repronim.org/resources/tools/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/tools/_index.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim - Training Overview",
      url: "https://repronim.org/resources/training/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/training/_index.md",
      includeFromStart: false,
    },

    // Tutorials from repronim.org (Principle-based organization)
    {
      title: "ReproNim Tutorial - Tutorials Overview",
      url: "https://repronim.org/resources/tutorials/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/tutorials/_index.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim Tutorial - DICOM to BIDS Conversion",
      url: "https://repronim.org/resources/tutorials/dicom-to-bids/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/tutorials/dicom-to-bids.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim Tutorial - Data Dictionary",
      url: "https://repronim.org/resources/tutorials/data-dictionary/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/tutorials/data-dictionary.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim Tutorial - Data Management and Sharing",
      url: "https://repronim.org/resources/tutorials/data-management-and-sharing/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/tutorials/data-management-and-sharing.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim Tutorial - Estimating Costs",
      url: "https://repronim.org/resources/tutorials/estimating-costs/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/tutorials/estimating-costs.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim Tutorial - Git Version Control",
      url: "https://repronim.org/resources/tutorials/git/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/tutorials/git.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim Tutorial - Neurodocker Containerization",
      url: "https://repronim.org/resources/tutorials/neurodocker/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/tutorials/neurodocker.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim Tutorial - ReproNim Containers with DataLad",
      url: "https://repronim.org/resources/tutorials/repronim-containers/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/tutorials/repronim-containers.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim Tutorial - ReproSchema",
      url: "https://repronim.org/resources/tutorials/reproschema/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/tutorials/reproschema.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim Tutorial - Nipoppy Workflow",
      url: "https://repronim.org/resources/tutorials/nipoppy/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/tutorials/nipoppy.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim Tutorial - FreeSurfer",
      url: "https://repronim.org/resources/tutorials/freesurfer/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/tutorials/freesurfer.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim Tutorial - FSL",
      url: "https://repronim.org/resources/tutorials/fsl/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/tutorials/fsl.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim Tutorial - Publish Everything",
      url: "https://repronim.org/resources/tutorials/publish-everything/",
      sourceUrl:
        "https://raw.githubusercontent.com/repronim/repronim.org/main/content/resources/tutorials/publish-everything.md",
      includeFromStart: false,
    },

    // =====================================================
    // SECONDARY: Tool-specific documentation
    // Detailed technical docs for individual tools
    // =====================================================

    // HeuDiConv documentation
    {
      title: "HeuDiConv Quickstart",
      url: "https://heudiconv.readthedocs.io/en/latest/quickstart.html",
      sourceUrl:
        "https://raw.githubusercontent.com/nipy/heudiconv/master/docs/quickstart.rst",
      includeFromStart: false,
    },
    {
      title: "HeuDiConv Installation",
      url: "https://heudiconv.readthedocs.io/en/latest/installation.html",
      sourceUrl:
        "https://raw.githubusercontent.com/nipy/heudiconv/master/docs/installation.rst",
      includeFromStart: false,
    },
    {
      title: "HeuDiConv Heuristics",
      url: "https://heudiconv.readthedocs.io/en/latest/heuristics.html",
      sourceUrl:
        "https://raw.githubusercontent.com/nipy/heudiconv/master/docs/heuristics.rst",
      includeFromStart: false,
    },
    {
      title: "HeuDiConv Tutorials",
      url: "https://heudiconv.readthedocs.io/en/latest/tutorials.html",
      sourceUrl:
        "https://raw.githubusercontent.com/nipy/heudiconv/master/docs/tutorials.rst",
      includeFromStart: false,
    },

    // DataLad documentation
    {
      title: "DataLad Handbook - Introduction",
      url: "https://handbook.datalad.org/en/latest/intro/philosophy.html",
      sourceUrl:
        "https://raw.githubusercontent.com/datalad-handbook/book/main/docs/intro/philosophy.rst",
      includeFromStart: false,
    },
    {
      title: "DataLad Handbook - Installation",
      url: "https://handbook.datalad.org/en/latest/intro/installation.html",
      sourceUrl:
        "https://raw.githubusercontent.com/datalad-handbook/book/main/docs/intro/installation.rst",
      includeFromStart: false,
    },
    {
      title: "DataLad Handbook - Create Dataset",
      url: "https://handbook.datalad.org/en/latest/basics/101-101-create.html",
      sourceUrl:
        "https://raw.githubusercontent.com/datalad-handbook/book/main/docs/basics/101-101-create.rst",
      includeFromStart: false,
    },
    {
      title: "DataLad Handbook - Version Control",
      url: "https://handbook.datalad.org/en/latest/basics/101-102-populate.html",
      sourceUrl:
        "https://raw.githubusercontent.com/datalad-handbook/book/main/docs/basics/101-102-populate.rst",
      includeFromStart: false,
    },
    {
      title: "DataLad Handbook - Run & Reproducibility",
      url: "https://handbook.datalad.org/en/latest/basics/101-109-rerun.html",
      sourceUrl:
        "https://raw.githubusercontent.com/datalad-handbook/book/main/docs/basics/101-109-rerun.rst",
      includeFromStart: false,
    },

    // Neurodocker
    {
      title: "Neurodocker README",
      url: "https://github.com/ReproNim/neurodocker",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/neurodocker/master/README.md",
      includeFromStart: false,
    },
    {
      title: "Neurodocker Examples",
      url: "https://github.com/ReproNim/neurodocker/tree/master/examples",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/neurodocker/master/examples/README.md",
      includeFromStart: false,
    },

    // ReproIn
    {
      title: "ReproIn README",
      url: "https://github.com/ReproNim/reproin",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reproin/master/README.md",
      includeFromStart: false,
    },

    // ReproNim containers
    {
      title: "ReproNim Containers README",
      url: "https://github.com/ReproNim/containers",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/containers/master/README.md",
      includeFromStart: false,
    },

    // Duct - execution monitoring
    {
      title: "Duct (con-duct) README",
      url: "https://github.com/con/duct",
      sourceUrl: "https://raw.githubusercontent.com/con/duct/master/README.md",
      includeFromStart: false,
    },

    // datalad-container
    {
      title: "DataLad-Container README",
      url: "https://github.com/datalad/datalad-container",
      sourceUrl:
        "https://raw.githubusercontent.com/datalad/datalad-container/main/README.md",
      includeFromStart: false,
    },

    // ReproSchema
    {
      title: "ReproSchema README",
      url: "https://github.com/ReproNim/reproschema",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reproschema/master/README.md",
      includeFromStart: false,
    },

    // ReproMan
    {
      title: "ReproMan README",
      url: "https://github.com/ReproNim/reproman",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reproman/master/README.md",
      includeFromStart: false,
    },

    // ReproStim documentation
    {
      title: "ReproStim Introduction",
      url: "https://reprostim.readthedocs.io/en/latest/intro/intro.html",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reprostim/master/docs/source/intro/intro.rst",
      includeFromStart: false,
    },
    {
      title: "ReproStim Overview",
      url: "https://reprostim.readthedocs.io/en/latest/overview/index.html",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reprostim/master/docs/source/overview/index.rst",
      includeFromStart: false,
    },
    {
      title: "ReproStim Installation",
      url: "https://reprostim.readthedocs.io/en/latest/install/index.html",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reprostim/master/docs/source/install/index.rst",
      includeFromStart: false,
    },
    {
      title: "ReproStim CLI - Main Commands",
      url: "https://reprostim.readthedocs.io/en/latest/cli/reprostim.html",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reprostim/master/docs/source/cli/reprostim.rst",
      includeFromStart: false,
    },
    {
      title: "ReproStim CLI - Screen Capture",
      url: "https://reprostim.readthedocs.io/en/latest/cli/reprostim-screencapture.html",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reprostim/master/docs/source/cli/reprostim-screencapture.rst",
      includeFromStart: false,
    },
    {
      title: "ReproStim CLI - Video Capture",
      url: "https://reprostim.readthedocs.io/en/latest/cli/reprostim-videocapture.html",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reprostim/master/docs/source/cli/reprostim-videocapture.rst",
      includeFromStart: false,
    },
    {
      title: "ReproStim CLI - Time Sync Stimuli",
      url: "https://reprostim.readthedocs.io/en/latest/cli/timesync-stimuli.html",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reprostim/master/docs/source/cli/timesync-stimuli.rst",
      includeFromStart: false,
    },
    {
      title: "ReproStim CLI - QR Parse",
      url: "https://reprostim.readthedocs.io/en/latest/cli/qr-parse.html",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reprostim/master/docs/source/cli/qr-parse.rst",
      includeFromStart: false,
    },
    {
      title: "ReproStim CLI - Video Audit",
      url: "https://reprostim.readthedocs.io/en/latest/cli/video-audit.html",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reprostim/master/docs/source/cli/video-audit.rst",
      includeFromStart: false,
    },
    {
      title: "ReproStim PsychoPy Integration",
      url: "https://reprostim.readthedocs.io/en/latest/notes/psychopy-notes.html",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reprostim/master/docs/source/notes/psychopy-notes.rst",
      includeFromStart: false,
    },
    {
      title: "ReproStim Container Setup",
      url: "https://reprostim.readthedocs.io/en/latest/notes/containers.html",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reprostim/master/docs/source/notes/containers.rst",
      includeFromStart: false,
    },
    {
      title: "ReproStim Development",
      url: "https://reprostim.readthedocs.io/en/latest/dev/index.html",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reprostim/master/docs/source/dev/index.rst",
      includeFromStart: false,
    },
    {
      title: "ReproStim README",
      url: "https://github.com/ReproNim/reprostim",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/reprostim/master/README.md",
      includeFromStart: false,
    },

    // =====================================================
    // TERTIARY: Legacy training modules
    // Older modular curriculum (still useful for deep dives)
    // =====================================================
    {
      title: "ReproNim Module - Introduction",
      url: "http://www.repronim.org/module-intro/",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/module-intro/gh-pages/README.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim Module - Reproducibility Basics",
      url: "http://www.repronim.org/module-reproducible-basics/",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/module-reproducible-basics/gh-pages/README.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim Module - FAIR Data",
      url: "http://www.repronim.org/module-FAIR-data/",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/module-FAIR-data/gh-pages/README.md",
      includeFromStart: false,
    },
    {
      title: "ReproNim Module - Data Processing",
      url: "http://www.repronim.org/module-dataprocessing/",
      sourceUrl:
        "https://raw.githubusercontent.com/ReproNim/module-dataprocessing/gh-pages/README.md",
      includeFromStart: false,
    },
  ];
};

export const execute = async (
  params: RetrieveRepronimDocsParams,
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
    console.warn("Error in retrieve_repronim_docs:", error);
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
  retLines.push(
    "Retrieve content from a list of ReproNim and related tool documentation URLs.",
  );
  retLines.push("");

  retLines.push(
    "The tool first validates that all provided URLs are in the allowed list.",
  );
  retLines.push("");

  retLines.push("The output is a JSON array where each element has the form:");
  retLines.push("{");
  retLines.push(`  "url": "document URL"`);
  retLines.push(`  "content": "document content"`);
  retLines.push("}");
  retLines.push("");

  retLines.push(
    "Here is the list of all available ReproNim and related documentation:",
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
          const fileName = parts[parts.length - 1] || parts[parts.length - 2];
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
