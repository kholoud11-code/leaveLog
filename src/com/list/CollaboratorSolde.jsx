import React, { Component } from "react";
import UnitService from "../../servicees/UnitService";
import "../css/list.css";
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import { FormattedMessage } from "react-intl";
import collaboratorService from "../../servicees/CollaborateurServices";
import Fetching from "./Fetching";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { BsSearch } from "react-icons/bs";
import PaidRequestService from "../../servicees/PaidRequestService";
import ExcelExport from "./ExcelExport";
import Box from "@mui/material/Box";
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
//code changes in balance action treatment
import BasicModal from "components/BasicModal";
import { FaClipboardList } from "react-icons/fa";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const englishColumn = [
  "Employee Id",
  "First Name",
  "Last Name",
  "Contract Balance",
  "Annual Balance",
  "Cumulative Balance",
  "Remaining Balance",
  "Balance of pending requests",
  "Validator",
  "Unit",
  "Spent vacation",
];
const frenchColumn = [
  "Id d'Employé",
  "Prénom",
  "Nom",
  "Solde du contrat",
  "Solde annuel",
  "Solde cumulé",
  "Solde Restant",
  "Solde des demandes en attente",
  "Validateur",
  "Unité",
  "Vacances passées",
];
const spanishColumn = [
  "Id Empleado",
  "Nombre",
  "Apellidos",
  "Saldo del contrato",
  "Balance anual",
  "Saldo acumulado",
  "Solde Restant",
  "Saldo de solicitudes pendientes",
  "Validador",
  "Unidad",
  "vacaciones pasadas",
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#5876AA", //theme.palette.info.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 17,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
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

//show to validator his collaborators solde
class CollaboratorSolde extends Component {
  constructor(props) {
    super(props);

    this.validatorRef = React.createRef();
    this.state = {
      //add historic
      //code changes in balance action treatment
      open: false,
      employee: null,
      collaborator: [],
      allcollaborator: [],
      PaidRequest: [],
      BackUpcollaborator: [],
      AllIdCollaborator: [],
      Unit: [],
      validator: "",
      fetching: true,
      //
      loading: true,
      allUnit: [],
      conRh: false,
    };

    (this.calculeCumulativeBalance = this.calculeCumulativeBalance.bind(this)),
      (this.findTotalBalance = this.findTotalBalance.bind(this));
    this.Rimmmingbalanc = this.Rimmmingbalanc.bind(this);
    // this.findValidator=this.findValidator.bind(this)
  }

  //get info of his collaborators
  componentDidMount() {
    if (sessionStorage.getItem("role") === "RH") {
      collaboratorService.getUser().then((res) => {
        this.setState({
          allcollaborator: res.data,
          BackUpcollaborator: res.data,
          fetching: false,
        });
      });
      this.setState({ conRh: true });
      UnitService.getunit().then((res) => {
        this.setState({ allUnit: res.data });
      });
      PaidRequestService.getPaidRequest().then((req) => {
        this.setState({ PaidRequest: req.data });
      });
    } else {
      UnitService.collaborators(parseInt(sessionStorage.getItem("user"))).then(
        (res) => {
          this.setState({
            allcollaborator: res.data,
            BackUpcollaborator: res.data,
            fetching: false,
          });
        }
      );
      PaidRequestService.getAllPaidRequestOfTheTeamOfValidator(
        sessionStorage.getItem("user")
      ).then((res) => {
        this.setState({ PaidRequest: res.data });
      });
      UnitService.getUnitByValidator(
        parseInt(sessionStorage.getItem("user"))
      ).then((res) => {
        this.setState({ allUnit: res.data });
      });
    }
    setTimeout(() => {
      this.setState({ loading: false });
    }, 5000);
  }
  getDifference = (array1, array2) => {
    return array1.filter((object1) => {
      return !array2.some((object2) => {
        return object1.id === object2.id;
      });
    });
  };

  getIntersection = (array1, array2) => {
    return array1.filter((object1) => {
      return array2.some((object2) => {
        return object1.id === object2.id;
      });
    });
  };

  //add historic add open and close
  //code changes in balance action treatment
  handleOpen = (emp) => {
    this.setState({ open: true, employee: emp });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  ////rest Data
  findValidator = () => {
    let collaboratorWithAllInfo = [];
    let lastversionofcollaboratorWithAllInfo = [];
    this.state.allUnit.map((unit) => {
      unit.collaborators1.map((collaborator) => {
        let collaboratorWithUnit = Object.assign(collaborator, {
          NameUnit: unit.name,
        });
        let collaboratorWithValidatorF = Object.assign(collaboratorWithUnit, {
          FirstNameValidator: unit.validator.firstname,
        });
        let collaboratorWithValidatorL = Object.assign(
          collaboratorWithValidatorF,
          { LastNameValidator: unit.validator.lastname }
        );
        collaboratorWithAllInfo.push(collaboratorWithValidatorL);
      });
    });
    let lastversionofcollaborator = this.getIntersection(
      this.state.allcollaborator,
      collaboratorWithAllInfo
    );
    lastversionofcollaborator.map((collab) => {
      collaboratorWithAllInfo.map((c) => {
        if (collab.id === c.id) {
          let lastversioncollaboratorWithUnit = Object.assign(collab, {
            NameUnit: c.NameUnit,
          });
          let lastversioncollaboratorWithValidatorF = Object.assign(
            lastversioncollaboratorWithUnit,
            { FirstNameValidator: c.FirstNameValidator }
          );
          let lastversioncollaboratorWithValidatorL = Object.assign(
            lastversioncollaboratorWithValidatorF,
            { LastNameValidator: c.LastNameValidator }
          );
          lastversionofcollaboratorWithAllInfo.push(
            lastversioncollaboratorWithValidatorL
          );
        }
      });
    });
    //console.log("lastversionofcollaboratorWithAllInfo :")
    //console.log(lastversionofcollaboratorWithAllInfo)
    // console.log(this.state.allUnit)
    if (
      (this.state.conRh === true && this.state.allcollaborator.length != 0) ||
      this.state.allUnit.length != 0
    ) {
      // console.log("Rh")
      let collabs3 = [];
      let collabs_without_val_and_uo = [];
      let collabs_without_val_and_uo1 = [];
      this.state.allUnit.map((unit) => {
        unit.collaborators1.map((c) => {
          collabs3.push(c);
        });
      });
      // console.log("collabs with uo :")
      // console.log(collabs3)
      collabs_without_val_and_uo = this.getDifference(
        this.state.allcollaborator,
        collabs3
      );
      //console.log("collabs_without_val_and_uo :")
      //console.log(collabs_without_val_and_uo)
      collabs_without_val_and_uo.map((c) => {
        let collab_without_unit = Object.assign(c, { NameUnit: "Non assigne" });
        let collab_without_val = Object.assign(collab_without_unit, {
          FirstNameValidator: "Non assigne",
        });
        let collab_without_val1 = Object.assign(collab_without_val, {
          LastNameValidator: "",
        });
        collabs_without_val_and_uo1.push(collab_without_val1);
      });
      //collaboratorWithAllInfo=collaboratorWithAllInfo.concat(collabs_without_val_and_uo1)
      lastversionofcollaboratorWithAllInfo =
        lastversionofcollaboratorWithAllInfo.concat(
          collabs_without_val_and_uo1
        );
    }
    //return collaboratorWithAllInfo;
    return lastversionofcollaboratorWithAllInfo;
  };
  //find TotalBalance from  PaidRequestService
  // change this function
  findTotalBalance(idCollaborator) {
    let totalPendingBalance = 0;
    this.state.PaidRequest.map((request) => {
      if (
        request.collaborator.id === idCollaborator &&
        request.statut === "Pending"
      ) {
        totalPendingBalance = totalPendingBalance + request.balanceUsed;
      }
    });
    return totalPendingBalance;
  }

  //treatment of spent vacation in current year
  getcurrentyear = () => {
    var current_date = new Date();
    return current_date.getFullYear();
  };

  findTotalSpentHolidaysBalance(idCollaborator) {
    let totalSpentHolidaysBalance = 0;
    this.state.PaidRequest.map((request) => {
      if (
        request.collaborator.id === idCollaborator &&
        (request.statut === "accepted" ||
          request.statut === "Pending cancellation" ||
          request.statut === "cancellation refused")
      ) {
        request.datesRequest.map((dates) => {
          var startdate = new Date(dates.startDate);
          var enddate = new Date(dates.endDate);
          if (
            startdate.getFullYear() === this.getcurrentyear() &&
            enddate.getFullYear() === this.getcurrentyear()
          ) {
            totalSpentHolidaysBalance =
              totalSpentHolidaysBalance + request.balanceUsed;
          }
        });
      }
    });
    return totalSpentHolidaysBalance;
  }

  //caclule Rmining balance
  Rimmmingbalanc(cumulativeBances, annualBalance) {
    let a = this.calculeCumulativeBalance(cumulativeBances);
    return a + annualBalance;
  }
  //caclule sum of cumulative balance
  calculeCumulativeBalance(soldes) {
    let a = 0;
    if (soldes != [] && soldes != null) {
      soldes.map((solde) => (a = a + solde.balance));
    }
    return a;
  }

  handleChange = (event) => {
    if (event.target.value != "") {
      this.setState((prevState) => {
        return {
          allcollaborator: prevState.allcollaborator.filter(
            (col) =>
              col.firstname.includes(event.target.value) ||
              col.lastname.includes(event.target.value)
          ),
        };
      });
    } else {
      this.setState({ allcollaborator: this.state.BackUpcollaborator });
    }
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
  columns = [
    //add historic add action column
    //code changes in balance action treatment
    {
      field: "action",
      headerName: "Action",
      headerAlign: "center",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      filterable: false,
      disableExport: true,
      width: 100,
      renderCell: (params) => {
        return (
          <LightTooltip
            title={translate("Show user balance history and actions")}
            placement="top"
          >
            <p
              style={{
                marginLeft: "30px",
                marginTop: "18px",
                fontSize: "17px",
              }}
            >
              <FaClipboardList
                onClick={() => this.handleOpen(params.row)}
                style={{
                  cursor: "pointer",
                  width: "20px",
                  height: "20px",
                  color: "#516EA5",
                }}
              />
            </p>
          </LightTooltip>
        );
      },
      valueGetter: (params) => params.row.cin,
    },
    {
      field: "cin",
      headerName: DatagridColumn[0],
      headerAlign: "center",
      width: 170,
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
      field: "firstname",
      headerName: DatagridColumn[1],
      headerAlign: "center",
      width: 180,
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
      field: "lastname",
      headerName: DatagridColumn[2],
      headerAlign: "center",
      width: 180,
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
      field: "contractBalance",
      headerName: DatagridColumn[3],
      type: "number",
      headerAlign: "center",
      //width: 150,
      width: 180,
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
            {params.row.solde.contractBalance}
          </p>
        );
      },
      valueGetter: (params) => params.row.solde.contractBalance,
    },
    {
      field: "annualBalance",
      //headerName: DatagridColumn[4],
      headerName: `${this.getcurrentyear()}`,
      type: "number",
      headerAlign: "center",
      //width: 150,
      width: 110,
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
            {params.row.solde.annualBalance}
          </p>
        );
      },
      valueGetter: (params) => params.row.solde.annualBalance,
    },
    {
      field: "cumulativeBances",
      //headerName: DatagridColumn[5],
      headerName: `${this.getcurrentyear() - 1}`,
      type: "number",
      headerAlign: "center",
      //width: 150,
      width: 110,
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
            {this.calculeCumulativeBalance(params.row.solde.cumulativeBances)}
          </p>
        );
      },
      valueGetter: (params) =>
        this.calculeCumulativeBalance(params.row.solde.cumulativeBances),
    },
    {
      field: "Rimmmingbalanc",
      headerName: DatagridColumn[6],
      type: "number",
      headerAlign: "center",
      //width: 160,
      width: 180,
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
            {this.Rimmmingbalanc(
              params.row.solde.cumulativeBances,
              params.row.solde.annualBalance
            )}
          </p>
        );
      },
      valueGetter: (params) =>
        this.Rimmmingbalanc(
          params.row.solde.cumulativeBances,
          params.row.solde.annualBalance
        ),
    },
    {
      field: "Panding",
      headerName: DatagridColumn[7],
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
            {this.findTotalBalance(params.row.id)}
          </p>
        );
      },
      valueGetter: (params) => this.findTotalBalance(params.row.id),
    },
    {
      field: "SpentVacation",
      headerName: DatagridColumn[10] + ` ${this.getcurrentyear()}`,
      type: "number",
      headerAlign: "center",
      //width: 150,
      width: 215,
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
            {this.findTotalSpentHolidaysBalance(params.row.id)}
          </p>
        );
      },
      valueGetter: (params) =>
        this.findTotalSpentHolidaysBalance(params.row.id),
    },
    {
      field: "validator",
      headerName: DatagridColumn[8],
      type: "string",
      headerAlign: "center",
      width: 180,
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
          >{`${params.row.FirstNameValidator || ""} ${
            params.row.LastNameValidator || ""
          }`}</p>
        );
      },
      valueGetter: (params) =>
        `${params.row.FirstNameValidator || ""} ${
          params.row.LastNameValidator || ""
        }`,
    },
    {
      field: "NameUnit",
      headerName: DatagridColumn[9],
      type: "string",
      headerAlign: "center",
      width: 180,
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
  ];

  render() {
    return (
      <div>
        {/* {this.state.fetching? <Fetching /> : null}
                <FormattedMessage id="Search">
                    { message => <InputGroup className="mb-2" style={{width:'30%'}}>
                            <InputGroup.Text id="basic-addon1"><BsSearch /></InputGroup.Text>
                            <Form.Control
                                placeholder={message}
                                aria-label="Search"
                                aria-describedby="basic-addon1"
                                onChange={(event) => this.handleChange(event)}
                            />
                    </InputGroup>}
                    </FormattedMessage> */}
        {this.state.fetching ? <Fetching /> : null}
        <div className="row">
          <div
            style={{
              display: "flex",
              height: "100%",
              width: "100%",
              marginTop: "15px",
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <Box sx={{ height: 550, width: "100%" }}>
              <DataGrid
                rows={this.findValidator()}
                columns={this.columns}
                autoPageSize
                rowsPerPageOptions={[10]}
                checkboxSelection={
                  JSON.parse(sessionStorage.getItem("firstname")) === "Super" &&
                  JSON.parse(sessionStorage.getItem("lastname")) === "Admin"
                    ? true
                    : false
                }
                onSelectionModelChange={(ids) => {
                  const selectedIDs = new Set(ids);
                  const selectedRowData = this.findValidator().filter((row) =>
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
                  Toolbar: ExcelExport,
                  LoadingOverlay: LinearProgress,
                  Pagination: this.CustomPagination,
                }}
              />
            </Box>
          </div>
        </div>
        {/* //add historic //code changes in balance action treatment */}
        {this.state.employee && (
          <BasicModal
            open={this.state.open}
            handleClose={this.handleClose}
            employee={this.state.employee}
          />
        )}
      </div>
    );
  }
}

export default CollaboratorSolde;
