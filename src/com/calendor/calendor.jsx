import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { Component } from "react";
import PaidRequestService from "../../servicees/PaidRequestService";
import ExeptionnelRequestService from "../../servicees/ExptionnelService";
import UnPaidRequestService from "../../servicees/UnPaidRequestService";
import RecoveryRequestService from "../../servicees/RecoveryRequestService";
import UnitService from "../../servicees/UnitService";
import collaboratorService from "../../servicees/CollaborateurServices";
import HolidayService from "../../servicees/HolidayService";
import translate from "../../i18nProvider/translate";
import "../css/list.css";
import { Spinner, Button, Modal, CardGroup, Card } from "react-bootstrap";
import { GoInfo } from "react-icons/go";
import VideoPlayerNtt from "../list/VideoPlayerNtt";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import DetailSoldeModal from "com/list/DetailSoldeModal";
import { reactLocalStorage } from "reactjs-localstorage";
import Select from "react-select";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import "moment/locale/fr";
import "moment/locale/es";

// Language-specific messages for react-big-calendar
const messages = {
  en: {
    date: "Date",
    time: "Time",
    event: "Event",
    allDay: "All Day",
    week: "Week",
    work_week: "Work Week",
    day: "Day",
    month: "Month",
    previous: "Back",
    next: "Next",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    today: "Today",
    agenda: "Agenda",
    noEventsInRange: "There are no events in this range.",
    showMore: (total) => `+${total} more`,
  },
  fr: {
    date: "Date",
    time: "Heure",
    event: "Événement",
    allDay: "Toute la journée",
    week: "Semaine",
    work_week: "Semaine de travail",
    day: "Jour",
    month: "Mois",
    previous: "Précédent",
    next: "Suivant",
    yesterday: "Hier",
    tomorrow: "Demain",
    today: "Aujourd'hui",
    agenda: "Agenda",
    noEventsInRange: "Aucun événement dans cette période.",
    showMore: (total) => `+${total} en plus`,
  },
  es: {
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    allDay: "Todo el día",
    week: "Semana",
    work_week: "Semana laboral",
    day: "Día",
    month: "Mes",
    previous: "Anterior",
    next: "Siguiente",
    yesterday: "Ayer",
    tomorrow: "Mañana",
    today: "Hoy",
    agenda: "Agenda",
    noEventsInRange: "No hay eventos en este rango.",
    showMore: (total) => `+${total} más`,
  },
};

const translations = {
  en: {
    placeholder: "Select...",
  },
  fr: {
    placeholder: "Sélectionner...",
  },
  es: {
    placeholder: "Seleccionar...",
  },
};

let locale = "";

switch (sessionStorage.getItem("lang")) {
  case "Fr":
    locale = "fr";
    moment.locale("fr");
    break;

  case "Sp":
    locale = "es";
    moment.locale("es");
    break;

  default:
    locale = "en";
    moment.locale("en");
    break;
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const vertical = "bottom";
const horizontal = "right";

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 15,
  },
}));

