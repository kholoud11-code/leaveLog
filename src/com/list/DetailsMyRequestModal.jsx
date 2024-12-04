import React from "react";
import { Modal, Button, InputGroup, FormControl } from "react-bootstrap";
import "../css/list.css";
import { FaUserCircle } from "react-icons/fa";
import translate from "../../i18nProvider/translate";

const DetailsMyRequestModel = (props) => {
  /***** */
  const TitleModelMethodByTypeRequest = (typerequest) => {
    if (typerequest === "Paid Request") {
      return translate("Details My Paid Request");
    }
    if (typerequest === "Unpaid Request") {
      return translate("Details My Unpaid Request");
    }
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
                  props.rowReq1.nameReq
                ) /*translate("Details My Paid Request")*/
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
                    {translate(props.rowReq1.nameReq)}
                  </span>
                </p>
                <p>
                  <span style={{ fontSize: "17px" }}>
                    {translate("Request Date")} :{" "}
                  </span>{" "}
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    {props.rowReq1.requestDate}
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
                  {props.checkStatutModal(props.rowReq1.statut)}
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
                {props.rowReq1.description !== "" ? (
                  <p>
                    <span style={{ fontSize: "17px" }}>
                      {translate("Description")} :{" "}
                    </span>{" "}
                    <span style={{ fontSize: "18px", color: "#008B8B" }}>
                      {props.rowReq1.description}
                    </span>
                  </p>
                ) : null}
                {props.rowunitname !== "" ? (
                  props.rowReq1.nameReq === "Paid Request" &&
                  props.rowReq1.statut != "Pending" &&
                  props.rowReq1.statut != "Pending cancellation" &&
                  props.rowReq1.unitname !== "" ? (
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
                        {props.rowReq1.unitname}
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
                  props.rowReq1.nameReq === "Paid Request" &&
                  props.rowReq1.statut != "Pending" &&
                  props.rowReq1.statut != "Pending cancellation" &&
                  props.rowReq1.firstnamevalidator !== "" &&
                  props.rowReq1.lastnamevalidator !== "" ? (
                    <p>
                      <span style={{ fontSize: "20px" }}>
                        {translate("Validator")} :{" "}
                      </span>
                      <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {props.rowReq1.firstnamevalidator +
                          " " +
                          props.rowReq1.lastnamevalidator}
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
                {props.rowReq1.statut === "refused" &&
                props.rowReq1.nameReq === "Paid Request" ? (
                  <p>
                    <span style={{ fontSize: "17px" }}>
                      {translate("Justification for refusing")} :
                    </span>
                    <InputGroup>
                      <FormControl
                        as="textarea"
                        aria-label="With textarea"
                        value={props.rowReq1.justification}
                        disabled
                        style={{ width: "auto" }}
                      />
                    </InputGroup>
                  </p>
                ) : null}
                {props.rowReq1.sendCancellationRequest === "OFF" &&
                props.rowReq1.statut === "cancellation refused" ? (
                  <p>
                    <span style={{ fontSize: "17px" }}>
                      {translate("Justification for refusing")} :
                    </span>
                    <InputGroup>
                      <FormControl
                        as="textarea"
                        aria-label="With textarea"
                        value={props.rowReq1.cancellationJustification}
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
            onClick={props.closeModel}
          >
            {translate("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetailsMyRequestModel;
