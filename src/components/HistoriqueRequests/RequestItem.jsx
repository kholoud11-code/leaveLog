import React from "react";
import "./RequestItem.css";
import { FaRegAddressCard, FaRegFlag } from "react-icons/fa";
import ToolTip from "./ToolTip";
import { MdAccountBalanceWallet } from "react-icons/md";
import BalanceActionService from "servicees/BalanceActionService";

const RequestItem = (props) => {
  const {
    actionDate,
    addedBy,
    //employeeID,
    id,
    name,
    totalBalance,
    reasonOfChange,
    dateTime,
    //typeofaction,
  } = props.request;

  React.useEffect(() => {
    BalanceActionService.getBalanceActionById(id).then((req) => {
      console.log(req.data);
    });
  }, []);

  return (
    <div className="request">
      <div className="request-date">
        {actionDate}
      </div>
      <div className="request-body">
        <div
          className="request-status"
          style={{
            backgroundColor:
              name === "Validation Of Paid Request" ||
              name.includes("Adding of Paid Request")
                ? "green"
                : addedBy === "Auto Service Task"
                ? "blue"
                : name === "Update User By Admin"
                ? "black"
                : "red",
          }}
        ></div>
        <div className="request-content">
          <div className="request-type">
            <div className="request-type-title">{name}</div>
            <div className="identity">
              <MdAccountBalanceWallet />
              <div className="balance-employee"> {totalBalance}</div>
            </div>
          </div>
          <div className="days"> </div>
          <div className="comments">
            <p>{reasonOfChange}</p>
          </div>
          <div className="request-footer">
            <div className="request-add-by">
              <span>Added By</span>
              <ToolTip addBy={addedBy} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestItem;
