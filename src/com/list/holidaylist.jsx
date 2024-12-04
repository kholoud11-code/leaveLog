import React, { Component } from "react";
import HolidayService from "../../servicees/HolidayService";
import "../css/list.css";
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import collaboratorService from "../../servicees/CollaborateurServices";
import Fetching from "./Fetching";
import { IoTrashSharp, IoSettings, IoAddCircleSharp } from "react-icons/io5";
import { Button } from "react-bootstrap";
import { FormattedMessage } from "react-intl";
import AddHolidayModal from "com/add/addHolidayModal";
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
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { BsSearch } from "react-icons/bs";
import Swal from "sweetalert2";
import AddRamadanDate from "com/add/addRamadanDate";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const englishStrings = {
  confirmationPrompt: "Are you sure?",
  deleteConfirmation: "Do you really want to delete this holiday?",
  deleteButton: "Yes, delete it!",
  deletedMessage: "Deleted!",
  deletionSuccessMessage: "The holiday has been deleted.",
  confirmButtonText: "Ok",
  cancelButtonText: "Cancel",
};

const frenchStrings = {
  confirmationPrompt: "Êtes-vous sûr(e) ?",
  deleteConfirmation: "Voulez-vous vraiment supprimer ce jour férié ?",
  deleteButton: "Oui, supprimez-le !",
  deletedMessage: "Supprimé !",
  deletionSuccessMessage: "Le jour férié a été supprimé.",
  confirmButtonText: "D'accord",
  cancelButtonText: "Annuler",
};

