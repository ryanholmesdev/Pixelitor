import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import './RightNav.scss';
import { FiEye, FiChevronsUp, FiChevronsDown, FiFile } from 'react-icons/fi';
import { layer } from '../../data/Layers';
const RightNav = (state) => {
  const [selectedIndex, setselectedIndex] = useState(0);
  const [draggingIndex, setDraggingIndex] = useState(null);

  const onLayerVisabilityClick = (layer) => {
    let obj = state.layers.find((l) => l.id === layer.id);
    obj.isVisible = !obj.isVisible;
    state.updateLayers(state.layers);
  };
  const onLayerSelectClick = (layer) => {
    if (layer.isSelected === false) {
      state.layers.forEach((l, i) => {
        if (l.id === layer.id) {
          l.isSelected = !l.isSelected;
          setselectedIndex(i);
        } else {
          l.isSelected = false;
        }
      });
      state.updateLayers(state.layers);
    }
  };

  const onDragStart = (draggingIndex) => {
    setDraggingIndex(draggingIndex);
  };

  // prevents n/a cursor from displaying.
  const onDragOver = (event) => {
    event.preventDefault();
    return false;
  };

  const onDragEnter = (targetIndex, event) => {
    if (targetIndex !== draggingIndex && targetIndex + 1 !== draggingIndex) {
      if (targetIndex === 0) {
      }

      event.currentTarget.classList.add('drag-enter');
    }
  };

  const onDragLeave = (event) => {
    event.currentTarget.classList.remove('drag-enter');
    event.stopPropagation();
  };

  const onDrop = (targetIndex, event) => {
    event.currentTarget.classList.remove('drag-enter');
    if (targetIndex !== draggingIndex && targetIndex + 1 !== draggingIndex) {
      let newLayers = state.layers;
      if (targetIndex === 0) {
        // if target index is first, then append above
      } else {
        // else append below
      }
      console.log(moveObjectAtIndex(newLayers, draggingIndex, targetIndex));

      //[newLayers[dropToLayerId], newLayers[draggingIndex]] = [newLayers[draggingIndex], newLayers[dropToLayerId]];
      //state.updateLayers(newLayers);
    }
  };

  const onDragEnd = (event) => {
    setDraggingIndex(null);
  };

  const moveObjectAtIndex = (array, oldIndex, newIndex) => {
    if (newIndex >= array.length) {
      newIndex = array.length - 1;
    }
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    return array;
  };

  const addNewLayer = () => {
    let newArray = state.layers;
    const id = newArray.length + 1;
    const newLayer = new layer(id);
    newArray[selectedIndex].isSelected = false;
    newArray.splice(selectedIndex, 0, newLayer);
    state.updateLayers(newArray);
  };

  return (
    <div className="rightBar">
      <div className="settings-container">
        <div className="setting">
          <SketchPicker color={state.color} onChange={state.onColorChange}></SketchPicker>
        </div>

        <div className="setting">
          <input
            type="range"
            min="1"
            max="100"
            value={state.brushSize}
            onChange={(event) => state.onBrushSizeChange(event.target.value)}
          ></input>
          <input
            type="number"
            value={state.brushSize}
            onChange={(event) => state.onBrushSizeChange(event.target.value)}
          ></input>
        </div>
        <div className="setting">
          <div className="layer-options">
            <div>{<FiChevronsUp color="7b8fa3" size="20px" style={{ margin: 'auto' }} />}</div>
            <div>{<FiChevronsDown color="7b8fa3" size="20px" style={{ margin: 'auto' }} />}</div>
            <div onClick={addNewLayer}>{<FiFile color="7b8fa3" size="20px" style={{ margin: 'auto' }} />}</div>
          </div>
          <div className="layers-container-main">
            {state.layers.map((layer, index) => {
              return (
                <div
                  className={`layers-container ${layer.isSelected ? 'active' : ''} 
                ${draggingIndex !== null ? 'prevent-pointer' : ''} }`}
                  key={layer.id}
                  draggable="true"
                  onDragStart={() => onDragStart(index)}
                  onDragOver={onDragOver.bind(this)}
                  onDragEnter={(e) => onDragEnter(index, e)}
                  onDragLeave={onDragLeave.bind(this)}
                  onDrop={(e) => onDrop(index, e)}
                  onDragEnd={onDragEnd}
                >
                  <div className="icon" onClick={() => onLayerVisabilityClick(layer)}>
                    {<FiEye color={!layer.isVisible ? '#788ca1' : '#3153e5'} size="20px" style={{ margin: 'auto' }} />}
                  </div>
                  <div className="layer-name" onClick={() => onLayerSelectClick(layer)}>
                    {layer.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightNav;
