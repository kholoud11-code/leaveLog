import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import UnitService from "../../servicees/UnitService";
import collaboratorService from "../../servicees/CollaborateurServices";
import Select from "react-select";
import translate from "../../i18nProvider/translate";
import { FormattedMessage } from "react-intl";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Swal from "sweetalert2";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const englishStrings = {
  selectNameValidatorCollaborators:
    "Please select Name, Validator, and Collaborators",
  confirmButtonText: "Ok",
  placeholder: "Select...",
};

const frenchStrings = {
  selectNameValidatorCollaborators:
    "Veuillez sélectionner le Nom, le Validateur et les Collaborateurs",
  confirmButtonText: "D'accord",
  placeholder: "Sélectionner...",
};

const spanishStrings = {
  selectNameValidatorCollaborators:
    "Por favor, seleccione Nombre, Validador y Colaboradores",
  confirmButtonText: "bueno",
  placeholder: "Seleccionar...",
};

let strings = {};

switch (sessionStorage.getItem("lang")) {
  case "Fr":
    strings = frenchStrings;
    break;

  case "Sp":
    strings = spanishStrings;
    break;

  default:
    strings = englishStrings;
    break;
}

class AddUnitModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      name: "",
      //add pkey in horid organizationUnit
      pkeyPaidVacation: "",
      pkeyFestive: "",
      pkeyMainTask: "",
      summaryMainTask: "",
      summaryPaidVacation: "",
      summaryFestive: "",
      validator: "",
      openSnackBar: false,
      collaborators: [],
      options: [],
      value: [],
      value1: [],
      collaborator: [],
      allUnits: [],
    };

    this.changenameHandler = this.changenameHandler.bind(this);
    //add pkey in horid organizationUnit
    this.changepkeyPaidVacationHandler =
      this.changepkeyPaidVacationHandler.bind(this);
    this.changepkeyFestiveHandler = this.changepkeyFestiveHandler.bind(this);
    this.changepkeyMainTaskHandler = this.changepkeyMainTaskHandler.bind(this);
    this.changesummaryMainTaskHandler =
      this.changesummaryMainTaskHandler.bind(this);
    this.changesummaryPaidVacationHandler =
      this.changesummaryPaidVacationHandler.bind(this);
    this.changesummaryFestiveHandler =
      this.changesummaryFestiveHandler.bind(this);
    this.changevalidatorHandler = this.changevalidatorHandler.bind(this);
    this.changecollaboratorHandler = this.changecollaboratorHandler.bind(this);
  }

  componentDidMount = () => {
    collaboratorService.getUser().then((res) => {
      this.setState({
        collaborator: res.data,
        options: res.data.map((user) => {
          return { value: user, label: user.firstname + " " + user.lastname };
        }),
      });
    });
    UnitService.getunit().then((res) => {
      this.setState({ allUnits: res.data });
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.id !== this.props.unitData.id) {
      this.setState({
        id: this.props.unitData.id,
        name: this.props.unitData.name,
        //add pkey in horid organizationUnit
        pkeyPaidVacation: this.props.unitData.pkeyPaidVacation,
        pkeyFestive: this.props.unitData.pkeyFestive,
        pkeyMainTask: this.props.unitData.pkeyMainTask,
        summaryMainTask: this.props.unitData.summaryMainTask,
        summaryPaidVacation: this.props.unitData.summaryPaidVacation,
        summaryFestive: this.props.unitData.summaryFestive,
        validator: this.props.unitData.validator,
        collaborators: this.props.unitData.collaborators1,
        value: this.state.options.filter(
          (option) => option.value.id === this.props.unitData.validator.id
        )[0],
        value1: this.state.options.filter((option) => {
          for (const element of this.props.unitData.collaborators1) {
            if (element.id === option.value.id) return option;
          }
        }),
      });
    }
  };

  saveOrUpdateUnit = () => {
    if (
      this.state.value1.length == 0 ||
      this.state.value.length == 0 ||
      this.state.name == ""
    ) {
      Swal.fire({
        title: strings.selectNameValidatorCollaborators,
        confirmButtonText: strings.confirmButtonText,
        icon: "warning",
      });
    } else {
      let unit = {
        name: this.state.name,
        //add pkey in horid organizationUnit
        pkeyPaidVacation: this.state.pkeyPaidVacation,
        pkeyFestive: this.state.pkeyFestive,
        pkeyMainTask: this.state.pkeyMainTask,
        summaryMainTask: this.state.summaryMainTask,
        summaryPaidVacation: this.state.summaryPaidVacation,
        summaryFestive: this.state.summaryFestive,
        validator: this.state.value.value,
        collaborators: this.state.value1.map((user) => user.value),
        country: sessionStorage.getItem("country"),
      };

      if (this.props.unitData.id === "") {
        this.props.onProgres();
        UnitService.createunit(unit).then((res) => {
          this.setState({ openSnackBar: true });
          this.props.onHide();
          this.props.refresh();
        });
      } else {
        this.props.onProgres();
        UnitService.updateunit(unit, this.state.id).then((res) => {
          this.setState({ openSnackBar: true });
          this.props.onHide();
          this.props.refresh();
        });
      }
    }
  };

  changenameHandler = (event) => {
    this.setState({ name: event.target.value });
  };
  //add pkey in horid organizationUnit
  changepkeyPaidVacationHandler = (event) => {
    this.setState({ pkeyPaidVacation: event.target.value });
  };
  changepkeyFestiveHandler = (event) => {
    this.setState({ pkeyFestive: event.target.value });
  };
  //
  changepkeyMainTaskHandler = (event) => {
    this.setState({ pkeyMainTask: event.target.value });
  };
  changesummaryMainTaskHandler = (event) => {
    this.setState({ summaryMainTask: event.target.value });
  };
  //
  changesummaryPaidVacationHandler = (event) => {
    this.setState({ summaryPaidVacation: event.target.value });
  };
  changesummaryFestiveHandler = (event) => {
    this.setState({ summaryFestive: event.target.value });
  };

  changevalidatorHandler = (validator) => {
    this.setState({ value: validator });
  };
  changecollaboratorHandler = (collaborators1) => {
    this.setState({ value1: collaborators1 });
  };

  checkIfHasUnit = () => {
    let labelsOfUnits = []; //names of employees of UO
    let allLabels = []; //names of all employees
    let resLabels = [];

    //this.props.allUnits.map(unit => {
    this.state.allUnits.map((unit) => {
      unit.collaborators.map((i) => labelsOfUnits.push(i));
    });

    this.state.options.map((l) => allLabels.push(l.label));

    allLabels.map((label) => {
      if (!labelsOfUnits.includes(label)) {
        resLabels.push(label);
      }
    });
    return resLabels;
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ openSnackBar: false });
  };

  render() {
    return (
      <React.Fragment>
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={this.state.openSnackBar}
            autoHideDuration={5000}
            onClose={this.handleClose}
          >
            <Alert
              onClose={this.handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              {this.state.id === ""
                ? translate("The Unit is successfully added!")
                : translate("The Unit is successfully updated!")}
            </Alert>
          </Snackbar>
        </Stack>
        <Modal show={this.props.show} onHide={this.props.onHide}>
          <Modal.Header
            closeButton
            style={{ paddingTop: 12, paddingRight: 18 }}
          >
            <Modal.Title>
              {this.state.id === ""
                ? translate("Add a new")
                : translate("Update an")}{" "}
              {translate("Organizational Unit")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ paddingTop: 0 }}>
            <div className="row">
              <div className="card-body" style={{ paddingTop: 0 }}>
                <form>
                  <div className="form-group">
                    <label>{translate("Name")}:</label>
                    <FormattedMessage id="Name">
                      {(message) => (
                        <input
                          placeholder={message}
                          name="name"
                          className="form-control"
                          disabled={
                            this.state.name === "BSA - ADMIN&FINANCE" ||
                            this.state.name === "Pool"
                              ? true
                              : null
                          }
                          value={this.state.name}
                          onChange={this.changenameHandler}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                  {/*add pkey in horid organizationUnit*/}
                  <div className="form-group">
                    <label title="">{translate("summaryMainTask")}:</label>
                    <FormattedMessage id="summaryMainTask">
                      {(message) => (
                        <input
                          placeholder={message}
                          name="summaryMainTask"
                          className="form-control"
                          value={this.state.summaryMainTask}
                          onChange={this.changesummaryMainTaskHandler}
                        />
                      )}
                    </FormattedMessage>
                  </div>

                  <div className="form-group">
                    <label>{translate("pkeyMainTask")}:</label>
                    <FormattedMessage id="pkeyMainTask">
                      {(message) => (
                        <input
                          placeholder={message}
                          name="pkeyMainTask"
                          className="form-control"
                          value={this.state.pkeyMainTask}
                          onChange={this.changepkeyMainTaskHandler}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                  <div className="form-group">
                    <label>{translate("summaryPaidVacation")}:</label>
                    <FormattedMessage id="summaryPaidVacation">
                      {(message) => (
                        <input
                          placeholder={message}
                          name="summaryPaidVacation"
                          className="form-control"
                          value={this.state.summaryPaidVacation}
                          onChange={this.changesummaryPaidVacationHandler}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                  <div className="form-group">
                    <label>{translate("pkeyPaidVacation")}:</label>
                    <FormattedMessage id="pkeyPaidVacation">
                      {(message) => (
                        <input
                          placeholder={message}
                          name="pkeyPaidVacation"
                          className="form-control"
                          value={this.state.pkeyPaidVacation}
                          onChange={this.changepkeyPaidVacationHandler}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                  <div className="form-group">
                    <label>{translate("summaryFestive")}:</label>
                    <FormattedMessage id="summaryFestive">
                      {(message) => (
                        <input
                          placeholder={message}
                          name="summaryFestive"
                          className="form-control"
                          value={this.state.summaryFestive}
                          onChange={this.changesummaryFestiveHandler}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                  <div className="form-group">
                    <label>{translate("pkeyFestive")}:</label>
                    <FormattedMessage id="pkeyFestive">
                      {(message) => (
                        <input
                          placeholder={message}
                          name="pkeyFestive"
                          className="form-control"
                          value={this.state.pkeyFestive}
                          onChange={this.changepkeyFestiveHandler}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                  <div className="form-group">
                    <label> {translate("validator")}:</label>
                    <Select
                      //value={sessionStorage.getItem("role")==="validator" ? this.state.options.find(u => u.value.id===parseInt(sessionStorage.getItem("user"))) : this.state.value}
                      //value={sessionStorage.getItem("role") === "validator" ? this.state.options.find(u => { if (u.value.id === parseInt(sessionStorage.getItem("user"))) { return u.value } }) : this.state.value}
                      value={this.state.value}
                      onChange={(change) => this.changevalidatorHandler(change)}
                      options={this.state.options}
                      placeholder={strings.placeholder}
                    />
                  </div>
                  <div className="form-group">
                    <label> {translate("collaborator")}:</label>

                    <Select
                      isMulti
                      onChange={(change) =>
                        this.changecollaboratorHandler(change)
                      }
                      value={this.state.value1}
                      //options={this.state.options.filter(u => u !== this.state.value&&this.checkIfHasUnit().includes(u))}
                      //options={this.state.options.filter(u => this.checkIfHasUnit().includes(u.label))}
                      options={this.state.options}
                      placeholder={strings.placeholder}
                    />
                  </div>
                </form>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              className="btn btn-danger"
              style={{ marginRight: "10px" }}
              onClick={this.props.onHide}
            >
              {translate("Cancel")}
            </Button>
            <Button
              className="btn btn-success"
              onClick={() => this.saveOrUpdateUnit()}
            >
              {translate("Save")}
            </Button>
            {/*<Button className="btn btn-primary" onClick={() => console.info(this.checkIfHasUnit())}>Test</Button>*/}
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}
export default AddUnitModal;
