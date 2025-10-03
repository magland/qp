import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { FunctionComponent, useState, useCallback } from "react";
import ScrollY from "./ScrollY";
import { useJupyterConnectivity } from "./JupyterConnectivity";
import { testPythonSession, TestResult } from "./pythonSessionTester";
import { JupyterServer } from "./types";
import MarkdownContent from "../components/MarkdownContent";

type JupyterViewProps = {
  width?: number;
  height?: number;
};

const ServerStatusIndicator = ({ isAvailable }: { isAvailable: boolean }) => (
  <Box
    component="span"
    sx={{
      display: "inline-block",
      width: 10,
      height: 10,
      borderRadius: "50%",
      backgroundColor: isAvailable ? "success.main" : "error.main",
      marginRight: 1,
    }}
  />
);

const JupyterConfigurationView: FunctionComponent<JupyterViewProps> = ({
  width,
  height,
}) => {
  const connectivity = useJupyterConnectivity();
  const {
    jupyterServerUrl,
    jupyterServerIsAvailable,
    numActiveKernels,
    refreshJupyter,
    serverConfig,
    setServerConfig,
  } = connectivity;

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | undefined>();

  const handleTest = useCallback(async () => {
    if (!serverConfig) return;

    setIsTesting(true);
    setTestResult(undefined);
    try {
      const result = await testPythonSession(connectivity);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsTesting(false);
    }
  }, [connectivity, serverConfig]);

  const [isAddServerDialogOpen, setIsAddServerDialogOpen] = useState(false);
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] =
    useState(false);
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  const [serverToDelete, setServerToDelete] = useState<string | null>(null);
  const [serverForToken, setServerForToken] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [newServerUrl, setNewServerUrl] = useState("");
  const [newServerName, setNewServerName] = useState("");

  const handleServerSelect = useCallback(
    (url: string) => {
      setServerConfig((prev) => {
        if (prev) {
          return {
            ...prev,
            selectedServerUrl: url,
          };
        }
        return prev;
      });
    },
    [setServerConfig],
  );

  const handleAddServer = useCallback(() => {
    if (newServerUrl) {
      const newServer: JupyterServer = {
        url: newServerUrl,
        name: newServerName,
        token: "",
        isBuiltIn: false,
      };
      setServerConfig((prev) => {
        if (prev) {
          return {
            ...prev,
            servers: [...prev.servers, newServer],
          };
        }
        return prev;
      });
      setNewServerUrl("");
      setNewServerName("");
      setIsAddServerDialogOpen(false);
    }
  }, [newServerUrl, newServerName, setServerConfig]);

  const handleDeleteConfirm = useCallback(() => {
    if (serverToDelete) {
      setServerConfig((prev) => {
        if (prev) {
          return {
            ...prev,
            servers: prev.servers.filter((s) => s.url !== serverToDelete),
          };
        }
        return prev;
      });
    }
    setIsDeleteConfirmDialogOpen(false);
    setServerToDelete(null);
  }, [serverToDelete, setServerConfig]);

  const handleRemoveServer = useCallback((url: string) => {
    setServerToDelete(url);
    setIsDeleteConfirmDialogOpen(true);
  }, []);

  const handleSetToken = useCallback((url: string) => {
    setServerForToken(url);
    setTokenInput("");
    setIsTokenDialogOpen(true);
  }, []);

  const handleTokenSubmit = useCallback(() => {
    if (serverForToken) {
      setServerConfig((prev) => {
        if (prev) {
          return {
            ...prev,
            servers: prev.servers.map((s) =>
              s.url === serverForToken ? { ...s, token: tokenInput } : s,
            ),
          };
        }
        return prev;
      });
    }
    setIsTokenDialogOpen(false);
    setServerForToken(null);
    setTokenInput("");
  }, [serverForToken, tokenInput, setServerConfig]);

  const originToAllow = window.location.origin;

  const currentServer = serverConfig?.servers.find(
    (s) => s.url === serverConfig.selectedServerUrl,
  );
  const servers = serverConfig?.servers || [];

  return (
    <ScrollY width={width || 600} height={height || 600}>
      <Box sx={{ p: 2 }}>
        {/* Status Section */}
        <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <ServerStatusIndicator isAvailable={jupyterServerIsAvailable} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Jupyter Connection
              {currentServer?.name && ` - ${currentServer.name}`}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Current Server Status
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                wordBreak: "break-all",
                mb: 1,
              }}
            >
              {jupyterServerUrl}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              {jupyterServerIsAvailable ? (
                <>
                  <Typography variant="body2" color="success.main">
                    Connected - {numActiveKernels} active{" "}
                    {numActiveKernels === 1 ? "kernel" : "kernels"}
                  </Typography>
                  <Button
                    size="small"
                    onClick={handleTest}
                    disabled={isTesting}
                  >
                    {isTesting ? "Testing..." : "Test Connection"}
                  </Button>
                  {testResult && (
                    <Typography
                      variant="body2"
                      color={testResult.success ? "success.main" : "error.main"}
                    >
                      {testResult.message}
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  <Typography variant="body2" color="error.main">
                    Not connected - see instructions below to host a server
                  </Typography>
                  <Button size="small" onClick={refreshJupyter}>
                    Retry Connection
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </Paper>

        {/* Server Selection Table */}
        <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Server Selection
          </Typography>
          <TableContainer
            sx={{ "& table": { tableLayout: "auto", width: "auto" } }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ width: "48px" }} />
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    URL (name)
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", width: "150px" }}>
                    Token
                  </TableCell>
                  <TableCell padding="checkbox" sx={{ width: "48px" }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {servers.map((server) => (
                  <TableRow key={server.url}>
                    <TableCell padding="checkbox">
                      <Radio
                        checked={jupyterServerUrl === server.url}
                        onChange={() => handleServerSelect(server.url)}
                      />
                    </TableCell>
                    <TableCell
                      onClick={() => handleServerSelect(server.url)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      {server.url} {server.name ? `(${server.name})` : ""}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2">
                          {server.token ? "******" : ""}
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => handleSetToken(server.url)}
                        >
                          {server.token ? "Change token" : "Set token"}
                        </Button>
                      </Stack>
                    </TableCell>
                    <TableCell padding="checkbox">
                      {!server.isBuiltIn && (
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveServer(server.url)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2 }}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => setIsAddServerDialogOpen(true)}
            >
              Add Server
            </Button>
          </Box>
        </Paper>

        {/* Delete Server Confirmation Dialog */}
        <Dialog
          open={isDeleteConfirmDialogOpen}
          onClose={() => {
            setIsDeleteConfirmDialogOpen(false);
            setServerToDelete(null);
          }}
        >
          <DialogTitle>Confirm Server Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this server?
              {serverToDelete && (
                <Box component="div" sx={{ mt: 1, wordBreak: "break-all" }}>
                  {serverToDelete}
                </Box>
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsDeleteConfirmDialogOpen(false);
                setServerToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Server Dialog */}
        <Dialog
          open={isAddServerDialogOpen}
          onClose={() => setIsAddServerDialogOpen(false)}
        >
          <DialogTitle>Add New Server</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Server URL"
                value={newServerUrl}
                onChange={(e) => setNewServerUrl(e.target.value)}
                fullWidth
                placeholder="http://localhost:8890"
              />
              <TextField
                label="Server Name (optional)"
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                fullWidth
                placeholder="My Custom Server"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddServerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddServer} disabled={!newServerUrl}>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Token Dialog */}
        <Dialog
          open={isTokenDialogOpen}
          onClose={() => {
            setIsTokenDialogOpen(false);
            setServerForToken(null);
            setTokenInput("");
          }}
        >
          <DialogTitle>Set Server Token</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Token"
              type="text"
              fullWidth
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsTokenDialogOpen(false);
                setServerForToken(null);
                setTokenInput("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleTokenSubmit}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Host Instructions */}
        <MarkdownContent
          content={hostInstructions
            .split("{ originToAllow }")
            .join(originToAllow)}
        />
      </Box>
    </ScrollY>
  );
};

const hostInstructions = `
## Instructions

**To run a local Jupyter server**, you need to install JupyterLab. You can do this using pip:

\`\`\`bash
pip install jupyterlab
\`\`\`

Then, start JupyterLab with the following command:

\`\`\`bash
jupyter lab --NotebookApp.allow_origin='{ originToAllow }' --NotebookApp.token='' --NotebookApp.disable_check_xsrf="True" --no-browser --port=8888 --MappingKernelManager.cull_interval="300" --MappingKernelManager.cull_idle_timeout="300" --MappingKernelManager.cull_connected="True"
\`\`\`

This command allows connections from your local frontend application, disables the token for easier access, and sets up kernel culling to manage resources effectively.

Finally, update the URL and optional token in the form above to connect to your local Jupyter server.

**To connect to JupyterHub (e.g., DANDI Hub)**, you can use the \`jupyter-web-proxy\` package. Run:

\`\`\`bash
npx jupyter-web-proxy https://hub.dandiarchive.org/user/<user> -t <token> -o { originToAllow }
\`\`\`

Replace \`<user>\` with your username and \`<token>\` with your JupyterHub token. Then select http://localhost:8010 above.

For more information, see the [jupyter-web-proxy documentation](https://www.npmjs.com/package/jupyter-web-proxy).
`;

export default JupyterConfigurationView;
