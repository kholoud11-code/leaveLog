import axios from 'axios';
import APIURL from './APIURL'

const User_API_BASE_URL = APIURL.url+"rest/neo4j/forgotpass";

class ForgotService {

    /*requestforgot(email){
        return axios.post(User_API_BASE_URL,{email});
    }*/
    requestforgot(email){
        return axios.post(User_API_BASE_URL+"/email",email);
    }
    codeVerification(email,code){
        return axios.post(User_API_BASE_URL+"/changepass/"+code,email);
    }
    ResetPassword(email,password){
        console.log(email+" "+password)
        return axios.post(User_API_BASE_URL+"/changepass/reset/"+password,email);
    }
    /*requestforgot(email){
        return axios.get(User_API_BASE_URL+"/email/"+email);
    }*/

}

export default new ForgotService()