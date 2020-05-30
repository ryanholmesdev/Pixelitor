import React from 'react';
import './SideNav.scss';
import { FiSettings } from 'react-icons/fi';

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
      <div className="settings">
        <FiSettings color="788ca1" size="20px" style={{ margin: 'auto' }} />
      </div>
    </div>
  );
};

export default SideNav;
