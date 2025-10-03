import * as executePythonCode from "../../qpcommon/tools/executePythonCode";
import { QPTool } from "../../qpcommon/types";

const getTools = async (): Promise<QPTool[]> => {
  return [executePythonCode];
};

export default getTools;
