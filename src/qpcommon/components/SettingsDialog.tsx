import { FunctionComponent, useState, useEffect } from "react";
import {
  getStoredApiKey,
  setStoredApiKey,
  clearStoredApiKey,
  maskApiKey,
} from "../utils/apiKeyStorage";
import JupyterConfigurationView from "../jupyter/JupyterConfigurationView";
import { Preferences } from "../MainWindow";

interface SettingsDialogProps {
  preferences: Preferences;
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDialog: FunctionComponent<SettingsDialogProps> = ({
  preferences,
  isOpen,
  onClose,
}) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [savedMessage, setSavedMessage] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      const storedKey = getStoredApiKey();
      if (storedKey) {
        setApiKey(storedKey);
      } else {
        setApiKey("");
      }
      setSavedMessage("");
      setShowApiKey(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      setStoredApiKey(apiKey.trim());
      setSavedMessage("API key saved successfully!");
      setTimeout(() => {
        setSavedMessage("");
        onClose();
      }, 1500);
    }
  };

  const handleClear = () => {
    clearStoredApiKey();
    setApiKey("");
    setSavedMessage("API key cleared!");
    setTimeout(() => {
      setSavedMessage("");
    }, 1500);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const storedKey = getStoredApiKey();
  const hasStoredKey = !!storedKey;

  return (
    <div className="model-dialog-overlay" onClick={handleOverlayClick}>
      <div className="model-dialog" style={{ maxWidth: "800px" }}>
        <div className="model-dialog-header">
          <h3>Settings</h3>
          <button className="model-dialog-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div style={{ padding: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              OpenRouter API Key
            </label>
            <p
              style={{ fontSize: "0.9em", color: "#666", marginBottom: "12px" }}
            >
              Required for premium models. Get your key from{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007bff", textDecoration: "underline" }}
              >
                openrouter.ai/keys
              </a>
            </p>
            <div style={{ position: "relative" }}>
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                style={{
                  width: "100%",
                  padding: "10px",
                  paddingRight: "80px",
                  fontSize: "14px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "4px 8px",
                  fontSize: "12px",
                  backgroundColor: "#f8f9fa",
                  color: "#333",
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                {showApiKey ? "Hide" : "Show"}
              </button>
            </div>
            {hasStoredKey && (
              <p
                style={{ fontSize: "0.85em", color: "#666", marginTop: "8px" }}
              >
                Current key: {maskApiKey(storedKey)}
              </p>
            )}
          </div>

          {savedMessage && (
            <div
              style={{
                padding: "10px",
                marginBottom: "15px",
                backgroundColor: "#d4edda",
                border: "1px solid #c3e6cb",
                borderRadius: "4px",
                color: "#155724",
                textAlign: "center",
              }}
            >
              {savedMessage}
            </div>
          )}

          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
          >
            {hasStoredKey && (
              <button
                onClick={handleClear}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Clear Key
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                backgroundColor: apiKey.trim() ? "#007bff" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: apiKey.trim() ? "pointer" : "not-allowed",
              }}
            >
              Save
            </button>
          </div>
        </div>
        {preferences.requiresJupyter && <JupyterConfigurationView />}
      </div>
    </div>
  );
};

export default SettingsDialog;
