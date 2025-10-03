import * as retrieveNwbDocs from "./retrieveNwbDocs";
import * as executePythonCode from "../../qpcommon/tools/executePythonCode";
import { QPTool } from "../../qpcommon/types";

const getTools = async (): Promise<QPTool[]> => {
  return [retrieveNwbDocs, executePythonCode];
};

export default getTools;
