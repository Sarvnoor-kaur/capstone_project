import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import "./PremiumTopbar.css";

const PremiumTopbar = ({ toggleSidebar, sidebarOpen = true }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const notifications = [
    { id: 1, unread: true },
    { id: 2, unread: true },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="premium-topbar">
      <div className="topbar-left">
        {/* Sidebar Toggle - ALWAYS visible on desktop and mobile */}
        <button
          className="topbar-sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>

        {/* Search Bar */}
        <div className="topbar-search">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search for resources, activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        {/* Notifications */}
        <button className="topbar-icon-btn" aria-label="Notifications">
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </button>

        {/* User Profile */}
        <div className="topbar-profile">
          <button
            className="profile-trigger"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-avatar">
              <User size={18} />
            </div>
            <div className="profile-info">
              <p className="profile-name">{user?.name || "User"}</p>
              <p className="profile-role">{user?.role || "Student"}</p>
            </div>
            <ChevronDown
              size={16}
              className={`profile-chevron ${showProfileMenu ? "open" : ""}`}
            />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <>
              <div
                className="profile-menu-overlay"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <div className="profile-avatar large">
                    <User size={24} />
                  </div>
                  <div>
                    <p className="profile-menu-name">{user?.name}</p>
                    <p className="profile-menu-email">{user?.email}</p>
                  </div>
                </div>
                <div className="profile-menu-divider" />
                <button
                  className="profile-menu-item"
                  onClick={() => {
                    navigate("/profile");
                    setShowProfileMenu(false);
                  }}
                >
                  <User size={18} />
                  <span>My Profile</span>
                </button>
                <button
                  className="profile-menu-item"
                  onClick={() => {
                    navigate("/settings");
                    setShowProfileMenu(false);
                  }}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
                <div className="profile-menu-divider" />
                <button className="profile-menu-item logout" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default PremiumTopbar;
