class layer {
  id = null;
  name = '';
  order = null;
  isSelected = true;
  isVisible = true;
  opacity = 100;
  constructor(id) {
    this.id = id;
    this.order = id;
    this.name = `Layer ${id}`;
  }
}

const layers = [new layer(0)];

export { layers, layer };
