import { useCallback, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import NewChatPage from "./pages/NewChatPage";
import { createNewChat } from "./interface/interface";

function App() {
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
      const chatId = await createNewChat(prompt);
      navigate(`/qp/chat/${chatId}`);
    },
    [navigate]
  );

  const location = useLocation();
  const chatId = location.pathname.startsWith("/qp/chat/")
    ? location.pathname.replace("/qp/chat/", "")
    : null;

  return (
    <Routes>
      <Route path="/qp/" element={<Navigate to="/qp/chat" />} />
      <Route
        path="/qp/chat"
        element={
          <NewChatPage
            width={windowDimensions.width}
            height={windowDimensions.height}
            onSubmitInitialPrompt={handleSubmitInitialPrompt}
          />
        }
      />
      <Route
        path="/qp/chat/:chatId"
        element={
          <ChatPage
            width={windowDimensions.width}
            height={windowDimensions.height}
            chatId={chatId || ""}
          />
        }
      />
    </Routes>
  );
}

export default App;
