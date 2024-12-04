import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { CardGroup, Card, Button } from "react-bootstrap";
import translate from "../../i18nProvider/translate";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line, Pie, PolarArea } from "react-chartjs-2";
import DashboardService from "../../servicees/DashboardService";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./DashBoard.css";

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

class PendingChartModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      NumberOfPendingPaidRequests: 0,
      TotalBalanceOfPendingPaidRequests: 0,
      NumberOfPendingCancellationPaidRequests: 0,
      TotalBalanceOfPendingCancellationPaidRequests: 0,
      numberOfPendingRequetsList: [],
      dataByMonth: [],
    };
  }
  componentDidMount() {
    //this.numberOfPendingRequetList();
    DashboardService.getNumberOfPendingPaidRequests().then((res) => {
      this.setState({ NumberOfPendingPaidRequests: res.data });
    });
    DashboardService.getNumberOfPendingCancellationPaidRequests().then(
      (res) => {
        this.setState({ NumberOfPendingCancellationPaidRequests: res.data });
      }
    );
    DashboardService.CountTotalBalanceOfPendingPaidRequests().then((res) => {
      this.setState({ TotalBalanceOfPendingPaidRequests: res.data });
    });
    DashboardService.CountTotalBalanceOfPendingCancellationPaidRequests().then(
      (res) => {
        this.setState({
          TotalBalanceOfPendingCancellationPaidRequests: res.data,
        });
      }
    );
  }
  numberOfPendingRequetList() {
    DashboardService.getNumberOfPendingRequestsList()
      .then((response) => {
        this.setState({ numberOfPendingRequetsList: response.data });
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération du nombre de Requests:",
          error
        );
      });
  }
  render() {
    const RequestType = ["Paid", "Unpaid", "Exep", "Recovery"];
    const { show, onHide } = this.props;
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>{translate("Details of pending request")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card bg={"light"} style={{ marginBottom: 0 }}>
            <Card.Header
              style={{ background: "#e9ecef", padding: "5px 0 5px 10px" }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "rgb(49, 116, 173)",
                }}
              >
                {translate("Pending")}
              </span>
            </Card.Header>
            <Card.Body style={{ padding: 0 }}>
              <TableContainer component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">
                        {translate("Number of requests")}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {translate("Total Duration")}
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell
                        align="center"
                        style={{
                          color: "rgb(49, 116, 173)",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        {this.state.NumberOfPendingPaidRequests}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          color: "rgb(49, 116, 173)",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        {this.state.TotalBalanceOfPendingPaidRequests}
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card.Body>
          </Card>
          <Card bg={"light"} style={{ marginBottom: 0 }}>
            <Card.Header
              style={{ background: "#e9ecef", padding: "5px 0 5px 10px" }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "rgb(49, 116, 173)",
                }}
              >
                {translate("Pending cancellation")}
              </span>
            </Card.Header>
            <Card.Body style={{ padding: 0 }}>
              <TableContainer component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">
                        {translate("Number of requests")}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {translate("Total Duration")}
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell
                        align="center"
                        style={{
                          color: "rgb(49, 116, 173)",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        {this.state.NumberOfPendingCancellationPaidRequests}
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        style={{
                          color: "rgb(49, 116, 173)",
                          fontWeight: "bold",
                          fontSize: "18px",
                        }}
                      >
                        {
                          this.state
                            .TotalBalanceOfPendingCancellationPaidRequests
                        }
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button id="CloseBtn" onClick={onHide}>
            {translate("Close")}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default PendingChartModal;
