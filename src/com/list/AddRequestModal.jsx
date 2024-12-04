import React, { useState } from "react";
import PaidVacation from "com/vacationrequest/PaidVacation";
import { Modal, Tabs, Tab } from "react-bootstrap";
import Fetching from "./Fetching";
import UnpaidVacation from "com/vacationrequest/UnpaidVacation";
import ExceptionVacation from "com/vacationrequest/ExceptionalVacation";
import RecoveryVacation from "com/vacationrequest/RecoveryVacation";
import { FormattedMessage } from "react-intl";
import translate from "../../i18nProvider/translate";

const AddRequestModal = (props) => {
  const [fetching, setFetching] = useState(false);
  const [indexVal, setIndexVal] = useState(null);

  function activeFetching() {
    setFetching(true);
    setIndexVal("1");
  }

  function descativeFetching() {
    setFetching(false);
    setIndexVal(null);
  }

  return (
    <React.Fragment>
      <div>{fetching ? <Fetching /> : null}</div>

      <div style={{ transform: "none" }}>
        <Modal
          {...props}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          style={{
            height: "100%",
            width: "100%",
            zIndex: indexVal,
          }}
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Tabs
              defaultActiveKey="home"
              id="uncontrolled-tab-example"
              className="mb-3"
            >
              <Tab eventKey="home" title={translate("Paid Request")}>
                <PaidVacation
                  activeFetching={activeFetching}
                  descativeFetching={descativeFetching}
                  toMyRequest={props.toMyRequest}
                  onHide={props.onHide}
                  updateState={props.updateState}
                  /*collaborateur={props.collaborateur}*/ paiedRequestOfCollaborateur={
                    props.paiedRequestOfCollaborateur
                  }
                  /* code separate traitment passe */ path={props.path}
                  toRequest={props.toRequest}
                  updateStateRequest={props.updateStateRequest}
                />
              </Tab>

              <Tab eventKey="unpaidReq" title={translate("Unpaid Request")}>
                <UnpaidVacation
                  activeFetching={activeFetching}
                  descativeFetching={descativeFetching}
                  toMyRequest={props.toMyRequest}
                  onHide={props.onHide}
                  updateState={props.updateState}
                  /*collaborateur={props.collaborateur}*/ unpaiedRequestOfCollaborateur={
                    props.unpaiedRequestOfCollaborateur
                  }
                  /* code separate traitment passe */ path={props.path}
                  toRequest={props.toRequest}
                  updateStateRequest={props.updateStateRequest}
                />
              </Tab>

              {/* The Tab of Exceptional has been hided at the moment, it will be back once the traitment of ExceptionVacation completed*/}
              {/*<Tab eventKey="excepReq" title={translate("Exceptional Request")}>
                <ExceptionVacation
                  activeFetching={activeFetching}
                  descativeFetching={descativeFetching}
                  toMyRequest={props.toMyRequest}
                  toAddTypeOfExceptionelVacation={
                    props.toAddTypeOfExceptionelVacation
                  }
                  onHide={props.onHide}
                  updateState={props.updateState}
                  //collaborateur={props.collaborateur}// exceptionnalRequestOfCollaborateur={
                    props.exceptionnalRequestOfCollaborateur
                  }
                  // code separate traitment passe // path={props.path}
                  toRequest={props.toRequest}
                  updateStateRequest={props.updateStateRequest}
                />
                </Tab>*/}

              {/* The Tab of Recovery has been hided at the moment, it will be back once the traitment of RecoveryVacation completed*/}
              {/*<Tab eventKey="recovReq" title={translate("Recovery Request")}>
                <RecoveryVacation
                  activeFetching={activeFetching}
                  descativeFetching={descativeFetching}
                  toMyRequest={props.toMyRequest}
                  onHide={props.onHide}
                  updateState={props.updateState}
                  //collaborateur={props.collaborateur}// recoveryRequestOfCollaborateur={
                    props.recoveryRequestOfCollaborateur
                  }
                  // code separate traitment passe // path={props.path}
                  toRequest={props.toRequest}
                  updateStateRequest={props.updateStateRequest}
                />
                </Tab>*/}
            </Tabs>
          </Modal.Body>
        </Modal>
      </div>
    </React.Fragment>
  );
};
export default AddRequestModal;
