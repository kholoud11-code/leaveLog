import React, { Component } from "react";
import PaidRequestService from "../../servicees/PaidRequestService";
import UnPaidRequestService from "../../servicees/UnPaidRequestService";
import RecoveryRequestService from "../../servicees/RecoveryRequestService";
import UnitService from "../../servicees/UnitService";
import CollaborateurServices from "../../servicees/CollaborateurServices";
import ExeptionnelRequestService from "../../servicees/ExptionnelService";
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import "../css/list.css";
import Fetching from "./Fetching";
import {
  DataGrid,
  GridToolbar,
  enUS,
  frFR,
  esES,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  GridColumnMenu,
} from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import { Button, Spinner } from "react-bootstrap";
import { TiDeleteOutline } from "react-icons/ti";
import { VscVerified } from "react-icons/vsc";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ValidRequestModel from "./ValidRequestModel";
import DeleteRequestModel from "./DeleteRequestModel";
import DetailsRequestModel from "./DetailsRequestModel";
import {
  IoCheckmarkCircleSharp,
  IoCloseCircle,
  IoPaperPlaneSharp,
  IoEye,
} from "react-icons/io5";
import { FiAlertOctagon } from "react-icons/fi";
import ConfirmCancelRequestModel from "./ConfirmCancelRequestModel";
import Cron from "../../servicees/Cron";
import ExcelExport from "./ExcelExport";
import Swal from "sweetalert2";
//traitement balance action
//code changes in balance action treatment
import BalanceActionService from "../../servicees/BalanceActionService";
import dateFormat from "dateformat";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const englishColumn = [
  "Collaborator",
  "Type",
  "Statut",
  "Type of time",
  "Start Date",
  "End Date",
  "Duration",
  "Action",
  "Confirmation of validation",
  "The processing of the paid request is in progress, please wait until it is completed...",
  "Unit",
  "Employee Id",
  "Validator",
  "Request is deleted by the owner",
  "Ok",
  "This organizational unit contains incomplete data that must be filled in by the validator.",
  "Please review and complete the required fields before proceeding.",
  "Attention",
  "Fridays Count (d)",
  "Current Month (h)",
  "Next Month (h)",
  "Summer Time",
];
const frenchColumn = [
  "Collaborateur",
  "Type",
  "Statut",
  "Type de temps",
  "Date de début",
  "Date de fin",
  "Durée",
  "Action",
  "Confirmation de validation",
  "Le traitement de la demande payante est en cours, merci de patienter jusqu'à ce qu'il soit terminé...",
  "Unité",
  "Id d'Employé",
  "Validateur",
  "La demande a été supprimée par le propriétaire",
  "D'accord",
  "Cette unité organisationnelle contient des données incomplètes qui doivent être remplies par le validateur.",
  "Veuillez vérifier et compléter les champs obligatoires avant de continuer.",
  "Attention",
  "Vendredis comptent (j)",
  "Mois actuel (h)",
  "Le mois prochain (h)",
  "Heure d'été",
];
const spanishColumn = [
  "Colaborador",
  "Tipo",
  "Estado",
  "Tipo de tiempo",
  "Fecha de inicio",
  "Fecha de finalización",
  "Duración",
  "Acción",
  "Confirmación de validación",
  "El procesamiento de la solicitud pagada está en progreso, espere hasta que se complete...",
  "Unidad",
  "Id Empleado",
  "Validador",
  "La solicitud ha sido eliminada por el propietario",
  "bueno",
  "Esta unidad organizativa contiene datos incompletos que debe completar el validador.",
  "Revise y complete los campos obligatorios antes de continuar.",
  "Atención",
  "Viernes cuentan (d)",
  "Mes actual (h)",
  "El próximo mes (h)",
  "Hora de verano",
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

const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  "& .ant-empty-img-1": {
    fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
  },
  "& .ant-empty-img-2": {
    fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
  },
  "& .ant-empty-img-3": {
    fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
  },
  "& .ant-empty-img-4": {
    fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
  },
  "& .ant-empty-img-5": {
    fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
    fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
  },
}));

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

