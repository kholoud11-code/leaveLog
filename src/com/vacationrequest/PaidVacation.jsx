import React, { Component } from "react";
import "../css/Request.css";
import collaboratorService from "../../servicees/CollaborateurServices";
import PaidRequestService from "../../servicees/PaidRequestService";
import Calendar from "../calendor/calendar6";
import dateFormat from "dateformat";
import translate from "../../i18nProvider/translate";
import { defineMessages, injectIntl, FormattedMessage } from "react-intl";
import HolidayService from "../../servicees/HolidayService";
import { Button, Card, CardGroup, Form, Col } from "react-bootstrap";
//import { I18nPropvider, LOCALES } from '../../i18nProvider';
//import User from 'views/UserProfile';
//import CollaborateurServices from '../../servicees/CollaborateurServices';
import Swal from "sweetalert2";
import { reactLocalStorage } from "reactjs-localstorage";
import Select from "react-select";
//traitement balance action
//code changes in balance action treatment
import BalanceActionService from "../../servicees/BalanceActionService";

const englishColumn = [
  "Impossible to enter a holiday in a period where there is already one or more public holidays",
  "enter EndDate",
  "enter startDate",
  "You already have a holiday in this period!! impossible to complete the new leave request",
  "Done!",
  "Your Request is sent with success",
  "insufficient balance",
  "already have a holiday in this period!! impossible to complete the new leave request",
  "Please be informed that your vacation hours will be logged automatically in Kosin once the request is accepted (this includes any festive days that exist in the same time frame of the request).",
  "If you encounter any issues, please contact your organizational unit validator.",
  "Ok",
  "Select...",
];
const frenchColumn = [
  "Impossible de saisir un congé dans une periode ou il y a déja un(des) jour(s) ferier",
  "entrez la date de fin",
  "entrez la date de début",
  "Vous avez deja un congé dans cette periode !! impossible de completer la nouvelle demande de congé",
  "Fait!",
  "Votre demande est envoyée avec succès",
  "solde insuffisant",
  "a déjà un congé à cette période !! impossible de completer la nouvelle demande de congé",
  "Veuillez noter que vos heures de vacances seront automatiquement enregistrées dans Kosin une fois la demande acceptée (cela inclut tous les jours fériés existants dans la même période que la demande de votre congé).",
  "Si vous rencontrez des problèmes, veuillez contacter le validateur de votre unité organisationnelle.",
  "D'accord",
  "Sélectionner...",
];
const spanishColumn = [
  "Imposible introducir un día festivo en un periodo en el que ya hay uno o más días festivos",
  "ingrese la fecha de finalización",
  "ingrese la fecha de inicio",
  "Ya tienes vacaciones en este periodo!! imposible completar la nueva solicitud de licencia",
  "Hecho!",
  "Su solicitud se envía con éxito",
  "saldo insuficiente",
  "ya tiene vacaciones a esta hora!! imposible completar la nueva solicitud de licencia",
  "Tenga en cuenta que sus horas de vacaciones se registrarán automáticamente en Kosin una vez que se acepte la solicitud de las vacaciones (esto incluye cualquier día festivo que exista en el mismo período de tiempo de la solicitud).",
  "Si tiene algún problema, comuníquese con el validador de su unidad organizativa.",
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

class PaidVacation extends Component {
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
      paidRequest: [],
      allrequest: 0,
      holidays: [],
      enableSaveButton: true,
      enableAddButton: false,
      fetching: false,
      paidReqCollab: [],
      showAlert: false,
      //new state
      collaborators: [],
      users: "",
      selectCollaborator: false,
      collaboratorId: "",
      isInBPOWeekendsUnit: false,
      isInBPO: false,
    };

    this.calendarChange = this.calendarChange.bind(this);
    this.childRef = React.createRef();
    this.dates = this.dates.bind(this);
    this.deletelist = this.deletelist.bind(this);
    this.calculeBalance = this.calculeBalance.bind(this);
    this.saveRequest = this.saveRequest.bind(this);
    this.descrptionChange = this.descrptionChange.bind(this);
    this.calculeCumulativeBalance = this.calculeCumulativeBalance.bind(this);
    this.changeSelect = this.changeSelect.bind(this);
  }

  componentDidMount() {
    //let user = this.props.collaborateur;//JSON.parse(sessionStorage.getItem('userConnected'));

    collaboratorService
      .getUserById(sessionStorage.getItem("user"))
      .then((res) => {
        this.setState({
          cumulative: res.data.solde.cumulativeBalance,
          annual: res.data.solde.annualBalance,
          collaboratorId: res.data.id,
          remainder: res.data.solde.remainder,
          user: res.data,
          soldes: res.data.solde.cumulativeBances,
        });
        sessionStorage.setItem("userConnected", JSON.stringify(res.data));
      });
    let balanceUsedPending = 0;
    /*if(reactLocalStorage.getObject("PaidRequestOfCollaborateurConnected"+sessionStorage.getItem('user')).length != 0){
          reactLocalStorage.getObject("PaidRequestOfCollaborateurConnected"+sessionStorage.getItem('user')).map(request=>{
            
            if(request.statut!=="refused" && request.statut!=="cancellation accepted"){
              if(request.statut==="Pending"){
               balanceUsedPending += request.balanceUsed;
                //this.setState({allrequest:this.state.allrequest+request.balanceUsed})
              }
              this.state.paidReqCollab.push(request)
              this.setState({paidReqCollab:this.state.paidReqCollab})
            } 
          })
          this.setState({allrequest:balanceUsedPending})
        }*/
    /* code separate traitment passe */
    /**** */
    if (this.props.path === "myrequest") {
      if (
        reactLocalStorage.getObject(
          "PaidRequestOfCollaborateurConnected" + sessionStorage.getItem("user")
        ).length != 0
      ) {
        reactLocalStorage
          .getObject(
            "PaidRequestOfCollaborateurConnected" +
              sessionStorage.getItem("user")
          )
          .map((request) => {
            if (
              request.statut !== "refused" &&
              request.statut !== "cancellation accepted"
            ) {
              if (request.statut === "Pending") {
                balanceUsedPending += request.balanceUsed;
                //this.setState({allrequest:this.state.allrequest+request.balanceUsed})
              }
              this.state.paidReqCollab.push(request);
              this.setState({ paidReqCollab: this.state.paidReqCollab });
            }
          });
        this.setState({ allrequest: balanceUsedPending });
      }
    } else if (this.props.path === "request") {
      this.props.paiedRequestOfCollaborateur.map((request) => {
        if (
          request.collaborator.id ===
            parseInt(sessionStorage.getItem("user")) &&
          request.statut !== "refused" &&
          request.statut !== "cancellation accepted"
        ) {
          if (request.statut === "Pending") {
            balanceUsedPending += request.balanceUsed;
            //this.setState({allrequest:this.state.allrequest+request.balanceUsed})
          }
          this.state.paidReqCollab.push(request);
          this.setState({ paidReqCollab: this.state.paidReqCollab });
        }
      });
      this.setState({ allrequest: balanceUsedPending });
    }
    /**** */

    HolidayService.getHoliday().then((res) => {
      this.setState({ holidays: res.data });
    });

    // new AFFICHER LA LISTE DES COLLABORATEURS
    /* code separate traitment passe */
    if (this.props.path === "request") {
      collaboratorService.getUser().then((res) => {
        this.setState({
          collaborators: res.data.filter((val) => {
            if ('"' + val.country + '"' === sessionStorage.getItem("country")) {
              return val;
            }
          }),
          options: res.data
            .filter((val) => {
              console.log(
                '"' + val.country + '"' === sessionStorage.getItem("country")
              );
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
  }

  // new GET FROM LISTE COLLABORATORS
  changevalidatorHandler = (users) => {
    //console.log(users.value)
    //console.info(this.state.paidReqCollab)
    //console.info(this.state.allrequest)

    this.setState({ selectCollaborator: true });
    this.setState({ users: users });
    this.setState({
      //paidReqCollab:[],
      //allrequest:0,
      cumulative: users.value.solde.cumulativeBalance,
      annual: users.value.solde.annualBalance,
      collaboratorId: users.value.id,
      remainder: users.value.solde.remainder,
      //user:user,
      soldes: users.value.solde.cumulativeBances,
    });
    this.state.paidReqCollab = [];
    this.state.allrequest = 0;
    let balanceUsedPending = 0;
    PaidRequestService.getPaidRequestOfUser(users.value.id).then((res) => {
      console.log(res.data);
      res.data.map((request) => {
        // console.log(request)
        if (
          request.collaborator.id === users.value.id &&
          request.statut !== "refused" &&
          request.statut !== "cancellation accepted"
        ) {
          //this.setState({paidReqCollab:[]});
          if (request.statut === "Pending") {
            //this.setState({allrequest:0});
            //console.log(this.state.allrequest)
            balanceUsedPending += request.balanceUsed;
            //console.log(this.state.allrequest)
          }
          //console.log(this.state.paidReqCollab)
          this.state.paidReqCollab.push(request);
          //console.log(this.state.paidReqCollab)
          this.setState({ paidReqCollab: this.state.paidReqCollab });
          console.log(this.state.paidReqCollab);
        }
      });
      this.setState({ allrequest: balanceUsedPending });
      console.log(this.state.paidReqCollab);
      console.log(this.state.allrequest);
    });

    //console.log(this.state.soldes)
    //console.log(this.state.annual)
  };

  //new RETURN COLLABORATEUR
  checkColaborator = () => {
    var collaborator = this.state.user;
    if (sessionStorage.getItem("role") === "RH" && this.state.users != "") {
      collaborator = this.state.users.value;
    }
    return collaborator;
  };

  //show to collaborator his cumulative balance
  calculeCumulativeBalance() {
    let a = 0;
    if (this.state.soldes != [] && this.state.soldes != null) {
      this.state.soldes.map((solde) => (a = a + solde.balance));
    }
    return a;
  }

  // calacule Duration of request with knowing holiday
  addDaysToDate(date, days) {
    var res = new Date(date);
    res.setDate(res.getDate() + days);
    return res;
  }

  checkHolidaySelected(datestartholiday, dateendholiday, dateselected) {
    let dsh = new Date(datestartholiday.getTime());
    let deh = new Date(dateendholiday.getTime());
    let ds = new Date(dateselected.getTime());

    if (dsh < ds && ds <= deh) {
      return true;
    }
    return false;
  }
  //Normal Method
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
    //treatment of change duration request with 5 consecutive days to 4 in jult and august
    let MonthofStartDate = new Date(b.getTime());
    let MonthofEndDate = new Date(a.getTime());
    let CheckHolidayOrWeekendTraitment = true;
    let NumbersOfDaysInAugust = 0;
    let NumbersOfDaysInJuly = 0;

    for (i; i <= a; i.setDate(i.getDate() + 1)) {
      //treatment of change duration request with 5 consecutive days to 4 in jult and august
      if (i.getMonth() + 1 === 8) {
        NumbersOfDaysInAugust += 1;
      }
      if (i.getMonth() + 1 === 7) {
        NumbersOfDaysInJuly += 1;
      }

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
              //treatment of change duration request with 5 consecutive days to 4 in jult and august
              CheckHolidayOrWeekendTraitment = false;
              if (c.getMonth() + 1 === 8) {
                NumbersOfDaysInAugust = NumbersOfDaysInAugust + 1;
              }
              if (c.getMonth() + 1 === 7) {
                NumbersOfDaysInJuly = NumbersOfDaysInJuly + 1;
              }
              z = z + 1;
            }
          }
          //treatment of change duration request with 5 consecutive days to 4 in jult and august
          CheckHolidayOrWeekendTraitment = false;
          if (i.getMonth() + 1 === 8) {
            NumbersOfDaysInAugust = NumbersOfDaysInAugust - map.duration;
          }
          if (i.getMonth() + 1 === 7) {
            NumbersOfDaysInJuly = NumbersOfDaysInJuly - map.duration;
          }
          z = z - map.duration;
        } else if (
          dateFormat(i, "yyyy-mm-dd") == map.date &&
          (holidaystartdate.getDay() == 0 || holidaystartdate.getDay() == 6)
        ) {
          for (var f = 0; f < map.duration; f++) {
            var a = new Date(map.date);
            //var c = dateFormat(new Date(a.getTime()+(1000 * 3600 * 24)*i),"yyyy-mm-dd")
            var c = this.addDaysToDate(map.date, f);
            if (c.getDay() == 6 || c.getDay() == 0) {
              //treatment of change duration request with 5 consecutive days to 4 in jult and august
              CheckHolidayOrWeekendTraitment = false;
              if (c.getMonth() + 1 === 8) {
                NumbersOfDaysInAugust = NumbersOfDaysInAugust + 1;
              }
              if (c.getMonth() + 1 === 7) {
                NumbersOfDaysInJuly = NumbersOfDaysInJuly + 1;
              }
              z = z + 1;
            }
          }
          //treatment of change duration request with 5 consecutive days to 4 in jult and august
          CheckHolidayOrWeekendTraitment = false;
          if (i.getMonth() + 1 === 8) {
            NumbersOfDaysInAugust = NumbersOfDaysInAugust - map.duration;
          }
          if (i.getMonth() + 1 === 7) {
            NumbersOfDaysInJuly = NumbersOfDaysInJuly - map.duration;
          }
          z = z - map.duration;
        }
      });

      if (i.getDay() == 0 || i.getDay() == 6) {
        //treatment of change duration request with 5 consecutive days to 4 in jult and august
        CheckHolidayOrWeekendTraitment = false;
        if (i.getMonth() + 1 === 8) {
          NumbersOfDaysInAugust = NumbersOfDaysInAugust - 1;
        }
        if (i.getMonth() + 1 === 7) {
          NumbersOfDaysInJuly = NumbersOfDaysInJuly - 1;
        }
        z = z - 1;
      }

      if (bool) {
        Swal.fire({
          title: DatagridColumn[0],
          confirmButtonText: DatagridColumn[10],
          icon: "warning",
        });
        break;
      }
    }
    if (bool) {
      return;
    }
    //treatment of changing duration of the request within 5 consecutive days to 4 in july and august
    /******/
    if (
      CheckHolidayOrWeekendTraitment === true &&
      z % 5 === 0 &&
      ((MonthofStartDate.getMonth() + 1 === 7 &&
        MonthofEndDate.getMonth() + 1 === 7) ||
        (MonthofStartDate.getMonth() + 1 === 7 &&
          MonthofEndDate.getMonth() + 1 === 8) ||
        (MonthofStartDate.getMonth() + 1 === 8 &&
          MonthofEndDate.getMonth() + 1 === 8))
    ) {
      let pas = z / 5;
      return z - pas;
    }
    if (
      CheckHolidayOrWeekendTraitment === false &&
      z % 5 === 0 &&
      ((MonthofStartDate.getMonth() + 1 === 7 &&
        MonthofEndDate.getMonth() + 1 === 7) ||
        (MonthofStartDate.getMonth() + 1 === 7 &&
          MonthofEndDate.getMonth() + 1 === 8) ||
        (MonthofStartDate.getMonth() + 1 === 8 &&
          MonthofEndDate.getMonth() + 1 === 8))
    ) {
      let pas = z / 5;
      return z - pas;
    }
    if (
      CheckHolidayOrWeekendTraitment === true &&
      z % 5 != 0 &&
      ((MonthofStartDate.getMonth() + 1 === 7 &&
        MonthofEndDate.getMonth() + 1 === 7) ||
        (MonthofStartDate.getMonth() + 1 === 7 &&
          MonthofEndDate.getMonth() + 1 === 8) ||
        (MonthofStartDate.getMonth() + 1 === 8 &&
          MonthofEndDate.getMonth() + 1 === 8))
    ) {
      let r = z % 5;
      let pas = (z - r) / 5;
      return z - pas;
    }
    if (
      CheckHolidayOrWeekendTraitment === false &&
      z % 5 != 0 &&
      ((MonthofStartDate.getMonth() + 1 === 7 &&
        MonthofEndDate.getMonth() + 1 === 7) ||
        (MonthofStartDate.getMonth() + 1 === 7 &&
          MonthofEndDate.getMonth() + 1 === 8) ||
        (MonthofStartDate.getMonth() + 1 === 8 &&
          MonthofEndDate.getMonth() + 1 === 8))
    ) {
      let r = z % 5;
      let pas = (z - r) / 5;
      return z - pas;
    }
    if (
      MonthofStartDate.getMonth() + 1 === 8 &&
      MonthofEndDate.getMonth() + 1 === 9 &&
      NumbersOfDaysInAugust < 5
    ) {
      return z;
    }
    if (
      MonthofStartDate.getMonth() + 1 === 8 &&
      MonthofEndDate.getMonth() + 1 === 9 &&
      NumbersOfDaysInAugust >= 5
    ) {
      let r = NumbersOfDaysInAugust % 5;
      let pas = (NumbersOfDaysInAugust - r) / 5;
      return z - pas;
    }
    if (
      MonthofStartDate.getMonth() + 1 === 6 &&
      MonthofEndDate.getMonth() + 1 === 7 &&
      NumbersOfDaysInJuly < 5
    ) {
      return z;
    }
    if (
      MonthofStartDate.getMonth() + 1 === 6 &&
      MonthofEndDate.getMonth() + 1 === 7 &&
      NumbersOfDaysInJuly >= 5
    ) {
      let r = NumbersOfDaysInJuly % 5;
      let pas = (NumbersOfDaysInJuly - r) / 5;
      return z - pas;
    }
    /******/
    return z;
  }
  //BPO Normal
  calculeAttIfBPO(a, b) {
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
    let i = new Date(b.getTime());
    let index = new Date(b.getTime());
    let bool = false;
    let CheckHolidayOrWeekendTraitment = true;

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
              //treatment of change duration request with 5 consecutive days to 4 in jult and august
              CheckHolidayOrWeekendTraitment = false;
              z = z + 1;
            }
          }
          //treatment of change duration request with 5 consecutive days to 4 in jult and august
          CheckHolidayOrWeekendTraitment = false;
          z = z - map.duration;
        } else if (
          dateFormat(i, "yyyy-mm-dd") == map.date &&
          (holidaystartdate.getDay() == 0 || holidaystartdate.getDay() == 6)
        ) {
          for (var f = 0; f < map.duration; f++) {
            var a = new Date(map.date);
            //var c = dateFormat(new Date(a.getTime()+(1000 * 3600 * 24)*i),"yyyy-mm-dd")
            var c = this.addDaysToDate(map.date, f);
            if (c.getDay() == 6 || c.getDay() == 0) {
              //treatment of change duration request with 5 consecutive days to 4 in jult and august
              CheckHolidayOrWeekendTraitment = false;
              z = z + 1;
            }
          }
          //treatment of change duration request with 5 consecutive days to 4 in jult and august
          CheckHolidayOrWeekendTraitment = false;

          z = z - map.duration;
        }
      });

      if (i.getDay() == 0 || i.getDay() == 6) {
        //treatment of change duration request with 5 consecutive days to 4 in jult and august
        CheckHolidayOrWeekendTraitment = false;
        z = z - 1;
      }

      if (bool) {
        Swal.fire({
          title: DatagridColumn[0],
          confirmButtonText: DatagridColumn[10],
          icon: "warning",
        });
        break;
      }
    }
    if (bool) {
      return;
    }
    //treatment of changing duration of the request within 5 consecutive days to 4 in july and august
    /******/
    if (CheckHolidayOrWeekendTraitment === true) {
      return z;
    }
    /******/
    return z;
  }
  //BPO Weekends
  calculeAttIfBPOWeekends(a, b) {
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
    //treatment of change duration request with 5 consecutive days to 4 in jult and august
    let CheckHolidayOrWeekendTraitment = true;

    for (i; i <= a; i.setDate(i.getDate() + 1)) {
      //treatment of change duration request with 5 consecutive days to 4 in jult and august
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
          }
          //treatment of change duration request with 5 consecutive days to 4 in jult and august
          CheckHolidayOrWeekendTraitment = false;
          z = z - map.duration;
        } else if (dateFormat(i, "yyyy-mm-dd") == map.date) {
          for (var f = 0; f < map.duration; f++) {
            var a = new Date(map.date);
            //var c = dateFormat(new Date(a.getTime()+(1000 * 3600 * 24)*i),"yyyy-mm-dd")
            var c = this.addDaysToDate(map.date, f);
            if (c.getDay() == 6 || c.getDay() == 0) {
              //treatment of change duration request with 5 consecutive days to 4 in jult and august
              CheckHolidayOrWeekendTraitment = false;

              z = z + 1;
            }
          }
          //treatment of change duration request with 5 consecutive days to 4 in jult and august
          CheckHolidayOrWeekendTraitment = false;

          z = z - map.duration;
        }
      });

      if (bool) {
        Swal.fire({
          title: DatagridColumn[0],
          confirmButtonText: DatagridColumn[10],
          icon: "warning",
        });
        break;
      }
    }
    if (bool) {
      return;
    }

    if (CheckHolidayOrWeekendTraitment === true) {
      return z;
    }

    return z;
  }
  // Add day with his start and end date with his duration
  add() {
    const element = this.childRef.current;
    const collaboratorId = this.state.collaboratorId;
    console.info(this.state.collaboratorId);
    // Check if the collaborator is in BPO or BPO Weekends Unit
    this.isCollaboratorInBPOWeekendsUnit(collaboratorId);
    this.isCollaboratorInBPOUnit(collaboratorId);
    // Wait for the state to be updated
    setTimeout(
      () => {
        //let calculeMethod;
        // Determine which calculation method to use
        if (this.state.isInBPOWeekendsUnit) {
          //calculeMethod = this.calculeAttIfBPOWeekends;
          console.info("BPO weekends calculate");
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
                  y = this.calculeAttIfBPOWeekends(
                    element.state.endDate,
                    element.state.startDate
                  );
                } else {
                  y =
                    this.calculeAttIfBPOWeekends(
                      element.state.endDate,
                      element.state.startDate
                    ) * 0.5;
                }
                let DateReq = {
                  startDate: dateFormat(element.state.startDate, "yyyy-mm-dd"),
                  endDate: dateFormat(element.state.endDate, "yyyy-mm-dd"),
                  //duration:Math.ceil((element.state.endDate.getTime()-element.state.startDate.getTime())/(1000 * 3600 * 24)+1)
                  //duration: this.calculeAtt(element.state.endDate,element.state.startDate)
                  duration: y,
                };

                if (
                  this.calculeAttIfBPOWeekends(
                    element.state.endDate,
                    element.state.startDate
                  )
                ) {
                  if (this.state.selectedType === "Full Day") {
                    x = this.calculeAttIfBPOWeekends(
                      element.state.endDate,
                      element.state.startDate
                    );
                  } else {
                    x =
                      this.calculeAttIfBPOWeekends(
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
                  console.info(this.state.list);
                  console.info(this.state.list1);
                }
              } else {
                Swal.fire({
                  title: DatagridColumn[1],
                  confirmButtonText: DatagridColumn[10],
                  icon: "warning",
                });
              }
            } else {
              Swal.fire({
                title: DatagridColumn[2],
                confirmButtonText: DatagridColumn[10],
                icon: "warning",
              });
            }
          }
        } else if (this.state.isInBPO) {
          //calculeMethod = this.calculeAttIfBPO;
          console.info("BPO normal calculate");

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
                  y = this.calculeAttIfBPO(
                    element.state.endDate,
                    element.state.startDate
                  );
                } else {
                  y =
                    this.calculeAttIfBPO(
                      element.state.endDate,
                      element.state.startDate
                    ) * 0.5;
                }
                let DateReq = {
                  startDate: dateFormat(element.state.startDate, "yyyy-mm-dd"),
                  endDate: dateFormat(element.state.endDate, "yyyy-mm-dd"),
                  //duration:Math.ceil((element.state.endDate.getTime()-element.state.startDate.getTime())/(1000 * 3600 * 24)+1)
                  //duration: this.calculeAtt(element.state.endDate,element.state.startDate)
                  duration: y,
                };

                if (
                  this.calculeAttIfBPO(
                    element.state.endDate,
                    element.state.startDate
                  )
                ) {
                  if (this.state.selectedType === "Full Day") {
                    x = this.calculeAttIfBPO(
                      element.state.endDate,
                      element.state.startDate
                    );
                  } else {
                    x =
                      this.calculeAttIfBPO(
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
                  console.info(this.state.list);
                  console.info(this.state.list1);
                }
              } else {
                Swal.fire({
                  title: DatagridColumn[1],
                  confirmButtonText: DatagridColumn[10],
                  icon: "warning",
                });
              }
            } else {
              Swal.fire({
                title: DatagridColumn[2],
                confirmButtonText: DatagridColumn[10],
                icon: "warning",
              });
            }
          }
        } else {
          // calculeMethod = this.calculeAtt;
          console.info("normal calculate");
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
                  y = this.calculeAtt(
                    element.state.endDate,
                    element.state.startDate
                  );
                } else {
                  y =
                    this.calculeAtt(
                      element.state.endDate,
                      element.state.startDate
                    ) * 0.5;
                }
                let DateReq = {
                  startDate: dateFormat(element.state.startDate, "yyyy-mm-dd"),
                  endDate: dateFormat(element.state.endDate, "yyyy-mm-dd"),
                  //duration:Math.ceil((element.state.endDate.getTime()-element.state.startDate.getTime())/(1000 * 3600 * 24)+1)
                  //duration: this.calculeAtt(element.state.endDate,element.state.startDate)
                  duration: y,
                };

                if (
                  this.calculeAtt(
                    element.state.endDate,
                    element.state.startDate
                  )
                ) {
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
                  console.info(this.state.list);
                  console.info(this.state.list1);
                }
              } else {
                Swal.fire({
                  title: DatagridColumn[1],
                  confirmButtonText: DatagridColumn[10],
                  icon: "warning",
                });
              }
            } else {
              Swal.fire({
                title: DatagridColumn[2],
                confirmButtonText: DatagridColumn[10],
                icon: "warning",
              });
            }
          }
        }
      },
      this.props.path === "request" ? 1500 : 1000
    ); // Adjust timeout as needed to ensure the state is updated
  }

  isCollaboratorInBPOWeekendsUnit(collaboratorId) {
    collaboratorService
      .isCollaboratorInBPOWeekendsUnit(collaboratorId)
      .then((response) => {
        const isInBPOWeekendsUnit = response.data;
        console.log("Is in BPO Weekends Unit:", isInBPOWeekendsUnit);
        // Update state or perform actions based on the result
        this.setState({ isInBPOWeekendsUnit });
      })
      .catch((error) => {
        console.error("Error checking BPO Weekends Unit status:", error);
      });
  }

  isCollaboratorInBPOUnit(collaboratorId) {
    collaboratorService
      .isCollaboratorInBPO(collaboratorId)
      .then((response) => {
        const isInBPO = response.data;
        console.log("Is in BPO:", isInBPO);
        // Update state or perform actions based on the result
        this.setState({ isInBPO });
      })
      .catch((error) => {
        console.error("Error checking BPO status:", error);
      });
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
    console.info(this.state.list);
    console.info(this.state.list1);
  }
  // function to calcule balance use in vancation

  calculeBalance() {
    let a = 0;
    if (this.state.list != []) {
      // if(this.state.selectedType==="Full Day"){
      this.state.list.map((lists) => (a = a + lists[2]));
      /* }else{
        this.state.list.map(lists=>
          //a=a+lists[2]*0.5
          a=a+lists[2]
          )
      } */
    }
    return a;
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

  //new RETURN STATUT
  checkStatut() {
    var statut = "Pending";
    if (sessionStorage.getItem("role") === "RH" && this.state.users != "") {
      statut = "accepted";
    }
    return statut;
  }

  //traitement balance action
  //code changes in balance action treatment
  calculeCumulaticeBalance(user1) {
    let a = 0;
    if (user1.cumulativeBances != [] && user1.cumulativeBances != null) {
      user1.cumulativeBances.map((solde) => (a = a + solde.balance));
    }
    return a;
  }

  //new traitement solde
  TraitementSolde(col, balanceUsed) {
    if (sessionStorage.getItem("role") === "RH" && this.state.users != "") {
      //treatment of log user connected
      // traitement balance action
      //code changes in balance action treatment
      let BackUpBalanceBefore =
        col.solde.annualBalance + this.calculeCumulaticeBalance(col.solde);

      const userDetaile =
        JSON.parse(sessionStorage.getItem("firstname")) +
        " " +
        JSON.parse(sessionStorage.getItem("lastname")) +
        " - " +
        " Treatment Solde Of Request Added By RH Admin ";
      let b = balanceUsed;
      let a = 0;
      if (col.solde.cumulativeBances != null) {
        col.solde.cumulativeBances.map((solde) => (a = a + solde.balance));
        //console.log(a + "  "+b)
        if (a > b) {
          col.solde.cumulativeBances.map((solde) => {
            if (solde.balance > b) {
              solde.balance = solde.balance - b;
              //console.log(solde.balance)
            } else {
              solde.balance = 0;
              b = b - solde.balance;
            }
          });
        } else {
          col.solde.cumulativeBances.map((solde) => (solde.balance = 0));
          col.solde.annualBalance = col.solde.annualBalance - (b - a);
        }
      } else {
        col.solde.annualBalance = col.solde.annualBalance - b;
      }
      //statut="accepted"
      console.log(col);
      console.log(col.solde);
      //treatment of log user connected
      // traitement balance action
      //code changes in balance action treatment
      let BalanceAction = {
        name: "Adding of Paid Request (Taken in the Past)",
        typeofaction: "System",
        addedBy:
          JSON.parse(sessionStorage.getItem("firstname")) +
          " " +
          JSON.parse(sessionStorage.getItem("lastname")),
        actionDate: dateFormat(new Date(), "yyyy-mm-dd"),
        dateTime: dateFormat(new Date(), "HH:MM:ss"),
        employeeID: this.checkColaborator().id,
        reasonOfChange:
          "Paid Request Vacation (" +
          this.state.selectedType +
          ") from " +
          this.state.list1[0].startDate +
          " to " +
          this.state.list1[0].endDate +
          " has been added and accepted by the admin, the total balance of " +
          BackUpBalanceBefore +
          " day(s) has been decreased automatically by " +
          this.state.list1[0].duration +
          " day(s). ",
        totalBalance:
          col.solde.annualBalance + this.calculeCumulaticeBalance(col.solde),
      };
      BalanceActionService.createBalanceAction(BalanceAction);
      collaboratorService.updateUser(col, col.id, userDetaile);
    }
  }

  saveRequest = (e) => {
    e.preventDefault();
    this.props.activeFetching();
    if (this.state.list1.length != 0) {
      let Request = {
        //collaborator : this.state.user,
        collaborator: this.checkColaborator(),
        description: this.state.description,
        balanceUsed: this.calculeBalance(),
        datesRequest: this.state.list1,
        requestDate: dateFormat(new Date(), "yyyy-mm-dd"),
        //statut: "Pending",
        statut: this.checkStatut(),
        typeOfTime: this.state.selectedType,
      };
      let balance = this.state.annual + this.calculeCumulativeBalance();

      //let differenceBtwnDate = this.state.list[0][0].getMonth()-(new Date()).getMonth()

      /*this.state.paidReqCollab.map(paidreq => {
        paidreq.datesRequest.map(datesReq => {
          this.state.list1.map(datecalendor => {
            var dateReqStart = new Date(datesReq.startDate);
            var dataReqEnd = new Date(datesReq.endDate);
            var datacalendorStart = new Date(datecalendor.startDate);
            var datacalendorEnd = new Date(datecalendor.endDate);
            if(datacalendorStart.getTime() >= dateReqStart.getTime() && datacalendorEnd.getTime() <= dataReqEnd.getTime() 
            || datacalendorStart.getTime() <= dataReqEnd.getTime() || datacalendorEnd.getTime() <= dataReqEnd.getTime()){
              alert('il ya un conge deja dans cette periode impossible de completer la demende de conge')
              this.props.descativeFetching();
            }
            else{
              console.log("................")
              if(balance+differenceBtwnDate>=this.calculeBalance()+this.state.allrequest){
                PaidRequestService.createPaidRequest(Request).then(res=>{
                  //this.props.history.push('/admin/Home');
                  
                 Swal.fire(
                    'Good job!',
                    'Your Request is sent with success',
                    'success'
                  ).then((result) => {
                    if (result.isConfirmed) {
                      location.reload();
                    }
                  })
                  this.props.descativeFetching();
                  this.props.toMyRequest();
                })
        
              }else{
                alert('solde insuffisant')
              }
            }
          })
        })
      })*/

      this.state.list1.map((datecalendor) => {
        var datacalendorStart = new Date(datecalendor.startDate);
        var datacalendorEnd = new Date(datecalendor.endDate);
        const res = this.state.paidReqCollab.reduce(function (
          paidReqres,
          paidreq
        ) {
          paidreq.datesRequest.map((datesReq) => {
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
              paidReqres.push(paidreq);
            }
          });
          return paidReqres;
        },
        []);
        if (res.length != 0) {
          if (
            sessionStorage.getItem("role") === "RH" &&
            this.state.users != ""
          ) {
            Swal.fire({
              title:
                this.checkColaborator().firstname +
                " " +
                this.checkColaborator().lastname +
                " " +
                DatagridColumn[7],
              confirmButtonText: DatagridColumn[10],
              icon: "warning",
            });
          } else {
            Swal.fire({
              title: DatagridColumn[3],
              confirmButtonText: DatagridColumn[10],
              icon: "warning",
            });
          }
          this.props.descativeFetching();
        } else {
          // if(balance+differenceBtwnDate>=this.calculeBalance()+this.state.allrequest){
          if (
            balance >= this.calculeBalance() + this.state.allrequest ||
            balance - (this.calculeBalance() + this.state.allrequest) >= -3
          ) {
            PaidRequestService.createPaidRequest(Request).then((res) => {
              //this.props.history.push('/admin/Home');
              if (
                sessionStorage.getItem("role") === "RH" &&
                this.state.users != ""
              ) {
                this.TraitementSolde(
                  this.checkColaborator(),
                  this.calculeBalance()
                );
              }
              Swal.fire({
                title: DatagridColumn[4],
                html:
                  sessionStorage.getItem("role") === "RH" &&
                  this.state.users != ""
                    ? `${DatagridColumn[5]}`
                    : `${DatagridColumn[5]} <br/> ${DatagridColumn[8]} <br/> <span style="color:red;font-weight:bold"> ${DatagridColumn[9]} </span>`,
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
              if (this.state.users === "") {
                reactLocalStorage.setObject(
                  "PaidRequestOfCollaborateurConnected" +
                    sessionStorage.getItem("user"),
                  []
                );
              }
              this.props.descativeFetching();
              /* code separate traitment passe */ this.props.path === "request"
                ? this.props.updateStateRequest()
                : this.props.updateState();
            });
          } else {
            Swal.fire({
              title: DatagridColumn[6],
              confirmButtonText: DatagridColumn[10],
              icon: "warning",
            });
            this.props.descativeFetching();
          }
        }
      });
    } else {
      Swal.fire({
        title: "-------",
        confirmButtonText: DatagridColumn[10],
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

  //NEW TEST RH POUR AFFICHER LA LISTE DES COLLABORATEURS
  /* code separate traitment passe */
  selectRH() {
    if (sessionStorage.getItem("role") === "RH") {
      if (this.props.path === "request") {
        return (
          <div className="form-group">
            <label
              className="text-danger"
              style={{ fontSize: "12px", fontWeight: "bold" }}
            >
              {" "}
              *{translate("Collaborator")}{" "}
            </label>
            <Select
              onChange={(change) => this.changevalidatorHandler(change)}
              options={this.state.options}
              placeholder={DatagridColumn[11]}
            />
          </div>
        );
      }
    }
  }

  render() {
    var a = JSON.parse(JSON.stringify(this.state.user));

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
                    {/* NEW TEST RH */
                    /* code separate traitment passe */}
                    {this.props.path === "request" ? this.selectRH() : null}
                  </Form.Group>
                  <Button
                    id="addBTN"
                    onClick={this.add.bind(this)}
                    style={{ marginLeft: "10px", float: "right" }}
                    //disabled={this.state.enableAddButton}
                    //disabled={this.props.path === "request" && !this.state.selectCollaborator}
                    disabled={
                      this.state.enableAddButton ||
                      (this.props.path === "request" &&
                        !this.state.selectCollaborator)
                    }
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
                    margin: "0px",
                    width: "62%",
                    background: "rgba(0,0,0,.03)",
                  }}
                >
                  <Card.Header
                    style={{
                      fontWeight: "bold",
                      background: "rgba(0,0,0,.00)",
                      color: "rgb(49, 116, 173)",
                    }}
                  >
                    {translate("Cumulative Balance")}:{" "}
                    {this.calculeCumulativeBalance()}
                  </Card.Header>
                  <Card.Header
                    style={{
                      fontWeight: "bold",
                      background: "rgba(0,0,0,.00)",
                      color: "rgb(49, 116, 173)",
                    }}
                  >
                    {translate("Annual Balance")}: {this.state.annual}
                  </Card.Header>
                  <Card.Header
                    style={{
                      fontWeight: "bold",
                      background: "rgba(0,0,0,.00)",
                      color: "rgb(49, 116, 173)",
                    }}
                  >
                    {translate("Total balance")}:{" "}
                    {this.state.annual + this.calculeCumulativeBalance()}
                  </Card.Header>
                  <Card.Header
                    style={{
                      fontWeight: "bold",
                      background: "rgba(0,0,0,.00)",
                      color: "rgb(49, 116, 173)",
                    }}
                  >
                    {translate("Balance of pending requests")}:{" "}
                    {this.state.allrequest}
                  </Card.Header>
                  <Card.Header
                    style={{
                      fontWeight: "bold",
                      background: "rgba(0,0,0,.00)",
                      color: "rgb(49, 116, 173)",
                    }}
                  >
                    {translate("Balance of request")}: {this.calculeBalance()}
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
                  type="submit"
                  id="saveReqBTN"
                  onClick={this.saveRequest}
                  disabled={
                    /* code separate traitment passe */ this.props.path ===
                    "myrequest"
                      ? this.state.enableSaveButton
                      : sessionStorage.getItem("role") === "RH" &&
                        this.state.users != ""
                      ? this.state.enableSaveButton
                      : true
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

export default injectIntl(PaidVacation);
