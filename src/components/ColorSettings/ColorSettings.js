import React, { useState } from 'react';
import './ColorSettings.scss';
import ColorPicker from '../ColorPicker/ColorPicker';
import { FiFile, FiTrash } from 'react-icons/fi';
import Colors from '../../data/DefaultColors';

export const ColorSettings = (props) => {
  const [colors, setColors] = useState(Colors);
  const [isColorOptionVisable, setIsColorOptionVisable] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const addSelectedColorToSachet = () => {
    const color = {
      id: colors.length,
      value: props.color,
    };
    setColors([...colors, color]);
  };

  const deleteSelectedColor = () => {
    let newColors = [...colors];
    newColors.splice(selectedColorIndex, 1);
    // reset ids
    newColors.forEach((color, index) => (color.id = index));
    setColors(...[newColors]);
  };

  return (
    <div>
      <ColorPicker
        color={props.color !== '' ? props.color : '#ffffff'}
        isVisible={isColorOptionVisable}
        hidePicker={() => setIsColorOptionVisable(false)}
        updateColor={props.updateColor}
      />
      <h3>Color</h3>
      <div className="color-section">
        <div className="active-color-container">
          <div
            className={`active-color ${props.color === '' ? 'no-active-color' : ''}`}
            style={{ backgroundColor: props.color }}
            onDoubleClick={() => setIsColorOptionVisable(true)}
          ></div>
        </div>
        <div className="color-satchets">
          {colors.map((color, index) => {
            return (
              <div
                className="color"
                key={color.id}
                style={{ backgroundColor: color.value }}
                onClick={() => {
                  props.updateColor(color.value);
                  setSelectedColorIndex(index);
                }}
              ></div>
            );
          })}
        </div>
      </div>
      <div className="color-tools">
        <div className="icons">
          <button onClick={addSelectedColorToSachet}>
            {<FiFile className="icon" size="25px" style={{ margin: 'auto' }} />}
          </button>
          <button disabled={colors.length === 0} onClick={deleteSelectedColor}>
            {<FiTrash className="icon" size="25px" style={{ margin: 'auto' }} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorSettings;
