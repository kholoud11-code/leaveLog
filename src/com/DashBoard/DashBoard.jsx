import React, { Component } from "react";
import "./DashBoard.css";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line, Pie, PolarArea } from "react-chartjs-2";
//import Util from "month-utils";
import DashboardService from "../../servicees/DashboardService";
import { FaSpinner } from "react-icons/fa";
import PendingChartModal from "./PendingChartModal";
import BalanceConsumedModal from "./BalanceConsumedModal";
import Select from "react-select";
import { GoInfo } from "react-icons/go";
import { Spinner, Button, Modal, CardGroup, Card } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import { FaUserCircle } from "react-icons/fa";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { FaChartPie } from "react-icons/fa";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import { event } from "jquery";
import { Datepicker } from "@datepicker-react/styled";
//import Card from '@mui/joy/Card';
import BalanceConsumedHistoryService from "../../servicees/BalanceConsumedHistoryService";
import CollaborateurServices from "../../servicees/CollaborateurServices";
import ExcelExport from "../list/ExcelExport";
import ExcelExport1 from "../list/ExcelExport1";
import ExcelExport2 from "../list/ExcelExport2";
import ExcelExport3 from "../list/ExcelExport3";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  enUS,
  frFR,
  esES,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Fetching from "../list/Fetching";

