import Sidebar from "../../components/sidebar/page";
import Header from "../../components/header/page";
import './style.css'; 

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
      <div className="dashboard-content">
        <h1>Welcome to the Dashboard</h1>
        {/* dashboard content here */}
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
