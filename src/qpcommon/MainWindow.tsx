/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, useEffect, useState } from "react";
import {
    Navigate,
    Route,
    Routes,
    useLocation
} from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import ChatsListPage from "./pages/ChatsListPage";
import { Chat } from "./types";
import { QPTool } from "./types";

type MainWindowProps = {
  getTools: (chat: Chat) => Promise<QPTool[]>;
  preferences: Preferences;
};

export type Preferences = {
  assistantSystemPrompt: string;
  assistantDisplayInfo: any;
  suggestedPrompts: string[];
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

  const location = useLocation();
  const chatId = location.pathname.startsWith("/chat/")
    ? location.pathname.replace("/chat/", "")
    : location.pathname === "/chat"
    ? ""
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
          <ChatPage
            key="new-chat" // Force remount when switching to new chat
            width={windowDimensions.width}
            height={windowDimensions.height}
            chatId=""
            getTools={getTools}
            preferences={preferences}
          />
        }
      />
      <Route
        path="/chat/:chatId"
        element={
          <ChatPage
            key={chatId} // Force remount when switching chats
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
