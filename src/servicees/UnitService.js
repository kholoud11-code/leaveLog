import axios from "axios";
import APIURL from "./APIURL";

const User_API_BASE_URL = APIURL.url + "rest/neo4j/unit";

class UnitService {
  getunit() {
    return axios.get(User_API_BASE_URL);
  }
  createunit(unit) {
    return axios.post(User_API_BASE_URL, unit);
  }
  getunitById(unitId) {
    return axios.get(User_API_BASE_URL + "/" + unitId);
  }

  /** my new service */
  getUnitByValidator(validatorID) {
    return axios.get(User_API_BASE_URL + "/validator/" + validatorID);
  }
  checkIfExistValidatorIntoTeamOfUnitsForValidatorById(validatorID) {
    return axios.get(
      User_API_BASE_URL +
        "/checkIfExistValidatorIntoTeamOfUnitsForValidator/" +
        validatorID
    );
  }
  checkIFvalidator(colabID) {
    return axios.get(User_API_BASE_URL + "/checkIFvalidator/" + colabID);
  }
  findvalidatorofunpaidvacation() {
    return axios.get(User_API_BASE_URL + "/findvalidatorofunpaidvacation/");
  }
  updateunit(unit, unitId) {
    return axios.put(User_API_BASE_URL + "/" + unitId, unit);
  }
  deletenit(userId) {
    return axios.delete(User_API_BASE_URL + "/" + userId);
  }
  collaborators(user) {
    return axios.get(User_API_BASE_URL + "/solde/" + user);
  }
  team(user) {
    return axios.get(User_API_BASE_URL + "/team/" + user);
  }
  unitNames(user) {
    return axios.get(User_API_BASE_URL + "/unitnames/" + user);
  }
  getAllUnitNames() {
    return axios.get(User_API_BASE_URL + "/getAllUnitNames/");
  }
  checkvalidator(user) {
    return axios.post(User_API_BASE_URL + "/check/", user);
  }
  findvalidator(user) {
    return axios.post(User_API_BASE_URL + "/findvalidator/", user);
  }
  findunitByUserId(userId) {
    return axios.get(User_API_BASE_URL + "/findunitbyuserid/" + userId);
  }
}

export default new UnitService();
