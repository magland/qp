import { Box, Button, Paper, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { ORToolCall } from "../qpcommon/completion/openRouterTypes";

type ToolApprovalMessageContainerProps = {
  children: React.ReactNode;
};

const ToolApprovalMessageContainer: FunctionComponent<
  ToolApprovalMessageContainerProps
> = ({ children }) => {
  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: theme.spacing(1),
        padding: theme.spacing(0, 2),
      })}
    >
      {children}
    </Box>
  );
};

type ToolApprovalMessageBubbleProps = {
  children: React.ReactNode;
};

const ToolApprovalMessageBubble: FunctionComponent<
  ToolApprovalMessageBubbleProps
> = ({ children }) => {
  return (
    <Paper
      elevation={1}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sx={(theme: any) => ({
        padding: theme.spacing(1, 2),
        maxWidth: "70%",
        backgroundColor: `${theme.palette.warning.light}20`, // Light warning color with 20% opacity
        color: theme.palette.text.primary,
        borderRadius: theme.spacing(2),
        wordBreak: "break-word",
      })}
    >
      {children}
    </Paper>
  );
};

type ToolApprovalMessageProps = {
  toolCallForPermission: ORToolCall;
  onSetToolCallApproval: (toolCall: ORToolCall, approved: boolean) => void;
};

const ToolApprovalMessage: FunctionComponent<ToolApprovalMessageProps> = ({
  toolCallForPermission,
  onSetToolCallApproval,
}) => {
  return (
    <ToolApprovalMessageGeneric
      toolCallForPermission={toolCallForPermission}
      onSetToolCallApproval={onSetToolCallApproval}
    />
  );
};

const ToolApprovalMessageGeneric: FunctionComponent<
  ToolApprovalMessageProps
> = ({ toolCallForPermission, onSetToolCallApproval }) => {
  return (
    <ToolApprovalMessageContainer>
      <ToolApprovalMessageBubble>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {"Tool Call Requires Approval"}
          </Typography>
          <Typography
            variant="body2"
            component="div"
            sx={{ fontFamily: "monospace", mb: 2 }}
          >
            {`${toolCallForPermission.function.name}(${toolCallForPermission.function.arguments})`}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() =>
                onSetToolCallApproval(toolCallForPermission, false)
              }
            >
              Deny
            </Button>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => onSetToolCallApproval(toolCallForPermission, true)}
            >
              Approve
            </Button>
          </Box>
        </Box>
      </ToolApprovalMessageBubble>
    </ToolApprovalMessageContainer>
  );
};

export default ToolApprovalMessage;
