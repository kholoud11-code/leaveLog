import React, { Component } from "react";
import "../css/Request.css";
import collaboratorService from "../../servicees/CollaborateurServices";
import RecoveryRequestService from "../../servicees/RecoveryRequestService";
import HolidayService from "../../servicees/HolidayService";
import Calendar from "../calendor/calendar5";
import dateFormat from "dateformat";
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import { defineMessages, injectIntl, FormattedMessage } from "react-intl";
import translate from "../../i18nProvider/translate";
import Select from "react-select";
import Swal from "sweetalert2";

import {
  Button,
  Card,
  CardGroup,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";

const englishColumn = [
  "Impossible to enter a holiday in a period where there is already one or more public holidays",
  "enter EndDate",
  "enter startDate",
  "you can't add other one",
  "You already have a holiday in this period!! impossible to complete the new leave request",
  "Done!",
  "Your Request is sent with success",
  "not",
  "Ok",
  "Select...",
];
const frenchColumn = [
  "Impossible de saisir un congé dans une periode ou il y a déja un(des) jour(s) ferier",
  "entrez la date de fin",
  "entrez la date de début",
  "vous ne pouvez pas en ajouter d'autre",
  "Vous avez deja un congé dans cette periode !! impossible de completer la nouvelle demande de congé",
  "Fait!",
  "Votre demande est envoyée avec succès",
  "ne pas",
  "D'accord",
  "Sélectionner...",
];
const spanishColumn = [
  "Imposible introducir un día festivo en un periodo en el que ya hay uno o más días festivos",
  "ingrese la fecha de finalización",
  "ingrese la fecha de inicio",
  "no puedes agregar más",
  "Ya tienes vacaciones en este periodo!! imposible completar la nueva solicitud de licencia",
  "Hecho!",
  "Su solicitud se envía con éxito",
  "no",
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

class RecoveryVacation extends Component {
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
      user: {},
      description: "",
      soldes: "",
      selectedType: "Full Day",
      RecoveryRequest: [],
      startHour: "",
      endHour: "",
      enableSaveButton: true,
      fetching: false,
      holidays: [],
      recoveryReqCollab: [],
    };
    this.calendarChange = this.calendarChange.bind(this);
    this.childRef = React.createRef();
    this.dates = this.dates.bind(this);
    this.deletelist = this.deletelist.bind(this);
    this.saveRequest = this.saveRequest.bind(this);
    this.descrptionChange = this.descrptionChange.bind(this);
    this.changeSelect = this.changeSelect.bind(this);
    this.calculeBalance = this.calculeBalance.bind(this);
    this.changeStartHourHandler = this.changeStartHourHandler.bind(this);
    this.changeEndHoursHandler = this.changeEndHoursHandler.bind(this);
    this.hourselect = this.hourselect.bind(this);
  }

  componentDidMount() {
    //this.setState({user:this.props.collaborateur})
    collaboratorService
      .getUserById(sessionStorage.getItem("user"))
      .then((res) => {
        this.setState({ user: res.data });
      });

    this.props.recoveryRequestOfCollaborateur.map((request) => {
      /* code separate traitment passe */
      if (
        request.collaborator.id === parseInt(sessionStorage.getItem("user")) &&
        request.statut === "Pending"
      ) {
        this.state.recoveryReqCollab.push(request);
        this.setState({ recoveryReqCollab: this.state.recoveryReqCollab });
      }
    });

    HolidayService.getHoliday().then((res) => {
      this.setState({ holidays: res.data });
    });
  }

  addDaysToDate(date, days) {
    var res = new Date(date);
    res.setDate(res.getDate() + days);
    return res;
  }

  calculeAtt(a, b) {
    let z = Math.ceil((a.getTime() - b.getTime()) / (1000 * 3600 * 24) + 1);
    let i = new Date(b.getTime());
    let index = new Date(b.getTime());
    let bool = false;

    for (i; i <= a; i.setDate(i.getDate() + 1)) {
      this.state.holidays.map((map) => {
        let holidaystartdate = new Date(map.date);
        let holidayenddate = this.addDaysToDate(map.date, map.duration - 1);

        if (index > holidaystartdate && index <= holidayenddate) {
          bool = true;
        }

        if (
          dateFormat(i, "yyyy-mm-dd") == map.date &&
          i.getDay() != 0 &&
          i.getDay() != 6
        ) {
          for (var f = 0; f < map.duration; f++) {
            var a = new Date(map.date);
            //var c = dateFormat(new Date(a.getTime()+(1000 * 3600 * 24)*i),"yyyy-mm-dd")
            var c = this.addDaysToDate(map.date, f);
            if (c.getDay() == 6 || c.getDay() == 0) {
              z = z + 1;
            }
          }
          z = z - map.duration;
          console.log(z);
        } else if (
          dateFormat(i, "yyyy-mm-dd") == map.date &&
          (holidaystartdate.getDay() == 0 || holidaystartdate.getDay() == 6)
        ) {
          for (var f = 0; f < map.duration; f++) {
            var a = new Date(map.date);
            //var c = dateFormat(new Date(a.getTime()+(1000 * 3600 * 24)*i),"yyyy-mm-dd")
            var c = this.addDaysToDate(map.date, f);
            if (c.getDay() == 6 || c.getDay() == 0) {
              z = z + 1;
            }
          }
          z = z - map.duration;
          //console.log(z)
        }
      });

      if (i.getDay() == 0 || i.getDay() == 6) {
        z = z - 1;
      }

      if (bool) {
        Swal.fire({
          title: DatagridColumn[0],
          confirmButtonText: DatagridColumn[8],
          icon: "warning",
        });
        break;
      }
    }
    if (bool) {
      return;
    }
    //console.log(z)
    return z;
  }

  // Add day with his start and end date with his duration
  add() {
    const element = this.childRef.current;
    if ((this.state.list = [])) {
      if (element.state.startDate != null) {
        if (element.state.endDate != null) {
          this.setState((state1) => {
            return {
              calendar: element.state,
              startDate: element.state.startDate,
            };
          });
          let DateReq = {
            startDate: dateFormat(element.state.startDate, "yyyy-mm-dd"),
            endDate: dateFormat(element.state.endDate, "yyyy-mm-dd"),
            //duration:Math.ceil((element.state.endDate.getTime()-element.state.startDate.getTime())/(1000 * 3600 * 24)+1)
            duration: this.calculeAtt(
              element.state.endDate,
              element.state.startDate
            ),
          };
          if (this.calculeAtt(element.state.endDate, element.state.startDate)) {
            this.state.list.push([
              element.state.startDate,
              element.state.endDate,
              this.calculeAtt(element.state.endDate, element.state.startDate),
            ]);
            this.state.list1.push(DateReq);
            this.setState({
              list: this.state.list,
              list1: this.state.list1,
              enableSaveButton: false,
            });
          }
        } else {
          Swal.fire({
            title: DatagridColumn[1],
            confirmButtonText: DatagridColumn[8],
            icon: "warning",
          });
        }
      } else {
        Swal.fire({
          title: DatagridColumn[2],
          confirmButtonText: DatagridColumn[8],
          icon: "warning",
        });
      }
    } else {
      Swal.fire({
        title: DatagridColumn[3],
        confirmButtonText: DatagridColumn[8],
        icon: "warning",
      });
    }
  }
  calendarChange = (calendarState) => {
    this.setState((state) => ({
      calendarState: { ...state.calendarState, ...calendarState },
    }));
  };
  // delete date

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
              <th>{translate("Duration")} </th>
              <th>{translate("Action")}</th>
            </tr>
          </thead>
          <tbody>
            {this.state.list.map((lists, index) => (
              <tr key={index}>
                <td> {dateFormat(lists[0], "yyyy-mm-dd")}</td>
                <td> {dateFormat(lists[1], "yyyy-mm-dd")}</td>
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
  // function to calcule balance use in vancaton

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
  saveRequest = (e) => {
    e.preventDefault();
    this.props.activeFetching();
    if (this.state.list1.length != 0) {
      let Request = {
        collaborator: this.state.user,
        description: this.state.description,
        totalDays: this.calculeBalance(),
        datesRequest: this.state.list1,
        requestDate: dateFormat(new Date(), "yyyy-mm-dd"),
        statut: "Pending",
        typeOfTime: this.state.selectedType,
        startHour: this.state.startHour,
        endHour: this.state.endHour,
      };

      const res = this.state.list1.map((datecalendor) => {
        var datacalendorStart = new Date(datecalendor.startDate);
        var datacalendorEnd = new Date(datecalendor.endDate);
        const res = this.state.recoveryReqCollab.reduce(function (
          recoveryReqres,
          recoveryreq
        ) {
          recoveryreq.datesRequest.map((datesReq) => {
            var dataReqStart = new Date(datesReq.startDate);
            var dataReqEnd = new Date(datesReq.endDate);
            if (
              (datacalendorStart.getTime() >= dataReqStart.getTime() &&
                datacalendorEnd.getTime() <= dataReqEnd.getTime()) ||
              (datacalendorStart.getTime() >= dataReqStart.getTime() &&
                datacalendorStart.getTime() <= dataReqEnd.getTime()) ||
              (datacalendorEnd.getTime() >= dataReqStart.getTime() &&
                datacalendorEnd.getTime() <= dataReqEnd.getTime())
            ) {
              recoveryReqres.push(recoveryreq);
            }
          });
          return recoveryReqres;
        },
        []);
        if (res.length != 0) {
          Swal.fire({
            title: DatagridColumn[4],
            confirmButtonText: DatagridColumn[8],
            icon: "warning",
          });
          this.props.descativeFetching();
        } else {
          RecoveryRequestService.createRecoveryRequest(Request).then((res) => {
            Swal.fire(DatagridColumn[5], DatagridColumn[6], "success").then(
              (result) => {
                if (result.isConfirmed) {
                  this.props.toMyRequest();
                  this.props.onHide();
                }
              }
            );
            this.props.descativeFetching();
            this.props.updateState();
          });
        }
      });
    } else {
      Swal.fire({
        title: DatagridColumn[7],
        confirmButtonText: DatagridColumn[8],
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
  changeStartHourHandler = (start) => {
    this.setState({ startHour: start.value });
  };
  changeEndHoursHandler = (end) => {
    this.setState({ endHour: end.value });
  };

  hourselect() {
    const options = [
      { value: 1, label: "1 am" },
      { value: 2, label: "2 am" },
      { value: 3, label: "3 am" },
      { value: 4, label: "4 am" },
      { value: 5, label: "5 am" },
      { value: 6, label: "6 am" },
      { value: 7, label: "7 am" },
      { value: 8, label: "8 am" },
      { value: 9, label: "9 am" },
      { value: 10, label: "10 am" },
      { value: 11, label: "11 am" },
      { value: 12, label: "12 am" },
      { value: 13, label: "1 pm" },
      { value: 14, label: "2 pm" },
      { value: 15, label: "3 pm" },
      { value: 16, label: "4 pm" },
      { value: 17, label: "5 pm" },
      { value: 18, label: "6 pm" },
      { value: 19, label: "7 pm" },
      { value: 20, label: "8 pm" },
      { value: 21, label: "9 pm" },
      { value: 22, label: "10 pm" },
      { value: 23, label: "11 pm" },
      { value: 24, label: "12 pm" },
    ];
    if (this.state.selectedType === "Hour")
      return (
        <div>
          <Form.Group
            style={{
              display: "inline-block",
              paddingTop: "10px",
              width: "20%",
              paddingRight: "10px",
            }}
          >
            <Select
              onChange={(change) => this.changeStartHourHandler(change)}
              options={options}
              placeholder={DatagridColumn[9]}
            />
          </Form.Group>
          <Form.Group
            style={{
              display: "inline-block",
              paddingTop: "10px",
              width: "20%",
              paddingRight: "10px",
            }}
          >
            <Select
              onChange={(change) => this.changeEndHoursHandler(change)}
              options={options}
              placeholder={DatagridColumn[9]}
            />
          </Form.Group>
        </div>
      );
  }

  render() {
    //console.log(this.state.startHour)
    //console.log(this.state.endHour)
    return (
      <div>
        <CardGroup>
          <Card>
            <Form>
              <Card.Body>
                <Col className="pr-4" md="12">
                  <Form.Group
                    style={{
                      display: "inline-block",
                      paddingTop: "10px",
                      paddingRight: "10px",
                    }}
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
                        key={"op" + "-" + "d"}
                      >
                        {(message) => (
                          <option value="Half Day afternoon">{message}</option>
                        )}
                      </FormattedMessage>
                      <FormattedMessage id="Hour" key={"op" + "-" + "c"}>
                        {(message) => <option value="Hour">{message}</option>}
                      </FormattedMessage>
                    </select>
                  </Form.Group>
                  {this.hourselect()}

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
              </Card.Body>

              <Card.Footer>
                <Card
                  style={{
                    width: "62%",
                    background: "rgba(0,0,0,.03)",
                    paddingBottom: "15px",
                  }}
                >
                  <Card.Header
                    style={{
                      fontWeight: "bold",
                      background: "rgba(0,0,0,.00)",
                      color: "rgb(49, 116, 173)",
                    }}
                  >
                    {translate("Total balance")}: {this.calculeBalance()}
                  </Card.Header>
                </Card>

                <Form.Group>
                  <label>{translate("Description")}:</label>
                  <Form.Control
                    cols="80"
                    onChange={this.descrptionChange}
                    rows="2"
                    as="textarea"
                  ></Form.Control>
                </Form.Group>

                <Button
                  id="saveReqBTN"
                  type="submit"
                  onClick={this.saveRequest}
                  disabled={true /*this.state.enableSaveButton*/}
                >
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

export default RecoveryVacation;
