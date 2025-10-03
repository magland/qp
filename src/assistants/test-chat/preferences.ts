import { Preferences } from "../../qpcommon/MainWindow";
import testChatAssistantDescription from "./testChatSystemPrompt";

const suggestedPrompts = [
  "Execute a simple Python script that prints 'Hello, World!'.",
];

const preferences: Preferences = {
  assistantSystemPrompt: testChatAssistantDescription,
  assistantDisplayInfo: "Assistant for testing qp.",
  suggestedPrompts,
};

export default preferences;
