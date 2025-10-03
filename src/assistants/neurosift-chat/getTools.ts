import * as executeJavaScript from "./neurosiftChat/executeJavaScript";
import { QPTool } from "../../qpcommon/types";

const getTools = async (): Promise<QPTool[]> => {
  return [executeJavaScript];
};

export default getTools;
