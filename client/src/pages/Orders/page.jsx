import Sidebar from "../../components/sidebar/page";
import Header from "../../components/header/page";
import './style.css'; 

const Order = () => {
  return (
    <div className="order-container">
      <Sidebar />
      <div className="order-main">
        <Header />
      <div className="order-content">
        <h1>Welcome to the Order</h1>
      </div>
      </div>
    </div>
  );
};

export default Order;
