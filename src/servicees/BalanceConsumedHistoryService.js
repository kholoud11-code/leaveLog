import axios from "axios";
import APIURL from "./APIURL";

const User_API_BASE_URL = APIURL.url + "rest/neo4j/balanceConsumedHistory";

class BalanceConsumedHistoryService {
  getAllBalanceConsumedHistory() {
    return axios.get(User_API_BASE_URL);
  }
  getBalanceConsumedHistoryByYear(Year) {
    return axios.get(User_API_BASE_URL + "/" + Year);
  }
  getBalanceConsumedHistoryOfAllMonthByYear(Year) {
    return axios.get(User_API_BASE_URL + "/months/" + Year);
  }
  getTotalBalanceConsumedOfAllMonthByYear(Year) {
    return axios.get(
      User_API_BASE_URL + "/months/totalBalanceConsumed/" + Year
    );
  }
  createBalanceConsumedHistory(balanceConsumedHistory) {
    return axios.post(User_API_BASE_URL, balanceConsumedHistory);
  }
  getBalanceConsumedHistoryById(balanceConsumedHistoryId) {
    return axios.get(User_API_BASE_URL + "/" + balanceConsumedHistoryId);
  }
  updateBalanceConsumedHistory(
    balanceConsumedHistory,
    balanceConsumedHistoryId
  ) {
    return axios.put(
      User_API_BASE_URL + "/" + balanceConsumedHistoryId,
      balanceConsumedHistory
    );
  }
  deleteBalanceConsumedHistory(id) {
    return axios.delete(User_API_BASE_URL + "/" + id);
  }
}

export default new BalanceConsumedHistoryService();
