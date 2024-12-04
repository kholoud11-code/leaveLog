import axios from "axios";
import APIURL from "./APIURL";
const User_API_BASE_URL = APIURL.url + "rest/neo4j";

class DashboardService {
  getNumberOfEmployes() {
    return axios.get(User_API_BASE_URL + "/collaboratorCount");
  }
  getTotalBalanceOfAllCollaborators() {
    return axios.get(User_API_BASE_URL + "/totalBalanceAllCollaboratorsCount");
  }
  getTotalCountOfPendingBalanceOfLastYearForAllUnits() {
    return axios.get(
      User_API_BASE_URL + "/totalPendingBalanceOfLastYearForAllUnitsCount"
    );
  }
  getNumberOfAllPendingPaidRequests() {
    return axios.get(User_API_BASE_URL + "/getNumberOfAllPendingPaidRequests");
  }
  getNumberOfPendingPaidRequests() {
    return axios.get(User_API_BASE_URL + "/getNumberOfPendingPaidRequests");
  }
  CountTotalBalanceOfPendingPaidRequests() {
    return axios.get(
      User_API_BASE_URL + "/CountTotalBalanceOfPendingPaidRequests"
    );
  }
  getNumberOfPendingCancellationPaidRequests() {
    return axios.get(
      User_API_BASE_URL + "/getNumberOfPendingCancellationPaidRequests"
    );
  }
  CountTotalBalanceOfPendingCancellationPaidRequests() {
    return axios.get(
      User_API_BASE_URL + "/CountTotalBalanceOfPendingCancellationPaidRequests"
    );
  }
  getNumberOfPendingRequestsList() {
    return axios.get(User_API_BASE_URL + "/PendingRequestCountList");
  }
  getMonthsByYears(year) {
    return axios.get(User_API_BASE_URL + "/barChartData/" + year);
  }
  getAllEmployeesBalance() {
    return axios.get(User_API_BASE_URL + "/AllEmployeesBalance");
  }
}

export default new DashboardService();
