interface TreeElement {
  id: string,
  name: string,
  disabled: boolean,
  children: Array<TreeElement>
}

export {
  TreeElement
};
