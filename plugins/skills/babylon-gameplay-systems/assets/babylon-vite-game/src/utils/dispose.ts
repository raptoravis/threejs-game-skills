import * as BABYLON from '@babylonjs/core';

export function disposeHierarchy(node: BABYLON.Node): void {
  if (node instanceof BABYLON.AbstractMesh) {
    node.material?.dispose();
  }
  const children = node.getChildren?.() ?? node.getChildMeshes?.() ?? [];
  for (const child of children.slice()) {
    disposeHierarchy(child);
  }
  node.dispose();
}
