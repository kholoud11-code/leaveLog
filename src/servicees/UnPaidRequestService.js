import axios from "axios";
import APIURL from "./APIURL";

const User_API_BASE_URL = APIURL.url + "rest/neo4j/UnpaidRequest";

class UnPaidRequestService {
  getUnPaidRequest() {
    return axios.get(User_API_BASE_URL);
  }
  createUnPaidRequest(PaidRequest) {
    return axios.post(User_API_BASE_URL, PaidRequest);
  }
  getUnPaidRequestById(PaidRequestId) {
    return axios.get(User_API_BASE_URL + "/" + PaidRequestId);
  }

  /** my new functions */
  getUnPaidRequestOfUser(UserId) {
    return axios.get(User_API_BASE_URL + "/users/" + UserId);
  }

  getAllUnpaidRequestOfTheTeamOfValidator(UserId) {
    return axios.get(User_API_BASE_URL + "/validator/" + UserId);
  }

  sendcancellationrequest(PaidRequest, PaidRequestId, PaidRequestBody) {
    return axios.put(
      User_API_BASE_URL +
        "/sendcancellationrequest/" +
        PaidRequestId +
        "/" +
        PaidRequest,
      PaidRequestBody
    );
  }

  statutrequestaftervalidatecancellation(PaidRequest, PaidRequestId) {
    return axios.put(
      User_API_BASE_URL +
        "/statutrequestaftervalidatecancellation/" +
        PaidRequestId +
        "/" +
        PaidRequest
    );
  }
  /** */

  updatUnPaidRequest(PaidRequest, PaidRequestId) {
    return axios.put(User_API_BASE_URL + "/" + PaidRequestId, PaidRequest);
  }

  deletUnPaidRequest(id) {
    return axios.delete(User_API_BASE_URL + "/" + id);
  }
  statut(PaidRequest, PaidRequestId) {
    return axios.put(
      User_API_BASE_URL + "/statut/" + PaidRequestId,
      PaidRequest
    );
  }
  /** */
  updateFinalStatutOfRequestAfterRHValidation(PaidRequest, PaidRequestId) {
    return axios.put(
      User_API_BASE_URL +
        "/updateFinalStatutOfRequestAfterRHValidation/" +
        PaidRequestId,
      PaidRequest
    );
  }
  /** */
}

export default new UnPaidRequestService();
