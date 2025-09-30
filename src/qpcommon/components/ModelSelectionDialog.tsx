import { FunctionComponent } from "react";
import { AVAILABLE_MODELS } from "../completion/availableModels";

interface ModelSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string;
  onSelectModel: (model: string) => void;
}

const ModelSelectionDialog: FunctionComponent<ModelSelectionDialogProps> = ({
  isOpen,
  onClose,
  currentModel,
  onSelectModel,
}) => {
  if (!isOpen) return null;

  const handleModelClick = (model: string) => {
    onSelectModel(model);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="model-dialog-overlay" onClick={handleOverlayClick}>
      <div className="model-dialog">
        <div className="model-dialog-header">
          <h3>Select Model</h3>
          <button className="model-dialog-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="model-list">
          {AVAILABLE_MODELS.map((modelInfo) => (
            <div
              key={modelInfo.model}
              className={`model-item ${
                modelInfo.model === currentModel ? "model-item-selected" : ""
              }`}
              onClick={() => handleModelClick(modelInfo.model)}
            >
              <div className="model-item-label">{modelInfo.label}</div>
              <div className="model-item-cost">
                ${modelInfo.cost.prompt}/M in • ${modelInfo.cost.completion}/M out
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelSelectionDialog;
