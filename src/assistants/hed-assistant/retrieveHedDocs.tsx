/* eslint-disable @typescript-eslint/no-explicit-any */
import { ORToolCall } from "../../qpcommon/completion/openRouterTypes";
import { ChatMessage, QPFunctionDescription } from "../../qpcommon/types";

export const toolFunction: QPFunctionDescription = {
  name: "retrieve_hed_docs",
  description: "Retrieve content from a list of HED documentation files.",
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

type RetrieveHedDocsParams = {
  urls: string[];
};

export type DocPage = {
  title: string;
  url: string;
  sourceUrl: string;
  includeFromStart: boolean;
  category?: string;
};

export const getDocPages = (): DocPage[] => {
  return [
    // === PRELOADED: Specification (3 docs) ===
    {
      title: "HED Introduction",
      url: "https://www.hedtags.org/hed-specification/01_Introduction.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/01_Introduction.md",
      includeFromStart: true,
      category: "specification",
    },
    {
      title: "HED Terminology",
      url: "https://www.hedtags.org/hed-specification/02_Terminology.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/02_Terminology.md",
      includeFromStart: true,
      category: "specification",
    },
    {
      title: "HED Basic Annotation",
      url: "https://www.hedtags.org/hed-specification/04_Basic_annotation.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/04_Basic_annotation.md",
      includeFromStart: true,
      category: "specification",
    },
    // === PRELOADED: Resources (1 doc) ===
    {
      title: "Introduction to HED",
      url: "https://www.hedtags.org/hed-resources/IntroductionToHed.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/IntroductionToHed.md",
      includeFromStart: true,
      category: "introductory",
    },

    // === ON-DEMAND: Specification Details (7 docs) ===
    {
      title: "HED Formats",
      url: "https://www.hedtags.org/hed-specification/03_HED_formats.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/03_HED_formats.md",
      includeFromStart: false,
      category: "specification-details",
    },
    {
      title: "HED Advanced Annotation",
      url: "https://www.hedtags.org/hed-specification/05_Advanced_annotation.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/05_Advanced_annotation.md",
      includeFromStart: false,
      category: "specification-details",
    },
    {
      title: "HED Infrastructure and Tools",
      url: "https://www.hedtags.org/hed-specification/06_Infrastructure_and_tools.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/06_Infrastructure_and_tools.md",
      includeFromStart: false,
      category: "specification-details",
    },
    {
      title: "HED Library Schemas",
      url: "https://www.hedtags.org/hed-specification/07_Library_schemas.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/07_Library_schemas.md",
      includeFromStart: false,
      category: "specification-details",
    },
    {
      title: "HED Ontology",
      url: "https://www.hedtags.org/hed-specification/08_HED_ontology.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/08_HED_ontology.md",
      includeFromStart: false,
      category: "specification-details",
    },
    {
      title: "HED Specification Appendix A",
      url: "https://www.hedtags.org/hed-specification/Appendix_A.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/Appendix_A.md",
      includeFromStart: false,
      category: "specification-details",
    },
    {
      title: "HED Specification Appendix B",
      url: "https://www.hedtags.org/hed-specification/Appendix_B.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/Appendix_B.md",
      includeFromStart: false,
      category: "specification-details",
    },

    // === ON-DEMAND: Introductory (2 docs) ===
    {
      title: "How Can You Use HED",
      url: "https://www.hedtags.org/hed-resources/HowCanYouUseHed.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HowCanYouUseHed.md",
      includeFromStart: false,
      category: "introductory",
    },
    {
      title: "HED History",
      url: "https://www.hedtags.org/hed-resources/HedHistory.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedHistory.md",
      includeFromStart: false,
      category: "introductory",
    },

    // === ON-DEMAND: Quick Starts (3 docs) ===
    {
      title: "HED Annotation Quickstart",
      url: "https://www.hedtags.org/hed-resources/HedAnnotationQuickstart.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedAnnotationQuickstart.md",
      includeFromStart: false,
      category: "quickstart",
    },
    {
      title: "BIDS Annotation Quickstart",
      url: "https://www.hedtags.org/hed-resources/BidsAnnotationQuickstart.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/BidsAnnotationQuickstart.md",
      includeFromStart: false,
      category: "quickstart",
    },
    {
      title: "HED Remodeling Quickstart",
      url: "https://www.hedtags.org/hed-resources/HedRemodelingQuickstart.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedRemodelingQuickstart.md",
      includeFromStart: false,
      category: "quickstart",
    },

    // === ON-DEMAND: Core Concepts (4 docs) ===
    {
      title: "HED Annotation Semantics",
      url: "https://www.hedtags.org/hed-resources/HedAnnotationSemantics.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedAnnotationSemantics.md",
      includeFromStart: false,
      category: "core-concepts",
    },
    {
      title: "HED Conditions and Design Matrices",
      url: "https://www.hedtags.org/hed-resources/HedConditionsAndDesignMatrices.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedConditionsAndDesignMatrices.md",
      includeFromStart: false,
      category: "core-concepts",
    },
    {
      title: "HED Schemas",
      url: "https://www.hedtags.org/hed-resources/HedSchemas.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedSchemas.md",
      includeFromStart: false,
      category: "core-concepts",
    },
    {
      title: "Understanding HED Versions",
      url: "https://www.hedtags.org/hed-resources/UnderstandingHedVersions.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/UnderstandingHedVersions.md",
      includeFromStart: false,
      category: "core-concepts",
    },

    // === ON-DEMAND: Tools (5 docs) ===
    {
      title: "HED Python Tools",
      url: "https://www.hedtags.org/hed-resources/HedPythonTools.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedPythonTools.md",
      includeFromStart: false,
      category: "tools",
    },
    {
      title: "HED MATLAB Tools",
      url: "https://www.hedtags.org/hed-resources/HedMatlabTools.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedMatlabTools.md",
      includeFromStart: false,
      category: "tools",
    },
    {
      title: "HED JavaScript Tools",
      url: "https://www.hedtags.org/hed-resources/HedJavascriptTools.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedJavascriptTools.md",
      includeFromStart: false,
      category: "tools",
    },
    {
      title: "HED Online Tools",
      url: "https://www.hedtags.org/hed-resources/HedOnlineTools.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedOnlineTools.md",
      includeFromStart: false,
      category: "tools",
    },
    {
      title: "CTagger GUI Tagging Tool",
      url: "https://www.hedtags.org/hed-resources/CTaggerGuiTaggingTool.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/CTaggerGuiTaggingTool.md",
      includeFromStart: false,
      category: "tools",
    },

    // === ON-DEMAND: Advanced Topics (5 docs) ===
    {
      title: "HED Remodeling Tools",
      url: "https://www.hedtags.org/hed-resources/HedRemodelingTools.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedRemodelingTools.md",
      includeFromStart: false,
      category: "advanced",
    },
    {
      title: "HED Schema Developers Guide",
      url: "https://www.hedtags.org/hed-resources/HedSchemaDevelopersGuide.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedSchemaDevelopersGuide.md",
      includeFromStart: false,
      category: "advanced",
    },
    {
      title: "HED Validation Guide",
      url: "https://www.hedtags.org/hed-resources/HedValidationGuide.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedValidationGuide.md",
      includeFromStart: false,
      category: "advanced",
    },
    {
      title: "HED Search Guide",
      url: "https://www.hedtags.org/hed-resources/HedSearchGuide.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedSearchGuide.md",
      includeFromStart: false,
      category: "advanced",
    },
    {
      title: "HED Summary Guide",
      url: "https://www.hedtags.org/hed-resources/HedSummaryGuide.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedSummaryGuide.md",
      includeFromStart: false,
      category: "advanced",
    },

    // === ON-DEMAND: Integration (3 docs) ===
    {
      title: "HED Annotation in NWB",
      url: "https://www.hedtags.org/hed-resources/HedAnnotationInNWB.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedAnnotationInNWB.md",
      includeFromStart: false,
      category: "integration",
    },
    {
      title: "HED and EEGLAB",
      url: "https://www.hedtags.org/hed-resources/HedAndEEGLAB.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedAndEEGLAB.md",
      includeFromStart: false,
      category: "integration",
    },
    {
      title: "HED Submission to INCF",
      url: "https://www.hedtags.org/hed-resources/HedSubmissionToINCF.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedSubmissionToINCF.md",
      includeFromStart: false,
      category: "integration",
    },

    // === ON-DEMAND: Reference (5 docs) ===
    {
      title: "Documentation Summary",
      url: "https://www.hedtags.org/hed-resources/DocumentationSummary.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/DocumentationSummary.md",
      includeFromStart: false,
      category: "reference",
    },
    {
      title: "HED Test Datasets",
      url: "https://www.hedtags.org/hed-resources/HedTestDatasets.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedTestDatasets.md",
      includeFromStart: false,
      category: "reference",
    },
    {
      title: "Example Datasets Overview",
      url: "https://github.com/hed-standard/hed-examples/blob/main/datasets/README.md",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-examples/main/datasets/README.md",
      includeFromStart: false,
      category: "reference",
    },
    {
      title: "HED Governance",
      url: "https://www.hedtags.org/hed-resources/HedGovernance.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedGovernance.md",
      includeFromStart: false,
      category: "reference",
    },
    {
      title: "What's New in HED",
      url: "https://www.hedtags.org/hed-resources/WhatsNew.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/WhatsNew.md",
      includeFromStart: false,
      category: "reference",
    },
  ];
};

export const execute = async (
  params: RetrieveHedDocsParams,
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
    console.warn("Error in retrieve_hed_docs:", error);
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

  // Group documents by category for better organization
  const categorizedDocs: { [category: string]: DocPage[] } = {};
  for (const doc of docPages) {
    const category = doc.category || "other";
    if (!categorizedDocs[category]) {
      categorizedDocs[category] = [];
    }
    categorizedDocs[category].push(doc);
  }

  const retLines: string[] = [];
  retLines.push("Retrieve content from a list of HED documentation URLs.");
  retLines.push("");

  retLines.push(
    "The tool first validates that all provided URLs are in the allowed list",
  );
  retLines.push("");

  retLines.push("The output is a JSON array where each element has the form:");
  retLines.push("{");
  retLines.push(`  "url": "HED document URL"`);
  retLines.push(`  "content": "HED document content"`);
  retLines.push("}");
  retLines.push("");

  retLines.push(
    "Here is the list of all available HED documentation files, organized by category:",
  );
  retLines.push("");

  // List preloaded docs first
  const preloaded = docPages.filter((doc) => doc.includeFromStart);
  if (preloaded.length > 0) {
    retLines.push("### Preloaded Documents (already available):");
    for (const doc of preloaded) {
      retLines.push(`- ${doc.title}: ${doc.url} (preloaded)`);
    }
    retLines.push("");
  }

  // List on-demand docs by category
  const categoryOrder = [
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
    "specification-details": "Specification Details",
    introductory: "Introductory Guides",
    quickstart: "Quick Start Tutorials",
    "core-concepts": "Core Concepts",
    tools: "Tool Guides",
    advanced: "Advanced Topics",
    integration: "Integration & Standards",
    reference: "Reference & Meta",
  };

  for (const category of categoryOrder) {
    if (categorizedDocs[category]) {
      const onDemandDocs = categorizedDocs[category].filter(
        (d) => !d.includeFromStart,
      );
      if (onDemandDocs.length > 0) {
        retLines.push(`### ${categoryNames[category]}:`);
        for (const doc of onDemandDocs) {
          retLines.push(`- ${doc.title}: ${doc.url}`);
        }
        retLines.push("");
      }
    }
  }

  if (preloaded.length > 0) {
    retLines.push("");
    retLines.push(
      "Here are the contents of the preloaded documents:",
    );
    for (const doc of preloaded) {
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
