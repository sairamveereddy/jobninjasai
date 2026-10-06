import { Side, XYWH, Point } from "@/types/canvas";

export function resizeBounds(bounds: XYWH, corner: Side, point: Point): XYWH {
  const result = { ...bounds };

  if ((corner & Side.Left) === Side.Left) {
    const right = bounds.x + bounds.width;
    result.x = Math.min(point.x, right);
    result.width = Math.abs(right - point.x);
  }

  if ((corner & Side.Right) === Side.Right) {
    const left = bounds.x;
    result.x = Math.min(point.x, left);
    result.width = Math.abs(point.x - left);
  }

  if ((corner & Side.Top) === Side.Top) {
    const bottom = bounds.y + bounds.height;
    result.y = Math.min(point.y, bottom);
    result.height = Math.abs(bottom - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    const top = bounds.y;
    result.y = Math.min(point.y, top);
    result.height = Math.abs(point.y - top);
  }

  return result;
}
