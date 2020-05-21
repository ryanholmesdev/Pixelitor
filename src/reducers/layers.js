import { layer } from '../data/Layers';

const initialLayers = [new layer(0)];

const addLayer = (layers, selectedIndex) => {
  let newLayers = layers;
  const newLayer = new layer(newLayers.length);
  newLayers[selectedIndex].isSelected = false;
  newLayers.splice(selectedIndex, 0, newLayer);
  for (var i = newLayers.length - 1; i >= 0; i--) {
    newLayers[i].order = i;
  }
  return newLayers;
};

const deleteLayer = (layers, index) => {
  let newArray = layers;
  newArray.splice(index, 1);
  return newArray;
};

const updateLayer = (layers, layer, index) => {
  let newLayers = layers;
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
    case 'DELETE':
      return [...deleteLayer(state, action.index)];
    default:
      return state;
  }
};

export default layers;
