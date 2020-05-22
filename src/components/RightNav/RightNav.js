import React from 'react';
import './RightNav.scss';
import LayersContainer from '../LayersContainer/LayersContainer';
import ColorSettings from '../ColorSettings/ColorSettings';
import { connect, useSelector, useDispatch } from 'react-redux';
import { updateSettings } from '../../actions/settings';

const RightNav = (props) => {
  const {
    brushSize,
    color,
    canvasWidth,
    canvasHeight,
    canvasX,
    canvasY,
    minCanvasWidth,
    minCanvasHeight,
    maxCanvasWidth,
    maxCanvasHeight,
  } = useSelector((state) => state.settings);
  const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const sizeChange = (value, event) => {
    let newSettings = settings;
    if (event === 'width') {
      if (value > newSettings.maxCanvasWidth) {
        value = newSettings.maxCanvasWidth;
      }
      newSettings.canvasWidth = value;
    } else if (event === 'height') {
      if (value > newSettings.maxCanvasHeight) {
        value = newSettings.maxCanvasHeight;
      }
      newSettings.canvasHeight = value;
    }
    dispatch(updateSettings(newSettings));
  };

  const axisChange = (value, type) => {
    value = parseInt(value);
    let newSettings = settings;
    if (type === 'x') {
      newSettings.canvasX = value;
    } else if (type === 'y') {
      newSettings.canvasY = value;
    }
    dispatch(updateSettings(newSettings));
  };

  const handleColorChange = (newColor) => {
    let newSettings = settings;
    newSettings.color = newColor;
    dispatch(updateSettings(newSettings));
  };

  const updateBrushSize = (value) => {
    let newSettings = settings;
    newSettings.brushSize = parseInt(value);
    dispatch(updateSettings(newSettings));
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
                onChange={(event) => sizeChange(event.target.value, 'width')}
                min={minCanvasWidth}
                max={maxCanvasWidth}
                value={canvasWidth}
              ></input>
            </div>
            <div>
              <label>Height</label>
              <input
                onChange={(event) => sizeChange(event.target.value, 'height')}
                type="number"
                min={minCanvasHeight}
                max={maxCanvasHeight}
                value={canvasHeight}
              ></input>
            </div>
            <div>
              <label>X position</label>
              <input
                onChange={(event) => axisChange(event.target.value, 'x')}
                type="number"
                min={0}
                value={canvasX}
              ></input>
            </div>
            <div>
              <label>Y position</label>
              <input
                onChange={(event) => axisChange(event.target.value, 'y')}
                type="number"
                min={0}
                value={canvasY}
              ></input>
            </div>
          </div>
        </div>
        <div className="setting">
          <ColorSettings color={color} updateColor={handleColorChange} />
        </div>
        <div className="setting range-container">
          <h3>Brush Size</h3>
          <input
            type="range"
            min="1"
            max="100"
            value={brushSize}
            onChange={(event) => updateBrushSize(event.target.value)}
          ></input>
          <input type="number" value={brushSize} onChange={(event) => updateBrushSize(event.target.value)}></input>
        </div>
        <div className="setting">
          <LayersContainer />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { settings: state.settings };
};

export default connect(mapStateToProps)(RightNav);
