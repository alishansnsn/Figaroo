import React, { useState, useRef, useEffect } from 'react';
import './Sidebar.css';
import { Home, Folder, Users, Moon, Sparkles, Settings, LogOut, ChevronDown } from 'lucide-react';

const userAvatarUrl = 'https://randomuser.me/api/portraits/men/32.jpg'; // Example avatar

const Sidebar: React.FC = () => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close settings menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        settingsBtnRef.current &&
        !settingsBtnRef.current.contains(event.target as Node)
      ) {
        setShowSettingsMenu(false);
      }
    };
    if (showSettingsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSettingsMenu]);

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showProfileMenu]);

  // Theme toggle handler
  const handleThemeToggle = () => {
    setIsDark((prev) => {
      const newVal = !prev;
      if (newVal) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      return newVal;
    });
  };

  // Settings menu item handler
  const handleMenuItem = (label: string) => {
    setShowSettingsMenu(false);
    alert(label);
  };

  // Profile menu item handler
  const handleProfileMenuItem = (label: string) => {
    setShowProfileMenu(false);
    alert(label);
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo">
        <img src="/figaroo-logo.png" alt="Figaroo Logo" className="figaroo-logo-img" />
      </div>

      {/* User Profile */}
      <div
        className={`user-profile${showProfileMenu ? ' open' : ''}`}
        ref={profileRef}
        onClick={() => setShowProfileMenu((v) => !v)}
        tabIndex={0}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <div className="user-avatar-img">
          <img src={userAvatarUrl} alt="Ali Shan" />
        </div>
        <span className="user-name">Ali Shan</span>
        <span className={`profile-chevron${showProfileMenu ? ' rotated' : ''}`}>
          <ChevronDown size={18} />
        </span>
        
        {/* Profile dropdown menu */}
        {showProfileMenu && (
          <div className="profile-menu glassy-menu" ref={profileMenuRef}>
            <button className="glassy-menu-item" onClick={() => handleProfileMenuItem('Settings')}>
              <Settings size={18} style={{ marginRight: 10 }} />
              Settings
            </button>
            <button className="glassy-menu-item logout" onClick={() => handleProfileMenuItem('Log Out')}>
              <LogOut size={18} style={{ marginRight: 10 }} />
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="nav">
        <a href="#" className="nav-item active">
          <Home className="nav-icon" size={18} />
          <span>Home</span>
        </a>
        <a href="#" className="nav-item">
          <Folder className="nav-icon" size={18} />
          <span>My Files</span>
        </a>
        <a href="#" className="nav-item">
          <Users className="nav-icon" size={18} />
          <span>Shared with Me</span>
        </a>
      </nav>

      {/* Components Counter */}
      <div className="components-counter">
        <div className="counter-bar">
          <div className="counter-fill" style={{ width: '60%' }}></div>
        </div>
        <span className="counter-text">3/5 Components used</span>
      </div>

      {/* Theme and Settings Toggle */}
      <div className="bottom-buttons">
        <button
          className="sidebar-icon-btn"
          title="Toggle Theme"
          onClick={handleThemeToggle}
        >
          <Moon size={18} />
        </button>
        <button
          className="sidebar-icon-btn"
          title="Settings"
          ref={settingsBtnRef}
          onClick={() => setShowSettingsMenu((v) => !v)}
        >
          <Settings size={18} />
        </button>
        {showSettingsMenu && (
          <div className="settings-menu glassy-menu" ref={menuRef}>
            <button className="glassy-menu-item" onClick={() => handleMenuItem('Privacy Policy')}>
              Privacy Policy
            </button>
            <button className="glassy-menu-item" onClick={() => handleMenuItem('Help & Support')}>
              Help &amp; Support
            </button>
            <button className="glassy-menu-item" onClick={() => handleMenuItem('Cookie Policy')}>
              Cookie Policy
            </button>
            <button className="glassy-menu-item" onClick={() => handleMenuItem('Terms of Service')}>
              Terms of Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 