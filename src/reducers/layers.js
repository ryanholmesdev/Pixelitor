import { layer } from '../data/Layers';

const initialLayers = [new layer(0)];

const getId = (existingLayers) => {
  const layers = existingLayers;
  const id = layers.sort((a, b) => b.id - a.id)[0].id + 1;
  return id;
};

const addLayer = (layers, selectedIndex) => {
  let newLayers = layers;
  newLayers[selectedIndex].isSelected = false;
  const id = getId([...layers]);
  const newLayer = new layer(id);
  newLayers.splice(selectedIndex, 0, newLayer);
  for (var i = newLayers.length - 1; i >= 0; i--) {
    newLayers[i].order = i;
  }
  return newLayers;
};

const updateLayer = (layers, layer, index) => {
  let newLayers = layers;
  if (index === undefined) {
    index = layers.findIndex((l) => l.id === layer.id);
  }
  newLayers[index] = layer;
  return newLayers;
};

const layers = (state = initialLayers, action) => {
  switch (action.type) {
    case 'ADD':
      return [...addLayer(state, action.selectedIndex)];
    case 'UPDATE-LAYER':
      return [...updateLayer(state, action.layer, action.index)];
    case 'UPDATE-LAYERS':
      return [...action.layers];
    default:
      return state;
  }
};

export default layers;
