import { Path } from '~/types';
import { TreeElement } from '~/types/component-types';

const buildTree = (path: Path, disabled: boolean, disabledId?: string): TreeElement => {
  return {
    id: path.id,
    name: path.path,
    children: path.children.map(child => buildTree(child, disabled || path.id === disabledId, disabledId)),
    disabled: disabled || path.id === disabledId
  };
}

export default buildTree;
