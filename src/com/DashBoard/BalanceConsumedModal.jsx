import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { CardGroup, Card, Button } from "react-bootstrap";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line, Pie, PolarArea } from "react-chartjs-2";
import translate from "../../i18nProvider/translate";
import DashboardService from "../../servicees/DashboardService";
import BalanceConsumedHistoryService from "../../servicees/BalanceConsumedHistoryService";
import "./DashBoard.css";

const englishColumn = ["Remaining Balance", "Total Days Consumed"];
const frenchColumn = ["Solde Restant", "Jours total consommés"];
const spanishColumn = ["Saldo Restante", "Total de días consumidos"];
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

class BalanceConsumedModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      consumedBalance: 0,
      balancePercent: 0,
    };
  }
  componentDidMount() {
    this.numberOfBalance();
    this.getTotalBalanceConsumedOfAllMonthByYear(new Date().getFullYear());
    this.updateBalancePercent();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.balance !== this.state.balance ||
      prevState.consumedBalance !== this.state.consumedBalance
    ) {
      this.updateBalancePercent();
    }
  }

  updateBalancePercent = () => {
    const { balance, consumedBalance } = this.state;
    const balancePercent = balance > 0 ? (consumedBalance / balance) * 100 : 0;
    this.setState({ balancePercent });
  };
  numberOfBalance() {
    DashboardService.getTotalBalanceOfAllCollaborators()
      .then((res) => {
        this.setState({ balance: res.data });
      })
      .catch((error) => {
        console.error("Erreur in balance", error);
      });
  }
  getTotalBalanceConsumedOfAllMonthByYear(year) {
    BalanceConsumedHistoryService.getTotalBalanceConsumedOfAllMonthByYear(year)
      .then((res) => {
        console.log("total balance consumed :" + res.data);
        this.setState({ consumedBalance: res.data });
      })
      .catch((error) => {
        console.error("Erreur in consumed Balance", error);
      });
  }
  render() {
    const CategoryType = [DatagridColumn[0], DatagridColumn[1]];
    const { show, onHide } = this.props;
    return (
      <div>
        <Modal show={show} onHide={onHide} centered>
          <Modal.Header closeButton>
            <Modal.Title>{translate("Details of balance")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="header">
              <Card
                bg={"light"}
                style={{
                  marginBottom: 0,
                  borderColor: "rgb(49, 116, 173)",
                  borderWidth: "5px",
                }}
              >
                <Card.Header
                  style={{
                    background: "white",
                    padding: "5px 0 5px 10px",
                  }}
                >
                  <h3
                    style={{
                      marginTop: "0px",
                      marginRight: "5px",
                      marginBottom: 0,
                      color: "rgb(49, 116, 173)",
                      display: "inline-block",
                      fontSize: "22px",
                      fontWeight: "bold",
                    }}
                  >
                    {translate("Balance of all employees")}
                  </h3>
                </Card.Header>
                <Card.Body
                  style={{
                    padding: 0,
                    background: "white",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "30px",
                      margin: 10,
                      justifyContent: "center",
                      display: "flex",
                    }}
                  >
                    {(this.state.balance + this.state.consumedBalance).toFixed(
                      1
                    )}{" "}
                    {translate("days")}
                  </p>
                </Card.Body>
              </Card>

              <Card
                bg={"light"}
                style={{
                  marginTop: 8,
                  borderColor: "rgb(49, 116, 173)",
                  borderWidth: "5px",
                }}
              >
                <Card.Body style={{ padding: 15, background: "white" }}>
                  <Pie
                    data={{
                      labels: CategoryType,
                      datasets: [
                        {
                          data: [
                            this.state.balance,
                            this.state.consumedBalance,
                          ],
                          backgroundColor: [
                            "rgb(49, 116, 173)",
                            "rgb(79, 146, 203)",
                          ],
                          borderColor: [
                            "rgb(49, 116, 173)",
                            "rgb(79, 146, 203)",
                          ],
                          borderRadius: 10,
                        },
                      ],
                    }}
                  />
                </Card.Body>
              </Card>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button id="CloseBtn" onClick={onHide}>
              {translate("Close")}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default BalanceConsumedModal;
