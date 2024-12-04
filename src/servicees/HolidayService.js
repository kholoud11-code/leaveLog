import axios from 'axios';
import APIURL from './APIURL'

const User_API_BASE_URL = APIURL.url+"rest/neo4j/holiday";

class HolidayService {

    getHoliday(){
        return axios.get(User_API_BASE_URL);
    }
    createholiday(holiday){
        return axios.post(User_API_BASE_URL, holiday);
    }
    getHolidayById(holidayId){
        return axios.get(User_API_BASE_URL + '/' + holidayId);
    }

    updateHoliday(holiday, holidayId){
        return axios.put(User_API_BASE_URL + '/' + holidayId, holiday);
    }
    
    deleteHoliday(id){
        return axios.delete(User_API_BASE_URL + '/' + id);
    }
}

export default new HolidayService()