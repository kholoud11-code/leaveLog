import axios from "axios";
import APIURL from "./APIURL";

const User_API_BASE_URL = APIURL.url + "rest/neo4j/collaborator";

axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    const token1 = "Bearer " + token;
    config.headers.Authorization = token1;
  }

  return config;
});
class collaboratorService {
  getUser() {
    return axios.get(User_API_BASE_URL);
  }
  getCollaboratorsPendingBalanceByYear() {
    return axios.get(User_API_BASE_URL + "/PendingBalanceByYear");
  }
  getTotalPendingBalanceForAllUnits() {
    return axios.get(User_API_BASE_URL + "/PendingBalanceForAllUnits");
  }
  getIndicatorsForAllCollaborators() {
    return axios.get(User_API_BASE_URL + "/Indicators");
  }
  getCollaboratorsAverageIndicatorByUnit() {
    return axios.get(User_API_BASE_URL + "/AverageIndicatorsByUnit");
  }
  getIndicatorsTimeMonthAndYear() {
    return axios.get(User_API_BASE_URL + "/IndicatorsTimeMonthAndYear");
  }
  //treatment of log user connected add update users page
  createUser(user, userDetaile, unitName) {
    return axios.post(
      User_API_BASE_URL + "/" + userDetaile + "/" + unitName,
      user
    );
  }
  sendEmailOnceNewUserHasBeenAdded(user) {
    return axios.post(User_API_BASE_URL + "/sendEmailAfterAddingNewOne", user);
  }
  getUserByUsername(username) {
    return axios.get(User_API_BASE_URL + "/findbyname/" + username);
  }
  getUserByEmail(email) {
    return axios.get(User_API_BASE_URL + "/email/" + email);
  }
  getUserById(userId) {
    return axios.get(User_API_BASE_URL + "/" + userId);
  }
  //treatment of log user connected add update users page
  updateUser(user, userId, userDetaile) {
    return axios.put(
      User_API_BASE_URL + "/" + userId + "/" + userDetaile,
      user
    );
  }
  updateUserNormal(user, userId, userDetaile) {
    return axios.put(
      User_API_BASE_URL + "/normal" + "/" + userId + "/" + userDetaile,
      user
    );
  }
  deleteUser(userId) {
    return axios.delete(User_API_BASE_URL + "/" + userId);
  }
  login(username, password) {
    return axios.post(User_API_BASE_URL + "/login", { username, password });
  }
  password(user, userId) {
    return axios.put(User_API_BASE_URL + "/password/" + userId, user);
  }
  /////
  passwordbycin(user, usercin) {
    return axios.put(User_API_BASE_URL + "/passwordbycin/" + usercin, user);
  }
  Rolebycin(user, usercin) {
    return axios.put(User_API_BASE_URL + "/roleteambycin/" + usercin, user);
  }
  getUserWithPaginition(page, size) {
    return axios.get(User_API_BASE_URL + "/pagination/" + page + "/" + size);
  }
  /////
  user(email) {
    return axios.post(User_API_BASE_URL + "/email", { email });
  }
  deactivateUser(userId) {
    return axios.put(User_API_BASE_URL + "/deactivate/" + userId);
  }
  isCollaboratorInBPOWeekendsUnit(collaboratorId) {
    return axios.get(
      User_API_BASE_URL + "/" + collaboratorId + "/isInBPOWeekendsUnit"
    );
  }
  isCollaboratorInBPO(collaboratorId) {
    return axios.get(User_API_BASE_URL + "/" + collaboratorId + "/isInBPOUnit");
  }
}

export default new collaboratorService();
