import axios from 'axios';
import APIURL from './APIURL'

const User_API_BASE_URL = APIURL.url+"rest/neo4j/Solde";

class BoldeService {

    getUserById(userId){
        return axios.get(User_API_BASE_URL + '/' + userId);
    }

    getUserById(balance){
        return axios.get(User_API_BASE_URL + '/' + balance);
    }

    deleteBalance(userId){
        return axios.delete(User_API_BASE_URL + '/' + userId);
    }
   
    updateBalance(balanceid,newBalance){
        return axios.put(User_API_BASE_URL + '/' + balanceid, newBalance);
    }
}

export default new BoldeService()