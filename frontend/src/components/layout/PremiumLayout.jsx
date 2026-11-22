import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import PremiumSidebar from "./PremiumSidebar";
import PremiumTopbar from "./PremiumTopbar";
import "./PremiumLayout.css";

const PremiumLayout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="premium-layout">
      <PremiumSidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        userRole={user?.role}
      />

      <div className={`premium-main ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <PremiumTopbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main className="premium-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PremiumLayout;
