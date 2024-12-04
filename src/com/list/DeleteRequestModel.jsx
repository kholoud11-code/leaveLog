import React, { useState } from "react";
import { Modal, Button, InputGroup, FormControl } from "react-bootstrap";
import "../css/list.css";
import { FaUserCircle } from "react-icons/fa";
import translate from "../../i18nProvider/translate";
import { FormattedMessage } from "react-intl";

const DeleteRequestModel = (props) => {
  /***** */
  const TitleModelMethodByTypeRequest = (typerequest) => {
    if (typerequest === "Paid Request") {
      return translate("Delete Paid Request");
    }
    if (typerequest === "Unpaid Request") {
      return translate("Delete Unpaid Request");
    }
  };

  const RejectRequestMethodByType = (typerequest) => {
    if (typerequest === "Paid Request") {
      //console.info("Rejecte "+typerequest)
      props.requestrejecte(props.rowReq1.id);
    }
    if (typerequest === "Unpaid Request") {
      //console.info("Rejecte "+typerequest)
      if (props.rowReq1.statut === "Pending") {
        props.unpaidrequestrejecte(props.rowReq1.id);
      }
      if (props.rowReq1.statut === "accepted by validator") {
        props.unpaidrequestfinalrejecte(props.rowReq1.id);
      }
    }
  };
  /***** */

  const [justistest, setJustistest] = useState("");
  return (
    <div>
      <Modal {...props}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h3>
              {
                TitleModelMethodByTypeRequest(
                  props.rowReq1.nameReq
                ) /*translate("Delete Paid Request")*/
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
          {props.rowReq1.nameReq === "Paid Request" ? (
            <div className="mt-2">
              <FormattedMessage id="give your justification before deleting request">
                {(message) => (
                  <InputGroup>
                    <FormControl
                      as="textarea"
                      key={props.rowReq1.id}
                      style={{ width: "auto", marginTop: "20px" }}
                      placeholder={message}
                      onChange={(e) => {
                        props.changeJustification(props.rowReq1.id, e);
                        setJustistest(e.target.value);
                      }}
                      id="InputJustis"
                    />
                  </InputGroup>
                )}
              </FormattedMessage>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button
            id="cancelReqBTN"
            style={{ marginLeft: "270px" }}
            onClick={props.closeModel}
          >
            {translate("Close")}
          </Button>
          <Button
            id="deleteReqBTN"
            style={{ marginLeft: "2px" }}
            disabled={
              props.rowReq1.nameReq === "Paid Request" ? !justistest : null
            }
            onClick={(e) => {
              e.preventDefault();
              RejectRequestMethodByType(
                props.rowReq1.nameReq
              ) /*props.requestrejecte(props.rowReq1.id)*/;
              props.closeModel();
            }}
          >
            {translate("Refuse")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteRequestModel;
