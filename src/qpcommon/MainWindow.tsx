import { FunctionComponent, useCallback, useEffect, useState } from "react";
import {
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate
} from "react-router-dom";
import { createNewChat } from "./interface/interface";
import ChatPage from "./pages/ChatPage";
import NewChatPage from "./pages/NewChatPage";
import ChatsListPage from "./pages/ChatsListPage";
import { Chat } from "./types";
import { QPTool } from "./types";
import getAppName from "./getAppName";

type MainWindowProps = {
  getTools: (chat: Chat) => Promise<QPTool[]>;
  preferences: Preferences;
};

export type Preferences = {
  assistantDescription: string;
  newChatTitle: string;
  newChatPromptPlaceholderText: string;
};

const MainWindow: FunctionComponent<MainWindowProps> = ({ getTools, preferences }) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();
  const handleSubmitInitialPrompt = useCallback(
    async (prompt: string) => {
      const chatId = await createNewChat(prompt, getAppName());
      navigate(`/chat/${chatId}`);
    },
    [navigate]
  );

  const location = useLocation();
  const chatId = location.pathname.startsWith("/chat/")
    ? location.pathname.replace("/chat/", "")
    : null;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" />} />
      <Route
        path="/chats"
        element={
          <ChatsListPage
            width={windowDimensions.width}
            height={windowDimensions.height}
          />
        }
      />
      <Route
        path="/chat"
        element={
          <NewChatPage
            width={windowDimensions.width}
            height={windowDimensions.height}
            onSubmitInitialPrompt={handleSubmitInitialPrompt}
            preferences={preferences}
          />
        }
      />
      <Route
        path="/chat/:chatId"
        element={
          <ChatPage
            width={windowDimensions.width}
            height={windowDimensions.height}
            chatId={chatId || ""}
            getTools={getTools}
            preferences={preferences}
          />
        }
      />
      <Route path="*" element={<Navigate to="/chat" />} />
    </Routes>
  );
}

export default MainWindow;
