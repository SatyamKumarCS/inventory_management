import Sidebar from "../../components/sidebar/page";
import Header from "../../components/header/page";
import './style.css'; 

const  ManageStore = () => {
  return (
    <div className="manage_store-container">
      <Sidebar />
      <div className="manage_store-main">
        <Header />
      <div className="manage_store-content">
        <h1>Welcome to the Manage Store</h1>
      </div>
      </div>
    </div>
  );
};

export default  ManageStore;
