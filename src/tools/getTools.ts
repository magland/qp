import getAppName from "../qpcommon/getAppName";
import { QPTool } from "../qpcommon/types";
import { Chat } from "../qpcommon/types";
import * as retrieveStanDocs from "../assistants/stan-assistant/retrieveStanDocs";
import * as retrieveNwbDocs from "../assistants/nwb-assistant/retrieveNwbDocs";
import * as executeJavaScript from "../assistants/neurosift-chat/neurosiftChat/executeJavaScript";
import * as executePythonCode from "../qpcommon/tools/executePythonCode";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getTools = async (_chat: Chat): Promise<QPTool[]> => {
  const appName = getAppName();
  if (appName === "stan-assistant") {
    return Promise.resolve([retrieveStanDocs]);
  } else if (appName === "nwb-assistant") {
    return Promise.resolve([retrieveNwbDocs]);
  } else if (appName === "neurosift-chat") {
    return Promise.resolve([executeJavaScript]);
  } else if (appName === "test-chat") {
    return Promise.resolve([executePythonCode]);
  } else {
    return Promise.resolve([]);
  }
};

export default getTools;