// request list with option give to RH option to valiate recovery-exeptionnel-recuperation vacation
class RequestOfTeam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paidRequest: [],
      collaborator: [],
      request: "",
      unPaidRequest: [],
      exeptionnel: [],
      RecoveryRequest: [],
      justis: [],
      col: "",
      select: "allRequest",
      fetching: true,
      loading: true,
      RowsPaidReq: [],
      showDetailsModel: false,
      showValideModel: false,
      showDeleteModel: false,
      showConfirmCancelRequestModel: false,
      refusecancellationjustis: [],
      rowReq: {},
      rowcollab: {},
      rowcollabsolde: {},
      rowdaterequests: [],
      teamcollab: [],
      collabvalidator: {},
      unpaidvalidator: {},
      //traitment affichage info of name of unit for details request of the collaborator
      units: [],
      unitname: "",
    };
    this.checkStatut = this.checkStatut.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.RequestRejecte = this.RequestRejecte.bind(this);
    this.RequestSuccess = this.RequestSuccess.bind(this);
    this.getrequestById = this.getrequestById.bind(this);
    this.changeJusti = this.changeJusti.bind(this);
    this.RejecteCancellationRequestMethod =
      this.RejecteCancellationRequestMethod.bind(this);
    this.ValidCancellationRequestMethod =
      this.ValidCancellationRequestMethod.bind(this);
    this.changeRefuseCancellationJustis =
      this.changeRefuseCancellationJustis.bind(this);
    /***** */
    this.UnRequestRejecte = this.UnRequestRejecte.bind(this);
    this.UnRequestSuccess = this.UnRequestSuccess.bind(this);
    this.RejecteCancellationUnpaidRequestMethod =
      this.RejecteCancellationUnpaidRequestMethod.bind(this);
    this.ValidCancellationUnpaidRequestMethod =
      this.ValidCancellationUnpaidRequestMethod.bind(this);
    /***** */
  }

  componentDidMount() {
    if (
      sessionStorage.getItem("role") === "RH" ||
      sessionStorage.getItem("role") === "RH grp"
    ) {
      PaidRequestService.getAllPaidRequestOfTheTeamOfValidator(
        sessionStorage.getItem("user")
      ).then((res) => {
        this.setState({ paidRequest: res.data, fetching: false });
      });

      UnPaidRequestService.getAllUnpaidRequestOfTheTeamOfValidator(
        sessionStorage.getItem("user")
      ).then((res) => {
        //console.info(res.data)
        this.setState({ unPaidRequest: res.data });
      });

      //traitment affichage info of name of unit for details request of the collaborator
      /****** */
      UnitService.getUnitByValidator(
        parseInt(sessionStorage.getItem("user"))
      ).then((res) => {
        this.setState({ units: res.data });
      });
      /****** */

      /*UnitService.collaborators(parseInt(sessionStorage.getItem('user'))).then((res) => {
                this.setState({ collaborator: res.data });
                  
               }).then(()=>{
                    this.state.collaborator.map(user => {
                        PaidRequestService.getPaidRequestOfUser(user.id).then((res) => {
                            this.setState({ paidRequest: this.state.paidRequest.concat(res.data) })
                        }).then(()=>{
                            this.setState({ fetching: false })
                        })

                        UnPaidRequestService.getUnPaidRequestOfUser(user.id).then(res=>{
                            this.setState({unPaidRequest:this.state.unPaidRequest.concat(res.data)});
                        })

                        ExeptionnelRequestService.getExeptionnelRequestOfUser(user.id).then(res=>{
                            this.setState({exeptionnel:this.state.exeptionnel.concat(res.data)});
                        })

                        RecoveryRequestService.getRecoveryRequestOfUser(user.id).then(res=>{
                            this.setState({RecoveryRequest:this.state.RecoveryRequest.concat(res.data),fetching: false});
                        })
                    })
                    this.setState({ fetching: false })
                })*/
    }
    //else if (sessionStorage.getItem('role') != 'validator' && sessionStorage.getItem('role') != 'Collaborator') {

    //     PaidRequestService.getPaidRequest().then((res) => {
    //         this.setState({ paidRequest: res.data, fetching: false});
    //     });

    //     UnPaidRequestService.getUnPaidRequest().then((res) => {
    //         this.setState({ unPaidRequest: res.data });
    //     });

    //     RecoveryRequestService.getRecoveryRequest().then((res) => {
    //         this.setState({ RecoveryRequest: res.data });
    //     });

    //     ExeptionnelRequestService.geExeptionnelRequest().then((res) => {
    //         this.setState({ exeptionnel: res.data});
    //     });

    // }

    this.getcollabvalidatorById(parseInt(sessionStorage.getItem("user")));

    /****** */
    UnitService.findvalidatorofunpaidvacation().then((res) => {
      this.setState({ unpaidvalidator: res.data });
    });
    /****** */

    UnitService.team(parseInt(sessionStorage.getItem("user"))).then((res) => {
      this.setState({ teamcollab: res.data });
    });

    setTimeout(() => {
      this.setState({ loading: false });
    }, 5000);

    this.interval = setInterval(() => {
      Cron.getCron().then((res) => {
        if (res.data === true) {
          this.setState({ loading: true });
          if (
            sessionStorage.getItem("role") === "RH" ||
            sessionStorage.getItem("role") === "RH grp"
          ) {
            /*let arrayOfPaidReq = []
                            this.state.collaborator.map(user => {
                            PaidRequestService.getPaidRequestOfUser(user.id).then((res) => {
                                arrayOfPaidReq.push(res.data)
                            }).then(()=>{
                                this.setState({paidRequest: arrayOfPaidReq})*/
            PaidRequestService.getAllPaidRequestOfTheTeamOfValidator(
              sessionStorage.getItem("user")
            )
              .then((res) => {
                this.setState({ paidRequest: res.data });
              })
              .catch((ex) => {
                console.info("problem de récuperation pour user : " + user.id);
              });
            UnPaidRequestService.getAllUnpaidRequestOfTheTeamOfValidator(
              sessionStorage.getItem("user")
            )
              .then((res) => {
                this.setState({ unPaidRequest: res.data });
              })
              .catch((ex) => {
                console.info("problem de récuperation pour user : " + user.id);
              });
          }
          // else {
          //     PaidRequestService.getPaidRequest().then((res) => {
          //         this.setState({ paidRequest: res.data });
          //     }).catch((ex) => {
          //         console.info("problem de récuperation")
          //     })
          //     /**** */
          //     UnPaidRequestService.getUnPaidRequest().then((res) => {
          //         this.setState({ unPaidRequest: res.data });
          //     }).catch((ex) => {
          //         console.info("problem de récuperation")
          //     })
          //     /**** */
          // }
        } else {
          this.setState({ loading: false });
        }
      });
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  /*shouldComponentUpdate = (nextProps, nextState) => {
        PaidRequestService.getPaidRequest().then((res) => {
            this.setState({ paidRequest: res.data});
        }).catch((ex) => {
            console.info("problem de récuperation")
        })
        if(nextState.paidRequest !== this.state.paidRequest){
            return true
        }else{
            return true
        }
    }*/
  /*componentDidUpdate = (prevProps, prevState) => { 
        setInterval(()=>{
            try{
                PaidRequestService.getPaidRequest().then((res) => {
                    console.info(prevState.paidRequest)
                    console.info(res.data)
                    console.info(prevState.paidRequest.length !== res.data.length)
    
                        if(prevState.paidRequest.length !== res.data.length){
                            this.setState({ paidRequest: res.data});
                            console.info("we have a change in paid request")
                        }else{
                            console.info("pas de changement")
                        }
                }).catch((ex) => {
                    console.info("problem de récuperation")
                }) 
            }
            catch(err){
                console.info("problem de récuperation")
                //this.setState(prevState => ({paidRequest: prevState.paidRequest }))     
            }
        },60000);
    }*/

  getrequestById(id) {
    PaidRequestService.getPaidRequestById(id).then((res) => {
      this.setState({ request: res.data });
    });
  }

  getcoltById(id) {
    CollaborateurServices.getUserById(id).then((res) => {
      this.setState({ col: res.data });
    });
  }

  getcollabvalidatorById(id) {
    CollaborateurServices.getUserById(id).then((res) => {
      this.setState({ collabvalidator: res.data });
    });
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

  /******* Functions for accepeting Request **********/

  RequestSuccess(id, col1) {
    Swal.fire({
      title: DatagridColumn[8],
      text: DatagridColumn[9],
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      footer: '<div class="spinner-border text-primary"></div>',
      //timer: 30000,
    });

    let Request = { statut: "accepted" };
    this.getcoltById(col1);
    //this.getrequestById(id)
    PaidRequestService.getPaidRequestById(id)
      .then((res) => {
        this.setState({ request: res.data, checkPaidReq: true });

        setTimeout(() => {
          //treatment of log user connected
          let idrequeststring = id.toString();
          const userDetaile =
            JSON.parse(sessionStorage.getItem("firstname")) +
            " " +
            JSON.parse(sessionStorage.getItem("lastname")) +
            " - " +
            " Validation Request By RH Admin for the collaborator " +
            this.state.col.firstname +
            " " +
            this.state.col.lastname +
            " - " +
            "Request ID : " +
            idrequeststring;
          let user1 = JSON.parse(JSON.stringify(this.state.col.solde));

          // traitement balance action
          //code changes in balance action treatment
          let BackUpBalanceBefore =
            user1.annualBalance + this.calculeCumulaticeBalance(user1);

          PaidRequestService.statut(Request, id).then((res) => {
            if (
              sessionStorage.getItem("role") === "RH" ||
              sessionStorage.getItem("role") === "RH grp"
            ) {
              PaidRequestService.getAllPaidRequestOfTheTeamOfValidator(
                sessionStorage.getItem("user")
              ).then((res) => {
                if (this.state.request != "") {
                  /*Swal.fire({
                            title:DatagridColumn[8],
                            text:DatagridColumn[9],
                            icon:'info',
                            showConfirmButton: false,
                            timer: 30000,
                        })*/

                  let b = this.state.request.balanceUsed;
                  let a = 0;
                  if (user1.cumulativeBances != null) {
                    user1.cumulativeBances.map(
                      (solde) => (a = a + solde.balance)
                    );
                    if (a > b) {
                      user1.cumulativeBances.map((solde) => {
                        if (solde.balance > b) {
                          solde.balance = solde.balance - b;
                        } else {
                          solde.balance = 0;
                          b = b - solde.balance;
                        }
                      });
                    } else {
                      user1.cumulativeBances.map(
                        (solde) => (solde.balance = 0)
                      );
                      user1.annualBalance = user1.annualBalance - (b - a);
                    }
                  } else {
                    user1.annualBalance = user1.annualBalance - b;
                  }
                  this.state.col.solde = user1;

                  // traitement balance action
                  //code changes in balance action treatment
                  let BalanceAction = {
                    name: "Validation Of Paid Request",
                    typeofaction: "System",
                    addedBy:
                      JSON.parse(sessionStorage.getItem("firstname")) +
                      " " +
                      JSON.parse(sessionStorage.getItem("lastname")),
                    actionDate: dateFormat(new Date(), "yyyy-mm-dd"),
                    dateTime: dateFormat(new Date(), "HH:MM:ss"),
                    employeeID: this.state.col.id,
                    reasonOfChange:
                      "Paid Request Vacation (" +
                      this.state.request.typeOfTime +
                      ") from " +
                      this.state.request.datesRequest[0].startDate +
                      " to " +
                      this.state.request.datesRequest[0].endDate +
                      " has been accepted, the total balance of " +
                      BackUpBalanceBefore +
                      " day(s) has been decreased automatically by " +
                      this.state.request.datesRequest[0].duration +
                      " day(s). ",
                    totalBalance:
                      user1.annualBalance +
                      this.calculeCumulaticeBalance(user1),
                  };
                  BalanceActionService.createBalanceAction(BalanceAction);

                  //treatment of log user connected
                  CollaborateurServices.updateUser(
                    this.state.col,
                    this.state.col.id,
                    userDetaile
                  );
                  /*Swal.fire({
                            title:DatagridColumn[8],
                            text:DatagridColumn[9],
                            icon:'info',
                            showConfirmButton: false,
                            timer: 30000,
                        })*/
                }

                this.setState({ paidRequest: res.data });
                setTimeout(() => {
                  Swal.close();
                }, 1000);
              });
            }
            // else
            // {
            //     PaidRequestService.getPaidRequest().then(res=>{
            //           if(this.state.request!=""){

            //             /*Swal.fire({
            //                 title:DatagridColumn[8],
            //                 text:DatagridColumn[9],
            //                 icon:'info',
            //                 showConfirmButton: false,
            //                 //timer: 30000,
            //             })*/

            //               let b = this.state.request.balanceUsed
            //               let a = 0
            //             if(user1.cumulativeBances!=null){
            //               user1.cumulativeBances.map(solde=> a=a+solde.balance)
            //               if(a>b){
            //                  user1.cumulativeBances.map(solde=>
            //                       {
            //                      if(solde.balance>b){
            //                        solde.balance=solde.balance-b;
            //                      }
            //                      else{solde.balance=0; b=b-solde.balance;}

            //                    })
            //                  }
            //                  else{
            //                    user1.cumulativeBances.map(solde=>solde.balance=0)
            //                    user1.annualBalance=user1.annualBalance-(b-a)
            //                  }
            //               } else{
            //                   user1.annualBalance=user1.annualBalance-(b)
            //               }
            //               this.state.col.solde=user1
            //               CollaborateurServices.updateUser(this.state.col,this.state.col.id);
            //               /*Swal.fire({
            //                 title:DatagridColumn[8],
            //                 text:DatagridColumn[9],
            //                 icon:'info',
            //                 showConfirmButton: false,
            //                 timer: 30000,
            //               })*/

            //               }

            //       this.setState({ paidRequest: res.data});
            //       setTimeout(() => {
            //         Swal.close()
            //       }, 1000);
            //   })
            // }
          });
        }, 1000);
        //this.componentDidMount();
        /*let arrayOfPaidReq = []
  this.state.collaborator.map(user => {
    PaidRequestService.getPaidRequestOfUser(user.id).then((res) => {
        arrayOfPaidReq.push(res.data)
    }).then(()=>{this.setState({ paidRequest: arrayOfPaidReq })})*/
        PaidRequestService.getAllPaidRequestOfTheTeamOfValidator(
          sessionStorage.getItem("user")
        ).then((res) => {
          this.setState({ paidRequest: res.data });
        });
      })
      .catch((ex) => {
        Swal.fire({
          title: DatagridColumn[13],
          confirmButtonText: DatagridColumn[14],
          icon: "warning",
        });
        this.componentDidMount();
      });
  }

  UnRequestSuccess(id) {
    let Request = { statut: "accepted" };
    UnPaidRequestService.statut(Request, id).then((res) => {
      if (
        sessionStorage.getItem("role") === "RH" ||
        sessionStorage.getItem("role") === "RH grp"
      ) {
        UnPaidRequestService.getAllUnpaidRequestOfTheTeamOfValidator(
          sessionStorage.getItem("user")
        ).then((res) => {
          this.setState({ unPaidRequest: res.data });
        });
      }
      /*UnPaidRequestService.getUnPaidRequest().then(res => {
                this.setState({ unPaidRequest: res.data });
            })*/
    });
  }
  RecoveryRequestSuccess(id) {
    let Request = { statut: "accepted" };
    RecoveryRequestService.statut(Request, id).then((res) => {
      RecoveryRequestService.getRecoveryRequest().then((res) => {
        this.setState({ RecoveryRequest: res.data });
      });
    });
  }

  exeptionnelSuccess(id) {
    let Request = { statut: "accepted" };
    ExeptionnelRequestService.statut(Request, id).then((res) => {
      ExeptionnelRequestService.geExeptionnelRequest().then((res) => {
        this.setState({ paidRequest: res.data });
      });
    });
  }

  /****** Functions for refusing Request **********/
  RequestRejecte(id) {
    let Request = { statut: "refused", justification: this.state.justis[id] };
    PaidRequestService.statut(Request, id).then((res) => {
      if (
        sessionStorage.getItem("role") === "RH" ||
        sessionStorage.getItem("role") === "RH grp"
      ) {
        /*let arrayOfPaidReq = []
               this.state.collaborator.map(user => {
                    PaidRequestService.getPaidRequestOfUser(user.id).then((res) => {
                        arrayOfPaidReq.push(res.data)
                    }).then(() => {
                        this.setState({paidRequest: arrayOfPaidReq})
                    })
                })*/
        PaidRequestService.getAllPaidRequestOfTheTeamOfValidator(
          sessionStorage.getItem("user")
        ).then((res) => {
          this.setState({ paidRequest: res.data });
        });
      }
      // else{
      //     PaidRequestService.getPaidRequest().then(res => {
      //         this.setState({ paidRequest: res.data });
      //     })
      // }
    });
  }

  UnRequestRejecte(id) {
    let Request = { statut: "refused" };
    UnPaidRequestService.statut(Request, id).then((res) => {
      if (
        sessionStorage.getItem("role") === "RH" ||
        sessionStorage.getItem("role") === "RH grp"
      ) {
        UnPaidRequestService.getAllUnpaidRequestOfTheTeamOfValidator(
          sessionStorage.getItem("user")
        ).then((res) => {
          this.setState({ unPaidRequest: res.data });
        });
      }
      /*UnPaidRequestService.getUnPaidRequest().then(res => {
                this.setState({ unPaidRequest: res.data });
            })*/
    });
  }
  RecoveryRequestRejecte(id) {
    let Request = { statut: "refused" };
    RecoveryRequestService.statut(Request, id).then((res) => {
      RecoveryRequestService.getRecoveryRequest().then((res) => {
        this.setState({ RecoveryRequest: res.data });
      });
    });
  }

  exeptionnelRejecte(id) {
    let Request = { statut: "refused" };
    ExeptionnelRequestService.statut(Request, id).then((res) => {
      ExeptionnelRequestService.geExeptionnelRequest().then((res) => {
        this.setState({ paidRequest: res.data });
      });
    });
  }

  deleteUser(id) {
    PaidRequestService.deletPaidRequest(id).then((res) => {
      this.setState({
        paidRequest: this.state.paidRequest.filter((user) => user.id !== id),
      });
    });
  }

  /*FilterRowsPaidTotal() {
        const newpaidReqrows1 = [];
        if (sessionStorage.getItem('role') === "RH") {
            this.state.paidRequest.map(paidRequests => {
                newpaidReqrows1.push(paidRequests)
            })
        }
        else {
            this.state.collaborator.map(collaborators =>
                this.state.paidRequest.map(
                    paidRequests => {
                        if (paidRequests.collaborator.id === collaborators.id) {
                            newpaidReqrows1.push(paidRequests)
                        }
                        else if (paidRequests.collaborator.team === "admin RH" && sessionStorage.getItem('role') === "Directeur") {
                            newpaidReqrows1.push(paidRequests)
                        }
                    }
                )
            )
        }
        const newpaidReqrows2 = this.state.paidRequest.filter(paidRequests => paidRequests.collaborator.team === "admin RH" && sessionStorage.getItem('role') === "Directeur")
        const totalpaid = [...newpaidReqrows1, ...newpaidReqrows2];
        return totalpaid
    }*/
  FilterRowsPaidTotal = () => {
    let uniqueIds = [];

    let unique = this.state.paidRequest.filter((element) => {
      let isDuplicate = uniqueIds.includes(element.id);

      if (!isDuplicate) {
        uniqueIds.push(element.id);

        return true;
      }

      return false;
    });
    return unique;
  };

  FilterRowsUnpaidTotal() {
    const newunpaidReqrows = [];
    this.state.unPaidRequest
      .filter((val) => {
        if (
          sessionStorage.getItem("role") === "RH" ||
          sessionStorage.getItem("role") === "RH grp" ||
          sessionStorage.getItem("role") === "validator"
        ) {
          return val;
        }
      })
      .map((unpaidRequests) => {
        if (
          /*unpaidRequests.statut === "Pending" &&*/ unpaidRequests.collaborator
            .team != "admin RH" ||
          unpaidRequests.collaborator.team === "admin RH"
        ) {
          newunpaidReqrows.push(unpaidRequests);
        }
      });
    return newunpaidReqrows;
  }

  FilterRowsRecoveryTotal() {
    const newrecoveryReqrows = [];
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

    return newrecoveryReqrows;
  }

  FilterRowsExeptionnelTotal() {
    const newexeptionnelReqrows = [];
    this.state.exeptionnel
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

    return newexeptionnelReqrows;
  }

  checkStatut(value) {
    if (value === "processed") {
      return (
        <td className="text-secondary" style={{ fontWeight: "bold" }}>
          <IoPaperPlaneSharp style={{ marginRight: "10px" }} />
          {translate(value)}
        </td>
      );
    } else if (value === "accepted" || value === "accepted by validator") {
      return (
        <td className="text-success" style={{ fontWeight: "bold" }}>
          <IoCheckmarkCircleSharp style={{ marginRight: "10px" }} />
          {translate(value)}
        </td>
      );
    } else if (value === "refused" || value === "refused by validator") {
      return (
        <td className="text-danger" style={{ fontWeight: "bold" }}>
          <IoCloseCircle style={{ marginRight: "10px" }} />
          {translate(value)}
        </td>
      );
    } else if (value === "cancellation refused") {
      //return (<td className="text-danger" style={{ fontWeight: 'bold' }}><IoCloseCircle style={{ marginRight: "10px" }} />{translate(value)} </td>);
      return (
        <td className="text-success" style={{ fontWeight: "bold" }}>
          <IoCheckmarkCircleSharp style={{ marginRight: "10px" }} />
          {translate("accepted")}
        </td>
      );
    } else if (value === "cancellation accepted") {
      //return (<td className="text-success" style={{ fontWeight: 'bold' }}><IoCheckmarkCircleSharp style={{ marginRight: "10px" }} />{translate(value)} </td>);
      return (
        <td className="text-danger" style={{ fontWeight: "bold" }}>
          <IoCloseCircle style={{ marginRight: "10px" }} />
          {translate("canceled")}
        </td>
      );
    } else {
      return (
        <td className="text-muted" style={{ fontWeight: "bold" }}>
          <IoPaperPlaneSharp style={{ marginRight: "10px" }} />
          {translate(value)}
          {"..."}
        </td>
      );
    }
  }

  checkStatutModal(value) {
    if (value === "processed") {
      return (
        <span
          className="text-secondary"
          style={{ fontSize: "18px", fontWeight: "bold" }}
        >
          <IoPaperPlaneSharp style={{ marginRight: "5px" }} />
          {translate(value)}
        </span>
      );
    } else if (value === "accepted" || value === "accepted by validator") {
      return (
        <span
          className="text-success"
          style={{ fontSize: "18px", fontWeight: "bold" }}
        >
          <IoCheckmarkCircleSharp style={{ marginRight: "5px" }} />
          {translate(value)}
        </span>
      );
    } else if (value === "refused" || value === "refused by validator") {
      return (
        <span
          className="text-danger"
          style={{ fontSize: "18px", fontWeight: "bold" }}
        >
          <IoCloseCircle style={{ marginRight: "5px" }} />
          {translate(value)}
        </span>
      );
    } else if (value === "cancellation refused") {
      //return (<span className="text-danger" style={{ fontSize: "18px", fontWeight: 'bold' }}><IoCloseCircle style={{ marginRight: "5px" }} />{translate(value)} </span>);
      return (
        <span
          className="text-success"
          style={{ fontSize: "18px", fontWeight: "bold" }}
        >
          <IoCheckmarkCircleSharp style={{ marginRight: "5px" }} />
          {translate("accepted")}
        </span>
      );
    } else if (value === "cancellation accepted") {
      //return (<span className="text-success" style={{ fontSize: "18px", fontWeight: 'bold' }}><IoCheckmarkCircleSharp style={{ marginRight: "5px" }} />{translate(value)} </span>);
      return (
        <span
          className="text-danger"
          style={{ fontSize: "18px", fontWeight: "bold" }}
        >
          <IoCloseCircle style={{ marginRight: "5px" }} />
          {translate("canceled")}
        </span>
      );
    } else {
      return (
        <span
          className="text-muted"
          style={{ fontSize: "18px", fontWeight: "bold" }}
        >
          <IoPaperPlaneSharp style={{ marginRight: "5px" }} />
          {translate(value)}
          {"..."}
        </span>
      );
    }
  }

  changeJusti = (index, event) => {
    var justi = this.state.justis.slice(); // Make a copy of the emails first.
    justi[index] = event.target.value; // Update it with the modified email.
    this.setState({ justis: justi });
  };

  //Last modification : filtred Table

  openDetailsModel(row) {
    if (
      row.nameReq === "Paid Request" &&
      sessionStorage.getItem("role") === "validator"
    ) {
      this.setState({ collabvalidator: {} });
      this.getcollabvalidatorById(parseInt(sessionStorage.getItem("user")));
    } else if (
      row.nameReq === "Paid Request" &&
      (sessionStorage.getItem("role") === "RH" ||
        sessionStorage.getItem("role") === "RH grp")
    ) {
      this.setState({ collabvalidator: {} });
      UnitService.findvalidator(row.collaborator).then((res) => {
        this.setState({ collabvalidator: res.data });
      });
    } else if (row.nameReq === "Unpaid Request") {
      if (row.statut === "Pending" || row.statut === "refused by validator") {
        this.setState({ collabvalidator: {} });
        UnitService.findvalidator(row.collaborator).then((res) => {
          this.setState({ collabvalidator: res.data });
        });
      } else {
        this.setState({ collabvalidator: {} });
        UnitService.findvalidatorofunpaidvacation().then((res) => {
          this.setState({ collabvalidator: res.data });
        });
        //this.setState({ collabvalidator: {}});
      }
    } else {
      this.setState({ collabvalidator: {} });
    }
    this.setState({
      showDetailsModel: true,
      rowReq: row,
      rowcollab: row.collaborator,
      rowcollabsolde: row.collaborator.solde,
      rowdaterequests: row.datesRequest,
    });
    //traitment affichage info of name of unit for details request of the collaborator
    let x = false;
    if (this.state.units.length != 0) {
      this.state.units.map((unit) => {
        unit.collaborators1.map((collab) => {
          if (collab.id === row.collaborator.id) {
            this.setState({ unitname: unit.name });
            x = true;
          }
        });
      });
      if (!x) {
        this.setState({ unitname: "Non assigne" });
      }
    }
  }

  openDeleteModel(row) {
    this.setState({
      showDeleteModel: true,
      rowReq: row,
      rowcollab: row.collaborator,
      rowdaterequests: row.datesRequest,
    });
  }

  openValidModel(row) {
    this.setState({
      showValideModel: true,
      rowReq: row,
      rowcollab: row.collaborator,
      rowdaterequests: row.datesRequest,
    });
  }
  openConfirmCancelRequestModel(row) {
    this.setState({
      showConfirmCancelRequestModel: true,
      rowReq: row,
      rowcollab: row.collaborator,
      rowdaterequests: row.datesRequest,
    });
  }

  RejecteCancellationRequestMethod(id) {
    let Request = {
      cancellationJustification: this.state.refusecancellationjustis[id],
    };
    PaidRequestService.sendcancellationrequest("OFF", id, Request).then(
      (res) => {
        PaidRequestService.statutrequestaftervalidatecancellation(
          "cancellation refused",
          id
        ).then((res) => {
          if (
            sessionStorage.getItem("role") === "RH" ||
            sessionStorage.getItem("role") === "RH grp"
          ) {
            /*let arrayOfPaidReq =[]
                    this.state.collaborator.map(user => {
                        PaidRequestService.getPaidRequestOfUser(user.id).then((res) => {
                            arrayOfPaidReq.push(res.data)
                        }).then(()=>{
                            this.setState({paidRequest:arrayOfPaidReq})
                        })
                    })*/
            PaidRequestService.getAllPaidRequestOfTheTeamOfValidator(
              sessionStorage.getItem("user")
            ).then((res) => {
              this.setState({ paidRequest: res.data });
            });
          }
          // else{
          //     PaidRequestService.getPaidRequest().then(res => {
          //         this.setState({ paidRequest: res.data });
          //     })
          // }
        });
      }
    );
  }

  RejecteCancellationUnpaidRequestMethod(id) {
    let Request = {
      cancellationJustification: this.state.refusecancellationjustis[id],
    };
    UnPaidRequestService.sendcancellationrequest("OFF", id, Request).then(
      (res) => {
        UnPaidRequestService.statutrequestaftervalidatecancellation(
          "cancellation refused",
          id
        ).then((res) => {
          if (
            sessionStorage.getItem("role") === "RH" ||
            sessionStorage.getItem("role") === "RH grp"
          ) {
            UnPaidRequestService.getAllUnpaidRequestOfTheTeamOfValidator(
              sessionStorage.getItem("user")
            ).then((res) => {
              this.setState({ unPaidRequest: res.data });
            });
          }
        });
      }
    );
  }

  ValidCancellationRequestMethod(collabid, paidreqid, balanceused) {
    Swal.fire({
      title: DatagridColumn[8],
      text: DatagridColumn[9],
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      footer: '<div class="spinner-border text-primary"></div>',
      //timer: 30000,
    });

    this.getcoltById(collabid);
    // traitement balance action
    //code changes in balance action treatment
    this.getrequestById(paidreqid);
    let Request = { cancellationJustification: "" };
    setTimeout(() => {
      //treatment of log user connected
      let idpaidrequeststring = paidreqid.toString();
      const userDetaile =
        JSON.parse(sessionStorage.getItem("firstname")) +
        " " +
        JSON.parse(sessionStorage.getItem("lastname")) +
        " - " +
        " Validation Cancellation Request By RH Admin " +
        "for the collaborator " +
        this.state.col.firstname +
        " " +
        this.state.col.lastname +
        " - " +
        "Request ID : " +
        idpaidrequeststring;
      let user1 = JSON.parse(JSON.stringify(this.state.col.solde));

      // traitement balance action
      //code changes in balance action treatment
      let BackUpBalanceBefore =
        user1.annualBalance + this.calculeCumulaticeBalance(user1);

      //traitment recover the solde when the request is canceled
      let VAR1 = balanceused;
      let totalsoldecumule = 0;
      let d = new Date();
      let year = d.getFullYear() - 1;
      let x = user1.contractBalance - user1.annualBalance;
      if (user1.cumulativeBances != null) {
        user1.cumulativeBances.map(
          (solde) => (totalsoldecumule = totalsoldecumule + solde.balance)
        );
        if (
          user1.contractBalance === user1.annualBalance &&
          (totalsoldecumule === 0 || totalsoldecumule != 0)
        ) {
          user1.cumulativeBances.map((solde) => {
            if (solde.year === year) {
              solde.balance = solde.balance + VAR1;
            }
          });
        }
        if (user1.contractBalance != user1.annualBalance && x < VAR1) {
          user1.annualBalance = user1.annualBalance + x;
          user1.cumulativeBances.map((solde) => {
            if (solde.year === year) {
              solde.balance = solde.balance + (VAR1 - x);
            }
          });
        }
        if (user1.contractBalance != user1.annualBalance && x >= VAR1) {
          user1.annualBalance = user1.annualBalance + VAR1;
        }
      } else {
        user1.annualBalance = user1.annualBalance + VAR1;
      }
      //user1.annualBalance = user1.annualBalance + balanceused;
      this.state.col.solde = user1;
      // traitement balance action
      //code changes in balance action treatment
      let BalanceAction = {
        name: "Cancellation Of Paid Request",
        typeofaction: "System",
        addedBy:
          JSON.parse(sessionStorage.getItem("firstname")) +
          " " +
          JSON.parse(sessionStorage.getItem("lastname")),
        actionDate: dateFormat(new Date(), "yyyy-mm-dd"),
        dateTime: dateFormat(new Date(), "HH:MM:ss"),
        employeeID: this.state.col.id,
        reasonOfChange:
          "Paid Request Vacation (" +
          this.state.request.typeOfTime +
          ") from " +
          this.state.request.datesRequest[0].startDate +
          " to " +
          this.state.request.datesRequest[0].endDate +
          " has been cancelled, the total balance of " +
          BackUpBalanceBefore +
          " day(s) has been incremented automatically by " +
          balanceused +
          " day(s). ",
        totalBalance:
          user1.annualBalance + this.calculeCumulaticeBalance(user1),
      };
      BalanceActionService.createBalanceAction(BalanceAction);

      //PaidRequestService.sendcancellationrequest("OFF", paidreqid, Request)
      //PaidRequestService.statutrequestaftervalidatecancellation("cancellation accepted", paidreqid)
      //PaidRequestService.sendcancellationrequest(
      //  "OFF",
      //  paidreqid,
      //  Request
      //).then((res) => {
      //PaidRequestService.statutrequestaftervalidatecancellation(
      //  "cancellation accepted",
      //  paidreqid
      //).then((res) => {
      PaidRequestService.NewMethodValidationCancellationRequest(
        paidreqid,
        "OFF",
        "cancellation accepted",
        Request
      ).then((res) => {
        //treatment of log user connected
        if (res.data) {
          CollaborateurServices.updateUser(
            this.state.col,
            this.state.col.id,
            userDetaile
          );
        } else {
          console.log("empty result");
        }
        setTimeout(() => {
          Swal.close();
        }, 1000);
        setTimeout(() => {
          if (
            sessionStorage.getItem("role") === "RH" ||
            sessionStorage.getItem("role") === "RH grp"
          ) {
            /*let arrayOfPaidReq = []
                            this.state.collaborator.map(user => {
                                PaidRequestService.getPaidRequestOfUser(user.id).then((res) => {
                                    arrayOfPaidReq.push(res.data)
                                }).then(()=>{
                                    this.setState({paidRequest:arrayOfPaidReq})
                                })
                            })*/
            PaidRequestService.getAllPaidRequestOfTheTeamOfValidator(
              sessionStorage.getItem("user")
            ).then((res) => {
              this.setState({ paidRequest: res.data });
            });
          }
          // else{
          //     PaidRequestService.getPaidRequest().then(res => {
          //         this.setState({ paidRequest: res.data });
          //     })
          // }
        }, 2000);
      });
      //});
      //});
    }, 1000);
  }

  ValidCancellationUnpaidRequestMethod(unpaidreqid) {
    let Request = { cancellationJustification: "" };
    UnPaidRequestService.sendcancellationrequest(
      "OFF",
      unpaidreqid,
      Request
    ).then((res) => {
      UnPaidRequestService.statutrequestaftervalidatecancellation(
        "cancellation accepted",
        unpaidreqid
      ).then((res) => {
        if (
          sessionStorage.getItem("role") === "RH" ||
          sessionStorage.getItem("role") === "RH grp"
        ) {
          UnPaidRequestService.getAllUnpaidRequestOfTheTeamOfValidator(
            sessionStorage.getItem("user")
          ).then((res) => {
            this.setState({ unPaidRequest: res.data });
          });
        }
      });
    });
  }

  changeRefuseCancellationJustis = (index, event) => {
    var canceljustis = this.state.refusecancellationjustis.slice();
    canceljustis[index] = event.target.value;
    this.setState({ refusecancellationjustis: canceljustis });
  };

  refreshPage = () => {
    window.location.reload();
  };

  CustomPagination = () => {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <Pagination
        color="primary"
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    );
  };

  CustomNoRowsOverlay = () => {
    return (
      <StyledGridOverlay>
        <svg
          width="120"
          height="100"
          viewBox="0 0 184 152"
          aria-hidden
          focusable="false"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse
                className="ant-empty-img-5"
                cx="67.797"
                cy="106.89"
                rx="67.797"
                ry="12.668"
              />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <Box sx={{ mt: 1 }}>
          {this.state.paidRequest.length == 0 ? (
            <span style={{ color: "#8c8c8c" }}>
              {translate("Please wait for preparing the Data")}
            </span>
          ) : (
            <span style={{ color: "#8c8c8c" }}>{translate("No Rows")}</span>
          )}
        </Box>
      </StyledGridOverlay>
    );
  };

  mycolumnsAllReq = [
    {
      field: "cin",
      headerName: DatagridColumn[11],
      headerAlign: "center",
      width: 130,
      //hide: true,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "ON"
          ? "super-app-theme--cell"
          : null,
      renderCell: (params) => {
        return (
          <p
            style={{
              paddingLeft: "20px",
              paddingTop: "18px",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            {params.row.collaborator.cin}
          </p>
        );
      },
      valueGetter: (params) => params.row.collaborator.cin,
    },
    {
      field: "collaborator",
      headerName: DatagridColumn[0],
      headerAlign: "center",
      width: 180,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "ON"
          ? "super-app-theme--cell"
          : null,
      renderCell: (params) => {
        return (
          <p
            style={{
              marginLeft: "10px",
              marginTop: "18px",
              fontSize: "17px",
              fontWeight: "bold",
            }}
          >
            {params.row.collaborator.firstname +
              " " +
              params.row.collaborator.lastname}
          </p>
        );
      },
      valueGetter: (params) =>
        params.row.collaborator.firstname +
        " " +
        params.row.collaborator.lastname,
    },
    {
      field: "nameReq",
      headerName: DatagridColumn[1],
      headerAlign: "center",
      width: 170,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "ON"
          ? "super-app-theme--cell"
          : null,
      renderCell: (params) => translate(params.row.nameReq),
    },
    {
      field: "statut",
      headerName: DatagridColumn[2],
      headerAlign: "center",
      width: 220,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "ON"
          ? "super-app-theme--cell"
          : null,
      renderCell: (params) => {
        return this.checkStatut(params.row.statut);
      },
      valueGetter: (params) => {
        if (params.row.statut === "cancellation refused") {
          return "accepted";
        } else if (params.row.statut === "cancellation accepted") {
          return "canceled";
        } else {
          return params.row.statut;
        }
      },
    },
    {
      field: "typeOfTime",
      headerName: DatagridColumn[3],
      headerAlign: "center",
      width: 130,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "ON"
          ? "super-app-theme--cell"
          : null,
      renderCell: (params) => translate(params.row.typeOfTime),
    },

    {
      field: "startDate",
      headerName: DatagridColumn[4],
      headerAlign: "center",
      width: 140,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "ON"
          ? "super-app-theme--cell"
          : null,
      renderCell: (params) => {
        return params.row.datesRequest.map((dates) => (
          <p
            key={dates.id}
            style={{
              marginLeft: "25px",
              marginTop: "18px",
              fontSize: "17px",
              fontWeight: "bold",
              color: "#32CD32",
            }}
          >
            {" "}
            {dates.startDate}{" "}
          </p>
        ));
      },
      valueGetter: (params) =>
        params.row.datesRequest.map((dates) => dates.startDate),
    },

    {
      field: "endDate",
      headerName: DatagridColumn[5],
      headerAlign: "center",
      width: 140,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "ON"
          ? "super-app-theme--cell"
          : null,
      renderCell: (params) => {
        return params.row.datesRequest.map((dates) => (
          <p
            key={dates.id}
            style={{
              marginLeft: "25px",
              marginTop: "18px",
              fontSize: "17px",
              fontWeight: "bold",
              color: "#1E90FF",
            }}
          >
            {" "}
            {dates.endDate}{" "}
          </p>
        ));
      },
      valueGetter: (params) =>
        params.row.datesRequest.map((dates) => dates.endDate),
    },

    {
      field: "duration",
      headerName: DatagridColumn[6],
      headerAlign: "center",
      type: "number",
      width: 100,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "ON"
          ? "super-app-theme--cell"
          : null,
      renderCell: (params) => {
        return params.row.datesRequest.map((dates) => (
          <p
            key={dates.id}
            style={{
              paddingLeft: "20px",
              paddingTop: "18px",
              fontSize: "17px",
              paddingRight: "20px",
            }}
          >
            {dates.duration}{" "}
          </p>
        ));
      },
      valueGetter: (params) =>
        params.row.datesRequest.map((dates) => dates.duration),
    },
    {
      field: "fridaysCount",
      headerName: DatagridColumn[18],
      headerAlign: "center",
      type: "number",
      sortable: true,
      hide: true,
      width: 210,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "ON"
          ? "super-app-theme--cell"
          : null,
      renderCell: (params) => {
        return (
          <p
            style={{ marginLeft: "20px", marginTop: "18px", fontSize: "17px" }}
          >
            {params.row.fridaysCount}
          </p>
        );
      },
      valueGetter: (params) => params.row.fridaysCount,
    },
    {
      field: "durationCurrentMonth",
      headerName: DatagridColumn[19],
      headerAlign: "center",
      type: "number",
      sortable: true,
      hide: true,
      width: 200,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "ON"
          ? "super-app-theme--cell"
          : null,
      renderCell: (params) => {
        return (
          <p
            style={{ marginLeft: "20px", marginTop: "18px", fontSize: "17px" }}
          >
            {params.row.durationCurrentMonth}
          </p>
        );
      },
      valueGetter: (params) => params.row.durationCurrentMonth,
    },
    {
      field: "durationNextMonth",
      headerName: DatagridColumn[20],
      headerAlign: "center",
      type: "number",
      sortable: true,
      hide: true,
      width: 200,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "ON"
          ? "super-app-theme--cell"
          : null,
      renderCell: (params) => {
        return (
          <p
            style={{ marginLeft: "20px", marginTop: "18px", fontSize: "17px" }}
          >
            {params.row.durationNextMonth}
          </p>
        );
      },
      valueGetter: (params) => params.row.durationNextMonth,
    },
    {
      field: "summertime",
      headerName: DatagridColumn[21],
      headerAlign: "center",
      type: "string",
      sortable: true,
      hide: true,
      width: 160,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "ON"
          ? "super-app-theme--cell"
          : null,
      renderCell: (params) => {
        return params.row.summertime != "" &&
          params.row.summertime != undefined ? (
          <p
            style={{ marginLeft: "20px", marginTop: "18px", fontSize: "17px" }}
          >
            {translate(params.row.summertime)}
          </p>
        ) : (
          <p
            style={{ marginLeft: "20px", marginTop: "18px", fontSize: "17px" }}
          >
            {params.row.summertime}
          </p>
        );
      },
      valueGetter: (params) => params.row.summertime,
    },
    {
      field: "validator",
      headerName: DatagridColumn[12],
      type: "string",
      headerAlign: "center",
      width: 180,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "ON"
          ? "super-app-theme--cell"
          : null,
      renderCell: (params) => {
        return (
          <p
            style={{
              marginLeft: "30px",
              marginTop: "18px",
              fontSize: "17px",
              fontWeight: "bold",
              color: "#1E90FF",
            }}
          >{`${params.row.firstNameValidator || ""} ${
            params.row.lastNameValidator || ""
          }`}</p>
        );
      },
      valueGetter: (params) =>
        `${params.row.firstNameValidator || ""} ${
          params.row.lastNameValidator || ""
        }`,
    },
    {
      field: "NameUnit",
      headerName: DatagridColumn[10],
      headerAlign: "center",
      width: 180,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "ON"
          ? "super-app-theme--cell"
          : null,
      renderCell: (params) => {
        return (
          <p
            style={{
              marginLeft: "30px",
              marginTop: "18px",
              fontSize: "17px",
              fontWeight: "bold",
              color: "#32CD32",
            }}
          >
            {params.row.NameUnit}
          </p>
        );
      },
      valueGetter: (params) => params.row.NameUnit,
    },
    {
      field: "action",
      headerName: DatagridColumn[7],
      headerAlign: "center",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      filterable: false,
      disableExport: true,
      width: 170,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "ON"
          ? "super-app-theme--cell"
          : null,
      renderCell: (params) => {
        return (
          <div>
            <LightTooltip
              title={translate("View request details")}
              placement="top"
            >
              <Button
                className="btnEye"
                onClick={() => this.openDetailsModel(params.row)}
              >
                <IoEye style={{ fontSize: "25px", color: "#20B2AA" }} />{" "}
              </Button>
            </LightTooltip>
            {params.row.statut === "Pending" &&
            params.row.nameReq === "Paid Request" &&
            (sessionStorage.getItem("role") === "RH" ||
              sessionStorage.getItem("role") === "RH grp") ? (
              <LightTooltip
                title={translate("Confirm vacation request")}
                placement="top"
              >
                <Button
                  style={{ marginLeft: "2px" }}
                  onClick={() =>
                    params.row.UnitMigrationActive
                      ? this.openValidModel(params.row)
                      : params.row.NameUnit.includes("BPO") ||
                        params.row.NameUnit === "Managers"
                      ? this.openValidModel(params.row)
                      : Swal.fire({
                          title: DatagridColumn[17],
                          html: `${DatagridColumn[15]} <br/> <span style="color:red;font-weight:bold"> ${DatagridColumn[16]} </span>`,
                          confirmButtonText: DatagridColumn[14],
                          icon: "warning",
                        })
                  }
                  className="btnValid"
                  disabled={this.state.loading}
                >
                  <EventAvailableIcon
                    style={{ fontSize: "25px", color: "green" }}
                  />{" "}
                </Button>
              </LightTooltip>
            ) : params.row.statut === "Pending" &&
              params.row.nameReq === "Unpaid Request" &&
              JSON.parse(sessionStorage.getItem("firstname")) ===
                params.row.firstNameValidator &&
              JSON.parse(sessionStorage.getItem("lastname")) ===
                params.row.lastNameValidator &&
              (sessionStorage.getItem("role") === "RH" ||
                sessionStorage.getItem("role") === "RH grp") ? (
              <LightTooltip
                title={translate("Confirm vacation request")}
                placement="top"
              >
                <Button
                  style={{ marginLeft: "2px" }}
                  onClick={() => this.openValidModel(params.row)}
                  className="btnValid"
                  disabled={this.state.loading}
                >
                  <EventAvailableIcon
                    style={{ fontSize: "25px", color: "green" }}
                  />{" "}
                </Button>
              </LightTooltip>
            ) : params.row.statut === "accepted by validator" &&
              params.row.nameReq === "Unpaid Request" &&
              sessionStorage.getItem("role") === "RH" &&
              this.state.unpaidvalidator.firstname ===
                JSON.parse(sessionStorage.getItem("firstname")) &&
              this.state.unpaidvalidator.lastname ===
                JSON.parse(sessionStorage.getItem("lastname")) ? (
              <LightTooltip
                title={translate("Confirm vacation request")}
                placement="top"
              >
                <Button
                  style={{ marginLeft: "2px" }}
                  onClick={() => this.openValidModel(params.row)}
                  className="btnValid"
                  disabled={this.state.loading}
                >
                  <EventAvailableIcon
                    style={{ fontSize: "25px", color: "green" }}
                  />{" "}
                </Button>
              </LightTooltip>
            ) : null}
            {params.row.statut === "Pending" &&
            params.row.nameReq === "Paid Request" &&
            (sessionStorage.getItem("role") === "RH" ||
              sessionStorage.getItem("role") === "RH grp") ? (
              <LightTooltip
                title={translate("Reject vacation request")}
                placement="top"
              >
                <Button
                  style={{ marginLeft: "2px" }}
                  onClick={() => this.openDeleteModel(params.row)}
                  className="btnDelete"
                  disabled={this.state.loading}
                >
                  <EventBusyIcon style={{ fontSize: "25px", color: "red" }} />{" "}
                </Button>
              </LightTooltip>
            ) : params.row.statut === "Pending" &&
              params.row.nameReq === "Unpaid Request" &&
              JSON.parse(sessionStorage.getItem("firstname")) ===
                params.row.firstNameValidator &&
              JSON.parse(sessionStorage.getItem("lastname")) ===
                params.row.lastNameValidator &&
              (sessionStorage.getItem("role") === "RH" ||
                sessionStorage.getItem("role") === "RH grp") ? (
              <LightTooltip
                title={translate("Reject vacation request")}
                placement="top"
              >
                <Button
                  style={{ marginLeft: "2px" }}
                  onClick={() => this.openDeleteModel(params.row)}
                  className="btnDelete"
                  disabled={this.state.loading}
                >
                  <EventBusyIcon style={{ fontSize: "25px", color: "red" }} />{" "}
                </Button>
              </LightTooltip>
            ) : params.row.statut === "accepted by validator" &&
              params.row.nameReq === "Unpaid Request" &&
              sessionStorage.getItem("role") === "RH" &&
              this.state.unpaidvalidator.firstname ===
                JSON.parse(sessionStorage.getItem("firstname")) &&
              this.state.unpaidvalidator.lastname ===
                JSON.parse(sessionStorage.getItem("lastname")) ? (
              <LightTooltip
                title={translate("Reject vacation request")}
                placement="top"
              >
                <Button
                  style={{ marginLeft: "2px" }}
                  onClick={() => this.openDeleteModel(params.row)}
                  className="btnDelete"
                  disabled={this.state.loading}
                >
                  <EventBusyIcon style={{ fontSize: "25px", color: "red" }} />{" "}
                </Button>
              </LightTooltip>
            ) : null}
            {params.row.sendCancellationRequest === "ON" &&
            params.row.statut === "Pending cancellation" &&
            params.row.nameReq === "Paid Request" &&
            (sessionStorage.getItem("role") === "RH" ||
              sessionStorage.getItem("role") === "RH grp") ? (
              <LightTooltip
                title={translate("Confirm cancellation request")}
                placement="top"
              >
                <Button
                  style={{ marginLeft: "2px" }}
                  className="btnWarning"
                  onClick={() =>
                    params.row.UnitMigrationActive
                      ? this.openConfirmCancelRequestModel(params.row)
                      : params.row.NameUnit.includes("BPO") ||
                        params.row.NameUnit === "Managers"
                      ? this.openConfirmCancelRequestModel(params.row)
                      : Swal.fire({
                          title: DatagridColumn[17],
                          html: `${DatagridColumn[15]} <br/> <span style="color:red;font-weight:bold"> ${DatagridColumn[16]} </span>`,
                          confirmButtonText: DatagridColumn[14],
                          icon: "warning",
                        })
                  }
                >
                  <FiAlertOctagon
                    style={{ fontSize: "23px", color: "#FF6347" }}
                  />{" "}
                </Button>
              </LightTooltip>
            ) : params.row.sendCancellationRequest === "ON" &&
              params.row.statut === "Pending cancellation" &&
              (sessionStorage.getItem("role") === "RH" ||
                sessionStorage.getItem("role") === "RH grp") ? (
              <LightTooltip
                title={translate("Confirm cancellation request")}
                placement="top"
              >
                <Button
                  style={{ marginLeft: "2px" }}
                  className="btnWarning"
                  onClick={() =>
                    params.row.nameReq === "Unpaid Request"
                      ? this.openConfirmCancelRequestModel(params.row)
                      : params.row.nameReq === "Paid Request" &&
                        params.row.UnitMigrationActive
                      ? this.openConfirmCancelRequestModel(params.row)
                      : params.row.nameReq === "Paid Request" &&
                        (params.row.NameUnit.includes("BPO") ||
                          params.row.NameUnit === "Managers")
                      ? this.openConfirmCancelRequestModel(params.row)
                      : Swal.fire({
                          title: DatagridColumn[17],
                          html: `${DatagridColumn[15]} <br/> <span style="color:red;font-weight:bold"> ${DatagridColumn[16]} </span>`,
                          confirmButtonText: DatagridColumn[14],
                          icon: "warning",
                        })
                  }
                >
                  <FiAlertOctagon
                    style={{ fontSize: "23px", color: "#FF6347" }}
                  />{" "}
                </Button>
              </LightTooltip>
            ) : null}
          </div>
        );
      },
    },
  ];

  AllRequest() {
    const paidReq = /*this.state.paidRequest;*/ this.FilterRowsPaidTotal();
    const paidReqType = paidReq.map((e) =>
      Object.assign(e, { nameReq: "Paid Request" })
    );
    const unpaidReq = this.FilterRowsUnpaidTotal();
    const unpaidReqType = unpaidReq.map((e) =>
      Object.assign(e, { nameReq: "Unpaid Request" })
    );
    const recoveryReq = this.FilterRowsRecoveryTotal();
    const recoveryReqType = recoveryReq.map((e) =>
      Object.assign(e, { nameReq: "Recovery Request" })
    );
    const exepReq = this.FilterRowsExeptionnelTotal();
    const exepReqType = exepReq.map((e) =>
      Object.assign(e, { nameReq: "Exceptional Request" })
    );

    let allreq = [
      ...paidReqType,
      ...unpaidReqType,
      ...recoveryReqType,
      ...exepReqType,
    ];

    // add name unit and validator  to colaborators
    let collaboratorWithAllInfo = [];
    this.state.units.map((unit) => {
      unit.collaborators1.map((collaborator) => {
        if (
          unit.pkeyFestive != null &&
          unit.pkeyFestive != "" &&
          unit.pkeyMainTask != null &&
          unit.pkeyMainTask != "" &&
          unit.pkeyPaidVacation != null &&
          unit.pkeyPaidVacation != "" &&
          unit.summaryFestive != null &&
          unit.summaryFestive != "" &&
          unit.summaryMainTask != null &&
          unit.summaryMainTask != "" &&
          unit.summaryPaidVacation != null &&
          unit.summaryPaidVacation != ""
        ) {
          let collaboratorWithMigrationActive = Object.assign(collaborator, {
            UnitMigrationActive: true,
          });
          let collaboratorWithUnit = Object.assign(
            collaboratorWithMigrationActive,
            {
              NameUnit: unit.name,
            }
          );
          let collaboratorWithFValidator = Object.assign(collaboratorWithUnit, {
            firstNameValidator: unit.validator.firstname,
          });
          let collaboratorWithLValidator = Object.assign(
            collaboratorWithFValidator,
            { lastNameValidator: unit.validator.lastname }
          );
          collaboratorWithAllInfo.push(collaboratorWithLValidator);
        } else {
          let collaboratorWithMigrationActive = Object.assign(collaborator, {
            UnitMigrationActive: false,
          });
          let collaboratorWithUnit = Object.assign(
            collaboratorWithMigrationActive,
            {
              NameUnit: unit.name,
            }
          );
          let collaboratorWithFValidator = Object.assign(collaboratorWithUnit, {
            firstNameValidator: unit.validator.firstname,
          });
          let collaboratorWithLValidator = Object.assign(
            collaboratorWithFValidator,
            { lastNameValidator: unit.validator.lastname }
          );
          collaboratorWithAllInfo.push(collaboratorWithLValidator);
        }
      });
    });

    // console.log(collaboratorWithAllInfo)
    // console.log(allreq)
    // let newAlleq=[];
    allreq.map((allr) => {
      let matchFound = false;
      collaboratorWithAllInfo.map((collab) => {
        if (allr.collaborator.id == collab.id) {
          matchFound = true;
          if (allr.nameReq === "Unpaid Request") {
            if (
              allr.statut === "Pending" ||
              allr.statut === "refused by validator"
            ) {
              Object.assign(allr, {
                firstNameValidator: collab.firstNameValidator,
              });
              Object.assign(allr, {
                lastNameValidator: collab.lastNameValidator,
              });
              Object.assign(allr, { NameUnit: collab.NameUnit });
            } else {
              Object.assign(allr, {
                firstNameValidator: this.state.unpaidvalidator.firstname,
              });
              Object.assign(allr, {
                lastNameValidator: this.state.unpaidvalidator.lastname,
              });
              Object.assign(allr, { NameUnit: collab.NameUnit });
            }
          } else if (allr.nameReq === "Paid Request") {
            if (
              allr.statut === "Pending" ||
              allr.statut === "Pending cancellation"
            ) {
              Object.assign(allr, {
                firstNameValidator: collab.firstNameValidator,
              });
              Object.assign(allr, {
                lastNameValidator: collab.lastNameValidator,
              });
              Object.assign(allr, { NameUnit: collab.NameUnit });
              Object.assign(allr, {
                UnitMigrationActive: collab.UnitMigrationActive,
              });
            } else {
              if (
                allr.firstnamevalidator === "" &&
                allr.lastnamevalidator === "" &&
                allr.unitname === ""
              ) {
                Object.assign(allr, {
                  firstNameValidator: collab.firstNameValidator,
                });
                Object.assign(allr, {
                  lastNameValidator: collab.lastNameValidator,
                });
                Object.assign(allr, { NameUnit: collab.NameUnit });
                Object.assign(allr, {
                  UnitMigrationActive: collab.UnitMigrationActive,
                });
              } else {
                Object.assign(allr, {
                  firstNameValidator: allr.firstnamevalidator,
                });
                Object.assign(allr, {
                  lastNameValidator: allr.lastnamevalidator,
                });
                Object.assign(allr, { NameUnit: allr.unitname });
                Object.assign(allr, {
                  UnitMigrationActive: collab.UnitMigrationActive,
                });
              }
            }
          } else {
            Object.assign(allr, {
              firstNameValidator: collab.firstNameValidator,
            });
            Object.assign(allr, {
              lastNameValidator: collab.lastNameValidator,
            });
            Object.assign(allr, { NameUnit: collab.NameUnit });
          }
          //Object.assign(allr, { NameUnit: collab.NameUnit });
        }
      });
      if (!matchFound) {
        allr.NameUnit = "Non assigne";
        allr.firstNameValidator = "Non assigne";
        allr.lastNameValidator = "";
        allr.UnitMigrationActive = false;
      }
    });
    // console.log(allreq)

    return (
      <div className="row">
        <div
          style={{
            display: "flex",
            height: 540,
            width: "100%",
            marginTop: "15px",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: "100%",
              "& .super-app-theme--cell": {
                backgroundColor: "#FF634718",
                color: "#1a3e72",
                fontWeight: "600",
              },
            }}
          >
            <DataGrid
              rows={allreq.sort(function (a, b) {
                // Priority order for status
                const statusPriority = {
                  Pending: 2,
                  "Pending cancellation": 1,
                  accepted: 3,
                  "accepted by validator": 2,
                  refused: 4,
                  "refused by validator": 4,
                  "cancellation accepted": 4,
                  "cancellation refused": 3,
                };

                // Compare status priority
                if (statusPriority[a.statut] < statusPriority[b.statut]) {
                  return -1;
                } else if (
                  statusPriority[a.statut] > statusPriority[b.statut]
                ) {
                  return 1;
                }

                //If status is the same, compare dates
                var c = new Date(a.requestDate);
                var d = new Date(b.requestDate);
                return d.getTime() - c.getTime();
              })}
              columns={this.mycolumnsAllReq}
              autoPageSize={true}
              rowsPerPageOptions={[10]}
              checkboxSelection={
                JSON.parse(sessionStorage.getItem("firstname")) === "Super" &&
                JSON.parse(sessionStorage.getItem("lastname")) === "Admin"
                  ? true
                  : false
              }
              localeText={
                sessionStorage.getItem("lang") === "Fr"
                  ? frFR.components.MuiDataGrid.defaultProps.localeText
                  : sessionStorage.getItem("lang") === "Sp"
                  ? esES.components.MuiDataGrid.defaultProps.localeText
                  : enUS.components.MuiDataGrid.defaultProps.localeText
              }
              onSelectionModelChange={(ids) => {
                const selectedIDs = new Set(ids);
                const selectedRowData = allreq.filter((row) =>
                  selectedIDs.has(row.id)
                );
                console.log(selectedRowData);
              }}
              components={{
                Toolbar: ExcelExport,
                LoadingOverlay: LinearProgress,
                Pagination: this.CustomPagination,
                NoRowsOverlay: this.CustomNoRowsOverlay,
              }}
              //components={{ Toolbar: GridToolbar,LoadingOverlay:LinearProgress, Pagination:this.CustomPagination }}
              loading={this.state.loading}
              sx={{
                fontSize: "17px",
                boxShadow: 1,
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                  fontWeight: "bold",
                },
              }}
            />
          </Box>
        </div>
      </div>
    );
  }

  list(a) {
    if (
      sessionStorage.getItem("role") === "RH" ||
      sessionStorage.getItem("role") === "RH grp"
    ) {
      if (a === "paidrequest") {
        return this.PaidRequest();
      } else if (a === "unpaid") {
        return this.Unpaidlists();
      } else if (a === "recovery") {
        return this.Recoverylists();
      } else if (a === "exceptional") {
        return this.exeptionnelList();
      } else if (a === "allRequest") {
        return this.AllRequest();
      }
    } else {
      return this.AllRequest();
    }
  }
  changeSelect = (event) => {
    this.setState({ select: event.target.value });
  };

  render() {
    return (
      <div>
        {this.state.fetching ? <Fetching /> : null}
        <br></br>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/*this.select()*/}
        </div>
        {this.list(this.state.select)}

        <DetailsRequestModel
          show={this.state.showDetailsModel}
          onHide={() => this.setState({ showDetailsModel: false })}
          closemodel={() => this.setState({ showDetailsModel: false })}
          rowreq1={this.state.rowReq}
          rowcollab1={this.state.rowcollab}
          rowcollabsolde1={this.state.rowcollabsolde}
          rowdaterequests1={this.state.rowdaterequests}
          rowvalidator={this.state.collabvalidator}
          checkstatutmodal={this.checkStatutModal}
          //traitment affichage info of name of unit for details request of the collaborator
          rowunitname={this.state.unitname}
          pathurl="request of team page"
        />

        <DeleteRequestModel
          show={this.state.showDeleteModel}
          onHide={() => this.setState({ showDeleteModel: false })}
          closeModel={() => this.setState({ showDeleteModel: false })}
          rowReq1={this.state.rowReq}
          rowcollab1={this.state.rowcollab}
          rowdaterequests1={this.state.rowdaterequests}
          requestrejecte={this.RequestRejecte}
          changeJustification={this.changeJusti}
          /**** */
          unpaidrequestrejecte={this.UnRequestRejecte}
        />

        <ValidRequestModel
          show={this.state.showValideModel}
          onHide={() => this.setState({ showValideModel: false })}
          closeModel={() => this.setState({ showValideModel: false })}
          rowReq1={this.state.rowReq}
          rowcollab1={this.state.rowcollab}
          rowdaterequests1={this.state.rowdaterequests}
          requestsuccess={this.RequestSuccess}
          refrechpage={this.refreshPage}
          role={sessionStorage.getItem("role")}
          /**** */
          unpaidrequestsuccess={this.UnRequestSuccess}
        />

        <ConfirmCancelRequestModel
          show={this.state.showConfirmCancelRequestModel}
          onHide={() => this.setState({ showConfirmCancelRequestModel: false })}
          closeModel={() =>
            this.setState({ showConfirmCancelRequestModel: false })
          }
          rowReq1={this.state.rowReq}
          rowcollab1={this.state.rowcollab}
          rowdaterequests1={this.state.rowdaterequests}
          rejectecancellationrequestmethod={
            this.RejecteCancellationRequestMethod
          }
          validecancellationrequestmethod={this.ValidCancellationRequestMethod}
          changerefusecancellationjustification={
            this.changeRefuseCancellationJustis
          }
          /*** */
          rejectecancellationunpaidrequestmethod={
            this.RejecteCancellationUnpaidRequestMethod
          }
          validecancellationunpaidrequestmethod={
            this.ValidCancellationUnpaidRequestMethod
          }
        />
      </div>
    );
  }
}
export default RequestOfTeam;
