import React from 'react';
import './Navigation.scss';
import { FiRotateCcw, FiRotateCw } from 'react-icons/fi';

const Navigation = () => {
  return (
    <nav>
      <div>
        <div className="icons">
          <div className="icon">
            <FiRotateCcw color="7b8fa3" size="30px" style={{ margin: 'auto' }} />
          </div>
          <div className="icon">
            <FiRotateCw color="7b8fa3" size="30px" style={{ margin: 'auto' }} />
          </div>
        </div>
      </div>
      <div>
        <button>Login</button>
      </div>
    </nav>
  );
};

export default Navigation;
