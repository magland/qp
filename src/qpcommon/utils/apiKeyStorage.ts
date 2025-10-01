const OPENROUTER_API_KEY_STORAGE_KEY = "openrouter_api_key";

export const getStoredApiKey = (): string | null => {
  try {
    return localStorage.getItem(OPENROUTER_API_KEY_STORAGE_KEY);
  } catch (error) {
    console.error("Error reading API key from localStorage:", error);
    return null;
  }
};

export const setStoredApiKey = (apiKey: string): void => {
  try {
    localStorage.setItem(OPENROUTER_API_KEY_STORAGE_KEY, apiKey);
  } catch (error) {
    console.error("Error saving API key to localStorage:", error);
  }
};

export const clearStoredApiKey = (): void => {
  try {
    localStorage.removeItem(OPENROUTER_API_KEY_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing API key from localStorage:", error);
  }
};

export const maskApiKey = (apiKey: string): string => {
  if (!apiKey || apiKey.length < 8) {
    return "***";
  }
  return `${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`;
};
