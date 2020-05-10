import React from 'react';
import './RightNav.scss';
import LayersContainer from '../LayersContainer/LayersContainer';
import ColorSettings from '../ColorSettings/ColorSettings';

const RightNav = (props) => {
  const {
    brushSize,
    color,
    canvasWidth,
    canvasHeight,
    minCanvasWidth,
    minCanvasHeight,
    maxCanvasWidth,
    maxCanvasHeight,
  } = props;
  const { layers } = props;

  const updateLayer = (layer, index) => {
    let newLayers = layers;
    newLayers[index] = layer;
    props.updateLayers(newLayers);
  };
  const updateLayers = (newLayers) => {
    props.updateLayers(newLayers);
  };

  return (
    <div className="rightBar">
      <div className="settings-container">
        <div className="setting">
          <h3>Canvas settings</h3>
          <div className="properties">
            <div>
              <label>Width</label>
              <input
                type="number"
                onChange={(event) => props.onCanvasSizeChange(event.target.value, 'width')}
                min={minCanvasWidth}
                max={maxCanvasWidth}
                value={canvasWidth}
              ></input>
            </div>
            <div>
              <label>Height</label>
              <input
                onChange={(event) => props.onCanvasSizeChange(event.target.value, 'height')}
                type="number"
                min={minCanvasHeight}
                max={maxCanvasHeight}
                value={canvasHeight}
              ></input>
            </div>
            <div>
              <label>X position</label>
              <input
                onChange={(event) => props.onCanvasSizeChange(event.target.value, 'height')}
                type="number"
                min={minCanvasHeight}
                max={maxCanvasHeight}
                value={canvasHeight}
              ></input>
            </div>
            <div>
              <label>Y position</label>
              <input
                onChange={(event) => props.onCanvasSizeChange(event.target.value, 'height')}
                type="number"
                min={minCanvasHeight}
                max={maxCanvasHeight}
                value={canvasHeight}
              ></input>
            </div>
          </div>
        </div>
        <div className="setting">
          <ColorSettings color={color} updateColor={props.onColorChange} />
        </div>
        <div className="setting range-container">
          <h3>Brush Size</h3>
          <input
            type="range"
            min="1"
            max="100"
            value={brushSize}
            onChange={(event) => props.onBrushSizeChange(event.target.value)}
          ></input>
          <input
            type="number"
            value={brushSize}
            onChange={(event) => props.onBrushSizeChange(event.target.value)}
          ></input>
        </div>
        <div className="setting">
          <LayersContainer layers={layers} updateLayer={updateLayer} updateLayers={updateLayers} />
        </div>
      </div>
    </div>
  );
};

export default RightNav;
