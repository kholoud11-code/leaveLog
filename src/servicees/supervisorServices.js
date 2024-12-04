import axios from 'axios';
import APIURL from './APIURL'

const User_API_BASE_URL = APIURL.url+"rest/neo4j/Supervisor";

class SupervisorService {

    getUser(){
        return axios.get(User_API_BASE_URL);
    }
    createUser(user){
        return axios.post(User_API_BASE_URL, user);
    }

    getUserById(userId){
        return axios.get(User_API_BASE_URL + '/' + userId);
    }

    updateUser(user, userId){
        return axios.put(User_API_BASE_URL + '/' + userId, user);
    }

    deleteUser(userId){
        return axios.delete(User_API_BASE_URL + '/' + userId);
    }
    login(username,password){
        return axios.post(User_API_BASE_URL + '/login',{username,password});
    }
    
}

export default new SupervisorService()