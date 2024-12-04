import React from "react";
import { Modal, Button, InputGroup, FormControl } from "react-bootstrap";
import "../css/list.css";
import { FaUserCircle } from "react-icons/fa";
import translate from "../../i18nProvider/translate";

const DetailsRequestModel = (props) => {
  /***** */
  const TitleModelMethodByTypeRequest = (typerequest) => {
    if (typerequest === "Paid Request") {
      return translate("Details Paid Request");
    }
    if (typerequest === "Unpaid Request") {
      return translate("Details Unpaid Request");
    }
  };

  const calculeCumulaticeBalance = (user1) => {
    let a = 0;
    if (user1.cumulativeBances != [] && user1.cumulativeBances != null) {
      user1.cumulativeBances.map((solde) => (a = a + solde.balance));
    }
    return a;
  };
  /***** */

  return (
    <div>
      <Modal {...props}>
        <Modal.Header closeButton>
          <Modal.Title style={{ marginTop: 0, marginBottom: "20px" }}>
            <h3>
              {
                TitleModelMethodByTypeRequest(
                  props.rowreq1.nameReq
                ) /*translate("Details Paid Request")*/
              }
            </h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "0 10px" }}>
          <div
            className="btn-group"
            role="group"
            aria-label="First group"
            id="mycontainer"
            style={{ height: "auto" }}
          >
            <div className="box">
              <div className="boxview1" style={{ alignItems: "center" }}>
                <div>
                  <FaUserCircle
                    style={{
                      fontSize: "70px",
                      color: "#20B2AA",
                      marginBottom: "10px",
                      marginLeft: "10px",
                    }}
                  />
                </div>
                <div style={{ width: "170px", paddingLeft: "30px" }}>
                  <p
                    style={{
                      marginBottom: "20px",
                      fontSize: "17px",
                      fontWeight: "bold",
                    }}
                  >
                    {props.rowcollab1.firstname +
                      " " +
                      props.rowcollab1.lastname}
                  </p>
                </div>
              </div>
              <div className="boxview2">
                <p>
                  <span style={{ fontSize: "17px" }}>
                    {translate("Type Request")} :{" "}
                  </span>{" "}
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#FF4500",
                    }}
                  >
                    {translate(props.rowreq1.nameReq)}
                  </span>
                </p>
                <p>
                  <span style={{ fontSize: "17px" }}>
                    {translate("Request Date")} :{" "}
                  </span>{" "}
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {props.rowreq1.requestDate}
                  </span>
                </p>
                <p>
                  <span style={{ fontSize: "17px" }}>
                    {translate("statut")} :
                  </span>{" "}
                  <span
                    className="text-secondary"
                    style={{ fontSize: "18px", fontWeight: "bold" }}
                  ></span>
                  {props.checkstatutmodal(props.rowreq1.statut)}
                </p>
                <p>
                  <span style={{ fontSize: "17px" }}>
                    {translate("type of time")} :{" "}
                  </span>{" "}
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {translate(props.rowreq1.typeOfTime)}
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
                      <span style={{ fontSize: "17px", fontWeight: "bold" }}>
                        {dates.duration}
                      </span>
                    </p>
                  </div>
                ))}
                {/***** */}
                {props.rowreq1.nameReq === "Paid Request" ? (
                  <p>
                    <span style={{ fontSize: "17px" }}>
                      {translate("Current Balance")} :{" "}
                    </span>{" "}
                    <span
                      style={{
                        fontSize: "18px",
                        color: "#008B8B",
                        fontWeight: "bold",
                      }}
                    >
                      {props.rowcollabsolde1.annualBalance +
                        calculeCumulaticeBalance(props.rowcollabsolde1)}
                    </span>
                  </p>
                ) : null}
                {/***** */}
                {props.rowreq1.description !== "" ? (
                  <p>
                    <span style={{ fontSize: "17px" }}>
                      {translate("Description")} :{" "}
                    </span>{" "}
                    <span style={{ fontSize: "18px", color: "#008B8B" }}>
                      {props.rowreq1.description}
                    </span>
                  </p>
                ) : null}
                {props.rowunitname !== "" &&
                props.pathurl === "request page" ? (
                  props.rowreq1.nameReq === "Paid Request" &&
                  props.rowreq1.statut != "Pending" &&
                  props.rowreq1.statut != "Pending cancellation" &&
                  props.rowreq1.unitname !== "" ? (
                    <p>
                      <span style={{ fontSize: "17px" }}>
                        {translate("Project Name")} :{" "}
                      </span>{" "}
                      <span
                        style={{
                          fontSize: "19px",
                          color: "#008B8B",
                          fontWeight: "bold",
                        }}
                      >
                        {props.rowreq1.unitname}
                      </span>
                    </p>
                  ) : (
                    <p>
                      <span style={{ fontSize: "17px" }}>
                        {translate("Project Name")} :{" "}
                      </span>{" "}
                      <span
                        style={{
                          fontSize: "19px",
                          color: "#008B8B",
                          fontWeight: "bold",
                        }}
                      >
                        {props.rowunitname}
                      </span>
                    </p>
                  )
                ) : null}
                {props.rowunitname !== "" &&
                props.pathurl === "request of team page" ? (
                  props.rowreq1.nameReq === "Paid Request" &&
                  props.rowreq1.statut != "Pending" &&
                  props.rowreq1.statut != "Pending cancellation" &&
                  props.rowreq1.unitname !== "" ? (
                    <p>
                      <span style={{ fontSize: "17px" }}>
                        {translate("Project Name")} :{" "}
                      </span>{" "}
                      <span
                        style={{
                          fontSize: "19px",
                          color: "#008B8B",
                          fontWeight: "bold",
                        }}
                      >
                        {props.rowreq1.unitname}
                      </span>
                    </p>
                  ) : (
                    <p>
                      <span style={{ fontSize: "17px" }}>
                        {translate("Project Name")} :{" "}
                      </span>{" "}
                      <span
                        style={{
                          fontSize: "19px",
                          color: "#008B8B",
                          fontWeight: "bold",
                        }}
                      >
                        {props.rowunitname}
                      </span>
                    </p>
                  )
                ) : null}
                {Object.keys(props.rowvalidator).length != 0 ? (
                  props.rowreq1.nameReq === "Paid Request" &&
                  props.rowreq1.statut != "Pending" &&
                  props.rowreq1.statut != "Pending cancellation" &&
                  props.rowreq1.firstnamevalidator !== "" &&
                  props.rowreq1.firstnamevalidator !== "" ? (
                    <p>
                      <span style={{ fontSize: "20px" }}>
                        {translate("Validator")} :{" "}
                      </span>
                      <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {props.rowreq1.firstnamevalidator +
                          " " +
                          props.rowreq1.lastnamevalidator}
                      </span>
                    </p>
                  ) : (
                    <p>
                      <span style={{ fontSize: "20px" }}>
                        {translate("Validator")} :{" "}
                      </span>
                      <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {props.rowvalidator.firstname +
                          " " +
                          props.rowvalidator.lastname}
                      </span>
                    </p>
                  )
                ) : null}
                {props.rowreq1.statut === "refused" &&
                props.rowreq1.nameReq === "Paid Request" ? (
                  <p>
                    <span style={{ fontSize: "17px" }}>
                      {translate("Justification for refusing")} :
                    </span>
                    <InputGroup>
                      <FormControl
                        as="textarea"
                        aria-label="With textarea"
                        value={props.rowreq1.justification}
                        disabled
                        style={{ width: "auto" }}
                      />
                    </InputGroup>
                  </p>
                ) : null}
                {props.rowreq1.sendCancellationRequest === "OFF" &&
                props.rowreq1.statut === "cancellation refused" ? (
                  <p>
                    <span style={{ fontSize: "17px" }}>
                      {translate("Justification for refusing")} :
                    </span>
                    <InputGroup>
                      <FormControl
                        as="textarea"
                        aria-label="With textarea"
                        value={props.rowreq1.cancellationJustification}
                        disabled
                        style={{ width: "auto" }}
                      />
                    </InputGroup>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn btn-secondary"
            style={{ marginLeft: "370px" }}
            onClick={props.closemodel}
          >
            {translate("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetailsRequestModel;
