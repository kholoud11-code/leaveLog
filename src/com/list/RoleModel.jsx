import React, { useState } from "react";
import { Modal, Button, InputGroup, FormControl, Form } from "react-bootstrap";
import "../css/list.css";
import { FaUserCircle } from "react-icons/fa";
import translate from "../../i18nProvider/translate";
import { FormattedMessage } from "react-intl";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import collaboratorService from "../../servicees/CollaborateurServices";
import Select from "react-select";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class RoleModel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      cin: "",
      team: "admin RH",
      open: false,
      options: [
        { value: { role: "admin RH" }, label: "admin RH" },
        { value: { role: "validator" }, label: "validator" },
        { value: { role: "collaborator" }, label: "collaborator" },
      ],
    };

    this.changecinHandler = this.changecinHandler.bind(this);
    this.changeRoleHandler = this.changeRoleHandler.bind(this);
  }

  componentDidUpdate = (prevProps, prevState) => {
    //console.info("prevState.id :"+prevState.id)
    //console.info("this.props.rowcollab1.id :"+this.props.rowcollab1.id)
    if (prevState.id !== this.props.rowcollab1.id) {
      this.setState({
        id: this.props.rowcollab1.id,
        cin: this.props.rowcollab1.cin,
      });
      //console.info("this.state.id :"+this.state.id)
      //console.info("this.state.cin :"+this.state.cin)
    }
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false });
  };

  changecinHandler = (event) => {
    this.setState({ cin: event.target.value });
  };

  changeRoleHandler = (change) => {
    this.setState({ team: change.value.role });
  };

  ChangeRoleByCinMethod = (e) => {
    e.preventDefault();
    let user = {
      team: this.state.team,
    };
    collaboratorService.Rolebycin(user, this.state.cin).then((res) => {
      this.setState({ open: true });
      this.props.onHide();
      this.props.refresh();
    });
  };

  /*const changecinHandler = (event) => {
       setCin(event.target.value)
   }*/
  render() {
    return (
      <React.Fragment>
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={this.state.open}
            autoHideDuration={4000}
            onClose={this.handleClose}
          >
            <Alert
              onClose={this.handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              {translate("Update Role Successfully")}
            </Alert>
          </Snackbar>
        </Stack>
        <Modal {...this.props}>
          <Modal.Header closeButton>
            <Modal.Title style={{ marginTop: 0, marginBottom: "5px" }}>
              <h3>{translate("Update Role")}</h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              className="btn-group me-2"
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
                      {this.props.rowcollab1.firstname +
                        " " +
                        this.props.rowcollab1.lastname}
                    </p>
                  </div>
                </div>
                <div className="boxview2">
                  <p style={{ marginTop: "25px", fontSize: "17px" }}>
                    {" "}
                    {translate(
                      "Do you want to Update Role for this user?"
                    )}{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className="" style={{ paddingBottom: "" }}>
              <Form.Group>
                <label>{translate("Employee Nr")}</label>
                <FormattedMessage id="Employee Nr">
                  {(message) => (
                    <Form.Control
                      /*defaultValue={this.state.cin}*/ value={this.state.cin}
                      disabled
                      onChange={this.changecinHandler}
                      placeholder={message}
                      type="text"
                    ></Form.Control>
                  )}
                </FormattedMessage>
              </Form.Group>
              <Form.Group>
                <label>{translate("Role")}</label>
                <Select
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 9999 }),
                  }}
                  value={this.state.options.find(
                    (option) => option.label === this.state.team
                  )}
                  onChange={(change) => this.changeRoleHandler(change)}
                  options={this.state.options}
                />
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              id="cancelReqBTN"
              style={{ marginLeft: "240px" }}
              onClick={this.props.closeModel}
            >
              {translate("Close")}
            </Button>
            <Button
              id="deleteReqBTN"
              style={{ marginLeft: "10px" }}
              onClick={this.ChangeRoleByCinMethod}
            >
              {translate("save")}
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}
export default RoleModel;