class Historic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      trainings: [],
      paidRequest: [],
      unPaidRequest: [],
      exptionnel: [],
      RecoveryRequest: [],
      select: "paidrequest",
      collaborator: [],
      holidays: [],
      totalPendingBalance: 0,
      annualBalance: 0,
      remainingBalance: 0,
      showSpinner: true,
      showVideo: false,
      openVideoBtn: true,
      //ADD MESSAGE OF NOTIFICATION TAKE REQUEST
      openMsgBtn: true,

      RowsPaidReq: [],
      rowReq: {},
      rowcollab: {},
      rowdaterequests: [],
      collab_team: [],
      collabvalidator: {},

      showbalanceModal: false,
      cumulativesbances: [],
      collaboratorConnected: {
        solde: {
          cumulativeBances: [],
        },
      },
      //traitment affichage info of name of unit for collaborator
      units: [],
      unitname: "",
      //traitment of add select unitName filtre
      unitnames: [],
      BackUpPaidRequest: [],
    };
    this.eventStyleGetter = this.eventStyleGetter.bind(this);
  }

  componentDidMount() {
    //if(Object.keys(JSON.parse(sessionStorage.getItem('userConnected'))).length === 0){
    //console.info('user session vide')

    collaboratorService
      .getUserById(sessionStorage.getItem("user"))
      .then((res) => {
        sessionStorage.setItem("userConnected", JSON.stringify(res.data));
        this.setState({
          collaboratorConnected: res.data,
          annualBalance: res.data.solde.annualBalance,
          cumulativesbances: res.data.solde.cumulativeBances,
          showSpinner: false,
        });
      });

    //traitment affichage info of name of unit for collaborator
    UnitService.getunit().then((res) => {
      //traitment of add select unitName filtre
      this.setState({ units: res.data });
      let x = false;
      res.data.map((unit) => {
        unit.collaborators1.map((collab) => {
          if (collab.id === parseInt(sessionStorage.getItem("user"))) {
            this.setState({ unitname: unit.name });
            x = true;
          }
        });
      });
      if (!x) {
        this.setState({ unitname: "Non assigne" });
      }
    });

    /*}
      else{
        console.info('user session full')
        this.setState({
          collaboratorConnected: JSON.parse(sessionStorage.getItem('userConnected')),
          annualBalance: JSON.parse(sessionStorage.getItem('userConnected')).solde.annualBalance,
          cumulativesbances:JSON.parse(sessionStorage.getItem('userConnected')).solde.cumulativeBances, 
          showSpinner:false
        })
      }*/

    PaidRequestService.getPaidRequestOfUser(
      parseInt(sessionStorage.getItem("user"))
    ).then((res) => {
      this.setState({ paidRequest: res.data });
      //traitment of add select unitName filtre
      this.setState({ BackUpPaidRequest: res.data });
      reactLocalStorage.setObject(
        "PaidRequestOfCollaborateurConnected" + sessionStorage.getItem("user"),
        res.data
      );
      res.data.map((request) => {
        if (
          request.collaborator.id ===
            parseInt(sessionStorage.getItem("user")) &&
          request.statut === "Pending"
        ) {
          this.setState({
            totalPendingBalance:
              this.state.totalPendingBalance + request.balanceUsed,
          });
        }
      });
    });

    if (
      sessionStorage.getItem("role") === "validator" ||
      sessionStorage.getItem("role") === "Collaborator"
    ) {
      UnPaidRequestService.getUnPaidRequestOfUser(
        parseInt(sessionStorage.getItem("user"))
      ).then((res) => {
        this.setState({ unPaidRequest: res.data });
      });
      ExeptionnelRequestService.getExeptionnelRequestOfUser(
        parseInt(sessionStorage.getItem("user"))
      ).then((res) => {
        this.setState({ exptionnel: res.data });
      });
      RecoveryRequestService.getRecoveryRequestOfUser(
        parseInt(sessionStorage.getItem("user"))
      ).then((res) => {
        this.setState({ RecoveryRequest: res.data });
      });
    } else {
      UnPaidRequestService.getUnPaidRequest().then((res) => {
        //console.info(res.data)
        this.setState({ unPaidRequest: res.data });
      });
      ExeptionnelRequestService.geExeptionnelRequest().then((res) => {
        this.setState({ exptionnel: res.data });
      });
      RecoveryRequestService.getRecoveryRequest().then((res) => {
        this.setState({ RecoveryRequest: res.data });
      });
    }

    if (sessionStorage.getItem("role") != "Collaborator") {
      UnitService.collaborators(parseInt(sessionStorage.getItem("user"))).then(
        (res) => {
          this.setState({ collab_team: res.data });
        }
      );
    }

    UnitService.team(parseInt(sessionStorage.getItem("user")))
      .then((res) => {
        //console.info(res.data)
        this.setState({ collaborator: res.data });
      })
      .then(() => {
        let uniqueIDOfCollaborators = [
          ...new Set(this.state.collaborator.map((c) => c.id)),
        ];
        //console.info(uniqueIDOfCollaborators)
        uniqueIDOfCollaborators.map((uniqueUserID) => {
          if (uniqueUserID !== parseInt(sessionStorage.getItem("user"))) {
            //console.log(uniqueUserID)
            PaidRequestService.getPaidRequestOfUser(uniqueUserID).then(
              (res) => {
                this.setState({
                  paidRequest: this.state.paidRequest.concat(res.data),
                  //traitment of add select unitName filtre
                  BackUpPaidRequest: this.state.BackUpPaidRequest.concat(
                    res.data
                    //
                  ),
                });
              }
            );
          }
        });
      });
    //traitment of add select unitName filtre
    UnitService.unitNames(parseInt(sessionStorage.getItem("user"))).then(
      (res) => {
        this.setState({ unitnames: res.data });
        // this.setState({ BackUpPaidRequest: this.state.paidRequest });
        console.log(res.data);
        this.setState({
          options: res.data
            .map((valueName) => {
              return {
                value: { unitname: valueName },
                label: valueName,
              };
            })
            .concat([{ value: { unitname: "ALL" }, label: "ALL" }]),
        });
      }
    );

    HolidayService.getHoliday().then((res) => {
      // this.setState({ BackUpPaidRequest: this.state.paidRequest });

      this.setState({ holidays: res.data });
    });
  }
  // BackUpPaidRequest = () => {
  //   this.setState({ BackUpPaidRequest: this.state.paidRequest });
  // };

  eventStyleGetter = (event, start, end, isSelected) => {
    if (event.type == "paid") {
      var backgroundColor = "#3174ad";
    } else if (event.type == "Unpaid") {
      var backgroundColor = "#4aad31";
    } else if (event.type == "exptionnel") {
      var backgroundColor = "#778899";
    } else if (event.type == "recovery") {
      var backgroundColor = "#c526b2";
    } else if (event.type == "holidays") {
      var backgroundColor = "#FF7F50";
    }

    var style = {
      backgroundColor: backgroundColor,
    };
    return {
      style: style,
    };
  };

  addDaysToDate(date, holidayDuration) {
    let startDate = new Date(date);
    startDate.setHours(0);
    let endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + holidayDuration,
      startDate.getHours(),
      startDate.getMinutes(),
      startDate.getSeconds(),
      startDate.getMilliseconds()
    );
    return endDate;
  }

  //Get current date
  getDateToday = () => {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return `${day}/${month}/${year}`;
  };

  calculeCumulativeBalance() {
    let total_cumulative = 0;
    if (
      this.state.cumulativesbances != [] &&
      this.state.cumulativesbances != null
    ) {
      this.state.cumulativesbances.map(
        (solde) => (total_cumulative = total_cumulative + solde.balance)
      );
    }
    return total_cumulative;
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ openVideoBtn: false });
  };

  //ADD MESSAGE OF NOTIFICATION TAKE REQUEST
  handleCloseMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ openMsgBtn: false });
  };

  /* 
     FilterRowspaidReq1 = () => {
      const newpaidReqrows1 = [];
      this.state.collab_team.map(collaborators =>
           this.state.paidRequest.map(
               paidRequests => {
                   if(paidRequests.collaborator.id===collaborators.id && paidRequests.statut==="Pending"){
                       newpaidReqrows1.push(paidRequests)
                   }
                   else if(paidRequests.collaborator.team==="admin RH" && paidRequests.statut==="Pending" && sessionStorage.getItem('role')==="Directeur"){
                       newpaidReqrows1.push(paidRequests)
                   }
               }
           )
       )
       return newpaidReqrows1;
     }

      FilterRowspaidReq2 = () => {
          const newpaidReqrows2 = this.state.paidRequest.filter(paidRequests => paidRequests.collaborator.team==="admin RH" && paidRequests.statut==="Pending" && sessionStorage.getItem('role')==="Directeur")
          return newpaidReqrows2; 
      }*/

  FilterRowsPaidTotal = () => {
    let totalpaid = [];
    if (sessionStorage.getItem("role") !== "Collaborator") {
      const newpaidReqrows1 = [];
      this.state.collab_team.map((collaborators) =>
        this.state.paidRequest.map((paidRequests) => {
          if (
            paidRequests.collaborator.id === collaborators.id &&
            paidRequests.statut === "Pending"
          ) {
            newpaidReqrows1.push(paidRequests);
          } else if (
            paidRequests.collaborator.team === "admin RH" &&
            paidRequests.statut === "Pending" &&
            sessionStorage.getItem("role") === "Directeur"
          ) {
            newpaidReqrows1.push(paidRequests);
          }
        })
      );
      const newpaidReqrows2 = this.state.paidRequest.filter(
        (paidRequests) =>
          paidRequests.collaborator.team === "admin RH" &&
          paidRequests.statut === "Pending" &&
          sessionStorage.getItem("role") === "Directeur"
      );
      totalpaid = [...newpaidReqrows1, ...newpaidReqrows2];
    }
    return totalpaid;
  };

  FilterRowsUnpaidTotal = () => {
    let newunpaidReqrows = [];
    if (sessionStorage.getItem("role") !== "Collaborator") {
      this.state.unPaidRequest
        .filter((val) => {
          if (
            sessionStorage.getItem("role") === "RH" ||
            sessionStorage.getItem("role") === "RH grp"
          ) {
            return val;
          }
        })
        .map((unpaidRequests) => {
          if (
            unpaidRequests.statut === "Pending" &&
            unpaidRequests.collaborator.team != "admin RH"
          ) {
            newunpaidReqrows.push(unpaidRequests);
          }
        });
    }
    return newunpaidReqrows;
  };

  FilterRowsRecoveryTotal = () => {
    let newrecoveryReqrows = [];
    if (sessionStorage.getItem("role") !== "Collaborator") {
      this.state.RecoveryRequest.filter((val) => {
        if (
          sessionStorage.getItem("role") === "RH" ||
          sessionStorage.getItem("role") === "RH grp"
        ) {
          return val;
        }
      }).map((recoveryRequests) => {
        if (
          recoveryRequests.statut === "Pending" &&
          recoveryRequests.collaborator.team != "admin RH"
        ) {
          newrecoveryReqrows.push(recoveryRequests);
        }
      });
    }
    return newrecoveryReqrows;
  };

  FilterRowsExeptionnelTotal = () => {
    let newexeptionnelReqrows = [];
    if (sessionStorage.getItem("role") !== "Collaborator") {
      this.state.exptionnel
        .filter((val) => {
          if (
            sessionStorage.getItem("role") === "RH" ||
            sessionStorage.getItem("role") === "RH grp"
          ) {
            return val;
          }
        })
        .map((exeptionnelRequests) => {
          if (
            exeptionnelRequests.statut === "Pending" &&
            exeptionnelRequests.collaborator.team != "admin RH"
          ) {
            newexeptionnelReqrows.push(exeptionnelRequests);
          }
        });
    }
    return newexeptionnelReqrows;
  };

  calculeTotaleRequest = () => {
    let paidReq = this.FilterRowsPaidTotal();
    let unpaidReq = this.FilterRowsUnpaidTotal();
    let recoveryReq = this.FilterRowsRecoveryTotal();
    let exepReq = this.FilterRowsExeptionnelTotal();
    let allrequest = [...paidReq, ...unpaidReq, ...recoveryReq, ...exepReq];
    return allrequest.length;
  };

  /**--- //traitment of add select unitName filtre------ */
  changeunitnameHandler = (changeUnitName) => {
    //this.setState({ BackUpPaidRequest: this.state.paidRequest });

    console.log(this.state.BackUpPaidRequest);
    console.log(changeUnitName.value.unitname);

    this.setState({ paidRequest: this.state.BackUpPaidRequest });

    // ---------------

    let collaboratorWithAllInfo = [];
    this.state.units.map((unit) => {
      unit.collaborators1.map((collaborator) => {
        let collaboratorWithUnit = Object.assign(collaborator, {
          NameUnit: unit.name,
        });
        collaboratorWithAllInfo.push(collaboratorWithUnit);
      });
    });

    this.state.paidRequest.map((request) => {
      let matchFound = false;
      collaboratorWithAllInfo.map((collab) => {
        if (request.collaborator.id == collab.id) {
          matchFound = true;
          Object.assign(request, { NameUnit: collab.NameUnit });
        }
      });
      if (!matchFound) {
        request.NameUnit = "Non assigne";
      }
    });

    if (changeUnitName.value.unitname === "ALL") {
      this.setState({ paidRequest: this.state.BackUpPaidRequest });
    } else {
      this.setState((prevState) => {
        return {
          paidRequest: prevState.paidRequest.filter((request) => {
            if (request.NameUnit === changeUnitName.value.unitname) {
              return request;
            }
          }),
        };
      });
    }
  };

  /**--- //traitment of add select unitName filtre------ */
  selectunits() {
    if (sessionStorage.getItem("role") != "Collaborator") {
      return (
        <div
          style={{
            marginBottom: "5px",
            paddingRight: "85%",
          }}
        >
          <label style={{ fontWeight: "bold", fontSize: "18px" }}>
            {translate("Organizational Unit")}
          </label>

          <Select
            styles={{
              menu: (provided) => ({ ...provided, zIndex: 9999 }),
            }}
            // isDisabled={sessionStorage.getItem("role") === "Collaborator"}
            onChange={(change) => this.changeunitnameHandler(change)}
            options={this.state.options}
            placeholder={translations[locale].placeholder}
          />
        </div>
      );
    }
  }

  /**--------- */

  render() {
    let total = this.calculeTotaleRequest();
    sessionStorage.setItem("TotalRequest", total);

    const localizer = momentLocalizer(moment);
    const event1 = this.state.paidRequest
      .filter((val) => {
        for (const element of this.state.collaborator) {
          if (
            (val.statut === "accepted" ||
              val.statut === "cancellation refused") &&
            element.id === val.collaborator.id
          ) {
            return val;
          }
        }
      })
      .map((paidRequest) => {
        let newEndDate = new Date(paidRequest.datesRequest[0].endDate);
        newEndDate.setDate(newEndDate.getDate() + 1);
        newEndDate.setHours(0);
        return {
          id: paidRequest.id,
          title:
            paidRequest.collaborator.firstname +
            " " +
            paidRequest.collaborator.lastname,
          start: new Date(paidRequest.datesRequest[0].startDate),
          end: newEndDate,
          allDay: true,
          type: "paid",
        };
      });
    const event2 = this.state.unPaidRequest
      .filter((val) => {
        for (const element of this.state.collaborator) {
          if (
            (val.statut === "accepted" ||
              val.statut === "cancellation refused") &&
            element.id === val.collaborator.id
          ) {
            return val;
          }
        }
      })
      .map((paidRequest) => {
        return {
          id: paidRequest.id,
          title:
            paidRequest.collaborator.firstname +
            " " +
            paidRequest.collaborator.lastname,
          start: new Date(paidRequest.datesRequest[0].startDate),
          end: new Date(paidRequest.datesRequest[0].endDate),
          allDay: true,
          type: "Unpaid",
        };
      });
    const event3 = this.state.exptionnel
      .filter((val) => {
        for (const element of this.state.collaborator) {
          if (val.statut === "accepted" && element.id === val.collaborator.id) {
            return val;
          }
        }
      })
      .map((paidRequest) => {
        return {
          id: paidRequest.id,
          title:
            paidRequest.collaborator.firstname +
            " " +
            paidRequest.collaborator.lastname,
          start: new Date(paidRequest.datesRequest[0].startDate),
          end: new Date(paidRequest.datesRequest[0].endDate),
          allDay: true,
          type: "exptionnel",
        };
      });
    const event4 = this.state.RecoveryRequest.filter((val) => {
      for (const element of this.state.collaborator) {
        if (val.statut === "accepted" && element.id === val.collaborator.id) {
          return val;
        }
      }
    }).map((paidRequest) => {
      return {
        id: paidRequest.id,
        title:
          paidRequest.collaborator.firstname +
          " " +
          paidRequest.collaborator.lastname,
        start: new Date(
          new Date(paidRequest.datesRequest[0].startDate).getTime() +
            (paidRequest.startHour - 1) * 60 * 60 * 1000
        ),
        end: new Date(
          new Date(paidRequest.datesRequest[0].endDate).getTime() +
            (paidRequest.endHour - 1) * 60 * 60 * 1000
        ),
        allDay: false,
        type: "recovery",
      };
    });
    const event5 = this.state.holidays.map((holiday) => {
      let startDate = new Date(holiday.date);
      startDate.setHours(0);
      return {
        id: holiday.id,
        title: translate(holiday.name),
        start: new Date(holiday.date),
        end: this.addDaysToDate(holiday.date, parseInt(holiday.duration)),
        allDay: true,
        type: "holidays",
      };
    });

    const events = event1.concat(event2, event3, event4, event5);
    const formats = {
      eventTimeRangeFormat: (range) =>
        `${format(range.start, "HH:mm")} ${format(range.end, "HH:mm")}`,
    };

    return (
      <React.Fragment>
        <div style={{ marginBottom: "15px", paddingBottom: "5px" }}>
          <div style={{ display: "block", padding: "0 20px" }}>
            <h2
              style={{
                marginTop: "0px",
                marginRight: "5px",
                marginBottom: 0,
                color: "rgb(49, 116, 173)",
                display: "inline-block",
              }}
            >
              {translate("Overview")}
            </h2>
            <p
              style={{
                fontWeight: "bold",
                margin: "8px",
                display: "inline-block",
              }}
            >
              {this.getDateToday()}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flex: "wrap",
              justifyContent: "space-around",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>
                {translate("Total balance")}
              </p>
              {this.state.showSpinner ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <h2 style={{ margin: 0, color: "rgb(49, 116, 173)" }}>
                  {this.state.annualBalance + this.calculeCumulativeBalance()}
                  <LightTooltip
                    title={translate("Show my balance details")}
                    placement="top"
                  >
                    <Button
                      style={{
                        border: "none",
                        margin: "0 0 0 8px",
                        padding: 0,
                      }}
                      onClick={() => this.setState({ showbalanceModal: true })}
                    >
                      <GoInfo
                        style={{ fontSize: "25px", color: "rgb(49, 116, 173)" }}
                      />
                    </Button>
                  </LightTooltip>
                </h2>
              )}
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>
                {translate("Balance of pending requests")}
              </p>
              {this.state.showSpinner ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                <h2 style={{ margin: 0, color: "rgb(49, 116, 173)" }}>
                  {this.state.totalPendingBalance}
                </h2>
              )}
            </div>
          </div>
        </div>
        {/* traitment of add select unitName filtre */}
        {sessionStorage.getItem("role") != "Collaborator" && this.selectunits()}

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month", "day", "week", "agenda", "work_week"]}
          style={{ height: 720, zIndex: "1" }}
          messages={messages[locale]}
          eventPropGetter={this.eventStyleGetter}
          onSelectEvent={(event) => console.info(event)}
        />
        <DetailSoldeModal
          size="md"
          show={this.state.showbalanceModal}
          onHide={() => this.setState({ showbalanceModal: false })}
          collabdata={this.state.collaboratorConnected}
          aria-labelledby="example-modal-sizes-title-sm"
          //traitment affichage info of name of unit for collaborator
          path="home"
          unitname={this.state.unitname}
        />
        <Modal
          show={this.state.showVideo}
          onHide={() => this.setState({ showVideo: false })}
          size="xl"
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton></Modal.Header>

          <Modal.Body>
            <VideoPlayerNtt />
          </Modal.Body>
        </Modal>
        {/* ADD MESSAGE OF NOTIFICATION TAKE REQUEST */}
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={this.state.openMsgBtn}
            anchorOrigin={{ vertical, horizontal }}
            autoHideDuration={20000}
            onClose={this.handleCloseMessage}
          >
            <Alert
              onClose={this.handleCloseMessage}
              severity="info"
              sx={{ width: "100%", marginBottom: "10%" }}
            >
              <Button
                onClick={() => this.setState({ openMsgBtn: false })}
                style={{
                  border: "none",
                  margin: 0,
                  padding: 0,
                  color: "white",
                }}
              >
                {translate(
                  "Please do not forget to consume your vacations during this current year"
                )}
              </Button>
            </Alert>
          </Snackbar>
        </Stack>
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={this.state.openVideoBtn}
            anchorOrigin={{ vertical, horizontal }}
            autoHideDuration={30000}
            onClose={this.handleClose}
          >
            <Alert
              onClose={this.handleClose}
              severity="info"
              sx={{ width: "100%" }}
            >
              <Button
                onClick={() =>
                  this.setState({ openVideoBtn: false, showVideo: true })
                }
                style={{
                  border: "none",
                  margin: 0,
                  padding: 0,
                  color: "white",
                }}
              >
                {translate("How to use Horidē ?")}
              </Button>
            </Alert>
          </Snackbar>
        </Stack>
      </React.Fragment>
    );
  }
}
export default Historic;
