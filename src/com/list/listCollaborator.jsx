import React, { Component } from "react";
import collaboratorService from "../../servicees/CollaborateurServices";
import BalanceService from "../../servicees/BalanceService";
import "../css/list.css";
import translate from "../../i18nProvider/translate";
import UnitService from "../../servicees/UnitService";
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
} from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import { Button } from "react-bootstrap";
import { IoTrashSharp, IoSettings } from "react-icons/io5";
import { GoInfo } from "react-icons/go";
import Fetching from "./Fetching";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import DetailSoldeModal from "./DetailSoldeModal";
import UpdatePasswordModel from "./UpdatePasswordModel";
import { RiLockPasswordFill, RiUserSettingsLine } from "react-icons/ri";
//traitement update Role
import RoleModel from "./RoleModel";
import Swal from "sweetalert2";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const englishColumn = [
  "First Name",
  "Last Name",
  "Username",
  "Email",
  "Employee Id",
  "Action",
  "Are you sure ?",
  "You won't be able to revert this!",
  "Yes, delete it!",
  "Deleted!",
  "The employee has been deleted.",
  "Cancel",
  "This employee is a validator !",
  "First, it is necessary to modify the validator for the units where this employe is a validator.",
  "Go to the unit list !",
  "Ok",
  "Role",
];
const frenchColumn = [
  "Prénom",
  "Nom",
  "Nom d'utilisateur",
  "E-mail",
  "Id d'Employé",
  "Action",
  "Es-tu sûr ?",
  "Vous ne pourrez pas revenir en arrière !",
  "Oui, supprimez-le !",
  "Supprimé!",
  "L'employé a été supprimé.",
  "Annuler",
  "Cet employé est un validateur !",
  "D'abord, Vous devez modifier le validateur pour les unités où cet employé est validateur.",
  "Allez à la liste des unités !",
  "D'accord",
  "Rôle",
];
const spanishColumn = [
  "Nombre",
  "Apellidos",
  "Nombre de Usuario",
  "Correo electrónico",
  "Id Empleado",
  "Acción",
  "Estás seguro(a) ?",
  "¡No podrás revertir esto!",
  "¡Sí, bórralo!",
  "¡Eliminado!",
  "El empleado ha sido eliminado.",
  "Cancelar",
  "¡Este empleado es un validador!",
  "Primero, es necesario modificar el validador de las unidades donde este empleado es validador.",
  "¡Ir a la lista de unidades!",
  "Bueno",
  "Rol",
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

// collaborator list with option give to RH option to change in the list
class listCollaborator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collaborator: [],
      select: "collaborator",
      search: "",
      teamRh: [],
      RHadmin: "",
      fetching: true,
      loading: true,
      showbalanceModal: false,
      showUpdatePasswordModel: false,
      rowcollabdata: {},
      rowcin: "",
      rowpassword: "",
      collaboratorData: {
        solde: {
          cumulativeBances: [],
        },
      },
      //traitement update Role
      showRoleModel: false,
      rowteam: "",
      //traitment affichage info of name of unit for collaborator
      units: [],
      unitname: "",
    };
    this.editUser = this.editUser.bind(this);
    this.changeselectHandler = this.changeselectHandler.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  componentDidMount() {
    collaboratorService.getUser().then((res) => {
      this.setState({ collaborator: res.data });
    });

    UnitService.getunit().then((res) => {
      //traitment affichage info of name of unit for collaborator
      this.setState({ units: res.data });
      res.data.map((res) => {
        if (res.name === "RH") {
          this.setState({
            teamRh: res.collaborators1,
            RHadmin: res.validator,
            fetching: false,
          });
        }
      });
    });

    setTimeout(() => {
      this.setState({ loading: false });
    }, 5000);
  }

  componentDidUpdate() {
    setTimeout(() => {
      collaboratorService.getUser().then((res) => {
        //console.info(res.data)
        this.setState({ collaborator: res.data, fetching: false });
      });
    }, 60000);

    /*collaboratorService.getUser().then((res) => {
      console.info(res.data)
      this.setState({ collaborator: res.data, fetching: false });
    });*/
  }

  deleteUser(id) {
    Swal.fire({
      title: DatagridColumn[6],
      text: DatagridColumn[7],
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: DatagridColumn[8],
      cancelButtonText: DatagridColumn[11],
    }).then((result) => {
      if (result.isConfirmed) {
        collaboratorService.deleteUser(id).then((res) => {
          this.setState({
            fetching: true,
            collaborator: this.state.collaborator.filter(
              (user) => user.id !== id
            ),
          });
        });

        Swal.fire({
          title: DatagridColumn[9],
          text: DatagridColumn[10],
          icon: "success",
          confirmButtonText: DatagridColumn[15],
        });
      }
    });
  }
  deactivateUser(id) {
    console.log(id);
    const isValidator = UnitService.checkIFvalidator(id);
    // Affichage du résultat dans la console
    console.log("Is Validator:", parseInt(isValidator.data));

    UnitService.checkIFvalidator(id).then((res) => {
      console.log("Is Validator:", parseInt(res.data));
      if (parseInt(res.data) === 1) {
        Swal.fire({
          title: DatagridColumn[12],
          text: DatagridColumn[13],
          icon: "error",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: DatagridColumn[14],
          cancelButtonText: DatagridColumn[11],
        }).then((result) => {
          if (result.isConfirmed) {
            this.props.history.push("/admin/units/list");
          }
        });
      } else {
        Swal.fire({
          title: DatagridColumn[6],
          text: DatagridColumn[7],
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: DatagridColumn[8],
          cancelButtonText: DatagridColumn[11],
        }).then((result) => {
          if (result.isConfirmed) {
            collaboratorService.deactivateUser(id).then((res) => {
              this.setState({
                fetching: true,
                collaborator: this.state.collaborator.filter(
                  (user) => user.id !== id
                ),
              });
              Swal.fire({
                title: DatagridColumn[9],
                text: DatagridColumn[10],
                confirmButtonText: DatagridColumn[15],
                icon: "success",
              });
            });
          }
        });
      }
    });
  }
  editUser(id) {
    this.props.history.push(`/admin/list/add-user/${id}`);
  }

  changeselectHandler = (event) => {
    this.setState({ select: event.target.value });
  };

  stringToColor(string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  stringAvatar = (name) => {
    return {
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
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
          {this.state.collaborator.length == 0 ? (
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

  /*showbalanceModal = () => {
    this.setState({ show: true });
  };*/

  openUpdatePasswordModel(row) {
    //console.info(row)
    this.setState({
      showUpdatePasswordModel: true,
      rowcollabdata: row,
      rowcin: row.cin,
      rowpassword: row.password,
    });
    //console.info(this.state.rowcollabdata)
  }

  //traitement update Role
  openRoleModel(row) {
    this.setState({
      showRoleModel: true,
      rowcollabdata: row,
      rowcin: row.cin,
      rowteam: row.team,
    });
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  //traitment affichage info of name of unit for collaborator
  openDetailSoldeModal = (row) => {
    let x = false;
    this.setState({ collaboratorData: row, showbalanceModal: true });
    if (this.state.units.length != 0) {
      this.state.units.map((unit) => {
        unit.collaborators1.map((collab) => {
          if (collab.id === row.id) {
            this.setState({ unitname: unit.name });
            x = true;
          }
        });
      });
      if (!x) {
        this.setState({ unitname: "Non assigne" });
      }
    }
  };

  mycolumns = [
    {
      field: "avatar",
      headerName: "Avatar",
      headerAlign: "center",
      filterable: false,
      disableExport: true,
      width: 100,
      renderCell: (params) => {
        return (
          <Avatar
            {...this.stringAvatar(
              (params.row.firstname + " " + params.row.lastname).toUpperCase()
            )}
            sx={{
              width: 47,
              height: 47,
              marginLeft: 2,
              bgcolor: this.stringToColor(
                params.row.firstname + " " + params.row.lastname
              ),
            }}
          />
        );
      },
    },
    {
      field: "firstname",
      headerName: DatagridColumn[0],
      headerAlign: "center",
      width: 180,
      renderCell: (params) => {
        return (
          <p
            style={{
              marginLeft: "30px",
              marginTop: "18px",
              fontSize: "17.5px",
            }}
          >
            {params.row.firstname}
          </p>
        );
      },
    },

    {
      field: "lastname",
      headerName: DatagridColumn[1],
      headerAlign: "center",
      width: 180,
      renderCell: (params) => {
        return (
          <p
            style={{
              marginLeft: "30px",
              marginTop: "18px",
              fontSize: "17.5px",
            }}
          >
            {params.row.lastname}
          </p>
        );
      },
    },

    {
      field: "username",
      headerName: DatagridColumn[2],
      headerAlign: "center",
      width: 150,
      renderCell: (params) => {
        return (
          <p
            style={{
              marginLeft: "30px",
              marginTop: "17px",
              fontSize: "17px",
              color: "#1E90FF",
              fontWeight: "bold",
            }}
          >
            {params.row.username}
          </p>
        );
      },
    },
    {
      field: "role",
      headerName: DatagridColumn[16],
      headerAlign: "center",
      width: 150,
      renderCell: (params) => {
        return (
          <p
            style={{
              marginLeft: "30px",
              marginTop: "17px",
              fontSize: "17px",
              color: "#1E90FF",
              fontWeight: "bold",
            }}
          >
            {params.row.role !== undefined && params.row.role !== null
              ? this.capitalizeFirstLetter(params.row.role)
              : params.row.role}
          </p>
        );
      },
    },
    {
      field: "email",
      headerName: DatagridColumn[3],
      headerAlign: "center",
      width: 330,
      renderCell: (params) => {
        return (
          <p
            style={{
              marginLeft: "30px",
              marginTop: "17px",
              fontSize: "17px",
              color: "#32CD32",
              fontWeight: "bold",
            }}
          >
            {params.row.email}
          </p>
        );
      },
    },
    {
      field: "cin",
      headerName: DatagridColumn[4],
      headerAlign: "center",
      width: 170,
      renderCell: (params) => {
        return (
          <p
            style={{ marginLeft: "30px", marginTop: "18px", fontSize: "18px" }}
          >
            {params.row.cin}
          </p>
        );
      },
    },
    {
      field: "action",
      headerName: DatagridColumn[5],
      headerAlign: "center",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      filterable: false,
      disableExport: true,
      width: 365,
      renderCell: (params) => {
        return (
          <div style={{ marginLeft: "10px" }}>
            <LightTooltip
              title={translate("View user balance details")}
              placement="top"
            >
              <Button
                style={{ border: "none", margin: "0 0 0 1px" }}
                onClick={
                  () =>
                    this.openDetailSoldeModal(
                      params.row
                    ) /*this.setState({ collaboratorData: params.row, showbalanceModal: true })*/
                }
              >
                <GoInfo
                  style={{ fontSize: "25px", color: "rgb(49, 116, 173)" }}
                />
              </Button>
            </LightTooltip>
            <LightTooltip
              title={translate("Reset user password")}
              placement="top"
            >
              <Button
                style={{ border: "none", marginRight: "2px" }}
                onClick={() => this.openUpdatePasswordModel(params.row)}
              >
                <RiLockPasswordFill
                  style={{ fontSize: "27px", color: "#1E90FF" }}
                />
              </Button>
            </LightTooltip>
            <LightTooltip title={translate("Update user role")} placement="top">
              <Button
                className="showBtn-role"
                onClick={() => this.openRoleModel(params.row)}
              >
                <RiUserSettingsLine
                  style={{ fontSize: "27px", color: "#1E900F" }}
                />
              </Button>
            </LightTooltip>
            <LightTooltip
              title={translate("Update user details")}
              placement="top"
            >
              <Button
                className="showBtn-setting"
                onClick={() => this.editUser(params.row.id)}
              >
                <IoSettings style={{ fontSize: "27px", color: "#1E90FF" }} />
              </Button>
            </LightTooltip>
            {/*<LightTooltip title={translate("Delete user")} placement="top">
              <Button
                className="showBtn-delete"
                onClick={() => this.deleteUser(params.row.id)}
              >
                <IoTrashSharp id="trash-btn" />
              </Button>
            </LightTooltip>*/}
            <LightTooltip title={translate("Deactivate user")} placement="top">
              <Button
                className="showBtn-delete"
                onClick={() => this.deactivateUser(params.row.id)}
              >
                <PersonRemoveIcon style={{ fontSize: "30px" }} id="trash-btn" />
              </Button>
            </LightTooltip>
          </div>
        );
      },
    },
  ];

  render() {
    return (
      <React.Fragment>
        {this.state.fetching ? <Fetching /> : null}
        <br></br>
        <div className="row">
          <div
            style={{
              height: 540,
              width: "100%",
              marginTop: "15px",
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <DataGrid
              rows={this.state.collaborator.filter((val) => {
                if (
                  '"' + val.country + '"' ===
                  sessionStorage.getItem("country")
                ) {
                  if (
                    parseInt(sessionStorage.getItem("user")) !=
                    this.state.RHadmin.id
                  ) {
                    let a = false;
                    this.state.teamRh.map((res) => {
                      if (val.id == res.id) {
                        a = true;
                      }
                    });

                    if (
                      a == false &&
                      this.state.search == "" &&
                      val.id != this.state.RHadmin.id &&
                      val.team != "Directeur"
                    ) {
                      return val;
                    } else if (
                      a == false &&
                      val.firstname
                        .toLowerCase()
                        .includes(this.state.search.toLowerCase()) &&
                      val.id != this.state.RHadmin.id &&
                      val.team != "Directeur"
                    ) {
                      return val;
                    }
                  } else {
                    if (
                      this.state.search == "" &&
                      val.id != this.state.RHadmin.id &&
                      val.team != "Directeur"
                    ) {
                      return val;
                    } else if (
                      val.firstname
                        .toLowerCase()
                        .includes(this.state.search.toLowerCase()) &&
                      val.id != this.state.RHadmin.id &&
                      val.team != "Directeur"
                    ) {
                      return val;
                    }
                  }
                }
              })}
              columns={this.mycolumns}
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
                const selectedRowData = this.state.collaborator.filter((row) =>
                  selectedIDs.has(row.id)
                );
                console.log(selectedRowData);
              }}
              localeText={
                sessionStorage.getItem("lang") === "Fr"
                  ? frFR.components.MuiDataGrid.defaultProps.localeText
                  : sessionStorage.getItem("lang") === "Sp"
                  ? esES.components.MuiDataGrid.defaultProps.localeText
                  : enUS.components.MuiDataGrid.defaultProps.localeText
              }
              components={{
                Toolbar: GridToolbar,
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
          </div>
        </div>
        <DetailSoldeModal
          size="md"
          show={this.state.showbalanceModal}
          onHide={() => this.setState({ showbalanceModal: false })}
          collabdata={this.state.collaboratorData}
          aria-labelledby="example-modal-sizes-title-sm"
          //traitment affichage info of name of unit for collaborator
          path="listcollaborator"
          unitname={this.state.unitname}
        />
        <UpdatePasswordModel
          show={this.state.showUpdatePasswordModel}
          onHide={() => this.setState({ showUpdatePasswordModel: false })}
          closeModel={() => this.setState({ showUpdatePasswordModel: false })}
          rowcollab1={this.state.rowcollabdata}
          rowcin1={this.state.rowcin}
          rowpassword1={this.state.rowpassword}
          refresh={() => this.componentDidMount()}
        />
        <RoleModel
          show={this.state.showRoleModel}
          onHide={() => this.setState({ showRoleModel: false })}
          closeModel={() => this.setState({ showRoleModel: false })}
          rowcollab1={this.state.rowcollabdata}
          rowcin1={this.state.rowcin}
          rowteam1={this.state.rowteam}
          refresh={() => this.componentDidMount()}
        />
      </React.Fragment>
    );
  }
}
export default listCollaborator;