const englishColumn = [
  "Number of vacation days consumed each month",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "Unit",
  "Balance",
  "Employee Id",
  "Last Name",
  "First Name",
  "Indicator 1",
  "Indicator 2",
  "Month",
  "Remaining Balance",
];
const frenchColumn = [
  "Nombre de jours de vacances consommés chaque mois",
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
  "Unité",
  "Solde",
  "Id d'Employé",
  "Nom",
  "Prénom",
  "Indicateur 1",
  "Indicateur 2",
  "Mois",
  "Solde Restant",
];
const spanishColumn = [
  "Número de días de vacaciones consumidos cada mes",
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
  "Unidad",
  "Saldo",
  "Id Empleado",
  "Apellidos",
  "Nombre",
  "Indicador 1",
  "Indicador 2",
  "Mes",
  "Solde Restant",
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

class DashBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      year: new Date().getFullYear(),
      selectedOption: null,
      yearOptionss: [],
      numberOfEmployes: 0,
      numberOfPendingRequets: 0,
      numberOfTotalPendingBalanceLastYear: 0,
      balance: 0,
      consumedBalance: 0,
      balancePercent: 0,
      numberOfPendingRequetsList: [],
      dataByMonth: [],
      BalanceConsumedHistoryOfAllMonth: [],
      modalShow: false,
      showBalanceModal: false,
      loading: true,
      loading1: true,
      loading2: true,
      loading3: true,
      fetching: true,
      CollaboratorsPendingBalance: [],
      TotalPendingBalanceForAllUnits: [],
      CollaboratorsIndicators: [],
      CollaboratorsAverageIndicatorByUnit: [],
      IndicatorsTimeMonthAndYear: {},
      currentDateMonthValue: 20,
      firstNextMonthValue: 20,
      secondNextMonthValue: 20,
      currentPendingToBeExpended: "",
      currentAccumulatedExpended: "",
      firstNextMonthAccumulatedExpended: "",
      secondNextMonthAccumulatedExpended: "",
    };

    this.getIndicatorsTimeMonthAndYear =
      this.getIndicatorsTimeMonthAndYear.bind(this);
  }
  componentDidMount() {
    this.getCollaboratorsPendingBalanceByYear(); //last year date used inside backend service process
    this.getTotalPendingBalanceForAllUnits(); //last year date used inside backend service process
    this.getIndicatorsForAllCollaborators();
    this.getCollaboratorsAverageIndicatorByUnit();
    this.getIndicatorsTimeMonthAndYear();
    this.getAllBalanceConsumedHistoryOptions();
    this.numberOfEmploye();
    this.getNumberOfTotalPendingBalanceLastYear();
    this.numberOfPendingRequet();
    //this.numberOfPendingRequetList();
    this.numberOfBalance();
    this.getTotalBalanceConsumedOfAllMonthByYear(new Date().getFullYear());
    //this.getMonthsByYears(this.state.year);
    this.getBalanceConsumedHistoryOfAllMonthByYear(this.state.year);
    const defaultYear = new Date().getFullYear();
    this.handleYearChangee({ value: defaultYear, label: String(defaultYear) });
    this.updateBalancePercent();
    setTimeout(() => {
      this.setState({ loading: false, loading1: false });
    }, 5000);
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.balance !== this.state.balance ||
      prevState.consumedBalance !== this.state.consumedBalance
    ) {
      this.updateBalancePercent();
    }
  }

  updateBalancePercent = () => {
    const { balance, consumedBalance } = this.state;
    const balancePercent =
      balance > 0 ? (consumedBalance / (balance + consumedBalance)) * 100 : 0;
    this.setState({ balancePercent });
  };
  handleYearChangee = (option) => {
    console.log(`Year changed to: ${option.value}`);
    this.setState({ selectedOption: option, year: option.value }, () => {
      //this.getMonthsByYears(option.value);
      this.getBalanceConsumedHistoryOfAllMonthByYear(option.value);
    });
  };
  getCollaboratorsPendingBalanceByYear() {
    CollaborateurServices.getCollaboratorsPendingBalanceByYear().then((res) => {
      this.setState({ CollaboratorsPendingBalance: res.data });
    });
  }
  getTotalPendingBalanceForAllUnits() {
    CollaborateurServices.getTotalPendingBalanceForAllUnits().then((res) => {
      this.setState({ TotalPendingBalanceForAllUnits: res.data });
    });
  }
  getIndicatorsForAllCollaborators() {
    CollaborateurServices.getIndicatorsForAllCollaborators().then((res) => {
      this.setState({
        CollaboratorsIndicators: res.data,
        loading2: false,
      });
    });
  }
  getCollaboratorsAverageIndicatorByUnit() {
    CollaborateurServices.getCollaboratorsAverageIndicatorByUnit().then(
      (res) => {
        this.setState({
          CollaboratorsAverageIndicatorByUnit: res.data,
          loading3: false,
          fetching: false,
        });
      }
    );
  }
  getIndicatorsTimeMonthAndYear = () => {
    CollaborateurServices.getIndicatorsTimeMonthAndYear().then((res) => {
      this.setState({
        IndicatorsTimeMonthAndYear: res.data,
        currentDateMonthValue: res.data.currentDateMonthValue,
        firstNextMonthValue: res.data.firstNextMonthValue,
        secondNextMonthValue: res.data.secondNextMonthValue,
        currentPendingToBeExpended: res.data.currentPendingToBeExpended,
        currentAccumulatedExpended: res.data.currentAccumulatedExpended,
        firstNextMonthAccumulatedExpended:
          res.data.firstNextMonthAccumulatedExpended,
        secondNextMonthAccumulatedExpended:
          res.data.secondNextMonthAccumulatedExpended,
      });
    });
  };
  getAllBalanceConsumedHistoryOptions() {
    BalanceConsumedHistoryService.getAllBalanceConsumedHistory().then((res) => {
      this.setState({
        yearOptionss: res.data.map((value) => {
          return {
            value: value.year,
            label: value.year,
          };
        }),
      });
    });
  }
  numberOfEmploye() {
    DashboardService.getNumberOfEmployes()
      .then((response) => {
        this.setState({ numberOfEmployes: response.data });
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération du nombre de collaborateurs",
          error
        );
      });
  }
  getNumberOfTotalPendingBalanceLastYear() {
    DashboardService.getTotalCountOfPendingBalanceOfLastYearForAllUnits()
      .then((res) => {
        this.setState({ numberOfTotalPendingBalanceLastYear: res.data });
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération du nombre de total pending balance of last year for all units",
          error
        );
      });
  }
  numberOfBalance() {
    DashboardService.getTotalBalanceOfAllCollaborators()
      .then((res) => {
        this.setState({ balance: res.data });
      })
      .catch((error) => {
        console.error("Erreur in balance", error);
      });
  }
  getTotalBalanceConsumedOfAllMonthByYear(year) {
    BalanceConsumedHistoryService.getTotalBalanceConsumedOfAllMonthByYear(year)
      .then((res) => {
        console.log("total balance consumed :" + res.data);
        this.setState({ consumedBalance: res.data });
      })
      .catch((error) => {
        console.error("Erreur in consumed Balance", error);
      });
  }
  numberOfPendingRequet() {
    DashboardService.getNumberOfAllPendingPaidRequests()
      .then((response) => {
        this.setState({ numberOfPendingRequets: response.data });
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération du nombre de Pending Requests:",
          error
        );
      });
  }
  numberOfPendingRequetList() {
    DashboardService.getNumberOfPendingRequestsList()
      .then((response) => {
        this.setState({ numberOfPendingRequetsList: response.data });
      })
      .catch((error) => {
        console.error("Error in numberOfPendingRequetList()", error);
      });
  }
  getMonthsByYears(year) {
    DashboardService.getMonthsByYears(year)
      .then((response) => {
        this.setState({ dataByMonth: response.data });
      })
      .catch((error) => {
        console.error("Error in getMonthsByYears(year)", error);
      });
  }

  /**** */
  getBalanceConsumedHistoryOfAllMonthByYear(year) {
    BalanceConsumedHistoryService.getBalanceConsumedHistoryOfAllMonthByYear(
      year
    )
      .then((res) => {
        this.setState({ BalanceConsumedHistoryOfAllMonth: res.data });
      })
      .catch((error) => {
        console.error("Error in getMonthsByYears(year)", error);
      });
  }
  /**** */

  handleYearChange = (event) => {
    const newYear = parseInt(event.target.value, 10);
    console.log(`Year changed to: ${newYear}`);
    this.setState({ year: newYear }, () => {
      this.getMonthsByYears(newYear);
      console.log(`Data fetching initiated for the year: ${newYear}`);
    });
  };
  getcurrentyear = () => {
    var current_date = new Date();
    return current_date.getFullYear();
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
          {this.state.loading === true &&
          this.state.TotalPendingBalanceForAllUnits.length === 0 ? (
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
  CustomNoRowsOverlay1 = () => {
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
          {this.state.CollaboratorsPendingBalance.length === 0 &&
          this.state.loading1 === true ? (
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

  CustomNoRowsOverlay2 = () => {
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
          {this.state.CollaboratorsIndicators.length === 0 &&
          this.state.loading2 === true ? (
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

  CustomNoRowsOverlay3 = () => {
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
          {this.state.CollaboratorsAverageIndicatorByUnit.length === 0 &&
          this.state.loading3 === true ? (
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

  TotalBalanceByProjectColumns = [
    {
      field: "NameUnit",
      headerName: DatagridColumn[13],
      type: "string",
      headerAlign: "center",
      width: 300,
      renderCell: (params) => {
        return (
          <p
            style={{
              //marginLeft: "60px",
              //marginTop: "18px",
              margin: "18px auto",
              textAlign: "center",
              fontSize: "17px",
              fontWeight: "bold",
              color: "rgb(49, 116, 173)",
            }}
          >
            {params.row.nameUnit}
          </p>
        );
      },
      valueGetter: (params) => params.row.nameUnit,
    },
    {
      field: "cumulativeBances",
      //headerName: DatagridColumn[5],
      headerName: DatagridColumn[14] + ` ${this.getcurrentyear() - 1}`,
      type: "number",
      headerAlign: "center",
      //width: 150,
      width: 260,
      renderCell: (params) => {
        return (
          <p
            style={{
              //paddingLeft: "20px",
              //paddingTop: "18px",
              fontSize: "17px",
              //paddingRight: "20px",
              margin: "18px auto",
            }}
          >
            {params.row.totalBalance}
          </p>
        );
      },
      valueGetter: (params) => params.row.totalBalance,
    },
  ];

  UserBalanceDetailsColumns = [
    {
      field: "cin",
      headerName: DatagridColumn[15],
      headerAlign: "center",
      width: 160,
      renderCell: (params) => {
        return (
          <p
            style={{ marginLeft: "30px", marginTop: "18px", fontSize: "17px" }}
          >
            {params.row.cin}
          </p>
        );
      },
      valueGetter: (params) => params.row.cin,
    },
    {
      field: "lastname",
      headerName: DatagridColumn[16],
      headerAlign: "center",
      width: 160,
      renderCell: (params) => {
        return (
          <p
            style={{ marginLeft: "30px", marginTop: "18px", fontSize: "17px" }}
          >
            {params.row.lastname}
          </p>
        );
      },
      valueGetter: (params) => params.row.lastname,
    },
    {
      field: "firstname",
      headerName: DatagridColumn[17],
      headerAlign: "center",
      width: 160,
      renderCell: (params) => {
        return (
          <p
            style={{ marginLeft: "30px", marginTop: "18px", fontSize: "17px" }}
          >
            {params.row.firstname}
          </p>
        );
      },
      valueGetter: (params) => params.row.firstname,
    },
    {
      field: "NameUnit",
      headerName: DatagridColumn[13],
      type: "string",
      headerAlign: "center",
      width: 160,
      renderCell: (params) => {
        return (
          <p
            style={{
              marginLeft: "30px",
              marginTop: "18px",
              fontSize: "17px",
              fontWeight: "bold",
              color: "rgb(49, 116, 173)",
            }}
          >
            {params.row.nameUnit}
          </p>
        );
      },
      valueGetter: (params) => params.row.nameUnit,
    },
    {
      field: "cumulativeBances",
      //headerName: DatagridColumn[5],
      headerName: DatagridColumn[14] + ` ${this.getcurrentyear() - 1}`,
      type: "number",
      headerAlign: "center",
      //width: 150,
      width: 150,
      renderCell: (params) => {
        return (
          <p
            style={{
              paddingLeft: "20px",
              paddingTop: "18px",
              fontSize: "17px",
              paddingRight: "20px",
            }}
          >
            {params.row.balance}
          </p>
        );
      },
      valueGetter: (params) => params.row.balance,
    },
  ];

  render() {
    const UserIndicatorsDetailsColumns = [
      {
        field: "cin",
        headerName: DatagridColumn[15],
        headerAlign: "center",
        width: 170,
        renderCell: (params) => {
          return (
            <p
              style={{
                marginLeft: "30px",
                marginTop: "18px",
                fontSize: "17px",
              }}
            >
              {params.row.cin}
            </p>
          );
        },
        valueGetter: (params) => params.row.cin,
      },
      {
        field: "lastname",
        headerName: DatagridColumn[16],
        headerAlign: "center",
        width: 170,
        renderCell: (params) => {
          return (
            <p
              style={{
                marginLeft: "30px",
                marginTop: "18px",
                fontSize: "17px",
              }}
            >
              {params.row.lastname}
            </p>
          );
        },
        valueGetter: (params) => params.row.lastname,
      },
      {
        field: "firstname",
        headerName: DatagridColumn[17],
        headerAlign: "center",
        width: 170,
        renderCell: (params) => {
          return (
            <p
              style={{
                marginLeft: "30px",
                marginTop: "18px",
                fontSize: "17px",
              }}
            >
              {params.row.firstname}
            </p>
          );
        },
        valueGetter: (params) => params.row.firstname,
      },
      {
        field: "NameUnit",
        headerName: DatagridColumn[13],
        type: "string",
        headerAlign: "center",
        width: 200,
        renderCell: (params) => {
          return (
            <p
              style={{
                marginLeft: "30px",
                marginTop: "18px",
                fontSize: "17px",
                fontWeight: "bold",
                color: "rgb(49, 116, 173)",
              }}
            >
              {params.row.nameUnit}
            </p>
          );
        },
        valueGetter: (params) => params.row.nameUnit,
      },
      {
        field: "remainingBalance",
        //headerName: DatagridColumn[5],
        headerName: DatagridColumn[21],
        type: "number",
        headerAlign: "center",
        //width: 150,
        width: 200,
        renderCell: (params) => {
          return (
            <p
              style={{
                paddingLeft: "20px",
                paddingTop: "18px",
                fontSize: "17px",
                paddingRight: "20px",
              }}
            >
              {params.row.balance}
            </p>
          );
        },
        valueGetter: (params) => params.row.balance,
      },
      {
        field: "firstIndicator",
        //headerName: DatagridColumn[5],
        headerName:
          DatagridColumn[18] +
          " " +
          DatagridColumn[this.state.currentDateMonthValue] +
          " " +
          this.state.currentPendingToBeExpended,
        type: "number",
        headerAlign: "center",
        //width: 150,
        width: 300,
        renderCell: (params) => {
          return (
            <p
              style={{
                paddingLeft: "20px",
                paddingTop: "18px",
                fontSize: "17px",
                paddingRight: "20px",
              }}
            >
              {params.row.firstIndicator}
            </p>
          );
        },
        valueGetter: (params) => params.row.firstIndicator,
      },
      {
        field: "secondIndicatorFirstNextMonth",
        //headerName: DatagridColumn[5],
        headerName:
          DatagridColumn[19] +
          " " +
          DatagridColumn[this.state.currentDateMonthValue] +
          " " +
          this.state.currentAccumulatedExpended,
        type: "number",
        headerAlign: "center",
        //width: 150,
        width: 300,
        renderCell: (params) => {
          return (
            <p
              style={{
                paddingLeft: "20px",
                paddingTop: "18px",
                fontSize: "17px",
                paddingRight: "20px",
              }}
            >
              {params.row.secondIndicatorFirstNextMonth}
            </p>
          );
        },
        valueGetter: (params) => params.row.secondIndicatorFirstNextMonth,
      },
      {
        field: "secondIndicatorSecondNextMonth",
        //headerName: DatagridColumn[5],
        headerName:
          DatagridColumn[19] +
          " " +
          DatagridColumn[this.state.firstNextMonthValue] +
          " " +
          this.state.firstNextMonthAccumulatedExpended,
        type: "number",
        headerAlign: "center",
        //width: 150,
        width: 300,
        renderCell: (params) => {
          return (
            <p
              style={{
                paddingLeft: "20px",
                paddingTop: "18px",
                fontSize: "17px",
                paddingRight: "20px",
              }}
            >
              {params.row.secondIndicatorSecondNextMonth}
            </p>
          );
        },
        valueGetter: (params) => params.row.secondIndicatorSecondNextMonth,
      },
      {
        field: "secondIndicatorThirdNextMonth",
        //headerName: DatagridColumn[5],
        headerName:
          DatagridColumn[19] +
          " " +
          DatagridColumn[this.state.secondNextMonthValue] +
          " " +
          this.state.secondNextMonthAccumulatedExpended,
        type: "number",
        headerAlign: "center",
        //width: 150,
        width: 300,
        renderCell: (params) => {
          return (
            <p
              style={{
                paddingLeft: "20px",
                paddingTop: "18px",
                fontSize: "17px",
                paddingRight: "20px",
              }}
            >
              {params.row.secondIndicatorThirdNextMonth}
            </p>
          );
        },
        valueGetter: (params) => params.row.secondIndicatorThirdNextMonth,
      },
    ];

    const AverageIndicatorsByUnitColumns = [
      {
        field: "NameUnit",
        headerName: DatagridColumn[13],
        type: "string",
        headerAlign: "center",
        width: 260,
        renderCell: (params) => {
          return (
            <p
              style={{
                //marginLeft: "60px",
                //marginTop: "18px",
                margin: "18px auto",
                textAlign: "center",
                fontSize: "17px",
                fontWeight: "bold",
                color: "rgb(49, 116, 173)",
              }}
            >
              {params.row.nameUnit}
            </p>
          );
        },
        valueGetter: (params) => params.row.nameUnit,
      },
      {
        field: "averageFirstIndicator",
        //headerName: DatagridColumn[5],
        headerName:
          DatagridColumn[18] +
          " " +
          DatagridColumn[this.state.currentDateMonthValue] +
          " " +
          this.state.currentPendingToBeExpended,
        type: "number",
        headerAlign: "center",
        //width: 150,
        width: 300,
        renderCell: (params) => {
          return (
            <p
              style={{
                //paddingLeft: "20px",
                //paddingTop: "18px",
                fontSize: "17px",
                //paddingRight: "20px",
                margin: "18px auto",
              }}
            >
              {params.row.averageFirstIndicator}
            </p>
          );
        },
        valueGetter: (params) => params.row.averageFirstIndicator,
      },
    ];

    const MONTHS = [
      DatagridColumn[1],
      DatagridColumn[2],
      DatagridColumn[3],
      DatagridColumn[4],
      DatagridColumn[5],
      DatagridColumn[6],
      DatagridColumn[7],
      DatagridColumn[8],
      DatagridColumn[9],
      DatagridColumn[10],
      DatagridColumn[11],
      DatagridColumn[12],
    ];
    const COLORS = [
      "rgb(30, 50, 123)",
      "rgb(33, 55, 128)", // Start color
      "rgb(38, 60, 133)",
      "rgb(43, 65, 138)",
      "rgb(48, 70, 143)",
      "rgb(53, 75, 148)",
      "rgb(58, 80, 153)",
      "rgb(63, 85, 158)",
      "rgb(68, 90, 163)",
      "rgb(73, 95, 168)",
      "rgb(78, 100, 173)",
      "rgb(88, 118, 170)", // End color
    ];
    const { selectedOption, yearOptionss } = this.state;
    return (
      <React.Fragment>
        <div className="App">
          {this.state.fetching ? <Fetching /> : null}
          <div className="StatisCard">
            <div style={{ display: "block", padding: "0 20px" }}>
              <Card sx={{ width: 320 }}>
                <Card.Body orientation="horizontal">
                  <div className="collaboratorbox">
                    <div className="collaboratorStat">
                      <h4
                        style={{
                          marginTop: "0px",
                          marginRight: "5px",
                          marginBottom: 0,
                          color: "rgb(49, 116, 173)",
                          display: "inline-block",
                          fontWeight: "bold",
                        }}
                      >
                        {translate("Collaborator")}
                      </h4>
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          margin: 0,
                        }}
                      >
                        {this.state.numberOfEmployes}
                      </p>
                    </div>
                    <div
                      style={{
                        width: "48%",
                        height: "50%",
                      }}
                    >
                      <PeopleAltIcon
                        style={{
                          fontSize: "50px",
                          color: "rgb(49, 116, 173)",
                          marginBottom: "5px",
                          marginTop: "5px",
                          marginLeft: "60%",
                        }}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>

            <div style={{ display: "block", padding: "0 20px" }}>
              <Card sx={{ width: 320 }}>
                <Card.Body orientation="horizontal">
                  <div className="pendingRequestBox">
                    <div className="pendingRequestStat">
                      <h4
                        style={{
                          marginTop: "0px",
                          marginRight: "5px",
                          marginBottom: 0,
                          color: "rgb(49, 116, 173)",
                          display: "inline-block",
                          fontWeight: "bold",
                        }}
                      >
                        {translate("Pending Request")}
                      </h4>
                      <div style={{ marginLeft: "35px" }}>
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "18px",
                            margin: 0,
                          }}
                        >
                          {this.state.numberOfPendingRequets}

                          <LightTooltip
                            title={translate("Show pending request details")}
                            placement="bottom"
                          >
                            <IconButton
                              className="btn btn-onfo"
                              onClick={() => this.setState({ modalShow: true })}
                            >
                              <GoInfo
                                style={{
                                  fontSize: "25px",
                                  color: "rgb(49, 116, 173)",
                                }}
                              />
                            </IconButton>
                          </LightTooltip>

                          <PendingChartModal
                            show={this.state.modalShow}
                            onHide={() => this.setState({ modalShow: false })}
                            closeModel={() =>
                              this.setState({ modalShow: false })
                            }
                          />
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        width: "48%",
                        height: "50%",
                      }}
                    >
                      <PendingActionsIcon
                        style={{
                          fontSize: "50px",
                          //color: "#20B2AA",
                          color: "rgb(49, 116, 173)",
                          marginBottom: "5px",
                          marginTop: "5px",
                          marginLeft: "60%",
                          //marginLeft: "10px",
                        }}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>

            <div style={{ display: "block", padding: "0 20px" }}>
              <Card sx={{ width: 320 }}>
                <Card.Body orientation="horizontal">
                  <div className="totalDaysConsumedBox">
                    <div className="totalDaysConsumedStat">
                      <h4
                        style={{
                          marginTop: "0px",
                          marginRight: "5px",
                          marginBottom: 0,
                          color: "rgb(49, 116, 173)",
                          display: "inline-block",
                          fontWeight: "bold",
                        }}
                      >
                        {translate("Total Days Consumed")}
                      </h4>
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          margin: 0,
                          marginLeft: "35px",
                        }}
                      >
                        {this.state.balancePercent.toFixed(2)}%
                        <LightTooltip
                          title={translate("Show total days consumed details")}
                          placement="bottom"
                        >
                          <IconButton
                            className="btn btn-info"
                            onClick={() =>
                              this.setState({ showBalanceModal: true })
                            }
                          >
                            <GoInfo
                              style={{
                                fontSize: "25px",
                                color: "rgb(49, 116, 173)",
                              }}
                            />
                          </IconButton>
                        </LightTooltip>
                        <BalanceConsumedModal
                          show={this.state.showBalanceModal}
                          onHide={() =>
                            this.setState({ showBalanceModal: false })
                          }
                          closeModel={() =>
                            this.setState({ showBalanceModal: false })
                          }
                        />
                      </p>
                    </div>
                    <div style={{ width: "48%", height: "50%" }}>
                      <FaChartPie
                        style={{
                          fontSize: "50px",
                          //color: "#20B2AA",
                          color: "rgb(49, 116, 173)",
                          marginBottom: "10px",
                          marginTop: "5px",
                          marginLeft: "60%",
                        }}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>

            <div style={{ display: "block", padding: "0 20px" }}>
              <Card sx={{ width: 320 }}>
                <Card.Body orientation="horizontal">
                  <div className="totalPendingBalanceBox">
                    <div className="totalPendingBalanceStat">
                      <h4
                        style={{
                          marginTop: "0px",
                          marginRight: "5px",
                          marginBottom: 0,
                          color: "rgb(49, 116, 173)",
                          display: "inline-block",
                          fontWeight: "bold",
                        }}
                      >
                        {translate("Total balance")} {this.getcurrentyear() - 1}
                      </h4>
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "18px",
                          margin: 0,
                        }}
                      >
                        {this.state.numberOfTotalPendingBalanceLastYear}
                      </p>
                    </div>
                    <div
                      style={{
                        width: "48%",
                        height: "50%",
                      }}
                    >
                      {this.state.numberOfTotalPendingBalanceLastYear != 0 ? (
                        <HourglassTopIcon
                          style={{
                            fontSize: "50px",
                            color: "rgb(49, 116, 173)",
                            marginBottom: "5px",
                            marginTop: "5px",
                            marginLeft: "60%",
                          }}
                        />
                      ) : (
                        <HourglassBottomIcon
                          style={{
                            fontSize: "50px",
                            color: "rgb(49, 116, 173)",
                            marginBottom: "5px",
                            marginTop: "5px",
                            marginLeft: "60%",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
          <div className="dataCard revenueCard">
            <div>
              <Select
                value={selectedOption}
                onChange={this.handleYearChangee}
                options={yearOptionss}
                className="select"
              />
              <Bar
                data={{
                  labels: MONTHS,
                  datasets: [
                    {
                      label: DatagridColumn[0],
                      data: this.state.BalanceConsumedHistoryOfAllMonth,
                      backgroundColor: COLORS,
                      borderRadius: 0,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    title: {
                      text: "Revenue Source",
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="dataCard totalBalanceByProjectCard">
            <div>
              <h4
                style={{
                  //marginTop: "0px",
                  //marginRight: "5px",
                  //marginBottom: 0,
                  margin: 5,
                  color: "rgb(49, 116, 173)",
                  //display: "inline-block",
                  fontWeight: "bold",
                }}
              >
                {translate("Remaining balance of")} {this.getcurrentyear() - 1}{" "}
                {translate("per unit")}
              </h4>
              <Box sx={{ height: 550, width: "100%", overflow: "hidden" }}>
                <DataGrid
                  rows={this.state.TotalPendingBalanceForAllUnits}
                  columns={this.TotalBalanceByProjectColumns}
                  autoPageSize
                  rowsPerPageOptions={[10]}
                  onSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const selectedRowData =
                      this.state.TotalPendingBalanceForAllUnits.filter((row) =>
                        selectedIDs.has(row.id)
                      );
                    console.log(selectedRowData);
                  }}
                  experimentalFeatures={{ newEditingApi: true }}
                  sx={{
                    fontSize: "17px",
                    boxShadow: 1,
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                      fontWeight: "bold",
                    },
                    "& .MuiDataGrid-toolbarContainer": {
                      overflow: "auto",
                    },
                  }}
                  localeText={
                    sessionStorage.getItem("lang") === "Fr"
                      ? frFR.components.MuiDataGrid.defaultProps.localeText
                      : sessionStorage.getItem("lang") === "Sp"
                      ? esES.components.MuiDataGrid.defaultProps.localeText
                      : enUS.components.MuiDataGrid.defaultProps.localeText
                  }
                  loading={this.state.loading}
                  components={{
                    Toolbar: ExcelExport1,
                    LoadingOverlay: LinearProgress,
                    Pagination: this.CustomPagination,
                    NoRowsOverlay: this.CustomNoRowsOverlay,
                  }}
                />
              </Box>
            </div>
          </div>
          <div className="dataCard userBalanceDetailsCard">
            <div>
              <h4
                style={{
                  //marginTop: "0px",
                  //marginRight: "5px",
                  //marginBottom: 0,
                  margin: 5,
                  color: "rgb(49, 116, 173)",
                  //display: "inline-block",
                  fontWeight: "bold",
                }}
              >
                {translate("Details of the remaining balance of")}{" "}
                {this.getcurrentyear() - 1}
              </h4>
              <Box sx={{ height: 550, width: "100%", overflow: "hidden" }}>
                <DataGrid
                  rows={this.state.CollaboratorsPendingBalance}
                  columns={this.UserBalanceDetailsColumns}
                  autoPageSize
                  rowsPerPageOptions={[10]}
                  onSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const selectedRowData =
                      this.state.CollaboratorsPendingBalance.filter((row) =>
                        selectedIDs.has(row.id)
                      );
                    console.log(selectedRowData);
                  }}
                  experimentalFeatures={{ newEditingApi: true }}
                  sx={{
                    fontSize: "17px",
                    boxShadow: 1,
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                      fontWeight: "bold",
                    },
                    "& .MuiDataGrid-toolbarContainer": {
                      overflow: "auto",
                    },
                  }}
                  localeText={
                    sessionStorage.getItem("lang") === "Fr"
                      ? frFR.components.MuiDataGrid.defaultProps.localeText
                      : sessionStorage.getItem("lang") === "Sp"
                      ? esES.components.MuiDataGrid.defaultProps.localeText
                      : enUS.components.MuiDataGrid.defaultProps.localeText
                  }
                  loading={this.state.loading1}
                  components={{
                    Toolbar: ExcelExport,
                    LoadingOverlay: LinearProgress,
                    Pagination: this.CustomPagination,
                    NoRowsOverlay: this.CustomNoRowsOverlay1,
                  }}
                />
              </Box>
            </div>
          </div>
          {/* */}
          <div className="dataCard IndicatorsByProjectCard">
            <div>
              <h4
                style={{
                  //marginTop: "0px",
                  //marginRight: "5px",
                  //marginBottom: 0,
                  margin: 5,
                  color: "rgb(49, 116, 173)",
                  //display: "inline-block",
                  fontWeight: "bold",
                }}
              >
                {translate("Indicators of")} {this.getcurrentyear()}{" "}
                {translate("per unit")}
              </h4>
              <Box sx={{ height: 550, width: "100%", overflow: "hidden" }}>
                <DataGrid
                  rows={this.state.CollaboratorsAverageIndicatorByUnit}
                  columns={AverageIndicatorsByUnitColumns}
                  autoPageSize
                  rowsPerPageOptions={[10]}
                  onSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const selectedRowData =
                      this.state.CollaboratorsAverageIndicatorByUnit.filter(
                        (row) => selectedIDs.has(row.id)
                      );
                    console.log(selectedRowData);
                  }}
                  experimentalFeatures={{ newEditingApi: true }}
                  sx={{
                    fontSize: "17px",
                    boxShadow: 1,
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                      fontWeight: "bold",
                    },
                    "& .MuiDataGrid-toolbarContainer": {
                      overflow: "auto",
                    },
                  }}
                  localeText={
                    sessionStorage.getItem("lang") === "Fr"
                      ? frFR.components.MuiDataGrid.defaultProps.localeText
                      : sessionStorage.getItem("lang") === "Sp"
                      ? esES.components.MuiDataGrid.defaultProps.localeText
                      : enUS.components.MuiDataGrid.defaultProps.localeText
                  }
                  loading={this.state.loading3}
                  components={{
                    Toolbar: ExcelExport3,
                    LoadingOverlay: LinearProgress,
                    Pagination: this.CustomPagination,
                    NoRowsOverlay: this.CustomNoRowsOverlay3,
                  }}
                />
              </Box>
            </div>
          </div>
          <div className="dataCard userIndicatorsDetailsCard">
            <div>
              <h4
                style={{
                  //marginTop: "0px",
                  //marginRight: "5px",
                  //marginBottom: 0,
                  margin: 5,
                  color: "rgb(49, 116, 173)",
                  //display: "inline-block",
                  fontWeight: "bold",
                }}
              >
                {translate("Details of the indicators of")}{" "}
                {this.getcurrentyear()}
              </h4>
              <Box sx={{ height: 550, width: "100%", overflow: "hidden" }}>
                <DataGrid
                  rows={this.state.CollaboratorsIndicators}
                  columns={UserIndicatorsDetailsColumns}
                  autoPageSize
                  rowsPerPageOptions={[10]}
                  onSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const selectedRowData =
                      this.state.CollaboratorsIndicators.filter((row) =>
                        selectedIDs.has(row.id)
                      );
                    console.log(selectedRowData);
                  }}
                  experimentalFeatures={{ newEditingApi: true }}
                  sx={{
                    fontSize: "17px",
                    boxShadow: 1,
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                      fontWeight: "bold",
                    },
                    "& .MuiDataGrid-toolbarContainer": {
                      overflow: "auto",
                    },
                  }}
                  localeText={
                    sessionStorage.getItem("lang") === "Fr"
                      ? frFR.components.MuiDataGrid.defaultProps.localeText
                      : sessionStorage.getItem("lang") === "Sp"
                      ? esES.components.MuiDataGrid.defaultProps.localeText
                      : enUS.components.MuiDataGrid.defaultProps.localeText
                  }
                  loading={this.state.loading2}
                  components={{
                    Toolbar: ExcelExport2,
                    LoadingOverlay: LinearProgress,
                    Pagination: this.CustomPagination,
                    NoRowsOverlay: this.CustomNoRowsOverlay2,
                  }}
                />
              </Box>
            </div>
          </div>
          {/* */}
        </div>
      </React.Fragment>
    );
  }
}
export default DashBoard;
