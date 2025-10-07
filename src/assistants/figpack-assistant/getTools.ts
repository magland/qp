import * as retrieveFigpackDocs from "./retrieveFigpackDocs";
import { QPTool } from "../../qpcommon/types";

const getTools = async (): Promise<QPTool[]> => {
  return [retrieveFigpackDocs];
};

export default getTools;
