import React from 'react';
import './ColorPicker.scss';

const ColorPicker = (props) => {
  return <div className={`pop-up ${props.show ? '' : 'hide'}`} className="pop-up"></div>;
};

export default ColorPicker;
