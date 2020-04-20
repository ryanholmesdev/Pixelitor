import React from 'react';
import { SketchPicker } from 'react-color';
import './RightNav.scss';

const RightNav = (state) => {
  console.log(state);
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
      </div>
    </div>
  );
};

export default RightNav;
