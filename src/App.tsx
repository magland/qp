import {
  BrowserRouter
} from "react-router-dom";
import MainWindow from "./qpcommon/MainWindow";
import { Chat } from "./qpcommon/types";
import { QPTool } from "./qpcommon/QPTool";

function App() {
  return (
    <BrowserRouter>
      <MainWindow getTools={getTools} assistantDescription={assistantDescription} />
    </BrowserRouter>
  );
}

const assistantDescription = "You are a helpful AI assistant answering questions about the solar system.";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getTools = async (_chat: Chat): Promise<QPTool[]> => {
  // For demonstration purposes, we return an empty array of tools.
  return Promise.resolve([]);
};

export default App;
