import * as executePythonCode from "../../qpcommon/tools/executePythonCode";
import * as getDandisetAssets from "./getDandisetAssets";
import * as getNwbFileInfo from "./getNwbFileInfo";
import { QPTool } from "../../qpcommon/types";

const getTools = async (): Promise<QPTool[]> => {
  return [executePythonCode, getDandisetAssets, getNwbFileInfo];
};

export default getTools;
