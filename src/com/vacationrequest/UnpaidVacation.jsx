import React, { Component } from "react";
import "../css/Request.css";
import collaboratorService from "../../servicees/CollaborateurServices";
import UnPaidRequestService from "../../servicees/UnPaidRequestService";
import HolidayService from "../../servicees/HolidayService";
import Calendar from "../calendor/calendar5";
import dateFormat from "dateformat";
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import { defineMessages, injectIntl, FormattedMessage } from "react-intl";
import Swal from "sweetalert2";
import { Button, Card, CardGroup, Form, Col } from "react-bootstrap";
import { reactLocalStorage } from "reactjs-localstorage";

const englishColumn = [
  "Impossible to enter a holiday in a period where there is already one or more public holidays",
  "enter EndDate",
  "enter startDate",
  "you can't add other one",
  "You already have a holiday in this period!! impossible to complete the new leave request",
  "Done!",
  "Your Request is sent with success",
  "Ok",
];
const frenchColumn = [
  "Impossible de saisir un congé dans une periode ou il y a déja un(des) jour(s) ferier",
  "entrez la date de fin",
  "entrez la date de début",
  "vous ne pouvez pas en ajouter d'autre",
  "Vous avez deja un congé dans cette periode !! impossible de completer la nouvelle demande de congé",
  "Fait!",
  "Votre demande est envoyée avec succès",
  "D'accord",
];
const spanishColumn = [
  "Imposible introducir un día festivo en un periodo en el que ya hay uno o más días festivos",
  "ingrese la fecha de finalización",
  "ingrese la fecha de inicio",
  "no puedes agregar más",
  "Ya tienes vacaciones en este periodo!! imposible completar la nueva solicitud de licencia",
  "Hecho!",
  "Su solicitud se envía con éxito",
  "bueno",
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

class UnpaidVacation extends Component {
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
      selectedType: "Full Day",
      UnpaidRequest: [],
      enableSaveButton: true,
      enableAddButton: false,
      fetching: false,
      holidays: [],
      unpaidReqCollab: [],
    };
    this.calendarChange = this.calendarChange.bind(this);
    this.childRef = React.createRef();
    this.dates = this.dates.bind(this);
    this.deletelist = this.deletelist.bind(this);
    this.saveRequest = this.saveRequest.bind(this);
    this.descrptionChange = this.descrptionChange.bind(this);
    this.changeSelect = this.changeSelect.bind(this);
    this.calculeBalance = this.calculeBalance.bind(this);
  }

  componentDidMount() {
    //console.log(this.props.path)
    //this.setState({user:this.props.collaborateur})
    collaboratorService
      .getUserById(sessionStorage.getItem("user"))
      .then((res) => {
        this.setState({ user: res.data });
      });

    /*this.props.unpaiedRequestOfCollaborateur.map(request=>{
        if(request.statut==="Pending"){
          this.state.unpaidReqCollab.push(request)
          this.setState({unpaidReqCollab:this.state.unpaidReqCollab})
        }   
      })*/

    /*** */
    /*UnPaidRequestService.getUnPaidRequestOfUser(parseInt(sessionStorage.getItem('user'))).then(res=>{
        this.setState({UnpaidRequest:res.data});
        res.data.map(request=>{
          if(request.statut==="Pending"){
            this.state.unpaidReqCollab.push(request)
            this.setState({unpaidReqCollab:this.state.unpaidReqCollab})
          }   
        })
      })*/
    /*if(reactLocalStorage.getObject("UnpaidRequestOfCollaborateurConnected"+sessionStorage.getItem('user')).length != 0){
        reactLocalStorage.getObject("UnpaidRequestOfCollaborateurConnected"+sessionStorage.getItem('user')).map(request=>{
          if(request.statut!=="refused" && request.statut!=="cancellation accepted"){
              this.state.unpaidReqCollab.push(request)
              this.setState({unpaidReqCollab:this.state.unpaidReqCollab})
              //console.info(this.state.unpaidReqCollab) 
          }
        })
      }*/
    /* code separate traitment passe */
    if (this.props.path === "myrequest") {
      if (
        reactLocalStorage.getObject(
          "UnpaidRequestOfCollaborateurConnected" +
            sessionStorage.getItem("user")
        ).length != 0
      ) {
        reactLocalStorage
          .getObject(
            "UnpaidRequestOfCollaborateurConnected" +
              sessionStorage.getItem("user")
          )
          .map((request) => {
            if (
              request.statut !== "refused" &&
              request.statut !== "cancellation accepted"
            ) {
              this.state.unpaidReqCollab.push(request);
              this.setState({ unpaidReqCollab: this.state.unpaidReqCollab });
              //console.info(this.state.unpaidReqCollab)
            }
          });
      }
    } else if (this.props.path === "request") {
      /* code separate traitment passe */
      this.props.unpaiedRequestOfCollaborateur.map((request) => {
        if (
          request.collaborator.id ===
            parseInt(sessionStorage.getItem("user")) &&
          request.statut !== "refused" &&
          request.statut !== "cancellation accepted"
        ) {
          this.state.unpaidReqCollab.push(request);
          this.setState({ unpaidReqCollab: this.state.unpaidReqCollab });
        }
      });
    }

    /*** */

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
    let enddateformat = dateFormat(a, "yyyy-mm-dd");
    let calculeenddate = new Date(enddateformat);
    let startdateformat = dateFormat(b, "yyyy-mm-dd");
    let calculestartdate = new Date(startdateformat);

    // Calculate the difference in milliseconds
    var timeDiff = Math.abs(
      calculeenddate.getTime() - calculestartdate.getTime()
    );

    // Calculate the difference in days method 1
    let z = Math.ceil(timeDiff / (24 * 60 * 60 * 1000) + 1);

    //let z = Math.ceil(((a.getTime()-b.getTime())/(1000 * 3600 * 24)+1))
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
          // console.log("*****************")
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
        } else if (
          dateFormat(i, "yyyy-mm-dd") == map.date &&
          (holidaystartdate.getDay() == 0 || holidaystartdate.getDay() == 6)
        ) {
          //console.log("******************")
          for (var f = 0; f < map.duration; f++) {
            var a = new Date(map.date);
            //var c = dateFormat(new Date(a.getTime()+(1000 * 3600 * 24)*i),"yyyy-mm-dd")
            var c = this.addDaysToDate(map.date, f);
            if (c.getDay() == 6 || c.getDay() == 0) {
              z = z + 1;
            }
          }
          z = z - map.duration;
          // console.log(z)
        }
      });

      if (i.getDay() == 0 || i.getDay() == 6) {
        z = z - 1;
      }

      if (bool) {
        Swal.fire({
          title: DatagridColumn[0],
          confirmButtonText: DatagridColumn[7],
          icon: "warning",
        });
        break;
      }
    }
    if (bool) {
      return;
    }
    // console.log(z)
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
          let x = 0;
          let y = 0;
          if (this.state.selectedType === "Full Day") {
            y = this.calculeAtt(element.state.endDate, element.state.startDate);
          } else {
            y =
              this.calculeAtt(element.state.endDate, element.state.startDate) *
              0.5;
          }
          let DateReq = {
            startDate: dateFormat(element.state.startDate, "yyyy-mm-dd"),
            endDate: dateFormat(element.state.endDate, "yyyy-mm-dd"),
            //duration:Math.ceil((element.state.endDate.getTime()-element.state.startDate.getTime())/(1000 * 3600 * 24)+1)
            //duration:this.calculeAtt(element.state.endDate,element.state.startDate)
            duration: y,
          };
          if (this.calculeAtt(element.state.endDate, element.state.startDate)) {
            if (this.state.selectedType === "Full Day") {
              x = this.calculeAtt(
                element.state.endDate,
                element.state.startDate
              );
            } else {
              x =
                this.calculeAtt(
                  element.state.endDate,
                  element.state.startDate
                ) * 0.5;
            }
            //this.state.list.push([element.state.startDate,element.state.endDate,this.calculeAtt(element.state.endDate,element.state.startDate)])
            this.state.list.push([
              element.state.startDate,
              element.state.endDate,
              x,
            ]);
            this.state.list1.push(DateReq);
            this.setState({
              list: this.state.list,
              list1: this.state.list1,
              enableAddButton: true,
              enableSaveButton: false,
            });
          }
        } else {
          Swal.fire({
            title: DatagridColumn[1],
            confirmButtonText: DatagridColumn[7],
            icon: "warning",
          });
        }
      } else {
        Swal.fire({
          title: DatagridColumn[2],
          confirmButtonText: DatagridColumn[7],
          icon: "warning",
        });
      }
    } else {
      Swal.fire({
        title: DatagridColumn[3],
        confirmButtonText: DatagridColumn[7],
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
                      this.setState({ enableAddButton: false });
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
      //if(this.state.selectedType==="Full Day"){
      this.state.list.map((lists) => (a = a + lists[2]));
      /*}else{
    this.state.list.map(lists=>
      a=a+lists[2]*0.5
      
      )
  }*/
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
      };

      const res = this.state.list1.map((datecalendor) => {
        var datacalendorStart = new Date(datecalendor.startDate);
        var datacalendorEnd = new Date(datecalendor.endDate);
        const res = this.state.unpaidReqCollab.reduce(function (
          unpaidReqres,
          unpaidreq
        ) {
          unpaidreq.datesRequest.map((datesReq) => {
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
              unpaidReqres.push(unpaidreq);
            }
          });
          return unpaidReqres;
        },
        []);
        if (res.length != 0) {
          Swal.fire({
            title: DatagridColumn[4],
            confirmButtonText: DatagridColumn[7],
            icon: "warning",
          });
          this.props.descativeFetching();
        } else {
          UnPaidRequestService.createUnPaidRequest(Request).then((res) => {
            Swal.fire({
              title: DatagridColumn[5],
              text: DatagridColumn[6],
              confirmButtonText: DatagridColumn[7],
              icon: "success",
            }).then((result) => {
              if (result.isConfirmed) {
                /* code separate traitment passe */ this.props.path ===
                "request"
                  ? this.props.toRequest()
                  : this.props.toMyRequest();
                this.props.onHide();
              }
            });
            reactLocalStorage.setObject(
              "UnpaidRequestOfCollaborateurConnected" +
                sessionStorage.getItem("user"),
              []
            );
            this.props.descativeFetching();
            /* code separate traitment passe */ this.props.path === "request"
              ? this.props.updateStateRequest()
              : this.props.updateState();
          });
        }
      });
    } else {
      Swal.fire({
        title: "------",
        confirmButtonText: DatagridColumn[7],
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

  render() {
    const { intl } = this.props;
    return (
      <div>
        {this.state.fetching ? <Fetching /> : null}
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
                  </Form.Group>
                  <Button
                    id="addBTN"
                    onClick={this.add.bind(this)}
                    style={{ marginLeft: "10px", float: "right" }}
                    disabled={this.state.enableAddButton}
                  >
                    {" "}
                    {translate("Add")}
                  </Button>
                </Col>
                <Col>{this.dates()}</Col>
              </Card.Body>

              <Card.Footer>
                <Card style={{ width: "62%", background: "rgba(0,0,0,.03)" }}>
                  <Card.Header
                    style={{
                      fontWeight: "bold",
                      background: "rgba(0,0,0,.00)",
                      color: "rgb(49, 116, 173)",
                      paddingBottom: "10px",
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
                  disabled={
                    /*true*/ /* code separate traitment passe */ this.props
                      .path === "request"
                      ? true
                      : this.state.enableSaveButton
                  }
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

export default injectIntl(UnpaidVacation);
