import React from "react";
import "layouts/Login1.css";
import LogoHoride from "../../assets/img/bg/horide.png";
import ForgotService from "../../servicees/ForgotServices";
import { withRouter } from "react-router-dom";
import Swal from "sweetalert2";

const englishColumn = ["error", "Ok"];
const frenchColumn = ["erreur", "D'accord"];
const spanishColumn = ["error", "bueno"];
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

class CodePin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      email: sessionStorage.getItem("email"),
    };

    this.changeemailHandler = this.changeemailHandler.bind(this);
    this.changecodeHandler = this.changecodeHandler.bind(this);
    this.SubmitCode = this.SubmitCode.bind(this);
  }
  SubmitCode = (e) => {
    this._isMounted = true;
    e.preventDefault();

    const pass = ForgotService.codeVerification(
      this.state.email,
      this.state.code
    ).then((res) => {
      console.log(res.data);
      if (res.data) {
        //console.log(res.data);
        this.props.history.push("/newpassword");
      } else {
        Swal.fire({
          title: DatagridColumn[0],
          confirmButtonText: DatagridColumn[1],
          icon: "warning",
        });
      }
    });
  };
  changecodeHandler = (event) => {
    this.setState({ code: event.target.value });
  };

  changeemailHandler = (event) => {
    this.setState({ email: event.target.value });
  };
  render() {
    console.log(this.state.code);
    return (
      <div className="body" style={{ height: "775px" }}>
        <div className="propre-container ">
          <div className="container   mx-auto">
            <div className="">
              <div className="card  ">
                <div className="card-header ">
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
                    <div className="hidden-error">
                      <h5 style={{ color: "#0F5298", fontSize: "18px" }}>
                        Please enter the verification code <br /> that was sent
                        to your email
                      </h5>
                    </div>
                    <form action="">
                      <div className="container-sm element-margin">
                        <input
                          type="code"
                          name="code"
                          className="form-control"
                          placeholder="Verification code"
                          onChange={this.changecodeHandler}
                        />
                      </div>

                      <div className="container-sm element-margin">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          name="code"
                          onClick={this.SubmitCode}
                        >
                          {" "}
                          Confirm code{" "}
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
    );
  }
}
export default withRouter(CodePin);
