import axios from 'axios';
import { request } from 'utils/request';
import APIURL from './APIURL'

const User_API_BASE_URL = APIURL.url+"rest/neo4j/auth";

class AuthService {

    login(username,password){
        const options = {
            method: "POST",
            url: `${APIURL.url}rest/neo4j/auth`,
            responseType: "json",
            data: {
            username,password
            },
            headers: {'Access-Control-Allow-Origin': '*'}
        };
        const response = request(options);
        return response;
    }
    user(username,password){
        return axios.post(User_API_BASE_URL+"/user",{username,password});
    }
    role(username,password){
        return axios.post(User_API_BASE_URL+"/role",{username,password});
    }
}

export default new AuthService()