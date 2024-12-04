import axios from "axios";
import APIURL from "./APIURL";

const User_API_BASE_URL = APIURL.url + "rest/neo4j/balanceAction";

class BalanceActionService {
  getBalanceAction() {
    return axios.get(User_API_BASE_URL);
  }
  getBalanceActionOfUser(UserId) {
    return axios.get(User_API_BASE_URL + "/users/" + UserId);
  }
  createBalanceAction(balanceAction) {
    return axios.post(User_API_BASE_URL, balanceAction);
  }
  getBalanceActionById(balanceActionId) {
    return axios.get(User_API_BASE_URL + "/" + balanceActionId);
  }
  updateBalanceAction(balanceAction, balanceActionId) {
    return axios.put(User_API_BASE_URL + "/" + balanceActionId, balanceAction);
  }
  deleteBalanceAction(id) {
    return axios.delete(User_API_BASE_URL + "/" + id);
  }
}

export default new BalanceActionService();
