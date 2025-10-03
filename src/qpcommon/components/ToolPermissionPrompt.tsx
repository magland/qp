import { FunctionComponent } from "react";

interface ToolPermissionPromptProps {
  toolName: string;
  onAllow: () => void;
  onDeny: () => void;
}

const ToolPermissionPrompt: FunctionComponent<ToolPermissionPromptProps> = ({
  toolName,
  onAllow,
  onDeny,
}) => {
  return (
    <div
      style={{
        padding: "16px",
        margin: "10px 20px",
        backgroundColor: "#fff3cd",
        border: "2px solid #ffc107",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>🔒</span>
        <h3
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: "bold",
            color: "#856404",
          }}
        >
          Permission Required
        </h3>
      </div>
      <div
        style={{
          marginBottom: "16px",
          fontSize: "0.95rem",
          color: "#856404",
          lineHeight: "1.5",
        }}
      >
        <p style={{ margin: "0 0 8px 0" }}>
          The assistant wants to use the tool: <strong>{toolName}</strong>
        </p>
      </div>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button
          onClick={onAllow}
          style={{
            padding: "10px 24px",
            fontSize: "0.95rem",
            fontWeight: "bold",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#218838")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#28a745")
          }
        >
          ✓ Allow
        </button>
        <button
          onClick={onDeny}
          style={{
            padding: "10px 24px",
            fontSize: "0.95rem",
            fontWeight: "bold",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#c82333")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#dc3545")
          }
        >
          ✗ Deny
        </button>
      </div>
    </div>
  );
};

export default ToolPermissionPrompt;
