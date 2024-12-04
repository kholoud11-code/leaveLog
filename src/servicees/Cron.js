import axios from "axios";
import APIURL from './APIURL'

const User_API_BASE_URL = APIURL.url+"rest/neo4j/Cron";

class Cron {
    getCron(){
        return axios.get(User_API_BASE_URL);
    }
}
export default new Cron()