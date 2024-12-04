import React, { useState } from "react";
import { Modal, Button, InputGroup, FormControl } from "react-bootstrap";
import "../css/list.css";
import { FaUserCircle } from "react-icons/fa";
import translate from "../../i18nProvider/translate";
import { FormattedMessage } from "react-intl";

const ConfirmCancelRequestModel = (props) => {
  const [justistest, setJustistest] = useState("");

  const TitleModelMethodByTypeRequest = (typerequest) => {
    if (typerequest === "Paid Request") {
      return translate("Confirm cancellation - Paid request");
    }
    if (typerequest === "Unpaid Request") {
      return translate("Confirm cancellation - Unpaid request");
    }
  };

  const RejecteCancellationRequestMethodByType = (typerequest) => {
    if (typerequest === "Paid Request") {
      //console.info("Rejecte Cancellation Of "+typerequest)
      props.rejectecancellationrequestmethod(props.rowReq1.id);
    }
    if (typerequest === "Unpaid Request") {
      //console.info("Rejecte Cancellation Of "+typerequest)
      props.rejectecancellationunpaidrequestmethod(props.rowReq1.id);
    }
  };

  const ValidCancellationRequestMethodByType = (typerequest) => {
    if (typerequest === "Paid Request") {
      //console.info("Valid Cancellation Of "+typerequest)
      props.validecancellationrequestmethod(
        props.rowcollab1.id,
        props.rowReq1.id,
        props.rowReq1.balanceUsed
      );
    }

    if (typerequest === "Unpaid Request") {
      //console.info("Valid Cancellation Of "+typerequest)
      props.validecancellationunpaidrequestmethod(props.rowReq1.id);
    }
  };

  return (
    <div>
      <Modal {...props}>
        <Modal.Header closeButton className="planModal">
          <Modal.Title style={{ marginTop: 0, marginBottom: "5px" }}>
            <h3>{TitleModelMethodByTypeRequest(props.rowReq1.nameReq)}</h3>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                <p style={{ marginTop: "13px", fontSize: "17px" }}>
                  {translate(
                    "The selected collaborator has submitted a cancellation request for the following reason:"
                  )}
                </p>
                <p>
                  {/*<span style={{fontSize:"17px"}}>{translate("Justification for sending")}</span>*/}
                  <InputGroup>
                    <FormControl
                      as="textarea"
                      aria-label="With textarea"
                      key={props.rowReq1.id}
                      style={{ width: "auto" }}
                      value={props.rowReq1.cancellationJustification}
                      disabled
                    />
                  </InputGroup>
                </p>
                <p>
                  <span
                    style={{
                      fontSize: "17px",
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {translate("Please confirm your action (Validate/Refuse)")}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="" style={{ paddingBottom: "" }}>
            <FormattedMessage id="Please provide your reason before submitting the cancellation request.">
              {(message) => (
                <InputGroup>
                  <FormControl
                    as="textarea"
                    key={props.rowReq1.id}
                    style={{ width: "auto" }}
                    placeholder={message}
                    onChange={(e) => {
                      props.changerefusecancellationjustification(
                        props.rowReq1.id,
                        e
                      );
                      setJustistest(e.target.value);
                    }}
                    id="InputJustis"
                  />
                </InputGroup>
              )}
            </FormattedMessage>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            id="cancelReqBTN"
            style={{ marginLeft: "180px" }}
            onClick={props.closeModel}
          >
            {translate("Close")}
          </Button>
          <Button
            id="deleteReqBTN"
            style={{ marginLeft: "2px" }}
            disabled={!justistest}
            onClick={(e) => {
              e.preventDefault();
              RejecteCancellationRequestMethodByType(
                props.rowReq1.nameReq
              ) /*props.rejectecancellationrequestmethod(props.rowReq1.id)*/;
              props.closeModel();
            }}
          >
            {translate("Refuse")}
          </Button>
          <Button
            id="validBtn"
            style={{ marginLeft: "2px" }}
            onClick={(e) => {
              e.preventDefault();
              ValidCancellationRequestMethodByType(
                props.rowReq1.nameReq
              ) /*props.validecancellationrequestmethod(props.rowcollab1.id,props.rowReq1.id,props.rowReq1.balanceUsed)*/;
              props.closeModel();
            }}
          >
            {translate("Valid")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConfirmCancelRequestModel;
