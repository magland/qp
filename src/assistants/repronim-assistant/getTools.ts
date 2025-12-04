import * as retrieveRepronimDocs from "./retrieveRepronimDocs";
import { QPTool } from "../../qpcommon/types";

const getTools = async (): Promise<QPTool[]> => {
  return [retrieveRepronimDocs];
};

export default getTools;
