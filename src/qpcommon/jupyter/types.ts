/* eslint-disable @typescript-eslint/no-explicit-any */
export interface JupyterServer {
  url: string;
  name: string;
  token: string;
  isBuiltIn: boolean;
}

export interface JupyterServerConfig {
  selectedServerUrl: string;
  servers: JupyterServer[];
}

export const isJupyterServerConfig = (
  config: any,
): config is JupyterServerConfig => {
  return (
    config &&
    typeof config.selectedServerUrl === "string" &&
    Array.isArray(config.servers) &&
    config.servers.every(
      (server: any) =>
        server &&
        typeof server.url === "string" &&
        typeof server.name === "string" &&
        typeof server.token === "string" &&
        typeof server.isBuiltIn === "boolean",
    )
  );
};

// Default built-in servers
export const builtInLocalServers: JupyterServer[] = [
  {
    url: "http://localhost:8888",
    name: "",
    token: "default local server",
    isBuiltIn: true,
  },
  {
    url: "http://localhost:8010",
    name: "jupyter-web-proxy for JupyterHub",
    token: "",
    isBuiltIn: true,
  },
];
