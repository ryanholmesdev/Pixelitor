import React, { useState } from 'react';
import './Layer.scss';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Layer = (props) => {
  const { index, draggingIndex } = props;
  const { name, isVisible, isSelected } = props.layer;
  const [isRenaming, setIsRenaming] = useState(false);
  const [renamingValue, setRenamingValue] = useState(name);

  const toggleVisible = () => {
    let newLayer = props.layer;
    newLayer.isVisible = !isVisible;
    props.updateLayer(newLayer, index);
  };

  const renameLayer = () => {
    let newLayer = props.layer;
    newLayer.name = renamingValue;
    props.updateLayer(newLayer, index);
    setIsRenaming(false);
  };

  const layerKeyPress = (e) => {
    if (e.key === 'Enter') {
      renameLayer();
    }
  };

  return (
    <div className={`layer ${isSelected ? 'active' : ''}${draggingIndex !== null ? 'prevent-pointer' : ''}`}>
      <div className="icon" onClick={toggleVisible}>
        {isVisible && <FiEye color="#3153e5" size="25px" style={{ margin: 'auto' }} />}
        {!isVisible && <FiEyeOff color="#788ca1" size="25px" style={{ margin: 'auto' }} />}
      </div>
      <div className="layername-container" onClick={!isSelected ? () => props.selectLayer(index) : undefined}>
        {!isRenaming && <span onDoubleClick={() => setIsRenaming(true)}> {name}</span>}
        {isRenaming && (
          <input
            type="text"
            value={renamingValue}
            autoFocus
            onChange={(e) => setRenamingValue(e.target.value)}
            onKeyPress={layerKeyPress}
            onBlur={renameLayer}
          ></input>
        )}
      </div>
    </div>
  );
};

export default Layer;
