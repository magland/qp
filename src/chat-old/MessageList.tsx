import { Box } from "@mui/material";
import { FunctionComponent, useEffect, useRef } from "react";
import Message from "./Message";
import ToolApprovalMessage from "./ToolApprovalMessage";
import { ORMessage, ORToolCall } from "../qpcommon/completion/openRouterTypes";

type MessageListProps = {
  messages: ORMessage[];
  toolCallForPermission?: ORToolCall;
  onSetToolCallApproval?: (toolCall: ORToolCall, approved: boolean) => void;
  height: number;
  onDeleteMessage?: (message: ORMessage) => void;
};

const MessageList: FunctionComponent<MessageListProps> = ({
  messages,
  toolCallForPermission,
  onSetToolCallApproval,
  height,
  onDeleteMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, toolCallForPermission]);

  return (
    <Box
      sx={{
        height: height - 100, // Leave space for input
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        py: 2,
      }}
    >
      {messages
        .filter((m) => {
          // this is a hack to hide system messages that are just describing what the user is seeing
          if (m.role === "system" && (m.content as string).startsWith(":")) {
            return false;
          }
          return true;
        })
        .map((msg, index) => (
          <Box key={index}>
            <Message
              message={msg}
              messages={messages}
              isUser={msg.role === "user"}
              onDeleteMessage={
                msg.role === "user" && onDeleteMessage
                  ? () => onDeleteMessage(msg)
                  : undefined
              }
            />
          </Box>
        ))}
      {toolCallForPermission && onSetToolCallApproval && (
        <ToolApprovalMessage
          toolCallForPermission={toolCallForPermission}
          onSetToolCallApproval={onSetToolCallApproval}
        />
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;
