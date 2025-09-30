import SendIcon from "@mui/icons-material/Send";
import { IconButton, Paper, TextField } from "@mui/material";
import { FunctionComponent, KeyboardEvent } from "react";

type MessageInputProps = {
  currentPromptText: string;
  setCurrentPromptText: (text: string) => void;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
};

const MessageInput: FunctionComponent<MessageInputProps> = ({
  currentPromptText,
  setCurrentPromptText,
  onSendMessage,
  disabled = false,
}) => {
  const message = currentPromptText;
  const setMessage = setCurrentPromptText;
  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        placeholder="Type your message..."
        sx={{ flex: 1 }}
      />
      <IconButton
        color="primary"
        onClick={handleSend}
        disabled={!message.trim() || disabled}
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default MessageInput;
