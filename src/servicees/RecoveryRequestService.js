import axios from 'axios';
import APIURL from './APIURL'

const User_API_BASE_URL = APIURL.url+"rest/neo4j/RecoveryRequest";

class RecoveryRequestService {

    getRecoveryRequest(){
        return axios.get(User_API_BASE_URL);
    }
    createRecoveryRequest(PaidRequest){
        return axios.post(User_API_BASE_URL, PaidRequest);
    }
    getRecoveryRequestById(PaidRequestId){
        return axios.get(User_API_BASE_URL + '/' + PaidRequestId);
    }

    /** my new function */
    getRecoveryRequestOfUser(UserId){
        return axios.get(User_API_BASE_URL + '/users/' + UserId)
    }
    /** */

    updatRecoveryRequest(PaidRequest, PaidRequestId){
        return axios.put(User_API_BASE_URL + '/' + PaidRequestId, PaidRequest);
    }
    
    deletRecoveryRequest(id){
        return axios.delete(User_API_BASE_URL + '/' + id);
    }
    statut(PaidRequest,PaidRequestId){
        return axios.put(User_API_BASE_URL + '/statut/'+PaidRequestId, PaidRequest);
    }
}

export default new RecoveryRequestService()