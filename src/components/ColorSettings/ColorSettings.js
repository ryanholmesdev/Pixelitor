import React, { useState } from 'react';
import './ColorSettings.scss';
import ColorPicker from '../ColorPicker/ColorPicker';
import { FiFile, FiTrash } from 'react-icons/fi';
import Colors from '../../data/DefaultColors';

export const ColorSettings = (props) => {
  const [colors, setColors] = useState(Colors);
  return (
    <div>
      <h3>Color</h3>
      <div className="color-section">
        <div className="active-color-container">
          <div className="active-color" style={{ backgroundColor: props.color }}>
            <ColorPicker show={false} />
          </div>
        </div>
        <div className="color-satchets">
          {colors.map((color) => {
            return (
              <div
                className="color"
                key={color.id}
                style={{ backgroundColor: color.value }}
                onClick={() => props.updateColor(color.value)}
              ></div>
            );
          })}
        </div>
      </div>
      <div className="color-tools">
        <div className="icons">
          <button title="add">{<FiFile className="icon" size="25px" style={{ margin: 'auto' }} />}</button>
          <button>{<FiTrash className="icon" size="25px" style={{ margin: 'auto' }} />}</button>
        </div>
      </div>
    </div>
  );
};

export default ColorSettings;
