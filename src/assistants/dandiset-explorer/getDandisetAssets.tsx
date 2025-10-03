/* eslint-disable @typescript-eslint/no-explicit-any */
import { ORToolCall } from "../../qpcommon/completion/openRouterTypes";
import MarkdownContent from "../../qpcommon/components/MarkdownContent";
import { ChatMessage, QPFunctionDescription } from "../../qpcommon/types";

export const toolFunction: QPFunctionDescription = {
  name: "get_dandiset_assets",
  description: "Retrieve information about assets (or files) in a dandiset.",
  parameters: {
    type: "object",
    properties: {
      dandisetId: {
        type: "string",
        description:
          "The ID of the dandiset to retrieve assets (or files) from.",
      },
      dandisetVersion: {
        type: "string",
        description:
          "The version of the dandiset to retrieve assets (or files) from.",
      },
      page: {
        type: "integer",
        description: "The page number to retrieve (default is 1).",
        default: 1,
      },
      pageSize: {
        type: "integer",
        description:
          "The number of assets (or files) to retrieve per page (default is 10).",
        default: 10,
      },
      glob: {
        type: "string",
        description:
          "A glob pattern to filter the assets (or files) to retrieve.",
        default: "",
      },
    },
    required: ["dandisetId", "dandisetVersion"],
  },
};

type GetDandisetAssetsParams = {
  dandisetId: string;
  dandisetVersion: string;
  page?: number;
  pageSize?: number;
  glob?: string;
};

export const execute = async (
  params: GetDandisetAssetsParams,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _o: any,
) => {
  const { dandisetId, dandisetVersion, page, pageSize } = params;

  try {
    const response = await fetch(
      `https://api.dandiarchive.org/api/dandisets/${dandisetId}/versions/${dandisetVersion}/assets/?page=${
        page || 1
      }&page_size=${pageSize || 10}&metadata=false&zarr=false&glob=${
        params.glob || ""
      }`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          // X-CSRFTOKEN: process.env.CSRF_TOKEN,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error fetching assets: ${response.statusText}`);
    }

    const data = await response.json();
    const results = data.results.map((result: any) => ({
      asset_id: result.asset_id,
      path: result.path,
      size: result.size,
    }));
    return { result: JSON.stringify(results, null, 2) };
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
  return `Retrieve information about assets (or files) in a dandiset.

The response will be an array of objects of the form:
{
      "asset_id": <asset_id>,
      "path": <path_of_asset>,
      "size": <size_in_bytes>,
}
`;
};

export const createToolCallView = (
  toolCall: ORToolCall,
  toolOutput: (ChatMessage & { role: "tool" }) | undefined,
): React.JSX.Element => {
  const args = JSON.parse(toolCall.function.arguments || "{}");
  const dandisetId: string = args.dandisetId || "";
  const mdContent = `**Retrieving files for Dandiset ${dandisetId}**`;
  const md = <MarkdownContent content={mdContent} />;
  if (!toolOutput) {
    return <>{md}</>;
  } else {
    const contentParsed = JSON.parse(toolOutput.content || "[]");
    return (
      <>
        {md}
        {toolOutput.content && <>Retrieved {contentParsed.length} files:</>}
      </>
    );
  }
};

export const requiresPermission = false;

export const isCancelable = false;
