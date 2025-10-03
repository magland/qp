/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { JupyterConnectivityContext } from "./JupyterConnectivity";
import {
  JupyterServerConfig,
  builtInLocalServers,
  isJupyterServerConfig,
} from "./types";
import { publicServers } from "./publicServers";

const STORAGE_KEY = "jupyterServers";

const loadServerConfigFromLocalStorage = (): JupyterServerConfig => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      const x = JSON.parse(stored);
      if (!isJupyterServerConfig(x)) {
        throw new Error("Invalid server config");
      }
      return x;
    } catch (e) {
      console.error("Failed to load server config from localStorage", e);
    }
  }

  return {
    selectedServerUrl: "",
    servers: builtInLocalServers,
  };
};

const loadServerConfig = (): JupyterServerConfig => {
  const config = loadServerConfigFromLocalStorage();

  // remember the tokens for built-in servers
  const tokensForBuiltInServers: {
    [url: string]: string;
  } = {};
  for (const server of config.servers) {
    if (server.isBuiltIn) {
      tokensForBuiltInServers[server.url] = server.token;
    }
  }

  // remove the built-in servers and add them back
  config.servers = config.servers.filter((s) => !s.isBuiltIn);
  config.servers.push(...builtInLocalServers);
  config.servers.push(
    ...publicServers.map((s) => ({
      url: s.url,
      name: s.name,
      isBuiltIn: true,
      token: tokensForBuiltInServers[s.url] || "",
    })),
  );

  return config;
};

const saveServerConfigToLocalStorage = (config: JupyterServerConfig) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

export const JupyterConnectivityProvider: FunctionComponent<
  PropsWithChildren<{
    mode: "jupyter-server" | "jupyterlab-extension";
    disabled?: boolean;
    extensionKernel?: any;
  }>
> = ({ children, mode, disabled, extensionKernel }) => {
  const [jupyterServerUrl, setJupyterServerUrl] = useState("");
  const [jupyterServerToken, setJupyterServerToken] = useState("");

  const [jupyterServerIsAvailable, setJupyterServerIsAvailable] =
    useState(false);
  const [numActiveKernels, setNumActiveKernels] = useState(0);

  // Load server config from localStorage on mount
  const [serverConfig, setServerConfig] = useState<JupyterServerConfig | null>(
    null,
  );

  // Initialize server config on mount
  useEffect(() => {
    if (disabled) {
      return;
    }
    const config = loadServerConfig();
    setServerConfig(config);
  }, [disabled]);

  // Update jupyterServerUrl and jupyterServerToken when serverConfig changes
  useEffect(() => {
    if (disabled) {
      return;
    }
    if (serverConfig) {
      setJupyterServerUrl(serverConfig.selectedServerUrl);
      setJupyterServerToken(
        serverConfig.servers.find(
          (s) => s.url === serverConfig.selectedServerUrl,
        )?.token || "",
      );
    }
  }, [serverConfig, disabled]);

  // Save server config to localStorage when it changes
  useEffect(() => {
    if (!serverConfig) {
      return;
    }
    if (serverConfig.servers.length > 0) {
      // but only if it has been loaded
      saveServerConfigToLocalStorage(serverConfig);
    }
  }, [serverConfig]);

  const check = useCallback(async () => {
    if (!jupyterServerUrl) {
      setJupyterServerIsAvailable(false);
      return;
    }
    if (mode === "jupyter-server") {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const headers: { [key: string]: string } = {
          "Content-Type": "application/json",
        };
        if (jupyterServerToken) {
          headers["Authorization"] = `token ${jupyterServerToken}`;
        }
        const resp = await fetch(`${jupyterServerUrl}/api/kernels`, {
          method: "GET",
          // apparently it's import to specify the header here, otherwise it seems the header fields can violate CORS
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (resp.ok) {
          const kernels = await resp.json();
          setJupyterServerIsAvailable(true);
          setNumActiveKernels(kernels.length);
        } else {
          console.error("Failed to fetch kernels", resp);
          setJupyterServerIsAvailable(false);
          setNumActiveKernels(0);
        }
      } catch (e: any) {
        console.error("Failed to fetch kernels *", e);
        setJupyterServerIsAvailable(false);
        setNumActiveKernels(0);
      }
    } else if (mode === "jupyterlab-extension") {
      setJupyterServerIsAvailable(!!extensionKernel);
    }
  }, [jupyterServerUrl, jupyterServerToken, mode, extensionKernel]);

  const [refreshCode, setRefreshCode] = useState(0);

  useEffect(() => {
    if (disabled) {
      return;
    }
    check();
  }, [check, refreshCode, disabled]);

  const refreshJupyter = useCallback(() => setRefreshCode((c) => c + 1), []);

  const value = useMemo(
    () => ({
      mode,
      jupyterServerUrl,
      jupyterServerToken,
      jupyterServerIsAvailable,
      refreshJupyter,
      setJupyterServerUrl,
      setJupyterServerToken,
      extensionKernel,
      numActiveKernels,
      serverConfig,
      setServerConfig,
    }),
    [
      mode,
      jupyterServerUrl,
      jupyterServerToken,
      jupyterServerIsAvailable,
      refreshJupyter,
      setJupyterServerUrl,
      setJupyterServerToken,
      extensionKernel,
      numActiveKernels,
      serverConfig,
    ],
  );

  return (
    <JupyterConnectivityContext.Provider value={value}>
      {children}
    </JupyterConnectivityContext.Provider>
  );
};
