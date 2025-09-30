/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * HorizontalSplitter Component
 *
 * This component creates a horizontal split view with a draggable divider between two panels.
 * Special handling is implemented to address an issue with iframe event capture during splitter dragging:
 *
 * Problem:
 * When dragging the splitter and the mouse enters an iframe region, the main window loses mouse events
 * because they get captured by the iframe. This breaks the drag operation and creates a poor user experience.
 *
 * Solution:
 * - When dragging starts, a full-window overlay div is shown above all content (including iframes)
 * - This overlay captures all mouse events during the drag operation
 * - The iframe cannot steal events because the overlay is above it
 * - Result is smooth, uninterrupted dragging regardless of iframe content
 */

import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export interface HorizontalSplitterProps {
  width: number;
  height: number;
  initialSplitterPosition: number;
  children: [React.ReactNode, React.ReactNode]; // Exactly two children required
}

const SPLITTER_WIDTH = 8; // Width of the splitter handle area in pixels

const HorizontalSplitter: FunctionComponent<HorizontalSplitterProps> = ({
  width,
  height,
  initialSplitterPosition,
  children,
}) => {
  const [splitterPosition, setSplitterPosition] = useState(
    initialSplitterPosition,
  );
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - containerRect.left;
      // Constrain position to reasonable bounds (minimum 100px from either edge)
      const constrainedPosition = Math.max(
        100,
        Math.min(width - 100, relativeX),
      );
      setSplitterPosition(constrainedPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Add a class to the body to prevent text selection during drag
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [isDragging, width]);

  // Ensure splitter stays within bounds if width changes
  useEffect(() => {
    setSplitterPosition((prev) => Math.max(100, Math.min(width - 100, prev)));
  }, [width]);

  const leftPanelWidth = splitterPosition - SPLITTER_WIDTH / 2;
  const rightPanelWidth = width - splitterPosition - SPLITTER_WIDTH / 2;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width,
        height,
      }}
    >
      {/*
        Overlay div that only appears during dragging.
        - Positioned above all content including iframes
        - Captures mouse events to prevent iframe event stealing
        - Transparent but covers entire window
        - Critical for maintaining smooth drag operations
      */}
      {isDragging && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            cursor: "col-resize",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: leftPanelWidth,
          height,
          overflow: "hidden",
        }}
      >
        {React.cloneElement(children[0] as any, {
          width: leftPanelWidth,
          height,
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: splitterPosition - SPLITTER_WIDTH / 2,
          top: 0,
          width: SPLITTER_WIDTH,
          height,
          cursor: "col-resize",
          backgroundColor: isDragging ? "#666" : "transparent",
          zIndex: 1000,
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            position: "absolute",
            left: SPLITTER_WIDTH / 2,
            top: 0,
            width: 1,
            height: "100%",
            backgroundColor: "#ccc",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: splitterPosition + SPLITTER_WIDTH / 2,
          top: 0,
          width: rightPanelWidth,
          height,
          overflow: "hidden",
        }}
      >
        {React.cloneElement(children[1] as any, {
          width: rightPanelWidth,
          height,
        })}
      </div>
    </div>
  );
};

export default HorizontalSplitter;
