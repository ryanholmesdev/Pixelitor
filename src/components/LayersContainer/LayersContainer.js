import React, { useState, useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { addLayer, updateLayer, updateLayers } from '../../actions/layer';
import './LayersContainer.scss';
import Layer from '../Layer/Layer';
import { FiChevronsUp, FiChevronsDown, FiFile, FiTrash } from 'react-icons/fi';

const LayersContainer = (props) => {
  const layers = useSelector((state) => state.layers);
  const dispatch = useDispatch();
  // anytime you want to update selectedIndex call method setLayerToBeSelected
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [opacity, setOpacity] = useState(layers[selectedIndex].opacity);

  const selectLayer = (index) => {
    setLayerToBeSelected(index);
    // un select previous selected.
    let newArray = layers;
    newArray[selectedIndex].isSelected = false;

    // select current.
    newArray[index].isSelected = true;
    dispatch(updateLayers(newArray));
  };

  const addNewLayer = () => {
    setLayerToBeSelected(selectedIndex);
    dispatch(addLayer(selectedIndex));
  };

  const deleteLayer = () => {
    let newLayers = layers;
    if (selectedIndex === 0) {
      newLayers.splice(selectedIndex, 1);
      setSelectedIndex(selectedIndex);
      newLayers[selectedIndex].isSelected = true;
      dispatch(updateLayers(newLayers));
    } else {
      newLayers.splice(selectedIndex, 1);
      newLayers[selectedIndex - 1].isSelected = true;
      dispatch(updateLayers(newLayers));
      setSelectedIndex(selectedIndex - 1);
    }
  };

  // moves object in array from 1 place to another, validate before calling.
  const moveItemInArray = (array, from, to) => {
    // remove `from` item and store it
    var fromItem = array.splice(from, 1)[0];
    // insert stored item into position `to`
    array.splice(to, 0, fromItem);
    return array;
  };

  const moveSelectedLayer = (targetIndex, currentIndex) => {
    if (currentIndex === null || currentIndex === undefined) currentIndex = selectedIndex;
    let newLayers = layers;
    const targetOrder = newLayers[targetIndex].order;
    const selectedOrder = newLayers[currentIndex].order;
    newLayers[targetIndex].order = selectedOrder;
    newLayers[selectedOrder].order = targetOrder;
    const orderedLayers = moveItemInArray(newLayers, currentIndex, targetIndex);
    dispatch(updateLayers(orderedLayers));
    setLayerToBeSelected(targetIndex);
  };

  const onOpacityChange = (value) => {
    setOpacity(value);
  };

  // Updates the layers opacity after change and timeout
  useEffect(() => {
    const updateLayersOpacity = () => {
      let updatedLayer = layers[selectedIndex];
      updatedLayer.opacity = parseFloat(opacity);
      updateLayer(updatedLayer, selectedIndex);
    };

    if (opacity !== layers[selectedIndex].opacity) {
      let debouncer = setTimeout(() => {
        updateLayersOpacity();
      }, 300);
      return () => {
        clearTimeout(debouncer);
      };
    }
    // eslint-disable-next-line
  }, [opacity]);

  const setLayerToBeSelected = (index) => {
    setSelectedIndex(index);
    // update opacity
    setOpacity(layers[index].opacity);
  };

  const isMoveUpLayerDisabled = () => {
    return selectedIndex === 0;
  };
  const isMoveDownLayerDisabled = () => {
    return layers.length === 1 || selectedIndex + 1 === layers.length;
  };
  const isTrashDisabled = () => {
    return layers.length === 1;
  };

  return (
    <div>
      <h3>Layers</h3>
      <div className="layer-options">
        <button onClick={addNewLayer}>{<FiFile className="icon" size="25px" style={{ margin: 'auto' }} />}</button>
        <button disabled={isMoveUpLayerDisabled()} onClick={() => moveSelectedLayer(selectedIndex - 1)}>
          {<FiChevronsUp className="icon" size="25px" style={{ margin: 'auto' }} />}
        </button>
        <button disabled={isMoveDownLayerDisabled()} onClick={() => moveSelectedLayer(selectedIndex + 1)}>
          {<FiChevronsDown className="icon" size="25px" style={{ margin: 'auto' }} />}
        </button>
        <button disabled={isTrashDisabled()} onClick={deleteLayer}>
          {<FiTrash className="icon" size="25px" style={{ margin: 'auto' }} />}
        </button>
      </div>
      <div className="layers-list">
        {layers.map((layer, index) => {
          return (
            <Layer
              key={layer.id}
              index={index}
              layer={{ ...layer }}
              updateLayer={(layer, index) => dispatch(updateLayer(layer, index))}
              selectLayer={selectLayer}
              isRenaming={selectedIndex === index ? true : false}
              draggingIndex={draggingIndex}
              setDraggingIndex={(index) => setDraggingIndex(index)}
              moveSelectedLayer={moveSelectedLayer}
              allowDrag={layers.length > 1}
            />
          );
        })}
      </div>
      <div className="range-container">
        <label>Layer opacity</label>
        <input
          type="range"
          min="1"
          max="100"
          value={opacity}
          onChange={(event) => onOpacityChange(event.target.value)}
        ></input>
        <input type="number" value={opacity} onChange={(event) => onOpacityChange(event.target.value)}></input>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { layers: state.layers };
};

export default connect(mapStateToProps)(LayersContainer);
