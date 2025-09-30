import { FunctionComponent, useState } from "react";
import ModelSelectionDialog from "./ModelSelectionDialog";

interface UsageDisplayProps {
  model: string;
  setModel: (model: string) => void;
  totalUsage: {
    promptTokens: number;
    completionTokens: number;
    estimatedCost: number;
  };
}

const UsageDisplay: FunctionComponent<UsageDisplayProps> = ({
  model,
  setModel,
  totalUsage,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatTokens = (tokens: number): string => {
    return tokens.toLocaleString();
  };

  const formatCost = (cost: number): string => {
    return `$${cost.toFixed(3)}`;
  };

  return (
    <>
      <div className="usage-display">
        <span className="model-name-clickable" onClick={() => setIsDialogOpen(true)}>
          {model}
        </span>{" "}
        • {formatTokens(totalUsage.promptTokens)} in •{" "}
        {formatTokens(totalUsage.completionTokens)} out •{" "}
        {formatCost(totalUsage.estimatedCost)}
      </div>
      <ModelSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        currentModel={model}
        onSelectModel={setModel}
      />
    </>
  );
};

export default UsageDisplay;
