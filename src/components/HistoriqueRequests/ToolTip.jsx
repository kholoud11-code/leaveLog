import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { FaRegUserCircle } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";

const ToolTip = ({ addBy }) => {
  // const tooltipStyle = {
  //   backgroundColor: "blue",
  //   color: "white",
  //   fontSize: "14px",
  // };

  return (
    <Tooltip title={addBy} arrow placement="top">
      <IconButton>
        <FaRegUserCircle className="add-icon" />
      </IconButton>
    </Tooltip>
  );
};
export default ToolTip;
