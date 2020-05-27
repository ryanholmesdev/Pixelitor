import React, { useRef, useEffect, useState } from 'react';
import './ColorPicker.scss';
import { FiX } from 'react-icons/fi';
import { ChromePicker } from 'react-color';

const ColorPicker = (props) => {
  const popupRef = useRef();
  const [currentColor, setCurrentColor] = useState(props.color);

  const handleDocumentClick = (e) => {
    if (!popupRef.current.contains(e.target)) {
      // clicking outside of popup will close it.
      props.hidePicker();
    }
  };

  const handleColorChange = (color, event) => {
    setCurrentColor(color.hex);
  };

  const handleColorChangeComplete = (color) => {
    props.updateColor(color.hex);
  };

  useEffect(() => {
    if (props.isVisible) {
      document.addEventListener('mousedown', handleDocumentClick);
      return () => {
        document.removeEventListener('mousedown', handleDocumentClick);
      };
    }
  });

  useEffect(() => {
    setCurrentColor(props.color);
  }, [props.color]);

  return (
    <div ref={popupRef} className={`pop-up ${props.isVisible ? '' : 'hide'}`}>
      <div className="close" onClick={props.hidePicker}>
        <FiX color="7b8fa3" size="30px" style={{ margin: 'auto' }} />
      </div>
      <div className="content">
        <ChromePicker color={currentColor} onChange={handleColorChange} onChangeComplete={handleColorChangeComplete} />
      </div>
    </div>
  );
};

export default ColorPicker;
