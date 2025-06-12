import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  ShoppingCart,
  Store,
  UserCheck,
  Settings,
  LogOut,
  Layers
} from 'lucide-react';
import './style.css'; // ← Make sure this file exists

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Users, label: 'Suppliers', path: '/suppliers' },
  { icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { icon: Store, label: 'Manage Store', path: '/manage-store' },
  { icon: UserCheck, label: 'Customers', path: '/customers' },
  { icon: Layers, label: 'Item Master', path: '/item-master' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar-container">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-wrapper">
          <div className="logo-circle">
            <span className="logo-letter">C</span>
          </div>
          <div>
            <h1 className="logo-title">Countrees</h1>
            <p className="logo-subtitle">TECHNOLOGIES</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <ul className="menu-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`menu-item ${isActive ? 'active' : ''}`}
                >
                  <Icon className="menu-icon" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="sidebar-bottom">
        <Link
          to="/settings"
          className={`menu-item ${location.pathname === '/settings' ? 'active' : ''}`}
        >
          <Settings className="menu-icon" />
          Settings
        </Link>
        <button className="menu-item logout-button">
          <LogOut className="menu-icon" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
