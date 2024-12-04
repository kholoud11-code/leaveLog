import React from "react";
import LogoHoride from "../assets/img/bg/horide.png";
//import collaboratorService from '../servicees/CollaborateurServices';
//import ForgotPassService from '../servicees/ForgotPassService';
import ForgotService from "../servicees/ForgotServices";
import "./Login1.css";
import { withRouter } from "react-router-dom";
import translate from "../i18nProvider/translate";
import Swal from "sweetalert2";

const englishStrings = {
  login: "Login",
  retry: "Retry",
  invalidAttempt: "Invalid attempt",
};

const frenchStrings = {
  login: "Connexion",
  retry: "Réessayer",
  invalidAttempt: "Tentative invalide",
};

const spanishStrings = {
  login: "Iniciar sesión",
  retry: "Reintentar",
  invalidAttempt: "Intento inválido",
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

class ForgetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      //traitement of user enumeration
      failedAttempts:
        parseInt(localStorage.getItem("forgotPasswordAttempts")) || 0,
      timeattend: parseInt(localStorage.getItem("timeattend")) || 0,
      isLocked: localStorage.getItem("timeattend") === null ? false : true,
    };
    //this.changeemailHandler=this.changeemailHandler.bind(this);
    //this.forgot = this.forgot.bind(this);

    this.changeemailHandler = this.changeemailHandler.bind(this);
    this.SubmitForgot = this.SubmitForgot.bind(this);
  }

  SubmitForgot = (e) => {
    this._isMounted = true;
    e.preventDefault();
    //traitement of user enumeration
    if (this.state.email != "") {
      const pass = ForgotService.requestforgot(this.state.email).then((res) => {
        //console.log(res.data)
        if (res.data) {
          sessionStorage.setItem("email", this.state.email);
          //traitement of user enumeration
          this.setState({ failedAttempts: 0 });
          localStorage.removeItem("forgotPasswordAttempts");
          localStorage.removeItem("timeattend");
          //console.log(res.data);
          this.props.history.push("/codepin");
        } else {
          //traitement of user enumeration
          const newFailedAttempts = this.state.failedAttempts + 1;
          this.setState({ failedAttempts: newFailedAttempts });
          if (newFailedAttempts >= 5) {
            this.setState({ isLocked: true });
            localStorage.setItem("timeattend", new Date().getTime());
            setTimeout(() => {
              this.setState({ failedAttempts: 0 });
              this.setState({ isLocked: false });
              localStorage.removeItem("forgotPasswordAttempts");
              localStorage.removeItem("timeattend");
            }, 5 * 60 * 1000);
          } else {
            //traitement of user enumeration
            Swal.fire({
              title: strings.invalidAttempt,
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: strings.retry,
              cancelButtonText: strings.login,
            }).then((result) => {
              if (result.isConfirmed) {
                // Retry logic
                this.setState({ email: "" });
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Redirect to login
                window.location.href = "/";
              }
            });
          }
          localStorage.setItem(
            "forgotPasswordAttempts",
            newFailedAttempts.toString()
          );
        }
      });
    }
  };

  changeemailHandler = (event) => {
    this.setState({ email: event.target.value });
  };

  //traitement of user enumeration
  componentDidMount() {
    const interval = setInterval(() => {
      const storedTime = localStorage.getItem("timeattend");
      if (storedTime) {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - parseInt(storedTime);
        //console.log(timeDifference/1000);
        if (timeDifference < 5 * 60 * 1000 && this.state.failedAttempts >= 5) {
          this.setState({ isLocked: true });
        } else {
          this.setState({ isLocked: false, failedAttempts: 0 });
          localStorage.removeItem("timeattend");
          localStorage.removeItem("forgotPasswordAttempts");
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }

  render() {
    return (
      <div className="body">
        <div className="propre-container ">
          <div className="container mx-auto" style={{ opacity: "0.9" }}>
            <div style={{ borderRadius: "20px" }}>
              <div className="card" style={{ borderRadius: "20px" }}>
                <div className="card-header" style={{ borderRadius: "20px" }}>
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
                    <div className="hidden-error ">
                      <h5 style={{ color: "#0F5298", fontSize: "18px" }}>
                        Please enter your email
                      </h5>
                    </div>
                    <form action="">
                      <div className="container-sm element-margin">
                        <input
                          type="text"
                          name="email"
                          className="form-control"
                          value={this.state.email}
                          onChange={this.changeemailHandler}
                          placeholder=""
                          style={{ borderColor: "#0F5298" }}
                        />
                        <div
                          className="hidden-error text-danger email"
                          style={{ display: "none" }}
                        >
                          Enter the email.
                        </div>
                      </div>

                      <div className="container-sm element-margin">
                        {/* traitement of user enumeration */}
                        {this.state.isLocked === false ? (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            name="submit"
                            onClick={this.SubmitForgot}
                          >
                            Send Request
                          </button>
                        ) : (
                          <div style={{ color: "grey" }}>
                            Please wait for 5 min and try again
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                  <p>
                    <a href="/" className="SignIn-Btn">
                      Sign in ?
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(ForgetPassword);
