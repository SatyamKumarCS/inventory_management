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
import './style.css'; 

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Inventory', path: '/Inventory' },
  { icon: FileText, label: 'Reports', path: '/Reports' },
  { icon: Users, label: 'Suppliers', path: '/Supplier' },
  { icon: ShoppingCart, label: 'Orders', path: '/Order' },
  { icon: Store, label: 'Manage Store', path: '/Manage_Store' },
  { icon: UserCheck, label: 'Customers', path: '/Customer' },
  { icon: Layers, label: 'Item Master', path: '/ItemMaster' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar-container">

      <div className="sidebar-logo">
        <img src="../../../full logo.png" alt="Logo" />
      </div>


      <nav className="sidebar-nav">
        <ul className="menu-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

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
