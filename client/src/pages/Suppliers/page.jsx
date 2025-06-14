import Sidebar from "../../components/sidebar/page";
import Header from "../../components/header/page";
import './style.css'; 

const Supplier = () => {
  return (
    <div className="supplier-container">
      <Sidebar />
      <div className="supplier-main">
        <Header /> 
      <div className="supplier-content">
        <h1>Welcome to the Supplier</h1>
      </div>
      </div>
    </div>
  );
};

export default Supplier;
