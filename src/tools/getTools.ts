import getAppName from "../qpcommon/getAppName";
import { QPTool } from "../qpcommon/types";
import { Chat } from "../qpcommon/types";

import getTestChatTools from "../assistants/test-chat/getTools";
import getStanAssistantTools from "../assistants/stan-assistant/getTools";
import getNwbAssistantTools from "../assistants/nwb-assistant/getTools";
import getNeurosiftChatTools from "../assistants/neurosift-chat/getTools";
import getDandisetExplorerTools from "../assistants/dandiset-explorer/getTools";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getTools = async (_chat: Chat): Promise<QPTool[]> => {
  const appName = getAppName();
  if (appName === "stan-assistant") {
    return getStanAssistantTools();
  } else if (appName === "nwb-assistant") {
    return getNwbAssistantTools();
  } else if (appName === "neurosift-chat") {
    return getNeurosiftChatTools();
  } else if (appName === "test-chat") {
    return getTestChatTools();
  } else if (appName === "dandiset-explorer") {
    return getDandisetExplorerTools();
  } else {
    return Promise.resolve([]);
  }
};

export default getTools;
