import axios from 'axios';
import APIURL from './APIURL'

const User_API_BASE_URL = APIURL.url+"rest/neo4j/ExeptionnelRequest";

class ExeptionnelRequestService {

    geExeptionnelRequest(){
        return axios.get(User_API_BASE_URL);
    }
    /** my new function */
    getExeptionnelRequestOfUser(UserId){
        return axios.get(User_API_BASE_URL + '/users/' + UserId)
    }
    /** */
    getType(){
        return axios.get(User_API_BASE_URL+'/typeofVaction');
    }
    creatExeptionnelRequest(ExeptionnelRequest){
        return axios.post(User_API_BASE_URL, ExeptionnelRequest);
    }
    creatType(ExeptionnelRequest){
        return axios.post(User_API_BASE_URL+'/typeofVaction', ExeptionnelRequest);
    }
    getExeptionnelRequestById(ExeptionnelRequestId){
        return axios.get(User_API_BASE_URL + '/' + ExeptionnelRequestId);
    }
    getTypetById(ExeptionnelRequestId){
        return axios.get(User_API_BASE_URL+'/typeofVaction' + '/' + ExeptionnelRequestId);
    }

    updatExeptionnelRequest(ExeptionnelRequest, ExeptionnelRequestId){
        return axios.put(User_API_BASE_URL + '/' + ExeptionnelRequestId, ExeptionnelRequest);
    }
    updatType(ExeptionnelRequest, ExeptionnelRequestId){
        return axios.put(User_API_BASE_URL+'/typeofVaction' + '/' + ExeptionnelRequestId, ExeptionnelRequest);
    }
    
    deletExeptionnelRequest(id){
        return axios.delete(User_API_BASE_URL + '/' + id);
    }
    deletType(id){
        return axios.delete(User_API_BASE_URL+'/typeofVaction' + '/' + id);
    }
    statut(ExeptionnelRequest,ExeptionnelRequestId){
        return axios.put(User_API_BASE_URL + '/statut/'+ExeptionnelRequestId, ExeptionnelRequest);
    }
}

export default new ExeptionnelRequestService()