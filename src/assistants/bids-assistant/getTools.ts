import * as retrieveBidsDocs from "./retrieveBidsDocs";
import { QPTool } from "../../qpcommon/types";

const getTools = async (): Promise<QPTool[]> => {
  return [retrieveBidsDocs];
};

export default getTools;
