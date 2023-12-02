interface TreeElement {
  id: string,
  label: string,
  disabled: boolean,
  children: Array<TreeElement>
}

export {
  TreeElement
};
