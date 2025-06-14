import Sidebar from "../../components/sidebar/page";
import Header from "../../components/header/page";
import './style.css'; 

const Reports = () => {
  return (
    <div className="report-container">
      <Sidebar />
      <div className="report-main">
        <Header />
      <div className="report-content">
        <h1>Welcome to the Report</h1>
      </div>
      </div>
    </div>
  );
};

export default Reports;
