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
  description?: string;
};

export const getDocPages = (): DocPage[] => {
  return [
    // === PRELOADED: Core (1 docs) ===
    {
      title: "HED annotation semantics",
      url: "https://www.hedtags.org/hed-resources/HedAnnotationSemantics.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/HedAnnotationSemantics.md",
      includeFromStart: true,
      category: "core",
      description: "Outlines the fundamental principles and rules for HED annotation syntax and structure.",
    },
    // === PRELOADED: Schema (1 docs) ===
   {
      title: "HED standard schema (latest)",
      url: "https://raw.githubusercontent.com/hed-standard/hed-schemas/main/schemas_latest_json/HEDLatest.json",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/schemas_latest_json/HEDLatest.json",
      includeFromStart: true,
      category: "schemas",
      description: "The latest version of the standard HED schema in JSON format, defining the hierarchical structure and vocabulary for HED tags.",
    },
    // === PRELOADED: Specification (2 docs) ===
    {
      title: "HED terminology",
      url: "https://www.hedtags.org/hed-specification/02_Terminology.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/02_Terminology.md",
      includeFromStart: true,
      category: "specification",
      description: "Defines key terms and concepts used throughout the HED specification to ensure consistent understanding.",
    },
    {
      title: "Basic annotation",
      url: "https://www.hedtags.org/hed-specification/04_Basic_annotation.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/04_Basic_annotation.md",
      includeFromStart: true,
      category: "specification",
      description: "Covers the essential guidelines and methods for creating basic HED annotations for events.",
    },
    // === PRELOADED: Introductory (2 doc) ===
    {
      title: "Introduction to HED",
      url: "https://www.hedtags.org/hed-resources/IntroductionToHed.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/IntroductionToHed.md",
      includeFromStart: true,
      category: "introductory",
      description: "Provides an overview of the Hierarchical Event Descriptors (HED) system, its purpose, and its applications in event annotation.",
    },
    {
      title: "How can you use HED?",
      url: "https://www.hedtags.org/hed-resources/HowCanYouUseHed.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HowCanYouUseHed.md",
      includeFromStart: true,
      category: "introductory",
      description: "Explains various use cases and scenarios where HED can be effectively applied for event annotation in research data.",
    },
    // === ON-DEMAND: Specification Details (7 docs) ===
    {
      title: "HED formats",
      url: "https://www.hedtags.org/hed-specification/03_HED_formats.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/03_HED_formats.md",
      includeFromStart: false,
      category: "specification",
      description: "Describes the different formats in which HED schemas and annotations can be represented and stored.",
    },
    {
      title: "Advanced annotation",
      url: "https://www.hedtags.org/hed-specification/05_Advanced_annotation.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/05_Advanced_annotation.md",
      includeFromStart: false,
      category: "specification",
      description: "Discusses use of definitions, temporal scope, and other advanced annotation features.",
    },
    {
      title: "HED support of BIDS",
      url: "https://www.hedtags.org/hed-specification/06_Infrastructure_and_tools.html#hed-support-of-bids",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/06_Infrastructure_and_tools.md#hed-support-of-bids",
      includeFromStart: false,
      category: "specification",
      description: "Explains how HED integrates with the Brain Imaging Data Structure (BIDS) for standardized event annotation in neuroimaging datasets.",
    },
    {
      title: "Library schemas",
      url: "https://www.hedtags.org/hed-specification/07_Library_schemas.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/07_Library_schemas.md",
      includeFromStart: false,
      category: "specification",
      description: "Details the concept of library schemas in HED, which allow for domain-specific extensions to the base HED schema.",
    },
    {
      title: "HED errors",
      url: "https://www.hedtags.org/hed-specification/Appendix_B.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/main/docs/source/Appendix_B.md",
      includeFromStart: false,
      category: "specification",
      description: "Lists and explains the various error codes and messages that can be encountered during HED annotation validation.",
    },
    {
      title: "Test cases",
      url: "https://raw.githubusercontent.com/hed-standard/hed-specification/refs/heads/main/tests/javascriptTests.json",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-specification/refs/heads/main/tests/javascriptTests.json",
      includeFromStart: false,
      category: "examples",
      description: "Examples of correct and incorrect HED annotations in JSON format for testing validation tools.",
    },
    // === ON-DEMAND: Quickstarts (2 docs) ===
    {
      title: "HED annotation quickstart",
      url: "https://www.hedtags.org/hed-resources/HedAnnotationQuickstart.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedAnnotationQuickstart.md",
      includeFromStart: false,
      category: "quickstart",
      description: "A step-by-step guide to quickly get started with HED annotation for events in datasets.",
    },
    {
      title: "BIDS annotation quickstart",
      url: "https://www.hedtags.org/hed-resources/BidsAnnotationQuickstart.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/BidsAnnotationQuickstart.md",
      includeFromStart: false,
      category: "quickstart",
      description: "A concise tutorial on how to apply HED annotations within the BIDS framework for neuroimaging data.",
    },
    {
      title: "HED annotation in NWB",
      url: "https://www.hedtags.org/hed-resources/HedAnnotationInNWB.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedAnnotationInNWB.md",
      includeFromStart: false,
      category: "quickstart",
      description: "A concise tutorial on how to apply HED annotations within the NWB (Neurodata without borders) framework for neuroimaging data.",
    },
    // === ON-DEMAND: Integration (1 docs) ===
    {
      title: "Getting started with HED in HWB",
      url: "https://www.hedtags.org/ndx-hed/description.html",
      sourceUrl: "https://raw.githubusercontent.com/hed-standard/ndx-hed/refs/heads/main/docs/source/description.rst",
      includeFromStart: false,
      category: "core",
      description: "More detailed description of the ndx-hed extension architecture and usage.",
    },
   
    // === ON-DEMAND: Core concepts (2 docs) ===
    {
      title: "HED conditions and design matrices",
      url: "https://www.hedtags.org/hed-resources/HedConditionsAndDesignMatrices.html",
      sourceUrl: "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedConditionsAndDesignMatrices.md",
      includeFromStart: false,
      category: "core",
      description: "Explains how to represent experimental conditions and design matrices using HED annotations for complex study designs.",
    },
    {
      title: "HED schemas",
      url: "https://www.hedtags.org/hed-resources/HedSchemas.html",
      sourceUrl:
        "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedSchemas.md",
      includeFromStart: false,
      category: "core",
      description: "Describes the structure and organization of HED schemas, including the standard schema and library schemas for specific domains."
    },
   
    // === ON-DEMAND: Tools (4 docs) ===
    {
      title: "HED python tools",
      url: "https://www.hedtags.org/hed-python/user_guide.html#",
      sourceUrl: "https://raw.githubusercontent.com/hed-standard/hed-python/refs/heads/main/docs/user_guide.md",
      includeFromStart: false,
      category: "tools",
      description: "Comprehensive guide to using the HED Python library for annotating, validating, and processing HED tags in datasets.",
    },
    {
      title: "HED MATLAB tools",
      url: "https://www.hedtags.org/hed-resources/HedMatlabTools.html",
      sourceUrl: "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedMatlabTools.md",
      includeFromStart: false,
      category: "tools",
      description: "Instructions for utilizing the HED MATLAB toolbox to work with HED annotations within MATLAB environments.",
    },
    {
      title: "HED JavaScript Tools",
      url: "https://www.hedtags.org/hed-javascript/docs/",
      sourceUrl: "https://raw.githubusercontent.com/hed-standard/hed-javascript/refs/heads/main/README.md",
      includeFromStart: false,
      category: "tools",
      description: "Guide to using HED JavaScript libraries for client-side annotation and validation of HED tags in web applications.",
    },
    {
      title: "HED online tools",
      url: "https://www.hedtags.org/hed-resources/HedOnlineTools.html",
      sourceUrl: "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedOnlineTools.md",
      includeFromStart: false,
      category: "tools",
      description: "Overview of online tools available for HED annotation, validation, and schema browsing through web interfaces.",
    },

    // === ON-DEMAND: Advanced (4 docs) ===
    {
      title: "HED schema developers guide",
      url: "https://www.hedtags.org/hed-resources/HedSchemaDevelopersGuide.html",
      sourceUrl: "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedSchemaDevelopersGuide.md",
      includeFromStart: false,
      category: "advanced",
      description: "Instructions and best practices for developers looking to create and maintain HED library schemas.",
    },
    {
      title: "HED validation guide",
      url: "https://www.hedtags.org/hed-resources/HedValidationGuide.html",
      sourceUrl: "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedValidationGuide.md",
      includeFromStart: false,
      category: "advanced",
      description: "Detailed instructions on how to validate HED annotations using various tools and best practices to ensure compliance with HED standards.",
    },
    {
      title: "HED search guide",
      url: "https://www.hedtags.org/hed-resources/HedSearchGuide.html",
      sourceUrl: "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedSearchGuide.md",
      includeFromStart: false,
      category: "advanced",
      description: "Instructions on how to effectively search and query HED tags within datasets using available tools.",
    },
    {
      title: "HED summary guide",
      url: "https://www.hedtags.org/hed-resources/HedSummaryGuide.html",
      sourceUrl: "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedSummaryGuide.md",
      includeFromStart: false,
      category: "advanced",
      description: "Guidance on generating and interpreting summaries of HED annotations in datasets to facilitate data analysis.",
    },

    // === ON-DEMAND: Integration (1 docs) ===
    {
      title: "HED and EEGLAB",
      url: "https://www.hedtags.org/hed-resources/HedAndEEGLAB.html",
      sourceUrl: "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedAndEEGLAB.md",
      includeFromStart: false,
      category: "integration",
      description: "Describes how to integrate HED annotations within the EEGLAB environment for EEG data analysis.",
    },

    // === ON-DEMAND: Reference (2 docs) ===
    {
      title: "Documentation summary",
      url: "https://www.hedtags.org/hed-resources/DocumentationSummary.html",
      sourceUrl: "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/DocumentationSummary.md",
      includeFromStart: false,
      category: "reference",
      description: "An overview of all HED documentation resources, providing quick access to various guides, specifications, and tools.",
    },
    {
      title: "HED test datasets",
      url: "https://www.hedtags.org/hed-resources/HedTestDatasets.html",
      sourceUrl: "https://raw.githubusercontent.com/hed-standard/hed-resources/main/docs/source/HedTestDatasets.md",
      includeFromStart: false,
      category: "reference",
      description: "A collection of datasets specifically designed for testing HED annotations and validation tools.",
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
    "core",
    "schemas",
    "quickstart",
    "introductory",
    "specification",
    "tools",
    "advanced",
    "integration",
    "reference",
  ];

  const categoryNames: { [key: string]: string } = {
    core: "Core concepts",
    schemas: "Schemas",
    quickstart: "Quick start tutorials",
    introductory: "Introductory guides",
    specification: "Specification details",
    tools: "Tool guides",
    advanced: "Advanced topics",
    integration: "Integration & standards",
    reference: "Reference & meta",
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
