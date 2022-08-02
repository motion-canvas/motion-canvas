export function KonvaNode(config?: {
  name?: string;
  centroid?: boolean;
}): ClassDecorator {
  return function (target) {
    target.prototype.className = config?.name ?? target.name;
    target.prototype._centroid = config?.centroid ?? true;
  };
}
