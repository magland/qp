/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, Dispatch, SetStateAction } from "react";
import { JupyterServerConfig } from "./types";

export type JupyterConnectivityState = {
  mode: "jupyter-server" | "jupyterlab-extension";
  jupyterServerUrl: string;
  jupyterServerToken: string;
  jupyterServerIsAvailable: boolean;
  refreshJupyter: () => void;
  setJupyterServerUrl: (newUrl: string) => void;
  setJupyterServerToken: (newToken: string) => void;
  extensionKernel?: any;
  numActiveKernels: number;
  serverConfig: JupyterServerConfig | null;
  setServerConfig: Dispatch<SetStateAction<JupyterServerConfig | null>>;
};

export const JupyterConnectivityContext =
  createContext<JupyterConnectivityState | null>(null);

export const tokenForPublicServer = (serverName: string) => {
  try {
    const publicServerTokens = localStorage.getItem("public-server-tokens");
    if (publicServerTokens) {
      const tokens = JSON.parse(publicServerTokens);
      return tokens[serverName];
    }
  } catch (e) {
    console.error("Failed to get public server token", e);
  }
  return "";
};

export const setTokenForPublicServer = (serverName: string, token: string) => {
  try {
    const publicServerTokens = localStorage.getItem("public-server-tokens");
    const tokens = publicServerTokens ? JSON.parse(publicServerTokens) : {};
    tokens[serverName] = token;
    localStorage.setItem("public-server-tokens", JSON.stringify(tokens));
  } catch (e) {
    console.error("Failed to set public server token", e);
  }
};

export const useJupyterConnectivity = () => {
  const context = useContext(JupyterConnectivityContext);
  if (!context) {
    throw new Error(
      "useJupyterConnectivity must be used within a JupyterConnectivityProvider",
    );
  }
  return context;
};
