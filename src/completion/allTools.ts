/* eslint-disable @typescript-eslint/no-explicit-any */
// import * as retrieveDocs from "./tools/retrieveDocs";

import { ORFunctionDescription } from "./openRouterTypes";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ToolExecutionContext {}

interface NCTool {
  toolFunction: ORFunctionDescription;
  execute: (params: any, o?: ToolExecutionContext) => Promise<string>;
  getDetailedDescription: () => Promise<string>;
  requiresPermission: boolean;
}

// const staticTools: NCTool[] = [retrieveDocs];
const staticTools: NCTool[] = [];

export const getAllTools = async () => {
  return [...staticTools] as const;
};

// For backward compatibility with existing imports
export default staticTools;
