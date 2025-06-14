import Sidebar from "../../components/sidebar/page";
import Header from "../../components/header/page";
import './style.css'; 

const Customer = () => {
  return (
    <div className="customer-container">
      <Sidebar />
      <div className="customer-main">
        <Header />
      <div className="customer-content">
        <h1>Welcome to the Customer</h1>
      </div>
      </div>
    </div>
  );
};

export default Customer;
