import { FunctionComponent, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

type OpenRouterKeyDialogProps = {
  open: boolean;
  onClose: () => void;
  currentKey: string | undefined;
  onSave: (key: string) => void;
};

const OpenRouterKeyDialog: FunctionComponent<OpenRouterKeyDialogProps> = ({
  open,
  onClose,
  currentKey,
  onSave,
}) => {
  const [key, setKey] = useState(currentKey || "");

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>OpenRouter API Key Settings</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          To use models other than gpt-4.1-mini, gemini-2.0-flash-001 and
          gpt-4o-mini, you need to provide your own OpenRouter API key. You can
          get one at{" "}
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://openrouter.ai/keys
          </a>
        </Typography>
        {currentKey && (
          <Typography variant="body2" fontFamily="monospace" sx={{ mb: 1 }}>
            Current key starts with: {currentKey.slice(0, 12)}...
          </Typography>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="OpenRouter API Key"
          type="password"
          fullWidth
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            onSave(key);
            onClose();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OpenRouterKeyDialog;
