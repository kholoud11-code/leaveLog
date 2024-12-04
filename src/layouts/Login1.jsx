import React from "react";
import LogoHoride from "../assets/img/bg/horide.png";
import AuthService from "../servicees/AuthServices";
import CollaborateurServices from "../servicees/CollaborateurServices";
import "../layouts/Login1.css";
import { withRouter } from "react-router-dom";
import Fetching from "../com/list/Fetching";
import { Button } from "react-bootstrap";
import { IoEye, IoEyeOff } from "react-icons/io5";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      password: "",
      username: "",
      fetching: false,
      passwordShown: false,
      //treatment of time based blocking and unblocking failed login
      userinfo: {},
      roleinfo: "",
      loginAttempts: parseInt(localStorage.getItem("loginAttempts")) || 0,
      loginAttemptsMessage:
        parseInt(localStorage.getItem("loginAttemptsMessage")) || 5,
      isLocked:
        localStorage.getItem("BlockedTimestamp") === null ? false : true,
    };
    this.changeusernameHandler = this.changeusernameHandler.bind(this);
    this.changepasswordHandler = this.changepasswordHandler.bind(this);
    this.login = this.login.bind(this);
  }

  //treatment of time based blocking and unblocking failed login
  componentDidMount() {
    const interval = setInterval(() => {
      let blockedtimestamp = localStorage.getItem("BlockedTimestamp");
      if (blockedtimestamp) {
        let timediff = new Date().getTime() - parseInt(blockedtimestamp);
        if (timediff < 5 * 60 * 1000) {
          this.setState({
            loginAttempts: 4,
            loginAttemptsMessage: 0,
            isLocked: true,
          });
          //this.setState({loginAttempts:5,loginAttemptsMessage:0,isLocked:true})
        }
        if (timediff >= 5 * 60 * 1000) {
          this.setState({
            loginAttempts: 0,
            loginAttemptsMessage: 5,
            isLocked: false,
          });
          localStorage.removeItem("BlockedTimestamp");
          localStorage.removeItem("loginAttempts");
          localStorage.removeItem("loginAttemptsMessage");
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }

  login = (e) => {
    e.preventDefault();
    this.setState({ fetching: true });

    AuthService.user(this.state.username, this.state.password)
      .then(
        (res) => {
          //treatment of time based blocking and unblocking failed login
          this.setState({ userinfo: res.data });
          //sessionStorage.setItem('user', JSON.stringify(res.data.id))
          //sessionStorage.setItem('firstname', JSON.stringify(res.data.firstname))
          //sessionStorage.setItem('lastname', JSON.stringify(res.data.lastname))
          //sessionStorage.setItem('country', JSON.stringify(res.data.country))
        },
        (err) => {
          console.log("AuthService.user");
        }
      )
      .then(() => {
        AuthService.role(this.state.username, this.state.password)
          .then(
            (res) => {
              //treatment of time based blocking and unblocking failed login
              this.setState({ roleinfo: res.data });
              //sessionStorage.setItem('role', JSON.stringify(res.data).replace('"', '').slice(0, -1))
            },
            (err) => {
              console.log("AuthService.role");
            }
          )
          .then(() => {
            AuthService.login(this.state.username, this.state.password)
              .then(
                (res) => {
                  //treatment of time based blocking and unblocking failed login
                  sessionStorage.setItem(
                    "token",
                    JSON.stringify(res.data.token).replace('"', "").slice(0, -1)
                  );
                  sessionStorage.setItem(
                    "user",
                    JSON.stringify(this.state.userinfo.id)
                  );
                  sessionStorage.setItem(
                    "firstname",
                    JSON.stringify(this.state.userinfo.firstname)
                  );
                  sessionStorage.setItem(
                    "lastname",
                    JSON.stringify(this.state.userinfo.lastname)
                  );
                  sessionStorage.setItem(
                    "country",
                    JSON.stringify(this.state.userinfo.country)
                  );
                  sessionStorage.setItem(
                    "role",
                    JSON.stringify(this.state.roleinfo)
                      .replace('"', "")
                      .slice(0, -1)
                  );
                  this.setState({ loginAttempts: 0, loginAttemptsMessage: 5 });
                  localStorage.removeItem("BlockedTimestamp");
                  localStorage.removeItem("loginAttempts");
                  localStorage.removeItem("loginAttemptsMessage");
                  this.setState({ fetching: false });
                  this.props.history.push("/admin/Home");
                },
                (err) => {
                  let x = (document.querySelector(
                    ".hidden-error"
                  ).style.display = "block");
                  setTimeout(function () {
                    document.querySelector(".hidden-error").style.display =
                      "none";
                  }, 3000);
                  this.setState({ fetching: false });
                }
              ) /*.then(()=>{
            CollaborateurServices.getUserById(parseInt(sessionStorage.getItem('user'))).then(res => {
              sessionStorage.setItem('userConnected', JSON.stringify(res.data))
              this.setState({ fetching: false })
              this.props.history.push('/admin/Home');
            })
          })*/
              .catch((ex) => {
                //treatment of time based blocking and unblocking failed login
                if (
                  this.state.loginAttemptsMessage > 0 &&
                  this.state.loginAttempts < 5
                ) {
                  this.setState({
                    loginAttempts: this.state.loginAttempts + 1,
                  });
                  this.setState({
                    loginAttemptsMessage: this.state.loginAttemptsMessage - 1,
                  });
                  localStorage.setItem(
                    "loginAttempts",
                    this.state.loginAttempts
                  );
                  localStorage.setItem(
                    "loginAttemptsMessage",
                    this.state.loginAttemptsMessage
                  );
                }
                let x = (document.querySelector(".hidden-error").style.display =
                  "block");
                setTimeout(function () {
                  document.querySelector(".hidden-error").style.display =
                    "none";
                }, 3000);
                this.setState({ fetching: false });
              });
          });
      });
    //treatment of time based blocking and unblocking failed login
    if (this.state.loginAttempts >= 4) {
      localStorage.setItem("BlockedTimestamp", new Date().getTime());
      this.setState({ isLocked: true });
      setTimeout(() => {
        localStorage.removeItem("BlockedTimestamp");
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("loginAttemptsMessage");
        this.setState({
          loginAttempts: 0,
          loginAttemptsMessage: 5,
          isLocked: false,
        });
      }, 5 * 60 * 1000);
    }
  };

  changeusernameHandler = (event) => {
    this.setState({ username: event.target.value });
  };
  changepasswordHandler = (event) => {
    this.setState({ password: event.target.value });
  };
  togglePassword = () => {
    this.setState((prevState) => ({ passwordShown: !prevState.passwordShown }));
  };

  render() {
    return (
      <React.Fragment>
        {this.state.fetching ? <Fetching /> : null}

        <div className="body">
          <div className="propre-container ">
            <div className="container mx-auto" style={{ opacity: "0.9" }}>
              <div style={{ borderRadius: "20px" }}>
                <div className="card" style={{ borderRadius: "20px" }}>
                  <div
                    className="card-header "
                    style={{ borderRadius: "20px" }}
                  >
                    <img
                      id="ntt"
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
                      {/* treatment of time based blocking and unblocking failed login */}
                      <div
                        className="hidden-error text-danger"
                        style={{ display: "none" }}
                      >
                        Incorrect Username or Password. Enter the correct
                        Username and Password and try again.{" "}
                        {this.state.loginAttemptsMessage} attempts remaining.
                      </div>
                      <form action="">
                        <div className="container-sm element-margin">
                          <input
                            name="email"
                            className="form-control"
                            onChange={this.changeusernameHandler}
                            placeholder="Username"
                            required
                          />
                        </div>
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
                            name="password"
                            className="form-control"
                            onChange={this.changepasswordHandler}
                            placeholder="Password"
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
                          {/* treatment of time based blocking and unblocking failed login */}
                          {this.state.isLocked === false ? (
                            <button
                              type="submit"
                              className="btn btn-primary"
                              name="singIn"
                              onClick={this.login}
                            >
                              Sign In
                            </button>
                          ) : (
                            <div style={{ color: "grey" }}>
                              Please wait for 5 min and try again.
                            </div>
                          )}
                        </div>
                      </form>
                    </div>

                    <p>
                      <a href="hy" className="forget_password">
                        forget password?
                      </a>
                    </p>
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
export default withRouter(Login);
