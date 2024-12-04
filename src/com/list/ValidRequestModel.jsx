import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "../css/list.css";
import { FaUserCircle } from "react-icons/fa";
import translate from "../../i18nProvider/translate";

const ValidRequestModel = (props) => {
  /***** */
  const TitleModelMethodByTypeRequest = (typerequest) => {
    if (typerequest === "Paid Request") {
      return translate("Valid Paid Request");
    }
    if (typerequest === "Unpaid Request") {
      return translate("Valid Unpaid Request");
    }
  };

  const ValidRequestMethodByType = (typerequest) => {
    if (typerequest === "Paid Request") {
      //console.info("Valid1 "+typerequest)
      props.requestsuccess(props.rowReq1.id, props.rowcollab1.id);
    }
    if (typerequest === "Unpaid Request") {
      //console.info("Valid2 "+typerequest)
      if (props.rowReq1.statut === "Pending") {
        props.unpaidrequestsuccess(props.rowReq1.id);
      }
      if (props.rowReq1.statut === "accepted by validator") {
        props.unpaidrequestfinalsuccess(props.rowReq1.id);
      }
    }
  };

  /***** */

  /*const valideRequest = (rowcollabteam,rowreqstatut,rowcollabrole) => {
        if(rowcollabteam==="admin RH" && rowreqstatut==="Pending" && rowcollabrole==="Directeur"){
            return(<Button variant="success" style={{marginLeft: "4px"}} onClick={ (e)=>{e.preventDefault(); props.requestsuccess(props.rowReq1.id);props.closeModel()}}>{translate("Valid")}</Button> )
        }else{
            return(<Button variant="success" style={{marginLeft: "4px"}} onClick={ (e)=>{e.preventDefault(); props.requestsuccess(props.rowReq1.id,props.rowcollab1.id);props.closeModel()}}>{translate("Valid")}</Button> )
        }
    }*/

  return (
    <div>
      <Modal {...props}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h3>
              {
                TitleModelMethodByTypeRequest(
                  props.rowReq1.nameReq
                ) /*translate("Valid Paid Request")*/
              }
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="btn-group me-2"
            role="group"
            aria-label="First group"
            id="mycontainer"
          >
            <div className="box">
              <div className="box1">
                <FaUserCircle
                  style={{
                    fontSize: "70px",
                    color: "#20B2AA",
                    marginBottom: "10px",
                    marginLeft: "10px",
                  }}
                />
                <p
                  style={{
                    marginBottom: "20px",
                    fontSize: "17px",
                    fontWeight: "bold",
                  }}
                >
                  {props.rowcollab1.firstname + " " + props.rowcollab1.lastname}
                </p>
              </div>
              <div className="box2">
                <p>
                  <span style={{ fontSize: "17px" }}>
                    {translate("Type Request")} :{" "}
                  </span>{" "}
                  <span style={{ fontSize: "17px", fontWeight: "bold" }}>
                    {translate(props.rowReq1.nameReq)}
                  </span>
                </p>
                {props.rowdaterequests1.map((dates) => (
                  <div key={dates.id}>
                    <p>
                      <span style={{ fontSize: "17px" }}>
                        {translate("Start Date")} :
                      </span>{" "}
                      <span
                        style={{
                          fontSize: "17px",
                          fontWeight: "bold",
                          color: "#32CD32",
                        }}
                      >
                        {dates.startDate}
                      </span>
                    </p>
                    <p>
                      <span style={{ fontSize: "17px" }}>
                        {translate("End Date")} :
                      </span>{" "}
                      <span
                        style={{
                          fontSize: "17px",
                          fontWeight: "bold",
                          color: "#1E90FF",
                        }}
                      >
                        {dates.endDate}
                      </span>
                    </p>
                    <p>
                      <span style={{ fontSize: "17px" }}>
                        {translate("Duration")} :
                      </span>{" "}
                      <span style={{ fontSize: "17px" }}>{dates.duration}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button
              variant="warning"
              style={{ marginLeft: "260px" }}
              onClick={props.closeModel}
            >
              {translate("Close")}
            </Button>
            {/*valideRequest(props.rowcollab1.team,props.rowReq1.statut,props.role)*/}
            {
              <Button
                variant="success"
                style={{ marginLeft: "4px" }}
                onClick={(e) => {
                  e.preventDefault();
                  ValidRequestMethodByType(
                    props.rowReq1.nameReq
                  ) /*props.requestsuccess(props.rowReq1.id,props.rowcollab1.id)*/;
                  props.closeModel();
                }}
              >
                {translate("Valid")}
              </Button>
            }
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ValidRequestModel;
