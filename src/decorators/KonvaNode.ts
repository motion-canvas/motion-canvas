export function KonvaNode(): ClassDecorator {
  return function(target) {
    target.prototype.className = target.name;
  }
}