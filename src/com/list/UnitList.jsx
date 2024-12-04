import React, { Component } from "react";
import UnitService from "../../servicees/UnitService";
import "../css/list.css";
import translate from "../../i18nProvider/translate";
import { FormattedMessage } from "react-intl";
import Fetching from "./Fetching";
import { Button } from "react-bootstrap";
import {
  IoAddCircleSharp,
  IoFileTray,
  IoSettings,
  IoTrashSharp,
} from "react-icons/io5";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import AddUnitModal from "com/add/addUnitModal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { BsSearch } from "react-icons/bs";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Skeleton from "@mui/material/Skeleton";
import Swal from "sweetalert2";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const englishColumn = [
  "Sorry",
  "Your team doesn't have any unit",
  "Okay",
  "Show Units of your teams",
];
const frenchColumn = [
  "Désolé",
  "Votre équipe n'a aucune unité",
  "D'accord",
  "Afficher les unités de vos équipes",
];
const spanishColumn = [
  "Lo siento",
  "Tu equipo no tiene ninguna unidad",
  "Bueno",
  "Mostrar Unidades de tus equipos",
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
  unitDeleted: "The unit has been deleted.",
  unitPoolProcess:
    "Please note that all collaborators who were part of this unit have been automatically assigned to the Pool unit.",
  deleted: "Deleted!",
  confirmDeleteUnit: "Do you really want to delete this unit?",
  confirmPrompt: "Are you sure?",
  confirmButtonText: "Yes, delete it!",
  confirmButtonText1: "Ok",
  cancelButtonText: "Cancel",
};

const frenchStrings = {
  unitDeleted: "L'unité a été supprimée.",
  unitPoolProcess:
    "Veuillez noter que tous les collaborateurs qui faisaient partie de cette unité ont été automatiquement affectés à l'unité Pool.",
  deleted: "Supprimé !",
  confirmDeleteUnit: "Voulez-vous vraiment supprimer cette unité ?",
  confirmPrompt: "Êtes-vous sûr(e) ?",
  confirmButtonText: "Oui, supprimez-le !",
  confirmButtonText1: "D'accord",
  cancelButtonText: "Annuler",
};