const spanishStrings = {
  confirmationPrompt: "¿Estás seguro?",
  deleteConfirmation: "¿Realmente quieres eliminar este día festivo?",
  deleteButton: "¡Sí, eliminarlo!",
  deletedMessage: "¡Eliminado!",
  deletionSuccessMessage: "El día festivo ha sido eliminado.",
  confirmButtonText: "bueno",
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

// holdays list with option give to RH option to change in the list
class Holidaylist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      holidays: [],
      RamadanDates: [],
      BackUpHoliday: [],
      BackUpaddRamadanData: [],
      fetching: true,
      modalShow: false,
      modalShow2: false,
      holidayData: {
        id: "",
        name: "",
        date: "",
        duration: "",
      },
      addRamadanData: {
        id: "",
        startDate: "",
        endDate: "",
      },
    };

    //this.editHoliday = this.editHoliday.bind(this);
    this.checkRh = this.checkRh.bind(this);
    this.checkRhbtn = this.checkRhbtn.bind(this);
  }

  /*editHoliday(id){
        this.props.history.push(`/admin/holiday/${id}`);
    }*/

  /*addHolidays(){
    this.props.history.push('/admin/holiday/add');
   }*/
  deleteHoliday(id) {
    Swal.fire({
      title: strings.confirmationPrompt,
      text: strings.deleteConfirmation,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: strings.deleteButton,
      cancelButtonText: strings.cancelButtonText,
    }).then((result) => {
      if (result.isConfirmed) {
        HolidayService.deleteHoliday(id).then((res) => {
          this.setState({
            holidays: this.state.holidays.filter(
              (holiday) => holiday.id !== id
            ),
          });

          Swal.fire({
            title: strings.deletedMessage,
            text: strings.deletionSuccessMessage,
            icon: "success",
            confirmButtonText: strings.confirmButtonText,
          });
        });
      }
    });
  }

  componentDidMount() {
    HolidayService.getHoliday().then((res) => {
      //console.info(res.data)
      this.setState({
        holidays: res.data,
        BackUpHoliday: res.data,
        fetching: false,
      });
    });
  }
  checkRh(x) {
    if (sessionStorage.getItem("role") === "RH") {
      return (
        <StyledTableCell align="center">
          <LightTooltip title={translate("Update holiday")} placement="top">
            <Button
              onClick={
                () =>
                  this.setState({
                    holidayData: x,
                    modalShow: true,
                  }) /*this.editHoliday(x)*/
              }
              className="showBtn-setting"
            >
              <IoSettings style={{ fontSize: "27px", color: "#1E90FF" }} />{" "}
            </Button>
          </LightTooltip>
          <LightTooltip title={translate("Delete holiday")} placement="top">
            <Button
              style={{ marginLeft: "10px" }}
              onClick={() => this.deleteHoliday(x.id)}
              className="showBtn-delete"
            >
              <IoTrashSharp id="trash-btn" />{" "}
            </Button>
          </LightTooltip>
        </StyledTableCell>
      );
    }
  }
  checkRhbtn() {
    if (sessionStorage.getItem("role") === "RH") {
      return (
        <div className="btnholiday">
          <button
            onClick={
              () =>
                this.setState({
                  holidayData: { id: "", name: "", date: "", duration: "" },
                  modalShow: true,
                }) /*this.addHolidays.bind(this)*/
            }
            className="btn btn-primary"
            style={{ marginRight: "10px" }}
          >
            <IoAddCircleSharp
              style={{ fontSize: "25px", marginRight: "6px" }}
            />
            {translate("add holiday")}
          </button>
          {/*add ramadane button*/}
          <button
            onClick={() =>
              this.setState({
                addRamadanData: { id: "", startDate: "", endDate: "" },
                modalShow2: true,
              })
            }
            className="btn btn-primary"
            style={{
              marginRight: "10px",
              border: "2px solid #04AA6D",
              color: "#04AA6D",
            }}
          >
            <IoAddCircleSharp
              style={{ fontSize: "25px", marginRight: "6px", color: "#04AA6D" }}
            />
            {translate("Update Ramadan")}
          </button>
        </div>
      );
    }
  }

  handleChange = (event) => {
    if (event.target.value != "") {
      this.setState((prevState) => {
        return {
          holidays: prevState.holidays.filter((hol) =>
            hol.name.toUpperCase().includes(event.target.value.toUpperCase())
          ),
        };
      });
    } else {
      this.setState({ holidays: this.state.BackUpHoliday });
    }
  };

  render() {
    return (
      <React.Fragment>
        <div>
          {this.state.fetching ? <Fetching /> : null}
          <br></br>
          <div className="row">
            <div
              className="btnholiday"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <FormattedMessage id="Search">
                {(message) => (
                  <InputGroup
                    className="mb-2"
                    style={{ width: "30%", paddingLeft: 10 }}
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
              {this.checkRhbtn()}
            </div>
            {/*<table className = "table table-striped table-bordered">
                        <Table striped bordered hover variant="dark" style={{boxShadow:'0px 10px 13px -7px #000000, 5px 5px 15px 5px rgba(0,0,0,0)'}}>
                            <thead>
                                <tr>
                                    <th>{translate('Holiday')}</th>
                                    <th>{translate('date')}</th>
                                    <th>{translate('Duration')}</th>
                                    {sessionStorage.getItem('role')==="RH"? <th>{translate('Action')}</th> : null}
                                </tr>
                            </thead>
                            <tbody>
                                {   
                                    this.state.holidays.sort(function(a, b) {
                                        var c = new Date(a.date);
                                        var d = new Date(b.date);
                                        return c.getTime()-d.getTime();
                                    }).filter(val=>{
                                        let re = val.country
                                       console.log("session: "+typeof(sessionStorage.getItem("country")))
                                        console.log(typeof(re))
                                        console.log(re===sessionStorage.getItem("country"))
                                        if(re===sessionStorage.getItem("country")){return val}}).map(
                                        
                                        holiday => 
                                        <tr key = {holiday.id }>
                                            <td> {holiday.name}</td>
                                            <td> {holiday.date}</td>
                                            <td> {holiday.duration}</td>
                                            {this.checkRh(holiday.id)}
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>*/}
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
                        {translate("Holiday")}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {translate("date")}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {translate("Duration")}
                      </StyledTableCell>
                      {sessionStorage.getItem("role") === "RH" ? (
                        <StyledTableCell align="center">
                          {translate("Action")}
                        </StyledTableCell>
                      ) : null}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.holidays
                      .sort(function (a, b) {
                        var c = new Date(a.date);
                        var d = new Date(b.date);
                        return c.getTime() - d.getTime();
                      })
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
                            {row.date}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {row.duration}
                          </StyledTableCell>
                          {this.checkRh(row)}
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>

        <AddHolidayModal
          show={this.state.modalShow}
          onHide={() =>
            this.setState({
              holidayData: { id: "", name: "", date: "", duration: "" },
              modalShow: false,
            })
          }
          refresh={() => this.componentDidMount()}
          holidayData={this.state.holidayData}
        />
        <AddRamadanDate
          show={this.state.modalShow2}
          onHide={() =>
            this.setState({
              addRamadanData: { id: "", startDate: "", endDate: "" },
              modalShow2: false,
            })
          }
          refresh={() => this.componentDidMount()}
          addRamadanData={this.state.addRamadanData}
        />
      </React.Fragment>
    );
  }
}

export default Holidaylist;
