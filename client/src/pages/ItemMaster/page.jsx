import Sidebar from "../../components/sidebar/page";
import Header from "../../components/header/page";
import './style.css'; 

const ItemMaster = () => {
  return (
    <div className="ItemMaster-container">
      <Sidebar />
      <div className="ItemMaster-main">
        <Header />
        <div className="ItemMaster-content">
          <div className="ItemMaster-header-row">
            <h1>Item Master</h1>
            <div className="ItemMaster-buttons">
              <button className="action-btn">Add Category</button>
              <button className="action-btn">Add Sub Category</button>
              <button className="action-btn">Add Item</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemMaster;
