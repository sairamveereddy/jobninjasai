"use client";

import { memo } from "react";
import { Side, XYWH } from "@/types/canvas";

const HANDLE_WIDTH = 8;

interface SelectionBoxProps {
  bounds: XYWH;
  zoom: number;
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

export const SelectionBox = memo(({ bounds, zoom, onResizeHandlePointerDown }: SelectionBoxProps) => {
  return (
    <>
      <rect
        className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
        x={bounds.x}
        y={bounds.y}
        width={bounds.width}
        height={bounds.height}
      />
      {/* Top Left */}
      <rect
        className="fill-white stroke-blue-500 stroke-1 cursor-nwse-resize"
        x={bounds.x - HANDLE_WIDTH / 2}
        y={bounds.y - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Top | Side.Left, bounds);
        }}
      />
      {/* Top Center */}
      <rect
        className="fill-white stroke-blue-500 stroke-1 cursor-ns-resize"
        x={bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}
        y={bounds.y - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Top, bounds);
        }}
      />
      {/* Top Right */}
      <rect
        className="fill-white stroke-blue-500 stroke-1 cursor-nesw-resize"
        x={bounds.x + bounds.width - HANDLE_WIDTH / 2}
        y={bounds.y - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Top | Side.Right, bounds);
        }}
      />
      {/* Middle Right */}
      <rect
        className="fill-white stroke-blue-500 stroke-1 cursor-ew-resize"
        x={bounds.x + bounds.width - HANDLE_WIDTH / 2}
        y={bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Right, bounds);
        }}
      />
      {/* Bottom Right */}
      <rect
        className="fill-white stroke-blue-500 stroke-1 cursor-nwse-resize"
        x={bounds.x + bounds.width - HANDLE_WIDTH / 2}
        y={bounds.y + bounds.height - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Bottom | Side.Right, bounds);
        }}
      />
      {/* Bottom Center */}
      <rect
        className="fill-white stroke-blue-500 stroke-1 cursor-ns-resize"
        x={bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2}
        y={bounds.y + bounds.height - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Bottom, bounds);
        }}
      />
      {/* Bottom Left */}
      <rect
        className="fill-white stroke-blue-500 stroke-1 cursor-nesw-resize"
        x={bounds.x - HANDLE_WIDTH / 2}
        y={bounds.y + bounds.height - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Bottom | Side.Left, bounds);
        }}
      />
      {/* Middle Left */}
      <rect
        className="fill-white stroke-blue-500 stroke-1 cursor-ew-resize"
        x={bounds.x - HANDLE_WIDTH / 2}
        y={bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2}
        width={HANDLE_WIDTH}
        height={HANDLE_WIDTH}
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Left, bounds);
        }}
      />
    </>
  );
});

SelectionBox.displayName = "SelectionBox";
