import axios from 'axios';
import APIURL from './APIURL'

const User_API_BASE_URL = APIURL.url+"rest/neo4j/PaidRequest";

class PaidRequestService {

    getPaidRequest(){
        return axios.get(User_API_BASE_URL);
    }
    createPaidRequest(PaidRequest){
        return axios.post(User_API_BASE_URL, PaidRequest);
    }
    getPaidRequestById(PaidRequestId){
        return axios.get(User_API_BASE_URL + '/' + PaidRequestId);
    }
    /** my new function */
    getPaidRequestOfUser(UserId){
        return axios.get(User_API_BASE_URL + '/users/' + UserId)
    }
    getAllPaidRequestOfTheTeamOfValidator(UserId){
        return axios.get(User_API_BASE_URL + '/validator/' + UserId)
    }
    /** */
    updatPaidRequest(PaidRequest, PaidRequestId){
        return axios.put(User_API_BASE_URL + '/' + PaidRequestId, PaidRequest);
    }
    
    deletPaidRequest(id){
        return axios.delete(User_API_BASE_URL + '/' + id);
    }
    statut(PaidRequest,PaidRequestId){
        return axios.put(User_API_BASE_URL + '/statut/'+PaidRequestId, PaidRequest);
    }
    
    sendcancellationrequest(PaidRequest,PaidRequestId,PaidRequestBody){
        return axios.put(User_API_BASE_URL + '/sendcancellationrequest/'+PaidRequestId+'/'+PaidRequest,PaidRequestBody);
    }
    statutrequestaftervalidatecancellation(PaidRequest,PaidRequestId){
        return axios.put(User_API_BASE_URL + '/statutrequestaftervalidatecancellation/'+PaidRequestId+'/'+PaidRequest);
    }

    NewMethodValidationCancellationRequest(PaidRequestId,Key,statut,PaidRequestBody){
        return axios.put(User_API_BASE_URL + '/NewMethodValidationCancellationRequest/'+PaidRequestId+'/'+Key+'/'+statut,PaidRequestBody);
    }
    
}

export default new PaidRequestService()