const spanishStrings = {
  unitDeleted: "La unidad ha sido eliminada.",
  unitPoolProcess:
    "Tenga en cuenta que todos los colaboradores que formaban parte de esta unidad han sido asignados automáticamente a la unidad Pool.",
  deleted: "¡Eliminado!",
  confirmDeleteUnit: "¿Realmente quieres eliminar esta unidad?",
  confirmPrompt: "¿Estás seguro?",
  confirmButtonText: "¡Sí, bórralo!",
  confirmButtonText1: "Bueno",
  cancelButtonText: "Cancelar",
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

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
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

class UnitList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      units: [],
      BackUpUnits: [],
      allUnits: [],
      unitsOfTeamOfValidatort: [],
      fetching: true,
      modalShow: false,
      progres: false,
      checked: false,
      match: false,
      unitData: {
        id: "",
        name: "",
        //add pkey in horid organizationUnit
        pkeyPaidVacation: "",
        pkeyFestive: "",
        pkeyMainTask: "",
        summaryMainTask: "",
        summaryPaidVacation: "",
        summaryFestive: "",
        validator: {},
        collaborators: [],
        country: "",
        collaborators1: [],
      },
    };
    this.deleteUnit = this.deleteUnit.bind(this);
  }

  componentDidMount() {
    if (sessionStorage.getItem("role") === "validator") {
      UnitService.getUnitByValidator(
        parseInt(sessionStorage.getItem("user"))
      ).then((res) => {
        this.setState({
          units: res.data,
          BackUpUnits: res.data,
          fetching: false,
          progres: false,
        });
        console.log(this.state.units);
      }); /*.then(() => {
                let teamOfValidator = []
                this.state.units.map( unit => unit.collaborators1.map(c => teamOfValidator.push(c)))
                
                teamOfValidator.map( colab => {
                    UnitService.checkIFvalidator(colab.id).then((res)=>{
                        if(parseInt(res.data)===1){
                            UnitService.getUnitByValidator(colab.id).then((res)=>{        
                                this.setState({ units: this.state.units.concat(res.data), BackUpUnits: this.state.units.concat(res.data),progres:false})
                            })
                        }
                    })
                })

              })*/
      UnitService.checkIfExistValidatorIntoTeamOfUnitsForValidatorById(
        parseInt(sessionStorage.getItem("user"))
      ).then((res) => {
        this.setState({
          match: res.data,
        });
      });
    } else {
      UnitService.getunit().then((res) => {
        console.info(res.data);
        this.setState({
          units: res.data,
          BackUpUnits: res.data,
          fetching: false,
          progres: false,
        });
        //console.log(this.state.units)
      });
    }
    /*UnitService.getunit().then((res) => {
            if(sessionStorage.getItem("role")!="validator"){
                this.setState({ units: res.data, BackUpUnits: res.data, fetching:false})
                //console.info(this.state.units)
            }else{
                let unitForValidator = res.data.filter( u => u.validator.id === parseInt(sessionStorage.getItem("user")))
                let teamOfValidator = []
                let UnitOfTeamOfValidator = []
               
                unitForValidator.map( unit => unit.collaborators1.map(c => teamOfValidator.push(c)))
                res.data.map(unit => {
                    teamOfValidator.map(u => {
                         if(unit.validator.id===u.id){
                            UnitOfTeamOfValidator.push(unit)
                         }
                     })
                })

                this.setState({ units: unitForValidator.concat(UnitOfTeamOfValidator), BackUpUnits: unitForValidator.concat(UnitOfTeamOfValidator), fetching:false})
            }
            this.setState({allUnits:res.data})
        })*/
  }

  deleteUnit(id) {
    Swal.fire({
      title: strings.confirmPrompt,
      text: strings.confirmDeleteUnit,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: strings.confirmButtonText,
      cancelButtonText: strings.cancelButtonText,
    }).then((result) => {
      if (result.isConfirmed) {
        UnitService.deletenit(id).then((res) => {
          this.setState({
            units: this.state.units.filter((unit) => unit.id !== id),
          });
          Swal.fire({
            title: strings.deleted,
            html: `${strings.unitDeleted} <br/> <span style="color:red;font-weight:bold"> ${strings.unitPoolProcess} </span>`,
            icon: "success",
            confirmButtonText: strings.confirmButtonText1,
          });
        });
      }
    });
  }

  handleChange = (event) => {
    if (event.target.value != "") {
      this.setState((prevState) => {
        return {
          units: prevState.units.filter((u) =>
            u.name.toUpperCase().includes(event.target.value.toUpperCase())
          ),
        };
      });
    } else {
      this.setState({ units: this.state.BackUpUnits });
    }
  };

  handleChangeSwitch = (event) => {
    console.info(event.target.checked);
    this.setState({ checked: event.target.checked });

    if (event.target.checked === true) {
      this.setState({ progres: true });

      if (this.state.unitsOfTeamOfValidatort.length == 0) {
        let teamOfValidator = [];
        this.state.units.map((unit) =>
          unit.collaborators1.map((c) => teamOfValidator.push(c))
        );
        teamOfValidator.map((colab) => {
          UnitService.checkIFvalidator(colab.id)
            .then((res) => {
              if (parseInt(res.data) === 1) {
                UnitService.getUnitByValidator(colab.id).then((res) => {
                  this.setState({
                    unitsOfTeamOfValidatort:
                      this.state.unitsOfTeamOfValidatort.concat(res.data),
                    units: this.state.units.concat(res.data),
                    BackUpUnits: this.state.units.concat(res.data),
                    //progres:false
                  });
                });
              }
            })
            .finally(() => {
              this.setState({ progres: false });
            });
        });
        if (!this.state.match) {
          Swal.fire({
            title: DatagridColumn[0],
            icon: "info",
            confirmButtonText: DatagridColumn[2],
            text: DatagridColumn[1],
          });
        }
      } else {
        this.setState({
          units: this.state.units.concat(this.state.unitsOfTeamOfValidatort),
          progres: false,
        });
      }
    } else {
      //this.setState({checked:false})
      let ValidatorUnits = this.state.units.filter(
        (unit) => unit.validator.id === parseInt(sessionStorage.getItem("user"))
      );
      this.setState({ units: ValidatorUnits });
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.fetching ? <Fetching /> : null}
        <div className="row">
          <div
            className="btnholiday"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <FormattedMessage id="Search">
                {(message) => (
                  <InputGroup
                    className="mb-2"
                    style={{
                      width:
                        sessionStorage.getItem("role") !== "RH"
                          ? "52%"
                          : "100%",
                      paddingLeft: 10,
                    }}
                  >
                    <InputGroup.Text id="basic-addon1">
                      <BsSearch />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder={message}
                      aria-label="Search"
                      aria-describedby="basic-addon1"
                      onChange={(event) => this.handleChange(event)}
                    />
                  </InputGroup>
                )}
              </FormattedMessage>
              {sessionStorage.getItem("role") !== "RH" ? (
                <FormControlLabel
                  disabled={this.state.progres ? true : false}
                  control={
                    <IOSSwitch
                      checked={this.state.checked}
                      onChange={this.handleChangeSwitch}
                      inputProps={{ "aria-label": "controlled" }}
                      sx={{ marginLeft: 1, marginRight: 1 }}
                    />
                  }
                  label={DatagridColumn[3]}
                  sx={{ margin: 0, color: "#5876AA" }}
                />
              ) : null}
            </div>
            <Button
              className="btn btn-primary"
              onClick={
                () =>
                  this.setState({
                    unitData: {
                      id: "",
                      name: "",
                      pkeyPaidVacation: "",
                      pkeyFestive: "",
                      pkeyMainTask: "",
                      summaryMainTask: "",
                      summaryPaidVacation: "",
                      summaryFestive: "",
                      validator: {},
                      collaborators: [],
                      country: "",
                      collaborators1: [],
                    },
                    modalShow: true,
                  }) /*this.addHolidays.bind(this)*/
              }
              style={{ marginRight: "10px" }}
            >
              <IoAddCircleSharp
                style={{ fontSize: "25px", marginRight: "6px" }}
              />
              {translate("Add Unit")}
            </Button>
          </div>
          {this.state.progres ? (
            <Box sx={{ width: "98%", margin: "10px auto 0 auto" }}>
              <LinearProgress />
            </Box>
          ) : null}
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
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">
                      {translate("Name")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {translate("Validator")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {translate("Team")}
                    </StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.units
                    .filter((val) => {
                      if (val.country === sessionStorage.getItem("country")) {
                        return val;
                      }
                    })
                    .map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="center"
                        >
                          <Stack direction="row" align="center" spacing={2}>
                            {" "}
                            <Chip
                              label={row.name}
                              color="primary"
                              style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                color: "#fff",
                                padding: "10px 10px",
                                marginLeft: "10px",
                              }}
                            />
                          </Stack>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <p style={{ fontWeight: "bold" }}>
                            {row.validator.firstname +
                              " " +
                              row.validator.lastname}
                          </p>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.collaborators.map((user) => (
                            <p key={user}>{user}</p>
                          ))}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {this.state.progres ? (
                            <div style={{ display: "flex", marginLeft: 30 }}>
                              <Skeleton
                                variant="rounded"
                                width={90}
                                height={40}
                                style={{ marginRight: 10 }}
                              />
                              <Skeleton
                                variant="rounded"
                                width={90}
                                height={40}
                              />
                            </div>
                          ) : (
                            <div>
                              <LightTooltip
                                title={translate(
                                  "Update this organizational unit"
                                )}
                                placement="top"
                              >
                                <button
                                  onClick={() =>
                                    this.setState({
                                      unitData: row,
                                      modalShow: true,
                                    })
                                  }
                                  className="btn btn-primary"
                                  id="showBtn-setting1"
                                >
                                  <IoSettings
                                    style={{
                                      fontSize: "25px",
                                      color: "#1E90FF",
                                      marginRight: "5px",
                                    }}
                                  />
                                </button>
                              </LightTooltip>
                              <LightTooltip
                                title={translate(
                                  "Delete this organizational unit"
                                )}
                                placement="top"
                              >
                                <button
                                  style={{ marginLeft: "10px", border: "none" }}
                                  onClick={() => this.deleteUnit(row.id)}
                                  className="btn btn-danger"
                                  id="showBtn-delete1"
                                >
                                  <IoTrashSharp
                                    id="trash-btn"
                                    style={{ marginRight: "3px" }}
                                  />
                                </button>
                              </LightTooltip>
                            </div>
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>

        <AddUnitModal
          show={this.state.modalShow}
          onHide={() =>
            this.setState({
              unitData: {
                id: "",
                name: "",
                pkeyPaidVacation: "",
                pkeyFestive: "",
                pkeyMainTask: "",
                summaryMainTask: "",
                summaryPaidVacation: "",
                summaryFestive: "",
                validator: {},
                collaborators: [],
                country: "",
                collaborators1: [],
              },
              modalShow: false,
            })
          }
          unitData={this.state.unitData}
          refresh={() => this.componentDidMount()}
          onProgres={() => this.setState({ progres: true })}
          //allUnits={this.state.allUnits}
        />
      </React.Fragment>
    );
  }
}
export default UnitList;
