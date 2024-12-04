import React, { Component } from "react";
import collaboratorService from "../../servicees/CollaborateurServices";
import dateFormat from "dateformat";
import { FormattedMessage } from "react-intl";
import { I18nPropvider, LOCALES } from "../../i18nProvider";
import translate from "../../i18nProvider/translate";
import { Row, Button } from "react-bootstrap";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import countries from "./countries";
import Fetching from "../list/Fetching";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Swal from "sweetalert2";
//code changes in balance action treatment
import BalanceActionService from "../../servicees/BalanceActionService";
//traitment of add select unitname options
import UnitService from "../../servicees/UnitService";
import Select from "react-select";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const englishColumn = [
  "Email",
  "Invalid Email or Username",
  "Username",
  "Invalid registration",
  "Try Again",
];
const frenchColumn = [
  "E-mail",
  "E-mail ou nom d'utilisateur invalide",
  "Nom d'utilisateur",
  "Enregistrement invalide",
  "Réessayez",
];
const spanishColumn = [
  "Correo electrónico",
  "Correo electrónico o nombre de usuario no válido",
  "Nombre de usuario",
  "Registro no válido",
  "intentar otra vez",
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

class addCollaborator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // step 2
      id: this.props.match.params.id,

      firstname: "",
      lastname: "",
      cin: "",
      birthday: "2000-01-01",
      adresse: "Tetouan",
      password: "Nttd@t@2022",
      email: "",
      username: "",
      Country: "",
      experience: "",
      //treatment of increment balance by experience
      experience_affiliationDate: "2000-01-01",
      annualBalance: "",
      contractBalance: "",
      cumulativeBalance: "",
      remainder: "",
      soldes: [],
      years: "",
      balance: "",
      fetching: false,
      open: false,
      //code traitement country work in add and update user
      count1: { code: "MA", label: "Morocco", phone: "212" },
      //count1:{ code: "LB", label: "Lebanon", phone: "961" },
      count2: {},
      //code changes in balance action treatment
      // Action historique traitement
      resonOfChange: "",
      isFocused: false,
      backUpTotalBalance: "",
      //traitment of add select unitname options
      unitname: "Pool",
      unitnames: [],
      options: [],
    };

    this.changefirstnameHandler = this.changefirstnameHandler.bind(this);
    this.changelastnameHandler = this.changelastnameHandler.bind(this);
    this.changeageHandler = this.changeageHandler.bind(this);
    this.changeadresseHandler = this.changeadresseHandler.bind(this);
    this.changepasswordHandler = this.changepasswordHandler.bind(this);
    //traitment of add select unitname options
    this.changeunitnameHandler = this.changeunitnameHandler.bind(this);
    this.changeusernameHandler = this.changeusernameHandler.bind(this);
    this.changecountry_workHandler = this.changecountry_workHandler.bind(this);
    this.changeemailHandler = this.changeemailHandler.bind(this);
    this.saveOrUpdateUser = this.saveOrUpdateUser.bind(this);
    this.changeexperienceHandler = this.changeexperienceHandler.bind(this);
    //treatment of increment balance by experience
    this.changeexperience_affiliationDateHandler =
      this.changeexperience_affiliationDateHandler.bind(this);
    this.changeannualBalanceHandler =
      this.changeannualBalanceHandler.bind(this);
    this.changeremainderHandler = this.changeremainderHandler.bind(this);
    this.soldess = this.soldess.bind(this);
    this.deletelist = this.deletelist.bind(this);
    this.changeBalance = this.changeBalance.bind(this);
    this.changeYear = this.changeYear.bind(this);
    this.changeCINHandler = this.changeCINHandler.bind(this);
    this.changecontractBalanceHandler =
      this.changecontractBalanceHandler.bind(this);
    //code changes in balance action treatment
    this.addReasonOfChange = this.addReasonOfChange.bind(this);
  }

  // get collaborator formation if user click in update
  componentDidMount = () => {
    this._isMounted = true;

    //traitment of add select unitname options
    UnitService.getAllUnitNames().then((res) => {
      this.setState({ unitnames: res.data });
      console.log(res.data);
      this.setState({
        options: res.data.map((valueName) => {
          return {
            value: { unitname: valueName },
            label: valueName,
          };
        }),
      });
    });

    if (this.state.id === ":id") {
      return;
    } else {
      collaboratorService.getUserById(this.state.id).then((res) => {
        let user = res.data;
        // Action historique traitement
        //code changes in balance action treatment
        let backUpTotalBalance =
          user.solde.annualBalance +
          this.calculeCumulaticeBalance(user.solde.cumulativeBances);

        //code traitement country work in add and update user
        this.findOptionofCountryWorkByValue(user.country);
        /*countries.map(country => {
                    if(country.label === user.country){
                        //this.setState({count1:country})
                        this.setState(prevState => ({
                            count1: {
                                code:country.code , label:country.label , phone: country.phone
                            }
                        }));
                    }
                })*/
        this.setState({
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          cin: user.cin,
          birthday: user.birthday,
          adresse: user.adresse,
          email: user.email,
          password: user.password,
          username: user.username,
          Country: user.country,
          annualBalance: user.solde.annualBalance,
          contractBalance: user.solde.contractBalance,
          experience: user.experience,
          // treatment of increment balance by experience
          experience_affiliationDate: user.experience_affiliationDate,
          remainder: user.solde.remainder,
          soldes: user.solde.cumulativeBances,
          //code changes in balance action treatment
          // Action historique traitement
          backUpTotalBalance: backUpTotalBalance,
        });
      });
    }
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false });
  };

  //traitement balance action
  //code changes in balance action treatment
  calculeCumulaticeBalance(cumulativeBances) {
    let sumBalance = 0;
    // if (cumulativeBances != [] && cumulativeBances != null) {
    //   //cumulativeBances.map((solde) => (a = a + solde.balance));
    // }

    sumBalance = cumulativeBances.reduce(
      (cumul, value) => cumul + parseFloat(value.balance),
      0
    );

    return sumBalance;
  }

  //errors for  formation not inputed
  errors = (x) => {
    document.querySelector("." + x).style.display = "block";
    setTimeout(function () {
      document.querySelector("." + x).style.display = "none";
    }, 10200);
    document.querySelector(".error").style.display = "inline-block";
    setTimeout(function () {
      document.querySelector(" .error").style.display = "none";
    }, 10200);
  };
  saveOrUpdateUser = (e) => {
    this._isMounted = true;
    e.preventDefault();

    if (this.state.firstname === "") {
      this.errors("firstname");
    }
    if (this.state.lastname === "") {
      this.errors("lastname");
    }
    if (this.state.cin === "") {
      this.errors("cin");
    }
    if (this.state.password === "") {
      this.errors("password");
    }
    //traitment of add select unitname options
    if (this.state.unitname === "") {
      this.errors("unit");
    }
    if (this.state.adresse === "") {
      this.errors("address");
    }
    if (this.state.email === "") {
      this.errors("email");
    }
    /*if(this.state.experience === ""){
            this.errors('experience')
        }*/
    //treatment of increment balance by experience
    if (this.state.experience_affiliationDate === "") {
      this.errors("experience");
    }
    if (this.state.birthday === "") {
      this.errors("birthday");
    }
    if (this.state.username === "") {
      this.errors("username");
    }
    if (this.state.Country === "") {
      this.errors("country");
    }
    if (this.state.contractBalance === "") {
      this.errors("contractBalance");
    }
    if (this.state.annualBalance === "") {
      this.errors("annualBalance");
    }
    if (this.state.remainder === "") {
      this.errors("remainder");
    } else {
      if (this.state.soldes.length === 0) {
        let DateReqBackup = {
          year: new Date().getFullYear() - 1,
          balance: 0,
        };
        this.state.soldes.push(DateReqBackup);
      }
      let user = {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        cin: this.state.cin,
        birthday: this.state.birthday,
        adresse: this.state.adresse,
        username: this.state.username,
        password: this.state.password,
        country: this.state.Country,
        email: this.state.email,
        experience: this.state.experience,
        //treatment of increment balance by experience
        experience_affiliationDate: this.state.experience_affiliationDate,
        solde: {
          annualBalance: this.state.annualBalance,
          contractBalance: this.state.contractBalance,
          remainder: this.state.remainder,
          cumulativeBances: this.state.soldes,
        },
      };
      //treatment of log user connected add update users page
      const userDetaile =
        JSON.parse(sessionStorage.getItem("firstname")) +
        " " +
        JSON.parse(sessionStorage.getItem("lastname")) +
        " - " +
        " Create User By RH Admin ";
      const userDetaile1 =
        JSON.parse(sessionStorage.getItem("firstname")) +
        " " +
        JSON.parse(sessionStorage.getItem("lastname")) +
        " - " +
        " Update User By RH Admin ";
      if (this.state.id === ":id") {
        user.password = this.state.password;
        let newone = collaboratorService
          .getUserByUsername(user.username)
          .then((res) => {
            if (!res.data) {
              let varificationemail = collaboratorService
                .getUserByEmail(user.email)
                .then((res) => {
                  if (!res.data) {
                    //treatment of log user connected add update users page
                    collaboratorService
                      .createUser(user, userDetaile, this.state.unitname)
                      .then((res) => {
                        this.setState({ open: true });
                        setTimeout(() => {
                          this.props.history.push("/admin/list/Collaborator");
                        }, 3000);
                        //send Email Once The User Has Been Added
                        collaboratorService.sendEmailOnceNewUserHasBeenAdded(
                          user
                        );
                      });
                  } else {
                    //alert(DatagridColumn[0] + user.email + DatagridColumn[1]);
                    //traitement of user enumeration
                    Swal.fire({
                      title: DatagridColumn[3],
                      icon: "info",
                      confirmButtonText: DatagridColumn[4],
                      text: DatagridColumn[1],
                    });
                    this.setState({ email: "" });
                    this.setState({ username: "" });
                  }
                });
            } else {
              //alert(DatagridColumn[2] + user.username + DatagridColumn[1]);
              //traitement of user enumeration
              Swal.fire({
                title: DatagridColumn[3],
                icon: "info",
                confirmButtonText: DatagridColumn[4],
                text: DatagridColumn[1],
              });
              this.setState({ email: "" });
              this.setState({ username: "" });
            }
          });
      } else {
        this.setState({ fetching: true });
        //treatment of log user connected add update users page
        //code changes in balance action treatment
        if (this.state.isFocused === true && this.state.resonOfChange != "") {
          // traitement balance action
          let BalanceAction = {
            name: "Update User By Admin",
            typeofaction: "Admin",
            addedBy:
              JSON.parse(sessionStorage.getItem("firstname")) +
              " " +
              JSON.parse(sessionStorage.getItem("lastname")),
            actionDate: dateFormat(new Date(), "yyyy-mm-dd"),
            dateTime: dateFormat(new Date(), "HH:MM:ss"),
            employeeID: this.state.id,
            reasonOfChange:
              "The Remaining Balance is " +
              this.state.backUpTotalBalance +
              " day(s). The reason of change is '" +
              this.state.resonOfChange +
              "'.",
            //convert type from string to Float
            totalBalance:
              parseFloat(user.solde.annualBalance) +
              this.calculeCumulaticeBalance(user.solde.cumulativeBances),
          };
          BalanceActionService.createBalanceAction(BalanceAction);
        }
        console.log(user);

        collaboratorService
          .updateUser(user, this.state.id, userDetaile1)
          .then((res) => {
            this.setState({ fetching: false });
            this.props.history.push("/admin/list/Collaborator");
          });
      }
    }
  };

  changeageHandler = (event) => {
    this.setState({ birthday: event.target.value });
  };

  changefirstnameHandler = (event) => {
    this.setState({ firstname: event.target.value });
  };

  changelastnameHandler = (event) => {
    this.setState({ lastname: event.target.value });
  };
  changeCINHandler = (event) => {
    this.setState({ cin: event.target.value });
  };
  changepasswordHandler = (event) => {
    this.setState({ password: event.target.value });
  };
  //traitment of add select unitname options
  changeunitnameHandler = (changeUnitName) => {
    this.setState({ unitname: changeUnitName.value.unitname });
  };
  changeadresseHandler = (event) => {
    this.setState({ adresse: event.target.value });
  };
  changeunite_organisationelleHandler = (event) => {
    this.setState({ unite_organisationelle: event.target.value });
  };
  changeusernameHandler = (event) => {
    this.setState({ username: event.target.value });
  };
  changecountry_workHandler = (event) => {
    this.setState({ Country: event.target.value });
  };
  changeexperienceHandler = (event) => {
    this.setState({ experience: event.target.value });
  };
  //treatment of increment balance by experience
  changeexperience_affiliationDateHandler = (event) => {
    this.setState({ experience_affiliationDate: event.target.value });
  };

  //code changes in balance action treatment
  changeannualBalanceHandler = (event) => {
    console.log(event.target.value);
    if (event.target.value.includes(",")) {
      let fixBalance = event.target.value.split(",");
      event.target.value = fixBalance[0] + "." + fixBalance[1];
    }
    // action historique
    if (this.state.annualBalance != event.target.value) {
      this.setState({ isFocused: true });
    }

    this.setState({ annualBalance: event.target.value });
  };

  //code changes in balance action treatment
  changecontractBalanceHandler = (event) => {
    if (event.target.value.includes(",")) {
      let fixContratBalance = event.target.value.split(",");
      event.target.value = fixContratBalance[0] + "." + fixContratBalance[1];
    }
    // action historique
    if (this.state.contractBalance != event.target.value) {
      this.setState({ isFocused: true });
    }
    this.setState({ contractBalance: event.target.value });
  };
  changeremainderHandler = (event) => {
    if (event.target.value.includes(",")) {
      let fixReminder = event.target.value.split(",");
      event.target.value = fixReminder[0] + "." + fixReminder[1];
    }
    this.setState({ remainder: event.target.value });
  };
  changeemailHandler = (event) => {
    this.setState({ email: event.target.value });
  };
  changeBalance = (event) => {
    this.setState({ balance: event.target.value });
  };
  changeYear = (event) => {
    this.setState({ years: event.target.value });
  };
  cancel() {
    this.props.history.push("/admin/list/collaborator");
  }
  getTitle() {
    if (this.state.id === ":id") {
      return <h3 className="text-center"></h3>;
    } else {
      return <h3 className="text-center"></h3>;
    }
  }
  //code changes in balance action treatment
  addReasonOfChange = (event) => {
    this.setState({ resonOfChange: event.target.value });
  };

  //table of comulative balance
  soldess() {
    if (this.state.soldes != [] && this.state.soldes != null) {
      return (
        <table
          className="table table-striped table-bordered"
          style={{ padding: "0px", margin: "0px" }}
        >
          <thead>
            <tr>
              <th>{translate("Years")}</th>
              <th>{translate("Balance")}</th>
              <th>{translate("Action")}</th>
            </tr>
          </thead>
          <tbody>
            {this.state.soldes.map((balance, index) => (
              <tr key={index}>
                <td> {balance.year}</td>
                <td> {balance.balance}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      this.deletelist(index);
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
  //delete a comulative balance
  //code changes in balance action treatment
  deletelist(i) {
    this.state.soldes.splice(i, 1);
    this.setState({ soldes: this.state.soldes });
    this.setState({ isFocused: true });
  }
  //add comuulative balance
  //code changes in balance action treatment
  add() {
    let DateReq = {
      year: this.state.years,
      balance: this.state.balance,
    };
    if (this.state.soldes === null) {
      this.state.soldes = [];
    }
    this.state.soldes.push(DateReq);
    this.setState({ soldes: this.state.soldes });
    this.setState({ isFocused: true });
    console.log(this.state.soldes);
  }

  //code traitement country work in add and update user
  /***** */
  findOptionofCountryWorkByValue = (val) => {
    countries.map((country) => {
      if (country.label === val) {
        this.setState({ count1: country });
      }
    });
  };
  /***** */

  render() {
    return (
      <div>
        {this.state.fetching ? <Fetching /> : null}
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={this.state.open}
            autoHideDuration={6000}
            onClose={this.handleClose}
          >
            <Alert
              onClose={this.handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              {translate("The Employee")}{" "}
              {this.state.firstname + " " + this.state.lastname}{" "}
              {translate("is successfully added")}
            </Alert>
          </Snackbar>
        </Stack>
        <br></br>
        <div className="container">
          <div className="row">
            <div className="card col-md-6 offset-md-3 offset-md-3">
              {this.getTitle()}
              <div className="card-body">
                <h3 style={{ color: "silver", textAlign: "center" }}>
                  {translate("Employee Informations")}
                </h3>
                <form>
                  <div className="form-group">
                    <label>
                      {" "}
                      <FormattedMessage id="FirstName" />:{" "}
                    </label>
                    <FormattedMessage id="FirstName">
                      {(message) => (
                        <input
                          placeholder={message}
                          name="firstname"
                          className="form-control"
                          value={this.state.firstname}
                          onChange={this.changefirstnameHandler}
                        />
                      )}
                    </FormattedMessage>
                    <div
                      className="hidden-error text-danger firstname"
                      style={{ display: "none" }}
                    >
                      {translate("Enter the first name")}.
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{translate("LastName")}: </label>
                    <FormattedMessage id="LastName">
                      {(message) => (
                        <input
                          placeholder={message}
                          name="lastname"
                          className="form-control"
                          value={this.state.lastname}
                          onChange={this.changelastnameHandler}
                        />
                      )}
                    </FormattedMessage>
                    <div
                      className="hidden-error text-danger lastname"
                      style={{ display: "none" }}
                    >
                      {translate("Enter the Last Name")}.
                    </div>
                  </div>
                  <div className="form-group">
                    <label> {translate("Employee Nr")} </label>
                    <FormattedMessage id="Employee Nr">
                      {(message) => (
                        <input
                          placeholder={message}
                          name="cin"
                          className="form-control"
                          value={this.state.cin}
                          onChange={this.changeCINHandler}
                        />
                      )}
                    </FormattedMessage>
                    <div
                      className="hidden-error text-danger cin"
                      style={{ display: "none" }}
                    >
                      {translate("Enter the Employee Nr")}.
                    </div>
                  </div>
                  {
                    /*this.state.id===":id"?*/ <div className="form-group">
                      <label> {translate("birthday")}: </label>
                      <FormattedMessage id="birthday">
                        {(message) => (
                          <input
                            placeholder={message}
                            name="birthday"
                            className="form-control"
                            type="date"
                            value={this.state.birthday}
                            onChange={this.changeageHandler}
                          />
                        )}
                      </FormattedMessage>
                      <div
                        className="hidden-error text-danger birthday"
                        style={{ display: "none" }}
                      >
                        {translate("Enter the birthday")}.
                      </div>
                    </div> /*: null */
                  }
                  <div className="form-group">
                    <label> {translate("address")}: </label>
                    <FormattedMessage id="address">
                      {(message) => (
                        <input
                          placeholder={message}
                          name="adress"
                          className="form-control"
                          value={this.state.adresse}
                          onChange={this.changeadresseHandler}
                        />
                      )}
                    </FormattedMessage>
                    <div
                      className="hidden-error text-danger address"
                      style={{ display: "none" }}
                    >
                      {translate("Enter the address")}.
                    </div>
                  </div>
                  <div className="form-group">
                    <label> {translate("username")}: </label>
                    <FormattedMessage id="username">
                      {(message) => (
                        <input
                          placeholder={message}
                          name="username"
                          className="form-control"
                          value={this.state.username}
                          onChange={this.changeusernameHandler}
                        />
                      )}
                    </FormattedMessage>
                    <div
                      className="hidden-error text-danger username"
                      style={{ display: "none" }}
                    >
                      {translate("Enter the username")}.
                    </div>
                  </div>
                  {this.state.id === ":id" ? (
                    <div className="form-group">
                      <label>{translate("password")}: </label>
                      <FormattedMessage id="password">
                        {(message) => (
                          <input
                            placeholder={message}
                            name="password"
                            className="form-control"
                            value={this.state.password}
                            onChange={this.changepasswordHandler}
                          />
                        )}
                      </FormattedMessage>
                      <div
                        className="hidden-error text-danger password"
                        style={{ display: "none" }}
                      >
                        {translate("Enter the password")}.
                      </div>
                    </div>
                  ) : null}
                  {/* traitment of add select unitname options */}
                  {this.state.id === ":id" ? (
                    <div className="form-group">
                      <label>{translate("Organizational Unit")}: </label>
                      <Select
                        styles={{
                          menu: (provided) => ({ ...provided, zIndex: 9999 }),
                        }}
                        value={this.state.options.find(
                          (option) => option.label === this.state.unitname
                        )}
                        onChange={(change) =>
                          this.changeunitnameHandler(change)
                        }
                        options={this.state.options}
                      />
                      <div
                        className="hidden-error text-danger unit"
                        style={{ display: "none" }}
                      >
                        {translate("Choose an Organizational Unit")}.
                      </div>
                    </div>
                  ) : null}
                  {/**/}
                  <div className="form-group">
                    <label>
                      {translate("country work")}:{" "}
                      {/*this.state.id === ":id" ? null : <span style={{color:'red',fontWeight:'bold',fontSize: 13}}>{translate('Please reselect the Country Work')}</span>*/}
                    </label>
                    <Autocomplete
                      id="country-select-demo"
                      sx={{ width: 300 }}
                      options={countries}
                      //defaultValue={{ label: "Morocco"}}
                      //defaultValue={this.state.count1}
                      //code traitement country work in add and update user
                      value={this.state.count1}
                      isOptionEqualToValue={(option, value) =>
                        option.label === value.label
                      }
                      autoHighlight
                      inputValue={this.state.Country}
                      onInputChange={(event, newInputValue) => {
                        this.setState({ Country: newInputValue });
                      }}
                      getOptionLabel={(option) => option.label}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                          {...props}
                        >
                          <img
                            loading="lazy"
                            style={{ width: "20px", height: "15px" }}
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                          />
                          {option.label} ({option.code})
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={translate("Choose a country")}
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password", // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                    <div
                      className="hidden-error text-danger country"
                      style={{ display: "none" }}
                    >
                      {translate("Enter the country")}.
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{translate("Experience")}: </label>
                    <FormattedMessage id="Experience">
                      {(message) => (
                        <input
                          placeholder={message}
                          name="country_work"
                          className="form-control"
                          type="date"
                          value={
                            /*this.state.experience - treatment of increment balance by experience */ this
                              .state.experience_affiliationDate
                          }
                          onChange={
                            /*this.changeexperienceHandler - treatment of increment balance by experience */ this
                              .changeexperience_affiliationDateHandler
                          }
                        />
                      )}
                    </FormattedMessage>
                    <div
                      className="hidden-error text-danger experience"
                      style={{ display: "none" }}
                    >
                      {translate("Enter the experience")}.
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{translate("Email")}: </label>
                    <input
                      placeholder="exemple@exemple.com"
                      name="email"
                      className="form-control"
                      type="email"
                      value={this.state.email}
                      onChange={this.changeemailHandler}
                    />
                    <div
                      className="hidden-error text-danger email"
                      style={{ display: "none" }}
                    >
                      {translate("Enter the email")}.
                    </div>
                  </div>

                  <div className="form-group">
                    <h3
                      style={{ color: "silver", textAlign: "center" }}
                      onClick={this.add.bind(this)}
                    >
                      {translate("Balance")}
                    </h3>
                    <Button
                      className="btn btn-success"
                      style={{
                        marginLeft: "10px",
                        float: "right",
                        marginTop: "41px",
                      }}
                      onClick={this.add.bind(this)}
                    >
                      {translate("Add")}
                    </Button>
                    <div className="form-group" style={{ display: "flex" }}>
                      <div className="form-group col-6">
                        <label>{translate("Years")}: </label>
                        <FormattedMessage id="Years">
                          {(message) => (
                            <input
                              placeholder={message}
                              className="form-control"
                              onChange={this.changeYear}
                            />
                          )}
                        </FormattedMessage>
                      </div>
                      <div className="form-group col-6">
                        <label>{translate("Balance")}: </label>
                        <FormattedMessage id="Balance">
                          {(message) => (
                            <input
                              placeholder={message}
                              type="number"
                              className="form-control"
                              onChange={this.changeBalance}
                            />
                          )}
                        </FormattedMessage>
                      </div>
                    </div>
                    {this.soldess()}
                    <div className="form-group">
                      <label>{translate("Annual Balance")}: </label>
                      <FormattedMessage id="Annual Balance">
                        {(message) => (
                          <input
                            placeholder={message}
                            type="number"
                            name="country_work"
                            className="form-control"
                            value={this.state.annualBalance}
                            onChange={this.changeannualBalanceHandler}
                            required
                          />
                        )}
                      </FormattedMessage>
                      <div
                        className="hidden-error text-danger annualBalance"
                        style={{ display: "none" }}
                      >
                        {translate("Enter the annual balance")}.
                      </div>
                    </div>
                    <div className="form-group">
                      <label>{translate("Contract Balance")}: </label>
                      <FormattedMessage id="Contract Balance">
                        {(message) => (
                          <input
                            placeholder={message}
                            type="number"
                            name="country_work"
                            className="form-control"
                            value={this.state.contractBalance}
                            onChange={this.changecontractBalanceHandler}
                            required
                          />
                        )}
                      </FormattedMessage>
                      <div
                        className="hidden-error text-danger contractBalance"
                        style={{ display: "none" }}
                      >
                        {translate("Enter the contract balance")}.
                      </div>
                    </div>
                    {/* //Action historique traitement //code changes in balance action treatment */}

                    {this.state.isFocused && this.state.id != ":id" && (
                      <div className="form-group">
                        <label>{translate("ReasonOfChange")}: </label>
                        <FormattedMessage id="ReasonOfChange">
                          {(message) => (
                            <textarea
                              rows="3"
                              cols="33"
                              placeholder={message}
                              type="text"
                              name="reason_Of_Change"
                              className="form-control"
                              maxLength="50"
                              value={this.state.resonOfChange}
                              onChange={this.addReasonOfChange}
                              required
                            />
                          )}
                        </FormattedMessage>
                      </div>
                    )}

                    {/* ///////////////////////// */}
                    <div className="form-group">
                      <label>{translate("Remainder")}: </label>
                      <FormattedMessage id="Remainder">
                        {(message) => (
                          <input
                            placeholder={message}
                            type="number"
                            name="country_work"
                            className="form-control"
                            value={this.state.remainder}
                            onChange={this.changeremainderHandler}
                            required
                          />
                        )}
                      </FormattedMessage>
                      <div
                        className="hidden-error text-danger remainder"
                        style={{ display: "none" }}
                      >
                        {translate("Enter the remainder")}.
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-success"
                    id="addBTN"
                    style={{ padding: "6px 18px" }}
                    onClick={this.saveOrUpdateUser}
                    disabled={this.state.Country != "" ? false : true}
                  >
                    {translate("Save")}
                  </button>
                  <button
                    className="btn btn-danger"
                    id="deleteReqBTN"
                    onClick={this.cancel.bind(this)}
                    style={{ marginLeft: "10px" }}
                  >
                    {translate("Cancel")}
                  </button>
                  <span
                    className="hidden-error text-danger error"
                    style={{ display: "none", paddingLeft: "20px" }}
                  >
                    {translate("Error")}
                  </span>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default addCollaborator;
