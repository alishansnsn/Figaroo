import React, { useState, useRef, useEffect } from 'react';
import './Sidebar.css';
import { Home, Folder, Users, Moon, Sparkles, Settings, LogOut, ChevronDown } from 'lucide-react';
import { ErrorHandler } from '../utils/errorHandler';

const userAvatarUrl = 'https://randomuser.me/api/portraits/men/81.jpg'; // Example avatar

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const settingsBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

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
    ErrorHandler.showInfo(label, 'This feature is coming soon!');
  };

  // Profile menu item handler
  const handleProfileMenuItem = (label: string) => {
    setShowProfileMenu(false);
    ErrorHandler.showInfo(label, 'This feature is coming soon!');
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      
      <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`} ref={sidebarRef}>
        {/* Logo */}
        <div className="logo">
          <img src="/figaroo-logo.png" alt="Figaroo Logo" className="figaroo-logo-img" />
        </div>

        {/* User Profile Section */}
        <div className="user-profile-container">
          <div
            className={`user-profile${showProfileMenu ? ' open' : ''}`}
            ref={profileRef}
            onClick={() => setShowProfileMenu((v) => !v)}
            tabIndex={0}
          >
            <div className="user-avatar">
              <img src={userAvatarUrl} alt="Ali Shan" />
            </div>
            <span className="user-name">Ali Shan</span>
            <ChevronDown size={20} className={`profile-chevron${showProfileMenu ? ' rotated' : ''}`} />
          </div>

          {showProfileMenu && (
            <div className="profile-menu" ref={profileMenuRef}>
              <button className="profile-menu-item" onClick={() => handleProfileMenuItem('Settings')}>
                <Settings size={18} />
                <span>Settings</span>
              </button>
              <button className="profile-menu-item logout" onClick={() => handleProfileMenuItem('Log Out')}>
                <LogOut size={18} />
                <span>Log Out</span>
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
    </>
  );
};

export default Sidebar; 