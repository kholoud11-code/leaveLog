import React, { Component } from "react";
import HolidayService from "../../servicees/HolidayService";
import dateFormat from "dateformat";
import { FormattedMessage } from "react-intl";
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import RamadanDateService from "../../servicees/RamadanDateService";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class AddRamadanDate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // step 2
      id: "",
      startDate: "",
      endDate: "",
      open: false,
    };
    this.changestartDateHandler = this.changestartDateHandler.bind(this);
    this.changeendDateHandler = this.changeendDateHandler.bind(this);
  }

  // get holiday formation if user click in update
  componentDidMount() {
    RamadanDateService.getRamadanDateById().then((res) => {
      let user = res.data;
      this.setState({
        id: user.id,
        startDate: user.startDate,
        endDate: user.endDate,
      });
    });
  }
  updateRamadan = (e) => {
    e.preventDefault();
    let Ramadan = {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    };
    RamadanDateService.updateRamadanDate(Ramadan).then((res) => {
      this.setState({ open: true });
      this.props.onHide();
      this.props.refresh();
    });
  };

  changestartDateHandler = (event) => {
    this.setState({ startDate: dateFormat(event.target.value, "yyyy-mm-dd") });
  };
  changeendDateHandler = (event) => {
    this.setState({ endDate: dateFormat(event.target.value, "yyyy-mm-dd") });
  };
  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={this.state.open}
            autoHideDuration={6000}
            onClose={this.handleClose}
          >
            <Alert
              onClose={this.handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              {translate("The Ramadan Date is successfully updated!")}
            </Alert>
          </Snackbar>
        </Stack>
        <Modal show={this.props.show} onHide={this.props.onHide}>
          <Modal.Header
            closeButton
            style={{ paddingTop: 12, paddingRight: 18 }}
          >
            <Modal.Title>{translate("Update Ramadan Date")}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ paddingTop: 0 }}>
            <form>
              <div className="form-group">
                <label> {translate("Start Date")} </label>
                <FormattedMessage id="startDate">
                  {(message) => (
                    <input
                      placeholder={message}
                      name="startDate"
                      className="form-control"
                      type="date"
                      value={this.state.startDate}
                      onChange={this.changestartDateHandler}
                    />
                  )}
                </FormattedMessage>
              </div>

              <div className="form-group">
                <label> {translate("End Date")} </label>
                <FormattedMessage id="endDate">
                  {(message) => (
                    <input
                      placeholder={message}
                      name="endDate"
                      className="form-control"
                      type="date"
                      value={this.state.endDate}
                      onChange={this.changeendDateHandler}
                    />
                  )}
                </FormattedMessage>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              className="btn btn-danger"
              style={{ marginRight: "10px" }}
              onClick={this.props.onHide}
            >
              {translate("Cancel")}
            </Button>
            <Button className="btn btn-success" onClick={this.updateRamadan}>
              {translate("Save")}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AddRamadanDate;
