import React from "react";
import "layouts/Login1.css";
import LogoHoride from "../../assets/img/bg/horide.png";
import { withRouter } from "react-router-dom";
import ForgotService from "../../servicees/ForgotServices";
import Swal from "sweetalert2";
import { Button } from "react-bootstrap";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Fetching from "com/list/Fetching";

const englishStrings = {
  passwordNoMatch: "Passwords do not match",
  done: "Done",
  passwordRenewalSuccess:
    "Congratulations, your password has been successfully renewed",
  confirmButtonText: "Ok",
};

const frenchStrings = {
  passwordNoMatch: "Les mots de passe ne correspondent pas",
  done: "Terminé",
  passwordRenewalSuccess:
    "Félicitations, votre mot de passe a été renouvelé avec succès",
  confirmButtonText: "D'accord",
};

const spanishStrings = {
  passwordNoMatch: "Las contraseñas no coinciden",
  done: "Hecho",
  passwordRenewalSuccess:
    "Felicidades, su contraseña ha sido renovada correctamente",
  confirmButtonText: "bueno",
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

class NewPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newpassword: "",
      retypepassword: "",
      passwordShown: false,
      fetching: false,
    };
    this.changenewpasswordHandler = this.changenewpasswordHandler.bind(this);
    this.changereytpepasswordHandler =
      this.changereytpepasswordHandler.bind(this);
    this.changereytpepasswordHandler =
      this.changereytpepasswordHandler.bind(this);
  }
  changenewpasswordHandler = (event) => {
    this.setState({ newpassword: event.target.value });
  };
  changereytpepasswordHandler = (event) => {
    this.setState({ retypepassword: event.target.value });
  };
  saveOrUpdatePassword = (e) => {
    e.preventDefault();
    this.setState({ fetching: true });
    //console.log(this.state.newpassword === this.state.retypepassword )
    if (
      this.state.newpassword === this.state.retypepassword &&
      this.state.newpassword != ""
    ) {
      ForgotService.ResetPassword(
        sessionStorage.getItem("email"),
        this.state.newpassword
      ).then((res) => {
        Swal.fire({
          title: strings.done,
          text: strings.passwordRenewalSuccess,
          icon: "success",
          confirmButtonText: strings.confirmButtonText,
        }).then((result) => {
          if (result.isConfirmed) {
            this.setState({ fetching: false });
            sessionStorage.clear();
            this.props.history.push("/");
          }
        });
      });
    } else {
      Swal.fire({
        title: strings.passwordNoMatch,
        confirmButtonText: strings.confirmButtonText,
        icon: "warning",
      }).then((result) => {
        if (result.isConfirmed) {
          this.setState({
            fetching: false,
          });
        }
      });
    }
  };
  togglePassword = () => {
    this.setState((prevState) => ({ passwordShown: !prevState.passwordShown }));
  };
  render() {
    //console.log(this.state.newpassword === this.state.retypepassword)
    //console.log(sessionStorage.getItem('email'))
    return (
      <React.Fragment>
        {this.state.fetching ? <Fetching /> : null}
        <div className="body">
          <div className="propre-container ">
            <div className="container   mx-auto">
              <div className="">
                <div className="card  ">
                  <div className="card-header ">
                    {/* <img src={Logo} alt="Logo" />*/}
                    <img
                      src={LogoHoride}
                      alt="Logo"
                      style={{
                        width: "45%",
                        height: "auto",
                        paddingTop: "inherit",
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <form action="">
                        <label>NEW PASSWORD</label>
                        <div
                          className="container-sm element-margin"
                          style={{
                            display: "flex",
                            border: "1px solid #E3E3E3",
                            marginTop: "20px",
                            paddingTop: 0,
                            paddingLeft: 0,
                            width: "93%",
                            borderRadius: "4px",
                          }}
                        >
                          <input
                            type={
                              this.state.passwordShown ? "text" : "password"
                            }
                            name="passwordN"
                            className="form-control"
                            placeholder="New Password"
                            onChange={this.changenewpasswordHandler}
                            style={{ border: "none" }}
                            required
                          />
                          <Button
                            onClick={this.togglePassword}
                            style={{
                              border: "none",
                              padding: 0,
                              fontSize: "23px",
                              color: "#A9A9A9",
                            }}
                          >
                            {this.state.passwordShown ? (
                              <IoEye />
                            ) : (
                              <IoEyeOff />
                            )}
                          </Button>
                        </div>
                        <label>RETYPE PASSWORD</label>
                        <div
                          className="container-sm element-margin"
                          style={{
                            display: "flex",
                            border: "1px solid #E3E3E3",
                            marginTop: "20px",
                            paddingTop: 0,
                            paddingLeft: 0,
                            width: "93%",
                            borderRadius: "4px",
                          }}
                        >
                          <input
                            type={
                              this.state.passwordShown ? "text" : "password"
                            }
                            name="passwordNR"
                            className="form-control"
                            placeholder="Repeat Password"
                            onChange={this.changereytpepasswordHandler}
                            style={{ border: "none" }}
                            required
                          />
                          <Button
                            onClick={this.togglePassword}
                            style={{
                              border: "none",
                              padding: 0,
                              fontSize: "23px",
                              color: "#A9A9A9",
                            }}
                          >
                            {this.state.passwordShown ? (
                              <IoEye />
                            ) : (
                              <IoEyeOff />
                            )}
                          </Button>
                        </div>

                        <div className="container-sm element-margin">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            name="singIn"
                            onClick={this.saveOrUpdatePassword}
                          >
                            Validate password
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => this.props.history.push("/")}
                            style={{ marginLeft: "10px" }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(NewPassword);
