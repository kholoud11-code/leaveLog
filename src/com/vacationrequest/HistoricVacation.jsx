import React, { Component } from "react";
import PaidRequestService from "../../servicees/PaidRequestService";
import ExeptionnelRequestService from "../../servicees/ExptionnelService";
import UnPaidRequestService from "../../servicees/UnPaidRequestService";
import RecoveryRequestService from "../../servicees/RecoveryRequestService";
import { defineMessages, injectIntl, FormattedMessage } from "react-intl";
import translate from "../../i18nProvider/translate";
import Swal from "sweetalert2";
import "../css/list.css";

const englishColumn = ["15 days", "Ok"];
const frenchColumn = ["15 jours", "D'accord"];
const spanishColumn = ["15 días", "bueno"];
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

class Historic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paidRequest: [],
      unPaidRequest: [],
      exptionnel: [],
      RecoveryRequest: [],
      select: "paidrequest",
    };
    this.PaidList = this.PaidList.bind(this);
    this.Unpaidlists = this.Unpaidlists.bind(this);
    this.ExpionnelList = this.ExpionnelList.bind(this);
    this.Recoverylists = this.Recoverylists.bind(this);
    this.checkStatut = this.checkStatut.bind(this);
    this.deletePaidRequest = this.deletePaidRequest.bind(this);
    this.changeSelect = this.changeSelect.bind(this);
    this.list = this.list.bind(this);
    this.transl = this.transl.bind(this);
  }

  //Cancel paid vacation
  deletePaidRequest(id, startDate, statut) {
    let actuelDate = new Date();
    actuelDate.setDate(actuelDate.getDate() + 15);
    let startDateRequest = new Date(startDate[0].startDate);
    console.log(actuelDate.getTime() + " " + startDateRequest.getTime());
    if (
      startDateRequest.getTime() > actuelDate.getTime() &&
      statut === "accepted"
    ) {
      PaidRequestService.deletPaidRequest(id).then((res) => {
        this.setState({
          paidRequest: this.state.paidRequest.filter((user) => user.id !== id),
        });
      });
    } else if (statut === "refused") {
      PaidRequestService.deletPaidRequest(id).then((res) => {
        this.setState({
          paidRequest: this.state.paidRequest.filter((user) => user.id !== id),
        });
      });
    } else {
      Swal.fire({
        title: DatagridColumn[0],
        confirmButtonText: DatagridColumn[1],
        icon: "warning",
      });
    }
  }
  //Cancel Unpaid vacation
  deleteun(id) {
    UnPaidRequestService.deletUnPaidRequest(id).then((res) => {
      this.setState({
        unPaidRequest: this.state.unPaidRequest.filter(
          (user) => user.id !== id
        ),
      });
    });
  }
  //Cancel exeptionnel vacation
  deleteEx(id) {
    ExeptionnelRequestService.deletExeptionnelRequest(id).then((res) => {
      this.setState({
        exptionnel: this.state.exptionnel.filter((user) => user.id !== id),
      });
    });
  }
  //Cancel recovery vacation
  deleteRe(id) {
    RecoveryRequestService.deletRecoveryRequest(id).then((res) => {
      this.setState({
        RecoveryRequest: this.state.RecoveryRequest.filter(
          (user) => user.id !== id
        ),
      });
    });
  }

  componentDidMount() {
    PaidRequestService.getPaidRequest().then((res) => {
      this.setState({ paidRequest: res.data });
    });
    UnPaidRequestService.getUnPaidRequest().then((res) => {
      this.setState({ unPaidRequest: res.data });
    });
    ExeptionnelRequestService.geExeptionnelRequest().then((res) => {
      this.setState({ exptionnel: res.data });
    });
    RecoveryRequestService.getRecoveryRequest().then((res) => {
      this.setState({ RecoveryRequest: res.data });
    });
  }
  //write stat of vacacion using colors
  checkStatut(value) {
    if (value === "processed") {
      return <td className="text-secondary">{value} </td>;
    } else if (value === "accepted") {
      return <td className="text-success">{value} </td>;
    } else if (value === "refused") {
      return <td className="text-danger">{value} </td>;
    }
  }
  //list of paid request
  PaidList() {
    return (
      <div className="row">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Request date</th>
              <th>{translate("Type")}</th>
              <th> {translate("statut")}</th>
              <th>{translate("type of time")}</th>
              <th>{translate("Start Date")}</th>
              <th>{translate("End Date")}</th>
            </tr>
          </thead>
          <tbody>
            {this.state.paidRequest
              .filter((val) => {
                if (val.statut != "Pending") {
                  return val;
                }
              })
              .sort(function (a, b) {
                var c = new Date(a.requestDate);
                var d = new Date(b.requestDate);
                return d.getTime() - c.getTime();
              })
              .map((paidRequests) => {
                if (
                  paidRequests.collaborator.id ===
                  JSON.parse(sessionStorage.getItem("user"))
                ) {
                  return (
                    <tr key={paidRequests.id}>
                      <td>{paidRequests.requestDate}</td>
                      <td>Paid Request</td>

                      {this.checkStatut(paidRequests.statut)}
                      <td>{paidRequests.typeOfTime}</td>
                      <td>
                        {paidRequests.datesRequest.map((dates) => (
                          <p key={dates.id}> {dates.startDate} </p>
                        ))}
                      </td>
                      <td>
                        {paidRequests.datesRequest.map((dates) => (
                          <p key={dates.id}> {dates.endDate} </p>
                        ))}
                      </td>
                      <td>
                        <button
                          style={{ marginLeft: "10px" }}
                          onClick={() =>
                            this.deletePaidRequest(
                              paidRequests.id,
                              paidRequests.datesRequest,
                              paidRequests.statut
                            )
                          }
                          className="btn btn-danger"
                        >
                          {translate("Delete")}{" "}
                        </button>{" "}
                      </td>
                    </tr>
                  );
                }
              })}
          </tbody>
        </table>
      </div>
    );
  }

  //list of unpaid request
  Unpaidlists() {
    return (
      <div className="row">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Request date</th>
              <th>{translate("Type")}</th>
              <th> {translate("statut")}</th>
              <th>{translate("type of time")}</th>
              <th>{translate("Start Date")}</th>
              <th>{translate("End Date")}</th>
            </tr>
          </thead>

          <tbody>
            {this.state.unPaidRequest
              .filter((val) => {
                if (val.statut != "Pending") {
                  return val;
                }
              })
              .sort(function (a, b) {
                var c = new Date(a.requestDate);
                var d = new Date(b.requestDate);
                return d.getTime() - c.getTime();
              })
              .map((paidRequests) => {
                if (
                  paidRequests.collaborator.id ===
                  JSON.parse(sessionStorage.getItem("user"))
                ) {
                  return (
                    <tr key={paidRequests.id}>
                      <td>{paidRequests.requestDate}</td>
                      <td>Unpaid Request</td>

                      {this.checkStatut(paidRequests.statut)}
                      <td>{paidRequests.typeOfTime}</td>
                      <td>
                        {paidRequests.datesRequest.map((dates) => (
                          <p key={dates.id}> {dates.startDate} </p>
                        ))}
                      </td>
                      <td>
                        {paidRequests.datesRequest.map((dates) => (
                          <p key={dates.id}> {dates.endDate} </p>
                        ))}
                      </td>
                      <td>
                        <button
                          style={{ marginLeft: "10px" }}
                          onClick={() => this.deleteun(paidRequests.id)}
                          className="btn btn-danger"
                        >
                          {translate("Delete")}{" "}
                        </button>{" "}
                      </td>
                    </tr>
                  );
                }
              })}
          </tbody>
        </table>
      </div>
    );
  }
  //list of exeptionnel request
  ExpionnelList() {
    return (
      <div className="row">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Request date</th>
              <th>{translate("Type")}</th>
              <th>{translate("statut")}</th>
              <th>{translate("type of time")}</th>
              <th>{translate("type of vacation")}</th>
              <th>{translate("Start Date")}</th>
              <th>{translate("End Date")}</th>
            </tr>
          </thead>

          <tbody>
            {this.state.exptionnel
              .filter((val) => {
                if (val.statut != "Pending") {
                  return val;
                }
              })
              .sort(function (a, b) {
                var c = new Date(a.requestDate);
                var d = new Date(b.requestDate);
                return d.getTime() - c.getTime();
              })
              .map((paidRequests) => {
                if (
                  paidRequests.collaborator.id ===
                  JSON.parse(sessionStorage.getItem("user"))
                ) {
                  return (
                    <tr key={paidRequests.id}>
                      <td>{paidRequests.requestDate}</td>
                      <td>Exeptionnel Request</td>

                      {this.checkStatut(paidRequests.statut)}
                      <td>{paidRequests.typeOfTime}</td>
                      <td>{paidRequests.vacacioType.name}</td>
                      <td>
                        {paidRequests.datesRequest.map((dates) => (
                          <p key={dates.id}> {dates.startDate} </p>
                        ))}
                      </td>
                      <td>
                        {paidRequests.datesRequest.map((dates) => (
                          <p key={dates.id}> {dates.endDate} </p>
                        ))}
                      </td>
                      <td>
                        <button
                          style={{ marginLeft: "10px" }}
                          onClick={() => this.deleteEx(paidRequests.id)}
                          className="btn btn-danger"
                        >
                          {translate("Delete")}{" "}
                        </button>{" "}
                      </td>
                    </tr>
                  );
                }
              })}
          </tbody>
        </table>
      </div>
    );
  }
  //list of recovery request

  Recoverylists() {
    return (
      <div className="row">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Request date</th>
              <th>{translate("Type")}</th>
              <th> {translate("statut")}</th>
              <th>{translate("type of time")}</th>
              <th>{translate("Start Date")}</th>
              <th>{translate("End Date")}</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>

          <tbody>
            {this.state.RecoveryRequest.filter((val) => {
              if (val.statut != "Pending") {
                return val;
              }
            })
              .sort(function (a, b) {
                var c = new Date(a.requestDate);
                var d = new Date(b.requestDate);
                return d.getTime() - c.getTime();
              })
              .map((paidRequests) => {
                if (
                  paidRequests.collaborator.id ===
                  JSON.parse(sessionStorage.getItem("user"))
                ) {
                  return (
                    <tr key={paidRequests.id}>
                      <td>{paidRequests.requestDate}</td>
                      <td>Recovery Request</td>

                      {this.checkStatut(paidRequests.statut)}
                      <td>{paidRequests.typeOfTime}</td>
                      <td>
                        {paidRequests.datesRequest.map((dates) => (
                          <p key={dates.id}> {dates.startDate} </p>
                        ))}
                      </td>
                      <td>
                        {paidRequests.datesRequest.map((dates) => (
                          <p key={dates.id}> {dates.endDate} </p>
                        ))}
                      </td>
                      <td>{paidRequests.startHour}</td>
                      <td>{paidRequests.endHour}</td>
                      <td>
                        <button
                          style={{ marginLeft: "10px" }}
                          onClick={() => this.deleteRe(paidRequests.id)}
                          className="btn btn-danger"
                        >
                          {translate("Delete")}{" "}
                        </button>{" "}
                      </td>
                    </tr>
                  );
                }
              })}
          </tbody>
        </table>
      </div>
    );
  }
  //select type of vacacion
  changeSelect = (event) => {
    this.setState({ select: event.target.value });
  };
  //show list of vacacion depend select option
  list(a) {
    if (a === "paidrequest") {
      return this.PaidList();
    } else if (a === "unpaid") {
      return this.Unpaidlists();
    } else if (a === "recovery") {
      return this.Recoverylists();
    } else if (a === "exceptional") {
      return this.ExpionnelList();
    }
  }
  transl(a) {
    return translate(a);
  }
  render() {
    return (
      <div>
        <br></br>
        <select
          className="custom-select"
          onChange={this.changeSelect}
          style={{ width: "200px" }}
        >
          <FormattedMessage id="Paid vacation" key={"op" + "-" + "b"}>
            {(message) => (
              <option defaultValue value="paidrequest">
                {message}
              </option>
            )}
          </FormattedMessage>
          <FormattedMessage id="Unpaid vacation" key={"op" + "-" + "a"}>
            {(message) => <option value="unpaid">{message}</option>}
          </FormattedMessage>
          <FormattedMessage id="Recovery vacation" key={"op" + "-" + "c"}>
            {(message) => (
              <option defaultValue value="recovery">
                {message}
              </option>
            )}
          </FormattedMessage>
          <FormattedMessage id="Exceptional vacation" key={"op" + "-" + "fa"}>
            {(message) => <option value="exceptional">{message}</option>}
          </FormattedMessage>
        </select>
        {this.list(this.state.select)}
      </div>
    );
  }
}

export default Historic;
