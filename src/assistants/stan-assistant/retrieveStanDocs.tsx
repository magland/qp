/* eslint-disable @typescript-eslint/no-explicit-any */
import { ORToolCall } from "../../qpcommon/completion/openRouterTypes";
import { ChatMessage, QPFunctionDescription } from "../../qpcommon/types";

export const toolFunction: QPFunctionDescription = {
  name: "retrieve_stan_docs",
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

type RetrieveStanDocsParams = {
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

export const getDocPages = (): DocPage[] => {
  return [
    {
      title: "Main Page",
      url: "https://mc-stan.org/docs/stan-users-guide/index.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/index.qmd",
      includeFromStart: true,
    },
    {
      title: "Regression Models",
      url: "https://mc-stan.org/docs/stan-users-guide/regression.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/regression.qmd",
      includeFromStart: true,
    },
    {
      title: "Time-Series Models",
      url: "https://mc-stan.org/docs/stan-users-guide/time-series.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/time-series.qmd",
      includeFromStart: false,
    },
    {
      title: "Missing Data and Partially Known Parameters",
      url: "https://mc-stan.org/docs/stan-users-guide/missing-data.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/missing-data.qmd",
      includeFromStart: false,
    },
    {
      title: "Truncated or Censored Data",
      url: "https://mc-stan.org/docs/stan-users-guide/truncation-censoring.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/truncation-censoring.qmd",
      includeFromStart: false,
    },
    {
      title: "Finite Mixtures",
      url: "https://mc-stan.org/docs/stan-users-guide/finite-mixtures.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/finite-mixtures.qmd",
      includeFromStart: false,
    },
    {
      title: "Measurement Error and Meta-Analysis",
      url: "https://mc-stan.org/docs/stan-users-guide/measurement-error.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/measurement-error.qmd",
      includeFromStart: false,
    },
    {
      title: "Latent Discrete Parameters",
      url: "https://mc-stan.org/docs/stan-users-guide/latent-discrete.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/latent-discrete.qmd",
      includeFromStart: false,
    },
    {
      title: "Sparse and Ragged Data Structures",
      url: "https://mc-stan.org/docs/stan-users-guide/sparse-ragged.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/sparse-ragged.qmd",
      includeFromStart: false,
    },
    {
      title: "Clustering Models",
      url: "https://mc-stan.org/docs/stan-users-guide/clustering.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/clustering.qmd",
      includeFromStart: false,
    },
    {
      title: "Gaussian Processes",
      url: "https://mc-stan.org/docs/stan-users-guide/gaussian-processes.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/gaussian-processes.qmd",
      includeFromStart: false,
    },
    {
      title: "Directions, Rotatations, and Hyperspheres",
      url: "https://mc-stan.org/docs/stan-users-guide/hyperspherical-models.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/hyperspherical-models.qmd",
      includeFromStart: false,
    },
    {
      title: "Solving Algebraic Equations",
      url: "https://mc-stan.org/docs/stan-users-guide/algebraic-equations.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/algebraic-equations.qmd",
      includeFromStart: false,
    },
    {
      title: "Ordinary Differential Equations",
      url: "https://mc-stan.org/docs/stan-users-guide/odes.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/odes.qmd",
      includeFromStart: false,
    },
    {
      title: "Computing One-Dimensional Integrals",
      url: "https://mc-stan.org/docs/stan-users-guide/one-dimensional-integrals.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/one-dimensional-integrals.qmd",
      includeFromStart: false,
    },
    {
      title: "Complex Numbers",
      url: "https://mc-stan.org/docs/stan-users-guide/complex-numbers.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/complex-numbers.qmd",
      includeFromStart: false,
    },
    {
      title: "Differential Algebraic Equations",
      url: "https://mc-stan.org/docs/stan-users-guide/dae.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/dae.qmd",
      includeFromStart: false,
    },
    {
      title: "Survival Models",
      url: "https://mc-stan.org/docs/stan-users-guide/survival.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/survival.qmd",
      includeFromStart: false,
    },
    {
      title: "Floating Point Arithmetic",
      url: "https://mc-stan.org/docs/stan-users-guide/floating-point.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/floating-point.qmd",
      includeFromStart: false,
    },
    {
      title: "Matrices, Vectors, Arrays, and Tuples",
      url: "https://mc-stan.org/docs/stan-users-guide/matrices-arrays.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/matrices-arrays.qmd",
      includeFromStart: false,
    },
    {
      title: "Multi-Indexing",
      url: "https://mc-stan.org/docs/stan-users-guide/multi-indexing.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/multi-indexing.qmd",
      includeFromStart: false,
    },
    {
      title: "User-Defined Functions",
      url: "https://mc-stan.org/docs/stan-users-guide/user-functions.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/user-functions.qmd",
      includeFromStart: false,
    },
    {
      title: "Custom Probability Functions",
      url: "https://mc-stan.org/docs/stan-users-guide/custom-probability.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/custom-probability.qmd",
      includeFromStart: false,
    },
    {
      title: "Proportionality Constants",
      url: "https://mc-stan.org/docs/stan-users-guide/proportionality-constants.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/proportionality-constants.qmd",
      includeFromStart: false,
    },
    {
      title: "Problematic Posteriors",
      url: "https://mc-stan.org/docs/stan-users-guide/problematic-posteriors.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/problematic-posteriors.qmd",
      includeFromStart: false,
    },
    {
      title: "Reparameterization and Change of Variables",
      url: "https://mc-stan.org/docs/stan-users-guide/reparameterization.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/reparameterization.qmd",
      includeFromStart: false,
    },
    {
      title: "Efficiency Tuning",
      url: "https://mc-stan.org/docs/stan-users-guide/efficiency-tuning.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/efficiency-tuning.qmd",
      includeFromStart: false,
    },
    {
      title: "Parallelization",
      url: "https://mc-stan.org/docs/stan-users-guide/parallelization.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/parallelization.qmd",
      includeFromStart: false,
    },
    {
      title: "Posterior Predictive Sampling",
      url: "https://mc-stan.org/docs/stan-users-guide/posterior-prediction.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/posterior-prediction.qmd",
      includeFromStart: false,
    },
    {
      title: "Simulation-Based Calibration",
      url: "https://mc-stan.org/docs/stan-users-guide/simulation-based-calibration.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/simulation-based-calibration.qmd",
      includeFromStart: false,
    },
    {
      title: "Posterior and Prior Predictive Checks",
      url: "https://mc-stan.org/docs/stan-users-guide/posterior-predictive-checks.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/posterior-predictive-checks.qmd",
      includeFromStart: false,
    },
    {
      title: "Held-Out Evaluation and Cross-Validation",
      url: "https://mc-stan.org/docs/stan-users-guide/cross-validation.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/cross-validation.qmd",
      includeFromStart: false,
    },
    {
      title: "Poststratification",
      url: "https://mc-stan.org/docs/stan-users-guide/poststratification.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/poststratification.qmd",
      includeFromStart: false,
    },
    {
      title: "Decision Analysis",
      url: "https://mc-stan.org/docs/stan-users-guide/decision-analysis.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/decision-analysis.qmd",
      includeFromStart: false,
    },
    {
      title: "The Bootstrap and Bagging",
      url: "https://mc-stan.org/docs/stan-users-guide/bootstrap.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/bootstrap.qmd",
      includeFromStart: false,
    },
    {
      title: "Using the Stan Compiler",
      url: "https://mc-stan.org/docs/stan-users-guide/using-stanc.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/using-stanc.qmd",
      includeFromStart: false,
    },
    {
      title: "Stan Program Style Guide",
      url: "https://mc-stan.org/docs/stan-users-guide/style-guide.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/style-guide.qmd",
      includeFromStart: false,
    },
    {
      title: "Transitioning from BUGS",
      url: "https://mc-stan.org/docs/stan-users-guide/for-bugs-users.html",
      sourceUrl:
        "https://raw.githubusercontent.com/stan-dev/docs/refs/heads/master/src/stan-users-guide/for-bugs-users.qmd",
      includeFromStart: false,
    },
  ];
  // if (cachedDocPages) {
  //   return cachedDocPages;
  // }

  // try {
  //   const response = await fetch(DOC_PAGES_URL);
  //   if (!response.ok) {
  //     throw new Error(`Failed to fetch doc pages: ${response.statusText}`);
  //   }
  //   const docPages = (await response.json()).docPages as DocPage[];

  //   console.info('Doc pages:', docPages);
  //   if (!docPages) {
  //     throw new Error("Failed to load document pages");
  //   }
  //   if (typeof docPages !== "object") {
  //     throw new Error("Invalid document pages format");
  //   }
  //   if (!Array.isArray(docPages)) {
  //     throw new Error("Document pages is not an array");
  //   }
  //   if (docPages.length === 0) {
  //     throw new Error("No documents are currently available.");
  //   }

  //   cachedDocPages = docPages;
  //   return docPages;
  // } catch (error) {
  //   console.error("Error fetching doc pages:", error);
  //   // Fallback to empty array if fetch fails
  //   return [];
  // }
};

// Regression Models
// https://mc-stan.org/docs/stan-users-guide/regression.html

// Time-Series Models
// https://mc-stan.org/docs/stan-users-guide/time-series.html

// Missing Data and Partially Known Parameters
// https://mc-stan.org/docs/stan-users-guide/missing-data.html

// Truncated or Censored Data
// https://mc-stan.org/docs/stan-users-guide/truncation-censoring.html

// Finite Mixtures
// https://mc-stan.org/docs/stan-users-guide/finite-mixtures.html

// Measurement Error and Meta-Analysis
// https://mc-stan.org/docs/stan-users-guide/measurement-error.html

// Latent Discrete Parameters
// https://mc-stan.org/docs/stan-users-guide/latent-discrete.html

// Sparse and Ragged Data Structures
// https://mc-stan.org/docs/stan-users-guide/sparse-ragged.html

// Clustering Models
// https://mc-stan.org/docs/stan-users-guide/clustering.html

// Gaussian Processes
// https://mc-stan.org/docs/stan-users-guide/gaussian-processes.html

// Directions, Rotatations, and Hyperspheres
// https://mc-stan.org/docs/stan-users-guide/hyperspherical-models.html

// Solving Algebraic Equations
// https://mc-stan.org/docs/stan-users-guide/algebraic-equations.html

// Ordinary Differential Equations
// https://mc-stan.org/docs/stan-users-guide/odes.html

// Computing One-Dimensional Integrals
// https://mc-stan.org/docs/stan-users-guide/one-dimensional-integrals.html

// Complex Numbers
// https://mc-stan.org/docs/stan-users-guide/complex-numbers.html

// Differential Algebraic Equations
// https://mc-stan.org/docs/stan-users-guide/dae.html

// Survival Models
// https://mc-stan.org/docs/stan-users-guide/survival.html

// Floating Point Arithmetic
// https://mc-stan.org/docs/stan-users-guide/floating-point.html

// Matrices, Vectors, Arrays, and Tuples
// https://mc-stan.org/docs/stan-users-guide/matrices-arrays.html

// Multi-Indexing
// https://mc-stan.org/docs/stan-users-guide/multi-indexing.html

// User-Defined Functions
// https://mc-stan.org/docs/stan-users-guide/user-functions.html

// Custom Probability Functions
// https://mc-stan.org/docs/stan-users-guide/custom-probability.html

// Proportionality Constants
// https://mc-stan.org/docs/stan-users-guide/proportionality-constants.html

// Problematic Posteriors
// https://mc-stan.org/docs/stan-users-guide/problematic-posteriors.html

// Reparameterization and Change of Variables
// https://mc-stan.org/docs/stan-users-guide/reparameterization.html

// Efficiency Tuning
// https://mc-stan.org/docs/stan-users-guide/efficiency-tuning.html

// Parallelization
// https://mc-stan.org/docs/stan-users-guide/parallelization.html

// Posterior Predictive Sampling
// https://mc-stan.org/docs/stan-users-guide/posterior-prediction.html

// Simulation-Based Calibration
// https://mc-stan.org/docs/stan-users-guide/simulation-based-calibration.html

// Posterior and Prior Predictive Checks
// https://mc-stan.org/docs/stan-users-guide/posterior-predictive-checks.html

// Held-Out Evaluation and Cross-Validation
// https://mc-stan.org/docs/stan-users-guide/cross-validation.html

// Poststratification
// https://mc-stan.org/docs/stan-users-guide/poststratification.html

// Decision Analysis
// https://mc-stan.org/docs/stan-users-guide/decision-analysis.html

// The Bootstrap and Bagging
// https://mc-stan.org/docs/stan-users-guide/bootstrap.html

// Using the Stan Compiler
// https://mc-stan.org/docs/stan-users-guide/using-stanc.html

// Stan Program Style Guide
// https://mc-stan.org/docs/stan-users-guide/style-guide.html

// Transitioning from BUGS
// https://mc-stan.org/docs/stan-users-guide/for-bugs-users.html

export const execute = async (
  params: RetrieveStanDocsParams,
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
    console.warn("Error in retrieve_stan_docs:", error);
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
  retLines.push("Retrieve content from a list of Stan document URLs.");
  retLines.push("");

  retLines.push(
    "The tool first validates that all provided URLs are in the allowed list",
  );
  retLines.push("");

  retLines.push("The output is a JSON array where each element has the form:");
  retLines.push("{");
  retLines.push(`  "url": "Stan document URL"`);
  retLines.push(` "content": "Stan document content"`);
  retLines.push("}");
  retLines.push("");

  retLines.push(
    "Here is the list of all available Stan documents with descriptions:",
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
