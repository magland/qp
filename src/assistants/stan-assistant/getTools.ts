import * as retrieveStanDocs from "./retrieveStanDocs";
import { QPTool } from "../../qpcommon/types";

const getTools = async (): Promise<QPTool[]> => {
  return [retrieveStanDocs];
};

export default getTools;
