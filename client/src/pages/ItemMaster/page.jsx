
import Sidebar from "../../components/sidebar/page";
import Header from "../../components/header/page";
import './style.css'; 

const ItemMaster = () => {
    // const [showAddCategory, setShowAddCategory] = useState(false);
    // const [showAddSubCategory, setShowAddSubCategory] = useState(false);
    // const [showItemForm, setShowItemForm] = useState(false);
  return (
    <div className="ItemMaster-container">
      <Sidebar />
      <div className="ItemMaster-main">
        <Header />
      <div className="ItemMaster-content">
        <h1>Item Master</h1>
        </div>
      </div>
      </div>
  );
};

export default ItemMaster;
