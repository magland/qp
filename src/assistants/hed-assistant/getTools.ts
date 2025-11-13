import * as retrieveHedDocs from "./retrieveHedDocs";
import { QPTool } from "../../qpcommon/types";

const getTools = async (): Promise<QPTool[]> => {
  return [retrieveHedDocs];
};

export default getTools;
