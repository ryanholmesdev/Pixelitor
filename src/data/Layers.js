class layer {
  id = null;
  name = '';
  order = null;
  isSelected = true;
  isVisible = true;
  constructor(id) {
    this.id = id;
    this.order = id;
    this.name = `Layer ${id}`;
  }
}

const layers = [new layer(0)];

export { layers, layer };