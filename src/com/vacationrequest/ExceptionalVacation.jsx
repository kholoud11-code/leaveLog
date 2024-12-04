import React, { Component } from "react";
import ExeptionnelRequestService from "../../servicees/ExptionnelService";
import collaboratorService from "../../servicees/CollaborateurServices";
import Calendar from "../calendor/calendor4";
import dateFormat from "dateformat";
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import { defineMessages, injectIntl, FormattedMessage } from "react-intl";
import "../css/Request.css";
import Select from "react-select";
import {
  Button,
  Card,
  CardGroup,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import Swal from "sweetalert2";

const englishColumn = [
  "enter selection",
  "enter startDate",
  "Done!",
  "Your Request is sent with success",
  "Ok",
  "Select...",
];
const frenchColumn = [
  "saisir la sélection",
  "entrez la date de début",
  "Fait!",
  "Votre demande est envoyée avec succès",
  "D'accord",
  "Sélectionner...",
];
const spanishColumn = [
  "ingresar selección",
  "ingrese la fecha de inicio",
  "Hecho!",
  "Su solicitud se envía con éxito",
  "bueno",
  "Seleccionar...",
];
let DatagridColumn = [];

switch (sessionStorage.getItem("lang")) {
  case "Fr":
    DatagridColumn = frenchColumn;
    break;

  case "Sp":
    DatagridColumn = spanishColumn;
    break;

  default:
    DatagridColumn = englishColumn;
    break;
}

class ExceptionVacation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      balance: [],
      calendarState: "",
      calendar: {},
      startDate: "",
      cumulative: "",
      annual: "",
      list: [],
      list1: [],
      balanceNedded: "",
      remainder: "",
      user: "",
      description: "",
      soldes: "",
      selectedType: "FullDay",
      UnpaidRequest: [],
      SelectTypeVacacion: "",
      duration: 0,
      option: [],
      collaborators: [],
      options: [],
      users: "",
      enableSaveButton: true,
      fetching: false,
    };
    this.calendarChange = this.calendarChange.bind(this);
    this.childRef = React.createRef();
    this.dates = this.dates.bind(this);
    this.deletelist = this.deletelist.bind(this);
    this.saveRequest = this.saveRequest.bind(this);
    this.descrptionChange = this.descrptionChange.bind(this);
    this.changeSelect = this.changeSelect.bind(this);
    this.calculeBalance = this.calculeBalance.bind(this);
    this.selectRH = this.selectRH.bind(this);
    this.addRH = this.addRH.bind(this);
  }

  componentDidMount() {
    //this.setState({user: this.props.collaborateur})
    collaboratorService
      .getUserById(sessionStorage.getItem("user"))
      .then((res) => {
        this.setState({ user: res.data });
      });

    if (
      sessionStorage.getItem("role") != "validator" &&
      sessionStorage.getItem("role") != "Collaborator"
    ) {
      collaboratorService.getUser().then((res) => {
        this.setState({
          collaborators: res.data.filter((val) => {
            if ('"' + val.country + '"' === sessionStorage.getItem("country")) {
              return val;
            }
          }),
          options: res.data
            .filter((val) => {
              //console.log('"' + val.country + '"' === sessionStorage.getItem("country"))
              if (
                '"' + val.country + '"' ===
                sessionStorage.getItem("country")
              ) {
                return val;
              }
            })
            .map((user) => {
              return {
                value: user,
                label: user.firstname + " " + user.lastname,
              };
            }),
        });
      });
    }

    ExeptionnelRequestService.getType().then((res) => {
      this.setState({ option: res.data });
    });
  }
  // Add day with his start and end date with his duration
  add() {
    const element = this.childRef.current;
    const b = new Date(element.state.startDate.getTime());
    b.setDate(element.state.startDate.getDate() + this.state.duration - 1);
    if (element.state.startDate != null) {
      if (this.state.duration != 0) {
        this.setState((state1) => {
          return {
            calendar: element.state,
            startDate: element.state.startDate,
          };
        });
        let DateReq = {
          startDate: dateFormat(
            element.state.startDate.toLocaleDateString(),
            "yyyy-mm-dd"
          ),
          endDate: dateFormat(b.toLocaleDateString(), "yyyy-mm-dd"),
          duration: Math.ceil(
            (b.getTime() - element.state.startDate.getTime()) /
              (1000 * 3600 * 24) +
              1
          ),
        };
        this.state.list.push([
          element.state.startDate,
          b,
          Math.ceil(
            (b.getTime() - element.state.startDate.getTime()) /
              (1000 * 3600 * 24) +
              1
          ),
        ]);
        this.state.list1.push(DateReq);
        this.setState({
          list: this.state.list,
          list1: this.state.list1,
          enableSaveButton: false,
        });
      } else {
        Swal.fire({
          title: DatagridColumn[0],
          confirmButtonText: DatagridColumn[4],
          icon: "warning",
        });
      }
    } else {
      Swal.fire({
        title: DatagridColumn[1],
        confirmButtonText: DatagridColumn[4],
        icon: "warning",
      });
    }
  }
  calendarChange = (calendarState) => {
    this.setState((state) => ({
      calendarState: { ...state.calendarState, ...calendarState },
    }));
  };
  //delete date selected
  deletelist(i) {
    this.state.list.splice(i, 1);
    this.state.list1.splice(i, 1);
    this.setState({
      list: this.state.list,
      list1: this.state.list1,
      enableSaveButton: true,
    });
  }
  // Table of date
  dates() {
    if (this.state.list != []) {
      return (
        <table
          className="table table-striped table-bordered"
          style={{ padding: "0px", margin: "0px" }}
        >
          <thead>
            <tr>
              <th>{translate("Start Date")}</th>
              <th>{translate("End Date")}</th>
              <th>{translate("Duration")}</th>
              <th>{translate("Action")}</th>
            </tr>
          </thead>
          <tbody>
            {this.state.list.map((lists, index) => (
              <tr key={index}>
                <td>
                  {" "}
                  {dateFormat(lists[0].toLocaleDateString(), "yyyy-mm-dd")}
                </td>
                <td>
                  {" "}
                  {dateFormat(lists[1].toLocaleDateString(), "yyyy-mm-dd")}
                </td>
                <td> {lists[2]}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      this.deletelist(index);
                    }}
                    className="btn btn-danger"
                  >
                    {" "}
                    X{" "}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  }
  // function to calcule balance use in vancatoin
  calculeBalance() {
    let a = 0;
    if (this.state.list != []) {
      if (this.state.selectedType === "Full Day") {
        this.state.list.map((lists) => (a = a + lists[2]));
      } else {
        this.state.list.map((lists) => (a = a + lists[2] * 0.5));
      }
    }
    return a;
  }
  // Save vacation request
  saveRequest = (e) => {
    e.preventDefault();
    this.props.activeFetching();
    if (this.state.list1.length != 0) {
      if (sessionStorage.getItem("role") != "RH") {
        let Request = {
          collaborator: this.state.user,
          description: this.state.description,
          totalDays: this.calculeBalance(),
          datesRequest: this.state.list1,
          requestDate: dateFormat(
            new Date().toLocaleDateString(),
            "yyyy-mm-dd"
          ),
          statut: "Pending",
          typeOfTime: this.state.selectedType,
          vacacioType: this.state.SelectTypeVacacion.value,
        };
        //console.log(Request)

        ExeptionnelRequestService.creatExeptionnelRequest(Request).then(
          (res) => {
            Swal.fire(DatagridColumn[2], DatagridColumn[3], "success").then(
              (result) => {
                if (result.isConfirmed) {
                  this.props.toMyRequest();
                  this.props.onHide();
                }
              }
            );
            this.props.descativeFetching();
            this.props.updateState();
          }
        );
      } else if (
        sessionStorage.getItem("role") === "RH" &&
        this.state.users === ""
      ) {
        let Request = {
          collaborator: this.state.user,
          description: this.state.description,
          totalDays: this.calculeBalance(),
          datesRequest: this.state.list1,
          requestDate: dateFormat(
            new Date().toLocaleDateString(),
            "yyyy-mm-dd"
          ),
          statut: "accepted",
          typeOfTime: this.state.selectedType,
          vacacioType: this.state.SelectTypeVacacion.value,
        };

        ExeptionnelRequestService.creatExeptionnelRequest(Request).then(
          (res) => {
            Swal.fire(DatagridColumn[2], DatagridColumn[3], "success").then(
              (result) => {
                if (result.isConfirmed) {
                  this.props.toMyRequest();
                  this.props.onHide();
                }
              }
            );
            this.props.descativeFetching();
            this.props.updateState();
          }
        );
      } else if (
        sessionStorage.getItem("role") === "RH" &&
        this.state.users != ""
      ) {
        let Request = {
          collaborator: this.state.users.value,
          description: this.state.description,
          totalDays: this.calculeBalance(),
          datesRequest: this.state.list1,
          requestDate: dateFormat(
            new Date().toLocaleDateString(),
            "yyyy-mm-dd"
          ),
          statut: "accepted",
          typeOfTime: this.state.selectedType,
          vacacioType: this.state.SelectTypeVacacion.value,
        };

        ExeptionnelRequestService.creatExeptionnelRequest(Request).then(
          (res) => {
            Swal.fire(DatagridColumn[2], DatagridColumn[3], "success").then(
              (result) => {
                if (result.isConfirmed) {
                  this.props.toMyRequest();
                  this.props.onHide();
                }
              }
            );
            this.props.descativeFetching();
            this.props.updateState();
          }
        );
      }
    } else {
      Swal.fire({
        title: "------",
        confirmButtonText: DatagridColumn[4],
        icon: "warning",
      });
    }
  };
  descrptionChange = (event) => {
    this.setState({ description: event.target.value });
  };
  changeSelect = (event) => {
    this.setState({ selectedType: event.target.value });
  };
  changeSelectType = (SelectTypeVacacion) => {
    this.setState({ SelectTypeVacacion });
    this.setState({ duration: SelectTypeVacacion.value.duration });
  };
  // if user is RH he can create Expetionnal vacacion to Collaborator
  selectRH() {
    if (sessionStorage.getItem("role") === "RH") {
      return (
        <div className="form-group">
          <label> {translate("Collaborator")} </label>
          <Select
            onChange={(change) => this.changevalidatorHandler(change)}
            options={this.state.options}
            placeholder={DatagridColumn[5]}
          />
        </div>
      );
    }
  }
  //butoon to Rh add a vacacion type
  go() {
    //this.props.history.push('/admin/vacationrequest/Type');
    this.props.toAddTypeOfExceptionelVacation();
  }
  addRH() {
    if (sessionStorage.getItem("role") === "RH") {
      return (
        <Button
          className="btn btn-success"
          onClick={this.go.bind(this)}
          style={{ marginLeft: "10px", float: "right" }}
        >
          +
        </Button>
      );
    }
  }

  changevalidatorHandler = (users) => {
    this.setState({ users: users });
  };

  render() {
    let options = this.state.option.map((user) => {
      return { value: user, label: user.name };
    });
    return (
      <div>
        <CardGroup>
          <Card>
            <Form>
              <Card.Body>
                <Col className="pr-4" md="12">
                  <Form.Group
                    style={{ display: "inline-block", paddingTop: "10px" }}
                  >
                    <select
                      className="custom-select"
                      onChange={this.changeSelect}
                      style={{ width: "200px" }}
                    >
                      <FormattedMessage id="Full Day" key={"op" + "-" + "b"}>
                        {(message) => (
                          <option defaultValue value="Full Day">
                            {message}
                          </option>
                        )}
                      </FormattedMessage>
                      <FormattedMessage
                        id="Half Day morning"
                        key={"op" + "-" + "a"}
                      >
                        {(message) => (
                          <option value="Half Day morning">{message}</option>
                        )}
                      </FormattedMessage>
                      <FormattedMessage
                        id="Half Day afternoon"
                        key={"op" + "-" + "c"}
                      >
                        {(message) => (
                          <option value="Half Day afternoon">{message}</option>
                        )}
                      </FormattedMessage>
                    </select>
                    {this.selectRH()}
                  </Form.Group>
                  <Button
                    className="btn btn-success"
                    onClick={this.add.bind(this)}
                    style={{ marginLeft: "10px", float: "right" }}
                  >
                    {" "}
                    {translate("Add")}
                  </Button>
                </Col>
                <Col>{this.dates()}</Col>
                <Card
                  style={{
                    width: "62%",
                    background: "rgba(0,0,0,.03)",
                    marginTop: "15px",
                  }}
                >
                  <Card.Header
                    style={{
                      fontWeight: "bold",
                      background: "rgba(0,0,0,.00)",
                      color: "rgb(49, 116, 173)",
                      paddingBottom: "10px",
                    }}
                  >
                    {translate("Total days")}: {this.calculeBalance()}
                  </Card.Header>
                </Card>

                <label
                  style={{
                    color: "#1DC7EA",
                    marginLeft: "10px",
                    fontWeight: "bold",
                  }}
                  htmlFor="CumulativeB"
                >
                  {translate("Select the type of vacation")}:{" "}
                </label>
                <Form.Group
                  style={{
                    display: "flex",
                    paddingTop: "10px",
                    width: "75%",
                    margin: "0px",
                  }}
                >
                  <Col md="9">
                    <Select
                      onChange={this.changeSelectType}
                      options={options}
                      placeholder={DatagridColumn[5]}
                    />
                  </Col>
                  <Col md="2">{this.addRH()}</Col>
                </Form.Group>

                <Form.Group>
                  <label>{translate("Description")}:</label>
                  <Form.Control
                    cols="80"
                    onChange={this.descrptionChange}
                    rows="2"
                    as="textarea"
                  ></Form.Control>
                </Form.Group>
              </Card.Body>
              <Card.Footer>
                <Button
                  id="saveReqBTN"
                  type="submit"
                  onClick={this.saveRequest}
                  disabled={true /*this.state.enableSaveButton*/}
                >
                  {" "}
                  {translate("Save request")}
                </Button>
              </Card.Footer>
            </Form>
          </Card>

          <Card style={{ padding: "0px 35px 0px 0px" }}>
            <Card.Body style={{ padding: "7px 7px" }}>
              <Calendar
                state={this.state.calendarState}
                ref={this.childRef}
                onChange={this.calendarChange}
              />
            </Card.Body>
            <Card.Footer></Card.Footer>
          </Card>
        </CardGroup>
      </div>
    );
  }
}
export default ExceptionVacation;
