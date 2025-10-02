import { Preferences } from "../../qpcommon/MainWindow";
import neurosiftChatAssistantDescription from "./neurosiftChatSystemPrompt";

const suggestedPrompts = [
  "What can you help with?",
  "How many dandisets are published?",
  "How many OpenNeuro datasets have fewer than 10 files?",
  "Find starred dandisets with Units and ElectricalSeries data",
  "What are all the genotypes in DANDI?",
  "What are all the species in DANDI?",
  "Show published dandisets larger than 100GB",
  "Find dandisets that contain both male and female subjects",
  "Break down OpenNeuro datasets by modality",
  "I'm looking for human data involving a writing task",
  // "Show a histogram of sampling rates for ElectricalSeries objects in DANDI.", // not working currently
];

const preferences: Preferences = {
  assistantSystemPrompt: neurosiftChatAssistantDescription,
  assistantDisplayInfo: "Assistant for exploring and querying neuroscience datasets across DANDI Archive, OpenNeuro, and EBRAINS repositories, with capabilities to search datasets, analyze NWB files, and generate data visualizations.",
  suggestedPrompts,
};

export default preferences;
