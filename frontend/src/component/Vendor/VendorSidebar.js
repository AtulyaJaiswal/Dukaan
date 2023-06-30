import React from "react";
import "./VendorSidebar.css";
// import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import { TreeView, TreeItem } from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddIcon from "@mui/icons-material/Add";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CategoryIcon from "@mui/icons-material/Category";
import DiscountIcon from "@mui/icons-material/Discount";
import Logo from "../../Images/logo.webp";

const VendorSidebar = () => {
  return (
    <div className="vendorSidebar">
      {/* <Link to="/">
        <img src={Logo} alt="Ecommerce" />
      </Link> */}
      <Link to="/vendor/dashboard">
        <p>
          <DashboardIcon /> Dashboard
        </p>
      </Link>

      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ImportExportIcon />}>
        <TreeItem nodeId="1" label="Products">
          <Link to="/vendor/products">
            <TreeItem nodeId="2" label="Edit" icon={<PostAddIcon />} />
          </Link>

          <Link to="/vendor/product/new">
            <TreeItem nodeId="3" label="Create" icon={<AddIcon />} />
          </Link>
        </TreeItem>
      </TreeView>
    </div>
  );
};

export default VendorSidebar;
