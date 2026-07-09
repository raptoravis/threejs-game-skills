export function disposeAll(objects: Array<{ dispose?: () => void; destroy?: () => void }>): void {
  for (const obj of objects) {
    if (obj.dispose) obj.dispose();
    else if (obj.destroy) obj.destroy();
  }
}
