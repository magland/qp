export class JobRunnerClient {
  private endpoint = "https://neurosift-search.vercel.app/api/execute-script";

  constructor() {
    // No initialization needed for simple HTTP approach
  }

  public isAlive(): boolean {
    // Always return true since we don't have connection state
    return true;
  }

  public onStatusChange(callback: () => void) {
    // No-op since we don't have connection state changes
    // The callback parameter is kept for API compatibility but not used
    void callback;
  }

  async executeScript(script: string): Promise<string> {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ script }),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Assuming the response contains an 'output' field
      // Adjust based on actual API response format
      if (data.error) {
        throw new Error(data.error);
      }

      return data.output || data.result || JSON.stringify(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to execute script: ${error.message}`);
      }
      throw new Error("Failed to execute script: Unknown error");
    }
  }

  dispose() {
    // No cleanup needed for simple HTTP approach
  }
}
