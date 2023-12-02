import type { Path } from '~/types';
import type { TreeElement } from '~/types/component-types';

const buildTree = (path: Path, disabled: boolean, disabledId?: string): TreeElement => {
  return {
    id: path.id,
    label: path.path,
    children: path.children.map(child => buildTree(child, disabled || path.id === disabledId, disabledId)),
    disabled: disabled || path.id === disabledId
  };
}

export default buildTree;
