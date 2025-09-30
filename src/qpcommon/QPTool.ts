import { ORFunctionDescription } from "./completion/openRouterTypes";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ToolExecutionContext {}

export interface QPTool {
  toolFunction: ORFunctionDescription;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (params: any, o?: ToolExecutionContext) => Promise<string>;
  getDetailedDescription: () => Promise<string>;
  requiresPermission: boolean;
}
