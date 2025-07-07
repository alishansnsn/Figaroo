import React from 'react';
import './Header.css';
import { Package, Settings, Upload } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="components-dropdown">
          <Package size={16} />
          <span>Components</span>
          <span className="dropdown-arrow">▼</span>
        </div>
        <button className="design-system-btn">
          <Settings size={16} />
          <span>Design System</span>
        </button>
      </div>
      
      <div className="header-right">
        <button className="share-btn">
          <Upload size={16} />
          <span>Share</span>
        </button>
      </div>
    </header>
  );
};

export default Header; 