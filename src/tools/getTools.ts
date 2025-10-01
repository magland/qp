import getAppName from "../qpcommon/getAppName";
import { QPTool } from "../qpcommon/types";
import { Chat } from "../qpcommon/types";
import * as retrieveStanDocs from "./retrieveStanDocs";
import * as retrieveNwbDocs from "./retrieveNwbDocs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getTools = async (_chat: Chat): Promise<QPTool[]> => {
  const appName = getAppName();
  if (appName === "stan-assistant") {
    return Promise.resolve([retrieveStanDocs]);
  }
  else if (appName === "nwb-assistant") {
    return Promise.resolve([retrieveNwbDocs]);
  }
  else {
    return Promise.resolve([]);
  }
};

export default getTools;