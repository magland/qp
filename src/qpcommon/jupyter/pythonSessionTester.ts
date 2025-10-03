import PythonSessionClient from "./PythonSessionClient";
import { JupyterConnectivityState } from "./JupyterConnectivity";

export type TestResult = {
  success: boolean;
  message: string;
};

export const testPythonSession = async (
  jupyterConnectivity: JupyterConnectivityState,
): Promise<TestResult> => {
  const client = new PythonSessionClient(jupyterConnectivity);

  let outputReceived = false;
  let testPassed = false;

  try {
    client.onOutputItem((item) => {
      if (
        item.type === "iopub" &&
        "name" in item.iopubMessage.content &&
        item.iopubMessage.content.name === "stdout" &&
        (item.iopubMessage.content.text as string).includes(
          "Hello from Python!",
        )
      ) {
        outputReceived = true;
        testPassed = true;
      }
    });

    await client.initiate();
    // to update the number of active kernels in the UI
    jupyterConnectivity.refreshJupyter();
    await client.runCode(`
import time
print("Hello from Python!")
time.sleep(1)
`);
    await client.waitUntilIdle();
    await client.shutdown();
    // to update the number of active kernels in the UI
    jupyterConnectivity.refreshJupyter();

    return {
      success: testPassed,
      message: outputReceived
        ? "Test passed! Successfully executed Python code and received output."
        : "Test failed: Did not receive expected output",
    };
  } catch (error) {
    return {
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};
