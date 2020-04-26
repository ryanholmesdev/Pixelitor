const layers = [
  {
    id: 0,
    name: 'Layer 1',
    isSelected: true,
    isVisible: true,
    layerHistory: [],
  },
];

/*
LayerHistory:{
  id,
  'action'
  'canvasData'
}
*/

class layer {
  id = null;
  name = '';
  isSelected = true;
  isVisible = true;
  layerHistory = [];
  constructor(id) {
    this.id = id;
    this.name = `Layer ${id}`;
  }
}

class layerHistory {
  id = null;
  action = '';
  canvasData = null;
  constructor(id, action, canvasData) {
    this.id = id;
    this.action = action;
    this.canvasData = canvasData;
  }
}

export { layers, layer, layerHistory };
