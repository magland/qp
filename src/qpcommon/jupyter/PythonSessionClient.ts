/* eslint-disable @typescript-eslint/no-explicit-any */
import { KernelManager, ServerConnection, Kernel } from "@jupyterlab/services";
import { JupyterConnectivityState } from "./JupyterConnectivity";
import { IIOPubMessage } from "@jupyterlab/services/lib/kernel/messages";

export type PythonSessionStatus =
  | "idle"
  | "busy"
  | "unavailable"
  | "uninitiated";

export type PlotlyContent = {
  config: {
    plotlyServerURL: string;
  };
  data: any;
  layout: any;
};

export type PythonSessionOutputItem =
  | {
      type: "iopub";
      iopubMessage: IIOPubMessage;
    }
  | {
      type: "system-error";
      content: string;
    };
// | {
//     type: "stdout" | "stderr";
//     content: string;
//   }
// | {
//     type: "image";
//     format: "png";
//     content: string;
//   }
// | {
//     type: "figure";
//     format: "plotly";
//     content: PlotlyContent;
//   }

let allKernelsStartedInThisBrowserSession: Kernel.IKernelConnection[] = [];

window.addEventListener("beforeunload", () => {
  // we cannot do an async shutdown here, but we can record this list of kernel IDs to localStorage so we can shut them down on next load
  const kernelIds = allKernelsStartedInThisBrowserSession.map((k) => k.id);
  let existingIdsToShutdown: string[] = [];
  try {
    const existingIdsToShutdownStr = localStorage.getItem(
      "kernels-to-shutdown",
    );
    if (existingIdsToShutdownStr) {
      existingIdsToShutdown = JSON.parse(existingIdsToShutdownStr);
    }
  } catch (e) {
    console.error("Failed to parse existingIdsToShutdown", e);
  }
  existingIdsToShutdown = existingIdsToShutdown.concat(kernelIds);
  try {
    localStorage.setItem(
      "kernels-to-shutdown",
      JSON.stringify(existingIdsToShutdown),
    );
  } catch (e) {
    console.error("Failed to set existingIdsToShutdown", e);
  }
});

// now on next load, we can shutdown these kernels
let existingKernelIdsToShutdown: string[] = [];
try {
  const existingIdsToShutdownStr = localStorage.getItem("kernels-to-shutdown");
  if (existingIdsToShutdownStr) {
    existingKernelIdsToShutdown = JSON.parse(existingIdsToShutdownStr);
  }
} catch (e) {
  console.error("Failed to parse existingIdsToShutdown", e);
}

