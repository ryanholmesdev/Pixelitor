const addLayer = (selectedIndex) => {
  return { type: 'ADD', selectedIndex };
};

const updateLayer = (layer, index) => {
  return { type: 'UPDATE-LAYER', layer, index };
};

const updateLayers = (layers) => {
  return { type: 'UPDATE-LAYERS', layers };
};

export { addLayer, updateLayer, updateLayers };
