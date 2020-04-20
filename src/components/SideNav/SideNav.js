import React from 'react';
import './SideNav.scss';

const SideNav = (props) => {
  const setActive = (tool) => {
    if (!tool.isSelected) {
      props.setActive(tool.id);
    }
  };
  return (
    <div className="sideBar">
      {props.tools.map((tool, index) => {
        return (
          <div className={`${tool.isSelected ? 'active' : ''}`} key={tool.id} onClick={() => setActive(tool)}>
            {<tool.icon color={!tool.isSelected ? '#788ca1' : '#ffffff'} size="20px" style={{ margin: 'auto' }} />}
          </div>
        );
      })}
    </div>
  );
};

export default SideNav;