class PythonSessionClient {
  #onOutputItemCallbacks: ((item: PythonSessionOutputItem) => void)[] = [];
  #pythonSessionStatus: PythonSessionStatus = "uninitiated";
  #onPythonSessionStatusChangedCallbacks: ((
    status: PythonSessionStatus,
  ) => void)[] = [];
  #kernel: Kernel.IKernelConnection | undefined;
  #kernelManager: KernelManager | undefined;
  #onStatusChangedSlot: any;
  #onIopubMessageSlot: any;
  constructor(private jupyterConnectivityState: JupyterConnectivityState) {}
  async initiate() {
    let kernelManager: KernelManager | undefined;
    let kernel: Kernel.IKernelConnection;
    if (this.jupyterConnectivityState.mode === "jupyter-server") {
      if (!this.jupyterConnectivityState.jupyterServerIsAvailable) {
        throw Error("Jupyter server is not available");
      }
      if (!this.jupyterConnectivityState.jupyterServerUrl) {
        throw Error("Jupyter server URL is not set");
      }
      const serverSettings = ServerConnection.makeSettings({
        baseUrl: this.jupyterConnectivityState.jupyterServerUrl,
        token: this.jupyterConnectivityState.jupyterServerToken,
      });
      kernelManager = new KernelManager({ serverSettings });
      // check to see if we have any existing kernels to shutdown
      for (const kernelId of existingKernelIdsToShutdown) {
        try {
          await kernelManager.shutdown(kernelId);
        } catch (e) {
          console.error("Failed to shutdown kernel", kernelId, e);
        }
      }
      existingKernelIdsToShutdown = [];
      localStorage.setItem(
        "kernels-to-shutdown",
        JSON.stringify(existingKernelIdsToShutdown),
      );
      this.#kernelManager = kernelManager;
      kernel = await kernelManager.startNew({
        name: "python",
      });
      allKernelsStartedInThisBrowserSession.push(kernel);
    } else if (this.jupyterConnectivityState.mode === "jupyterlab-extension") {
      if (!this.jupyterConnectivityState.extensionKernel) {
        throw Error(
          "extensionKernel is not available even though the mode is jupyter-server",
        );
      }
      kernel = this.jupyterConnectivityState.extensionKernel;
    } else {
      throw Error("Unexpected mode:" + this.jupyterConnectivityState.mode);
    }

    const onStatusChanged = (_: any, status: any) => {
      if (status === "idle") {
        this._setPythonSessionStatus("idle");
      } else if (status === "busy") {
        this._setPythonSessionStatus("busy");
      } else {
        // todo: separate this out
        this._setPythonSessionStatus("unavailable");
      }
    };

    const onIopubMessage = (_: any, msg: IIOPubMessage) => {
      this._addOutputItem({
        type: "iopub",
        iopubMessage: msg,
      });
      // console.log("iopub", msg);
      // if ("name" in msg.content) {
      //   if (msg.content.name === "stdout" || msg.content.name === "stderr") {
      //     const item: PythonSessionOutputItem = {
      //       type: msg.content.name,
      //       content: msg.content.text,
      //     };
      //     this._addOutputItem(item);
      //   }
      // } else if ("traceback" in msg.content) {
      //   const item: PythonSessionOutputItem = {
      //     type: "stderr",
      //     content: msg.content.traceback.join("\n") + "\n" + msg.content.evalue,
      //   };
      //   this._addOutputItem(item);
      // } else if ("data" in msg.content) {
      //   if ("image/png" in msg.content.data) {
      //     const item: PythonSessionOutputItem = {
      //       type: "image",
      //       format: "png",
      //       content: msg.content.data["image/png"] as string,
      //     };
      //     this._addOutputItem(item);
      //   } else if ("application/vnd.plotly.v1+json" in msg.content.data) {
      //     const item: PythonSessionOutputItem = {
      //       type: "figure",
      //       format: "plotly",
      //       content: msg.content.data[
      //         "application/vnd.plotly.v1+json"
      //       ] as PlotlyContent,
      //     };
      //     this._addOutputItem(item);
      //   }
      // }
    };

    this.#onStatusChangedSlot = onStatusChanged;
    this.#onIopubMessageSlot = onIopubMessage;

    kernel.statusChanged.connect(onStatusChanged);
    kernel.iopubMessage.connect(onIopubMessage);

    try {
      if (this.jupyterConnectivityState.mode === "jupyter-server") {
        // wait until we get our first status change
        while (this.#pythonSessionStatus === "uninitiated") {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        // wait until not busy
        while (this.#pythonSessionStatus === "busy") {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        if (this.#pythonSessionStatus === "unavailable") {
          throw Error("Python session unavailable");
        } else if (this.#pythonSessionStatus === "idle") {
          this.#kernel = kernel;
        } else {
          throw Error(
            "Unexpected python session status:" + this.#pythonSessionStatus,
          );
        }
      } else if (
        this.jupyterConnectivityState.mode === "jupyterlab-extension"
      ) {
        this.#pythonSessionStatus = "idle";
        this.#kernel = kernel;
      } else {
        throw Error("Unexpected mode:" + this.jupyterConnectivityState.mode);
      }
    } catch (err: any) {
      console.error("Error initiating", err);
      kernel.statusChanged.disconnect(onStatusChanged);
      kernel.iopubMessage.disconnect(onIopubMessage);
      if (this.#kernelManager) {
        this.#kernelManager.dispose();
        this.#kernelManager = undefined;
      }
      if (this.#kernel) {
        await this.#kernel.shutdown();
        allKernelsStartedInThisBrowserSession =
          allKernelsStartedInThisBrowserSession.filter(
            (k) => k !== this.#kernel,
          );
        this.#kernel = undefined;
      }
      throw err;
    }
  }
  async cancelExecution() {
    if (!this.#kernel) return;
    await this.#kernel.interrupt();
  }
  async shutdown() {
    if (this.jupyterConnectivityState.mode === "jupyter-server") {
      if (this.#kernel) {
        await this.#kernel.shutdown();
        allKernelsStartedInThisBrowserSession =
          allKernelsStartedInThisBrowserSession.filter(
            (k) => k !== this.#kernel,
          );
      }
      if (this.#kernelManager) {
        this.#kernelManager.dispose();
      }
      this.#kernel = undefined;
      this.#kernelManager = undefined;
    } else {
      // disconnect the slots
      if (this.#kernel) {
        if (this.#onStatusChangedSlot) {
          this.#kernel.statusChanged.disconnect(this.#onStatusChangedSlot);
        }
        if (this.#onIopubMessageSlot) {
          this.#kernel.iopubMessage.disconnect(this.#onIopubMessageSlot);
        }
      }
    }
  }
  async runCode(code: string) {
    if (!this.#kernel) {
      throw Error("Unexpected, no kernel in runCode");
      // try {
      //   console.info("initiating python session");
      //   await this.initiate();
      // } catch (err: any) {
      //   console.error("Error initiating", err);
      //   const errMessages = [
      //     "Error initiating python session. Configure your Jupyter connection in the Jupyter tab.",
      //   ];
      //   for (const errMessage of errMessages) {
      //     const item: PythonSessionOutputItem = {
      //       type: "system-error",
      //       content: errMessage,
      //     };
      //     this.#onOutputItemCallbacks.forEach((callback) => {
      //       callback(item);
      //     });
      //   }
      //   return;
      // }
    }
    if (!this.#kernel) throw Error("Unexpected, no kernel");
    const future = this.#kernel.requestExecute({ code });
    // const reply = await future.done;
    await future.done;
    future.dispose();
  }
  onOutputItem(callback: (item: PythonSessionOutputItem) => void) {
    this.#onOutputItemCallbacks.push(callback);
    return () => {
      this.removeOnOutputItem(callback);
    };
  }
  removeOnOutputItem(callback: (item: PythonSessionOutputItem) => void) {
    this.#onOutputItemCallbacks = this.#onOutputItemCallbacks.filter(
      (c) => c !== callback,
    );
  }
  get pythonSessionStatus() {
    return this.#pythonSessionStatus;
  }
  onPythonSessionStatusChanged(
    callback: (status: PythonSessionStatus) => void,
  ) {
    this.#onPythonSessionStatusChangedCallbacks.push(callback);
  }
  removeOnPythonSessionStatusChanged(
    callback: (status: PythonSessionStatus) => void,
  ) {
    this.#onPythonSessionStatusChangedCallbacks =
      this.#onPythonSessionStatusChangedCallbacks.filter((c) => c !== callback);
  }
  async waitUntilIdle() {
    while (this.#pythonSessionStatus !== "idle") {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  _setPythonSessionStatus(status: PythonSessionStatus) {
    this.#pythonSessionStatus = status;
    this.#onPythonSessionStatusChangedCallbacks.forEach((callback) => {
      callback(status);
    });
  }
  _addOutputItem(item: PythonSessionOutputItem) {
    this.#onOutputItemCallbacks.forEach((callback) => {
      callback(item);
    });
  }
}

export default PythonSessionClient;
