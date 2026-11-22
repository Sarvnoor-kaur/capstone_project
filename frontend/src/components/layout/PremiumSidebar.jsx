import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Activity,
  BookOpen,
  MessageSquare,
  User,
  Shield,
  Lock,
  ClipboardList,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Users,
  Wind,
  BarChart2,
} from "lucide-react";
import "./PremiumSidebar.css";

const PremiumSidebar = ({ isOpen, toggleSidebar, userRole = "student" }) => {
  const location = useLocation();

  const studentMenuItems = [
    { path: "/dashboard",  label: "Home",           icon: Home,          badge: null   },
    { path: "/mood",       label: "Mood Tracker",   icon: Activity,      badge: null   },
    { path: "/analytics",  label: "Analytics",      icon: BarChart2,     badge: "New"  },
    { path: "/breathing",  label: "Breathing",      icon: Wind,          badge: "Calm" },
    { path: "/assessments",label: "Assessments",    icon: ClipboardList, badge: null   },
    { path: "/ai-chat",    label: "AI Companion",   icon: Sparkles,      badge: "New"  },
    { path: "/resources",  label: "Resources",      icon: BookOpen,      badge: null   },
    { path: "/support",    label: "Support",        icon: MessageSquare, badge: null   },
  ];

  const counselorMenuItems = [
    { path: "/admin", label: "Counselor Hub", icon: Users, badge: null },
    { path: "/dashboard", label: "Wellness Home", icon: Home, badge: null },
    { path: "/resources", label: "Resources", icon: BookOpen, badge: null },
    { path: "/support", label: "Support Queue", icon: MessageSquare, badge: null },
  ];

  const menuItems = userRole === "counselor" ? counselorMenuItems : studentMenuItems;

  const settingsItems = [
    { path: "/profile", label: "My Profile", icon: User },
    { path: "/consent", label: "Consent", icon: Shield },
    { path: "/privacy", label: "Privacy", icon: Lock },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="premium-sidebar-overlay" onClick={toggleSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`premium-sidebar ${isOpen ? "open" : "closed"}`}>
        {/* Floating Rail Toggle Button (Always visible on the border) */}
        <button
          className="sidebar-rail-toggle"
          onClick={toggleSidebar}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Header with Branding */}
        <div className="premium-sidebar-header">
          {isOpen ? (
            <>
              <div className="sidebar-brand">
                <div className="brand-logo">
                  <Sparkles className="brand-icon" />
                </div>
                <div className="brand-text">
                  <h1 className="brand-name">Mentovya</h1>
                  <p className="brand-tagline">Your wellness journey</p>
                </div>
              </div>
              <button
                className="sidebar-toggle-btn"
                onClick={toggleSidebar}
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <ChevronLeft size={18} />
              </button>
            </>
          ) : (
            <button
              className="sidebar-expand-header-btn"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
              title="Click to expand sidebar"
            >
              <div className="brand-logo mini">
                <Sparkles className="brand-icon" />
              </div>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="premium-sidebar-nav">
          {/* Main Menu */}
          <div className="nav-section">
            {isOpen && (
              <p className="nav-section-title">Main Navigation</p>
            )}
            <ul className="nav-list">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`nav-link ${active ? "active" : ""}`}
                      title={!isOpen ? item.label : ""}
                    >
                      <div className="nav-link-content">
                        <Icon className="nav-icon" size={22} />
                        {isOpen && <span className="nav-label">{item.label}</span>}
                      </div>
                      {item.badge && isOpen && (
                        <span className="nav-badge">{item.badge}</span>
                      )}
                      {active && <div className="active-indicator" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Settings Section */}
          <div className="nav-section">
            {isOpen && (
              <p className="nav-section-title">Settings</p>
            )}
            <ul className="nav-list">
              {settingsItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`nav-link ${active ? "active" : ""}`}
                      title={!isOpen ? item.label : ""}
                    >
                      <div className="nav-link-content">
                        <Icon className="nav-icon" size={22} />
                        {isOpen && <span className="nav-label">{item.label}</span>}
                      </div>
                      {active && <div className="active-indicator" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Premium Footer */}
        {isOpen && (
          <div className="premium-sidebar-footer">
            <div className="premium-promo-card">
              <div className="promo-icon">✨</div>
              <h4 className="promo-title">AI Powered Care</h4>
              <p className="promo-text">
                Personalized wellness insights & 24/7 confidential support
              </p>
              <Link to="/ai-chat" className="promo-btn">
                <span>Talk to AI</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default PremiumSidebar;
