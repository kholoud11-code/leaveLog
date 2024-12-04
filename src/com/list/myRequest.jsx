import React, { Component } from "react";
import PaidRequestService from "../../servicees/PaidRequestService";
import ExeptionnelRequestService from "../../servicees/ExptionnelService";
import UnPaidRequestService from "../../servicees/UnPaidRequestService";
import RecoveryRequestService from "../../servicees/RecoveryRequestService";
import UnitService from "../../servicees/UnitService";
import CollaborateurServices from "../../servicees/CollaborateurServices";
import translate from "../../i18nProvider/translate";
import {
  IoAddCircleSharp,
  IoTrashSharp,
  IoCheckmarkCircleSharp,
  IoCloseCircle,
  IoPaperPlaneSharp,
  IoEye,
} from "react-icons/io5";
import { RiChatDeleteLine } from "react-icons/ri";
import {
  DataGrid,
  enUS,
  frFR,
  esES,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import { Button } from "react-bootstrap";
import Box from "@mui/material/Box";
import Fetching from "./Fetching";
import "../css/list.css";
import AddRequestModal from "./AddRequestModal";
import DetailsMyRequestModel from "./DetailsMyRequestModal";
import Cron from "../../servicees/Cron";
import ExcelExport from "./ExcelExport";
import SendCancelRequestModel from "./SendCancelRequestModel";
import { reactLocalStorage } from "reactjs-localstorage";
import Swal from "sweetalert2";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const englishColumn = [
  "Request Date",
  "Type",
  "Statut",
  "Type of time",
  "Start Date",
  "End Date",
  "Duration",
  "Action",
  "Are you sure ?",
  "The request was already accepted , you must refresh the page or wait few minutes to update the data automatically",
  "Sending of cancellation request",
  "The operation is in progress",
  "please don't forget to remove the vacation hours logged in Kosin once this request is accepted.",
  "Fridays Count (d)",
  "Current Month (h)",
  "Next Month (h)",
  "Summer Time",
];
const frenchColumn = [
  "Date de demande",
  "Type",
  "Statut",
  "Type de temps",
  "Date de début",
  "Date de fin",
  "Durée",
  "Action",
  "Es-tu sûr ?",
  "La demande a déjà été acceptée, vous devez actualiser la page ou attendre quelques minutes pour mettre à jour les données automatiquement",
  "Envoi de demande d'annulation",
  "L'opération est en cours",
  "n'oubliez pas de supprimer les heures de vacances enregistrées dans Kosin une fois cette demande acceptée.",
  "Vendredis comptent (j)",
  "Mois actuel (h)",
  "Le mois prochain (h)",
  "Heure d'été",
];
const spanishColumn = [
  "Fecha de solicitud",
  "Tipo",
  "Estado",
  "Tipo de tiempo",
  "Fecha de inicio",
  "Fecha de finalización",
  "Duración",
  "Acción",
  "Estás seguro(a) ?",
  "La solicitud ya fue aceptada, debes actualizar la página o esperar unos minutos para actualizar los datos automáticamente",
  "Envío de solicitud de cancelación",
  "La operación está en progreso",
  "no olvide eliminar las horas de vacaciones registradas en Kosin una vez que se acepte esta solicitud.",
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

const englishStrings = {
  cannotRevert: "You won't be able to revert this!",
  recoveryRequestDeleted: "Recovery request has been deleted.",
  exceptionalRequestDeleted: "Exceptional request has been deleted.",
  unpaidRequestDeleted: "Unpaid request has been deleted.",
  unableToDeletePaidRequest: "Unable to delete paid request.",
  deleted: "Deleted!",
  paidRequestDeleted: "Paid request has been deleted.",
  confirmDeletion: "Are you sure?",
  confirmButtonText: "Yes, delete it!",
  confirmButtonText1: "Ok",
  cancelButtonText: "Cancel",
};

const frenchStrings = {
  cannotRevert: "Vous ne pourrez pas revenir en arrière !",
  recoveryRequestDeleted: "La demande de récupération a été supprimée.",
  exceptionalRequestDeleted: "La demande exceptionnelle a été supprimée.",
  unpaidRequestDeleted: "La demande non payée a été supprimée.",
  unableToDeletePaidRequest: "Impossible de supprimer la demande payée.",
  deleted: "Supprimé !",
  paidRequestDeleted: "La demande payée a été supprimée.",
  confirmDeletion: "Êtes-vous sûr(e) ?",
  confirmButtonText: "Oui, supprimez-le !",
  cancelButtonText: "Annuler",
  confirmButtonText1: "D'accord",
};

const spanishStrings = {
  cannotRevert: "¡No podrás revertir esto!",
  recoveryRequestDeleted: "La solicitud de recuperación ha sido eliminada.",
  exceptionalRequestDeleted: "La solicitud excepcional ha sido eliminada.",
  unpaidRequestDeleted: "La solicitud no pagada ha sido eliminada.",
  unableToDeletePaidRequest: "No se puede eliminar la solicitud pagada.",
  deleted: "¡Eliminado!",
  paidRequestDeleted: "La solicitud pagada ha sido eliminada.",
  confirmDeletion: "¿Estás seguro?",
  confirmButtonText: "¡Sí, elimínalo!",
  cancelButtonText: "Cancelar",
  confirmButtonText1: "bueno",
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

// Request of user list
class myRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paidRequest: [],
      unPaidRequest: [],
      exptionnel: [],
      RecoveryRequest: [],
      select: "allRequest",
      fetching: true,
      loading: true,
      showModal: false,
      showDetailsModel: false,
      showSendCancelRequestModel: false,
      cancellationjustis: [],
      rowReq: {},
      rowcollab: {},
      rowdaterequests: [],
      teamcollab: [],
      collab: {},
      collabvalidator: {},
      collabDirecteur: {},
      collabConnected: {},
      //traitment affichage info of name of unit for details request of the collaborator
      unitname: "",
    };

    this.checkStatut = this.checkStatut.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.changeSelect = this.changeSelect.bind(this);
    this.list = this.list.bind(this);
    this.transl = this.transl.bind(this);
    this.SendCancellationRequestMethod =
      this.SendCancellationRequestMethod.bind(this);
    this.changeCancellationJustis = this.changeCancellationJustis.bind(this);
    this.SendCancellationUnpaidRequestMethod =
      this.SendCancellationUnpaidRequestMethod.bind(this);
  }

  componentDidMount() {
    if (performance.navigation.type === 1) {
      reactLocalStorage.setObject(
        "PaidRequestOfCollaborateurConnected" + sessionStorage.getItem("user"),
        []
      );
    }

    this.setState({
      collabConnected: JSON.parse(sessionStorage.getItem("userConnected")),
    });

    if (
      !Array.isArray(
        reactLocalStorage.getObject(
          "PaidRequestOfCollaborateurConnected" + sessionStorage.getItem("user")
        )
      ) ||
      reactLocalStorage.getObject(
        "PaidRequestOfCollaborateurConnected" + sessionStorage.getItem("user")
      ).length == 0
    ) {
      PaidRequestService.getPaidRequestOfUser(
        parseInt(sessionStorage.getItem("user"))
      ).then((res) => {
        this.setState({ paidRequest: res.data /*,fetching: false*/ });
        //console.log(this.state.paidRequest);
        reactLocalStorage.setObject(
          "PaidRequestOfCollaborateurConnected" +
            sessionStorage.getItem("user"),
          res.data
        );
      });
    } else {
      this.setState({
        paidRequest: reactLocalStorage.getObject(
          "PaidRequestOfCollaborateurConnected" + sessionStorage.getItem("user")
        ) /*,fetching: false*/,
      });
      console.log(this.state.paidRequest);
    }

    UnPaidRequestService.getUnPaidRequestOfUser(
      parseInt(sessionStorage.getItem("user"))
    ).then((res) => {
      this.setState({ unPaidRequest: res.data, fetching: false });
      reactLocalStorage.setObject(
        "UnpaidRequestOfCollaborateurConnected" +
          sessionStorage.getItem("user"),
        res.data
      );
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

    /*PaidRequestService.getPaidRequestOfUser(parseInt(sessionStorage.getItem('user'))).then((res) => {
            this.setState({ paidRequest: res.data, collabConnected: JSON.parse(sessionStorage.getItem('userConnected'))});
        });*/
    /*PaidRequestService.getPaidRequestOfUser(parseInt(sessionStorage.getItem('user'))).then((res) => {
            this.setState({ paidRequest: res.data});
        })*/
    /*UnitService.team(parseInt(sessionStorage.getItem('user'))).then((res) => {
            this.setState({ teamcollab: res.data, fetching: false});
        });*/

    /*UnPaidRequestService.getUnPaidRequest().then((res) => {
            this.setState({ unPaidRequest: res.data});
        });
        ExeptionnelRequestService.geExeptionnelRequest().then((res) => {
            this.setState({ exptionnel: res.data});
        });
        RecoveryRequestService.getRecoveryRequest().then((res) => {
            this.setState({ RecoveryRequest: res.data});
        });*/

    /*CollaborateurServices.getUser().then((res) => {
            res.data.map(collabo => {
                if(collabo.team==="Directeur"){
                    this.setState({ collabDirecteur: collabo});
                }
            })
        })*/

    /*CollaborateurServices.getUserById(parseInt(sessionStorage.getItem('user'))).then(res => {
            this.setState({ collabConnected: res.data});
        })*/

    setTimeout(() => {
      this.setState({ loading: false });
    }, 3000);

    this.interval = setInterval(() => {
      Cron.getCron().then((res) => {
        if (res.data === true) {
          this.setState({ loading: true });
          PaidRequestService.getPaidRequestOfUser(
            parseInt(sessionStorage.getItem("user"))
          ).then((res) => {
            this.setState({ paidRequest: res.data });
            reactLocalStorage.setObject(
              "PaidRequestOfCollaborateurConnected" +
                sessionStorage.getItem("user"),
              res.data
            );
          });
          //get my unpaid request
          UnPaidRequestService.getUnPaidRequestOfUser(
            parseInt(sessionStorage.getItem("user"))
          ).then((res) => {
            this.setState({ unPaidRequest: res.data });
            reactLocalStorage.setObject(
              "UnpaidRequestOfCollaborateurConnected" +
                sessionStorage.getItem("user"),
              res.data
            );
          });
          ////////
        } else {
          this.setState({ loading: false });
        }
      });
    }, 1000);
    //traitment affichage info of name of unit for details request of the collaborator
    UnitService.findunitByUserId(parseInt(sessionStorage.getItem("user"))).then(
      (res) => {
        if (res.data.name === undefined) {
          this.setState({ unitname: "Non assigne" });
        } else {
          this.setState({ unitname: res.data.name });
        }
      }
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    reactLocalStorage.setObject(
      "PaidRequestOfCollaborateurConnected" + sessionStorage.getItem("user"),
      []
    );
    reactLocalStorage.setObject(
      "UnpaidRequestOfCollaborateurConnected" + sessionStorage.getItem("user"),
      []
    );
  }

  deleteUser(id, nameReq) {
    Swal.fire({
      title: strings.confirmDeletion,
      text: strings.cannotRevert,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: strings.confirmButtonText,
      cancelButtonText: strings.cancelButtonText,
    }).then((result) => {
      if (result.isConfirmed) {
        switch (nameReq) {
          case "Paid Request":
            PaidRequestService.deletPaidRequest(id).then((res) => {
              if (res.data.deleted) {
                this.setState({
                  paidRequest: this.state.paidRequest.filter(
                    (user) => user.id !== id
                  ),
                });
                reactLocalStorage.setObject(
                  "PaidRequestOfCollaborateurConnected" +
                    sessionStorage.getItem("user"),
                  this.state.paidRequest
                );
                Swal.fire({
                  title: strings.deleted,
                  text: strings.paidRequestDeleted,
                  icon: "success",
                  confirmButtonText: strings.confirmButtonText1,
                });
              } else {
                Swal.fire({
                  title: "Oops!",
                  text: strings.unableToDeletePaidRequest,
                  icon: "error",
                  confirmButtonText: strings.confirmButtonText1,
                });
              }
            });
            break;

          case "Unpaid Request":
            UnPaidRequestService.deletUnPaidRequest(id).then((res) => {
              this.setState({
                unPaidRequest: this.state.unPaidRequest.filter(
                  (user) => user.id !== id
                ),
              });
              reactLocalStorage.setObject(
                "UnpaidRequestOfCollaborateurConnected" +
                  sessionStorage.getItem("user"),
                this.state.unPaidRequest
              );
              Swal.fire({
                title: strings.deleted,
                text: strings.unpaidRequestDeleted,
                icon: "success",
                confirmButtonText: strings.confirmButtonText1,
              });
            });
            break;

          case "Exceptionnel Request":
            ExeptionnelRequestService.deletExeptionnelRequest(id).then(
              (res) => {
                this.setState({
                  exptionnel: this.state.exptionnel.filter(
                    (user) => user.id !== id
                  ),
                });
                Swal.fire({
                  title: strings.deleted,
                  text: strings.exceptionalRequestDeleted,
                  icon: "success",
                  confirmButtonText: strings.confirmButtonText1,
                });
              }
            );
            break;

          default:
            RecoveryRequestService.deletRecoveryRequest(id).then((res) => {
              this.setState({
                RecoveryRequest: this.state.RecoveryRequest.filter(
                  (user) => user.id !== id
                ),
              });
              Swal.fire({
                title: strings.deleted,
                text: strings.recoveryRequestDeleted,
                icon: "success",
                confirmButtonText: strings.confirmButtonText1,
              });
            });
            break;
        }
      }
    });
  }

  /********** */
  SendCancellationRequestMethod(id) {
    //add code changes treatment of migration horide to kosin
    Swal.fire({
      title: DatagridColumn[10],
      html: `${DatagridColumn[11]} <br/> ${DatagridColumn[12]}`,
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      footer: `<div class="spinner-border text-primary"></div>`,
      //timer: 30000,
    });
    let Request = {
      cancellationJustification: this.state.cancellationjustis[id],
    };
    PaidRequestService.sendcancellationrequest("ON", id, Request).then(
      (res) => {
        PaidRequestService.statutrequestaftervalidatecancellation(
          "Pending cancellation",
          id
        ).then((res) => {
          PaidRequestService.getPaidRequestOfUser(
            parseInt(sessionStorage.getItem("user"))
          ).then((res) => {
            this.setState({ paidRequest: res.data });
            reactLocalStorage.setObject(
              "PaidRequestOfCollaborateurConnected" +
                sessionStorage.getItem("user"),
              res.data
            );
            setTimeout(() => {
              Swal.close();
            }, 1000);
          });
        });
      }
    );
  }

  SendCancellationUnpaidRequestMethod(id) {
    let Request = {
      cancellationJustification: this.state.cancellationjustis[id],
    };
    UnPaidRequestService.sendcancellationrequest("ON", id, Request).then(
      (res) => {
        UnPaidRequestService.statutrequestaftervalidatecancellation(
          "Pending cancellation",
          id
        ).then((res) => {
          UnPaidRequestService.getUnPaidRequestOfUser(
            parseInt(sessionStorage.getItem("user"))
          ).then((res) => {
            this.setState({ unPaidRequest: res.data });
            reactLocalStorage.setObject(
              "UnpaidRequestOfCollaborateurConnected" +
                sessionStorage.getItem("user"),
              res.data
            );
          });
        });
      }
    );
  }
  /********** */

  checkStatut(value) {
    if (value === "processed") {
      return (
        <td className="text-secondary" style={{ fontWeight: "bold" }}>
          <IoPaperPlaneSharp style={{ marginRight: "10px" }} />
          {translate(value)}{" "}
        </td>
      );
    } else if (value === "accepted" || value === "accepted by validator") {
      return (
        <td className="text-success" style={{ fontWeight: "bold" }}>
          <IoCheckmarkCircleSharp style={{ marginRight: "10px" }} />
          {translate(value)}{" "}
        </td>
      );
    } else if (value === "refused" || value === "refused by validator") {
      return (
        <td className="text-danger" style={{ fontWeight: "bold" }}>
          <IoCloseCircle style={{ marginRight: "10px" }} />
          {translate(value)}{" "}
        </td>
      );
    } else if (value === "cancellation refused") {
      //return(<td className="text-danger" style={{fontWeight:'bold'}}><IoCloseCircle style={{marginRight:"10px"}}/>{translate(value)} </td> );
      return (
        <td className="text-success" style={{ fontWeight: "bold" }}>
          <IoCheckmarkCircleSharp style={{ marginRight: "10px" }} />
          {translate("accepted")}{" "}
        </td>
      );
    } else if (value === "cancellation accepted") {
      //return(<td className="text-success" style={{fontWeight:'bold'}}><IoCheckmarkCircleSharp style={{marginRight:"10px"}}/>{translate(value)} </td> );
      return (
        <td className="text-danger" style={{ fontWeight: "bold" }}>
          <IoCloseCircle style={{ marginRight: "10px" }} />
          {translate("canceled")}{" "}
        </td>
      );
    } else {
      return (
        <td className="text-muted" style={{ fontWeight: "bold" }}>
          <IoPaperPlaneSharp style={{ marginRight: "10px" }} />
          {translate(value)}
          {"..."}{" "}
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
          {translate(value)}{" "}
        </span>
      );
    } else if (value === "accepted" || value === "accepted by validator") {
      return (
        <span
          className="text-success"
          style={{ fontSize: "18px", fontWeight: "bold" }}
        >
          <IoCheckmarkCircleSharp style={{ marginRight: "5px" }} />
          {translate(value)}{" "}
        </span>
      );
    } else if (value === "refused" || value === "refused by validator") {
      return (
        <span
          className="text-danger"
          style={{ fontSize: "18px", fontWeight: "bold" }}
        >
          <IoCloseCircle style={{ marginRight: "5px" }} />
          {translate(value)}{" "}
        </span>
      );
    } else if (value === "cancellation refused") {
      //return(<span className="text-danger" style={{fontSize:"18px",fontWeight:'bold'}}><IoCloseCircle style={{marginRight:"5px"}}/>{translate(value)} </span> );
      return (
        <span
          className="text-success"
          style={{ fontSize: "18px", fontWeight: "bold" }}
        >
          <IoCheckmarkCircleSharp style={{ marginRight: "5px" }} />
          {translate("accepted")}{" "}
        </span>
      );
    } else if (value === "cancellation accepted") {
      //return(<span className="text-success" style={{fontSize:"18px",fontWeight:'bold'}}><IoCheckmarkCircleSharp style={{marginRight:"5px"}}/>{translate(value)} </span> );
      return (
        <span
          className="text-danger"
          style={{ fontSize: "18px", fontWeight: "bold" }}
        >
          <IoCloseCircle style={{ marginRight: "5px" }} />
          {translate("canceled")}{" "}
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
          {"..."}{" "}
        </span>
      );
    }
  }

  openDetailsModel(row) {
    /* if(row.nameReq === "Paid Request"){
            if(sessionStorage.getItem('role')==="RH"){
                this.setState({ collabvalidator: this.state.collabDirecteur});
            }
            this.state.teamcollab.map(collab => {
                UnitService.checkvalidator(collab).then(res => {
                    if(res.data!=0 && collab.team==="admin RH" && sessionStorage.getItem('role')==="RH grp"){
                        this.setState({ collabvalidator: collab});
                    }else if(res.data!=0 && collab.team!="admin RH" && sessionStorage.getItem('role')!="RH grp" && sessionStorage.getItem('role')!="RH"){
                        this.setState({ collabvalidator: collab});
                    }
                })
            })
        }*/
    if (row.nameReq === "Paid Request") {
      this.setState({ collabvalidator: {} });
      UnitService.findvalidator(this.state.collabConnected).then((res) => {
        this.setState({ collabvalidator: res.data });
      });
    } else if (row.nameReq === "Unpaid Request") {
      if (row.statut === "Pending" || row.statut === "refused by validator") {
        this.setState({ collabvalidator: {} });
        UnitService.findvalidator(this.state.collabConnected).then((res) => {
          this.setState({ collabvalidator: res.data });
        });
      } else {
        this.setState({ collabvalidator: {} });
        UnitService.findvalidatorofunpaidvacation().then((res) => {
          this.setState({ collabvalidator: res.data });
        });
      }
    } else {
      this.setState({ collabvalidator: {} });
      UnitService.findvalidatorofunpaidvacation().then((res) => {
        this.setState({ collabvalidator: res.data });
      });
      //this.setState({ collabvalidator: {}});
    }

    this.setState({
      showDetailsModel: true,
      rowReq: row,
      rowcollab: row.collaborator,
      rowdaterequests: row.datesRequest,
    });
  }

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
          {this.state.paidRequest.length == 0 &&
          this.state.fetching === true ? (
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

  openSendCancelRequestModel(row) {
    this.setState({
      showSendCancelRequestModel: true,
      rowReq: row,
      rowcollab: row.collaborator,
      rowdaterequests: row.datesRequest,
    });
  }
  changeCancellationJustis = (index, event) => {
    var canceljustis = this.state.cancellationjustis.slice();
    canceljustis[index] = event.target.value;
    this.setState({ cancellationjustis: canceljustis });
  };

  //Last modification : filtred Table
  mycolumns = [
    {
      field: "requestDate",
      headerName: DatagridColumn[0],
      headerAlign: "center",
      width: 160,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "OFF" &&
        params.row.statut === "cancellation refused"
          ? "super-app-theme--cancellation-refused"
          : params.row.sendCancellationRequest === "OFF" &&
            params.row.statut === "cancellation accepted"
          ? "super-app-theme--cancellation-accepted"
          : null,
      renderCell: (params) => {
        return (
          <p
            style={{
              marginLeft: "20px",
              marginTop: "18px",
              fontSize: "17px",
              fontWeight: "bold",
            }}
          >
            {params.row.requestDate}
          </p>
        );
      },
    },

    {
      field: "nameReq",
      headerName: DatagridColumn[1],
      headerAlign: "center",
      width: 170,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "OFF" &&
        params.row.statut === "cancellation refused"
          ? "super-app-theme--cancellation-refused"
          : params.row.sendCancellationRequest === "OFF" &&
            params.row.statut === "cancellation accepted"
          ? "super-app-theme--cancellation-accepted"
          : null,
      renderCell: (params) => translate(params.row.nameReq),
    },

    {
      field: "statut",
      headerName: DatagridColumn[2],
      headerAlign: "center",
      width: 220,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "OFF" &&
        params.row.statut === "cancellation refused"
          ? "super-app-theme--cancellation-refused"
          : params.row.sendCancellationRequest === "OFF" &&
            params.row.statut === "cancellation accepted"
          ? "super-app-theme--cancellation-accepted"
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
      width: 150,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "OFF" &&
        params.row.statut === "cancellation refused"
          ? "super-app-theme--cancellation-refused"
          : params.row.sendCancellationRequest === "OFF" &&
            params.row.statut === "cancellation accepted"
          ? "super-app-theme--cancellation-accepted"
          : null,
      renderCell: (params) => translate(params.row.typeOfTime),
    },

    {
      field: "startDate",
      headerName: DatagridColumn[4],
      headerAlign: "center",
      width: 160,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "OFF" &&
        params.row.statut === "cancellation refused"
          ? "super-app-theme--cancellation-refused"
          : params.row.sendCancellationRequest === "OFF" &&
            params.row.statut === "cancellation accepted"
          ? "super-app-theme--cancellation-accepted"
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
      width: 160,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "OFF" &&
        params.row.statut === "cancellation refused"
          ? "super-app-theme--cancellation-refused"
          : params.row.sendCancellationRequest === "OFF" &&
            params.row.statut === "cancellation accepted"
          ? "super-app-theme--cancellation-accepted"
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
      sortable: true,
      width: 100,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "OFF" &&
        params.row.statut === "cancellation refused"
          ? "super-app-theme--cancellation-refused"
          : params.row.sendCancellationRequest === "OFF" &&
            params.row.statut === "cancellation accepted"
          ? "super-app-theme--cancellation-accepted"
          : null,
      renderCell: (params) => {
        return params.row.datesRequest.map((dates) => (
          <p
            key={dates.id}
            style={{ marginLeft: "20px", marginTop: "18px", fontSize: "17px" }}
          >
            {dates.duration}
          </p>
        ));
      },
      valueGetter: (params) =>
        params.row.datesRequest.map((dates) => dates.duration),
    },
    {
      field: "fridaysCount",
      headerName: DatagridColumn[13],
      headerAlign: "center",
      type: "number",
      sortable: true,
      hide: true,
      width: 210,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "OFF" &&
        params.row.statut === "cancellation refused"
          ? "super-app-theme--cancellation-refused"
          : params.row.sendCancellationRequest === "OFF" &&
            params.row.statut === "cancellation accepted"
          ? "super-app-theme--cancellation-accepted"
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
      headerName: DatagridColumn[14],
      headerAlign: "center",
      type: "number",
      sortable: true,
      hide: true,
      width: 200,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "OFF" &&
        params.row.statut === "cancellation refused"
          ? "super-app-theme--cancellation-refused"
          : params.row.sendCancellationRequest === "OFF" &&
            params.row.statut === "cancellation accepted"
          ? "super-app-theme--cancellation-accepted"
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
      headerName: DatagridColumn[15],
      headerAlign: "center",
      type: "number",
      sortable: true,
      hide: true,
      width: 200,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "OFF" &&
        params.row.statut === "cancellation refused"
          ? "super-app-theme--cancellation-refused"
          : params.row.sendCancellationRequest === "OFF" &&
            params.row.statut === "cancellation accepted"
          ? "super-app-theme--cancellation-accepted"
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
      headerName: DatagridColumn[16],
      headerAlign: "center",
      type: "string",
      sortable: true,
      hide: true,
      width: 160,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "OFF" &&
        params.row.statut === "cancellation refused"
          ? "super-app-theme--cancellation-refused"
          : params.row.sendCancellationRequest === "OFF" &&
            params.row.statut === "cancellation accepted"
          ? "super-app-theme--cancellation-accepted"
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
      field: "action",
      headerName: DatagridColumn[7],
      headerAlign: "center",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      filterable: false,
      disableExport: true,
      width: 130,
      cellClassName: (params) =>
        params.row.sendCancellationRequest === "OFF" &&
        params.row.statut === "cancellation refused"
          ? "super-app-theme--cancellation-refused"
          : params.row.sendCancellationRequest === "OFF" &&
            params.row.statut === "cancellation accepted"
          ? "super-app-theme--cancellation-accepted"
          : null,
      renderCell: (params) => {
        return (
          <React.Fragment>
            <LightTooltip
              title={translate("View my request details")}
              placement="top"
            >
              <Button
                className="showBtn"
                onClick={() => this.openDetailsModel(params.row)}
              >
                <IoEye style={{ fontSize: "27px", color: "#20B2AA" }} />
              </Button>
            </LightTooltip>
            {params.row.statut === "Pending" ? (
              <LightTooltip
                title={translate("Delete vacation request")}
                placement="top"
              >
                <Button
                  className="showBtn-delete"
                  onClick={() =>
                    this.deleteUser(params.row.id, params.row.nameReq)
                  }
                  disabled={this.state.loading}
                >
                  <IoTrashSharp id="trash-btn" />
                </Button>
              </LightTooltip>
            ) : null}
            {(params.row.statut === "accepted" ||
              params.row.statut === "Pending cancellation") &&
            params.row.sendCancellationRequest !== "OFF" ? (
              <LightTooltip
                title={translate("Send cancellation request")}
                placement="top"
              >
                <Button
                  style={{ marginLeft: "10px", border: "none" }}
                  onClick={() => this.openSendCancelRequestModel(params.row)}
                  disabled={
                    params.row.sendCancellationRequest === "ON" ? true : false
                  }
                >
                  <RiChatDeleteLine
                    style={{ fontSize: "25px", color: "#FF6347" }}
                  />{" "}
                </Button>
              </LightTooltip>
            ) : null}
          </React.Fragment>
        );
      },
    },
  ];

  //All history list
  allRequest() {
    var paidReq = Array.isArray(this.state.paidRequest)
      ? this.state.paidRequest.map((e) =>
          Object.assign(e, { nameReq: "Paid Request" })
        )
      : [];
    var unpaidReq = this.state.unPaidRequest.map((e) =>
      Object.assign(e, { nameReq: "Unpaid Request" })
    );
    var excpReq = this.state.exptionnel.map((e) =>
      Object.assign(e, { nameReq: "Exceptional Request" })
    );
    var recReq = this.state.RecoveryRequest.map((e) =>
      Object.assign(e, { nameReq: "Recovery Request" })
    );

    //console.log(paidReq);

    let allrequest = [...paidReq, ...unpaidReq, ...excpReq, ...recReq];

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
              "& .super-app-theme--cancellation-refused": {
                backgroundColor: "#FF634715",
              },
              "& .super-app-theme--cancellation-accepted": {
                backgroundColor: "#32CD3215",
              },
            }}
          >
            <DataGrid
              rows={allrequest.sort(function (a, b) {
                var c = new Date(a.requestDate);
                var d = new Date(b.requestDate);
                var idc = a.id;
                var idd = b.id;
                if (d.getTime() === c.getTime()) {
                  return idd - idc;
                }
                return d.getTime() - c.getTime();
              })} //.filter(allReq => allReq.collaborator.id===JSON.parse(sessionStorage.getItem('user')))}
              columns={this.mycolumns}
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
                const selectedRowData = allrequest.filter((row) =>
                  selectedIDs.has(row.id)
                );
                console.log(selectedRowData);
              }}
              //components={{ Toolbar: GridToolbar, LoadingOverlay:LinearProgress, Pagination:this.CustomPagination }}
              components={{
                Toolbar: ExcelExport,
                LoadingOverlay: LinearProgress,
                Pagination: this.CustomPagination,
                NoRowsOverlay: this.CustomNoRowsOverlay,
              }}
              loading={this.state.loading}
              sx={{
                fontSize: "17px",
                boxShadow: 1,
                width: "100%",
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

  changeSelect = (event) => {
    this.setState({ select: event.target.value });
  };
  list(a) {
    if (a === "paidrequest") {
      return this.lists();
    } else if (a === "unpaid") {
      return this.Unpaidlists();
    } else if (a === "recovery") {
      return this.Recoverylists();
    } else if (a === "exceptional") {
      return this.ExpionnelList();
    } else if (a === "allRequest") {
      return this.allRequest();
    }
  }
  transl(a) {
    return translate(a);
  }

  toAddHoliday = () => {
    this.setState({ showModal: true });
  };

  toMyRequest = () => {
    this.props.history.push("/admin/collaborator/MyRequest");
  };
  toAddTypeOfExceptionelVacation = () => {
    this.props.history.push("/admin/vacationrequest/Type");
  };
  updateState = () => {
    //this.componentDidMount();
    if (
      reactLocalStorage.getObject(
        "PaidRequestOfCollaborateurConnected" + sessionStorage.getItem("user")
      ).length == 0
    ) {
      PaidRequestService.getPaidRequestOfUser(
        parseInt(sessionStorage.getItem("user"))
      ).then((res) => {
        this.setState({ paidRequest: res.data });
        reactLocalStorage.setObject(
          "PaidRequestOfCollaborateurConnected" +
            sessionStorage.getItem("user"),
          res.data
        );
      });
    } else {
      this.setState({
        paidRequest: reactLocalStorage.getObject(
          "PaidRequestOfCollaborateurConnected" + sessionStorage.getItem("user")
        ),
      });
    }

    //get my unpaid request
    /*UnPaidRequestService.getUnPaidRequestOfUser(parseInt(sessionStorage.getItem('user'))).then(res=>{
            this.setState({unPaidRequest:res.data});
        })*/
    if (
      reactLocalStorage.getObject(
        "UnpaidRequestOfCollaborateurConnected" + sessionStorage.getItem("user")
      ).length == 0
    ) {
      UnPaidRequestService.getUnPaidRequestOfUser(
        parseInt(sessionStorage.getItem("user"))
      ).then((res) => {
        this.setState({ unPaidRequest: res.data });
        reactLocalStorage.setObject(
          "UnpaidRequestOfCollaborateurConnected" +
            sessionStorage.getItem("user"),
          res.data
        );
      });
    } else {
      this.setState({
        unPaidRequest: reactLocalStorage.getObject(
          "UnpaidRequestOfCollaborateurConnected" +
            sessionStorage.getItem("user")
        ),
      });
    }
    //////
  };
  render() {
    return (
      <div>
        {this.state.fetching && <Fetching />}
        <AddRequestModal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
          toMyRequest={this.toMyRequest}
          toAddTypeOfExceptionelVacation={this.toAddTypeOfExceptionelVacation}
          updateState={this.updateState}
          //collaborateur={this.state.collabConnected}
          paiedRequestOfCollaborateur={this.state.paidRequest}
          unpaiedRequestOfCollaborateur={this.state.unPaidRequest}
          exceptionnalRequestOfCollaborateur={this.state.exptionnel}
          recoveryRequestOfCollaborateur={this.state.RecoveryRequest}
          /***** */
          path="myrequest"
          //code separate traitment passe
        />

        <DetailsMyRequestModel
          show={this.state.showDetailsModel}
          onHide={() => this.setState({ showDetailsModel: false })}
          closeModel={() => this.setState({ showDetailsModel: false })}
          checkStatutModal={this.checkStatutModal}
          rowReq1={this.state.rowReq}
          rowcollab1={this.state.rowcollab}
          rowdaterequests1={this.state.rowdaterequests}
          rowvalidator={this.state.collabvalidator}
          //traitment affichage info of name of unit for details request of the collaborator
          rowunitname={this.state.unitname}
        />

        <SendCancelRequestModel
          show={this.state.showSendCancelRequestModel}
          onHide={() => this.setState({ showSendCancelRequestModel: false })}
          closeModel={() =>
            this.setState({ showSendCancelRequestModel: false })
          }
          rowReq1={this.state.rowReq}
          rowcollab1={this.state.rowcollab}
          rowdaterequests1={this.state.rowdaterequests}
          sendcancellationrequestmethod={this.SendCancellationRequestMethod}
          changecancellationjustification={this.changeCancellationJustis}
          sendcancellationunpaidrequestmethod={
            this.SendCancellationUnpaidRequestMethod
          }
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div></div>
          <Button
            className="btn btn-primary"
            onClick={() => this.toAddHoliday()}
          >
            <IoAddCircleSharp
              style={{ fontSize: "25px", marginRight: "6px" }}
            />
            {translate("addRrequest")}
          </Button>
        </div>
        {this.list(this.state.select)}
      </div>
    );
  }
}
export default myRequest;
