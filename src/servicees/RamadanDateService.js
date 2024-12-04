import axios from "axios";
import APIURL from "./APIURL";

const User_API_BASE_URL = APIURL.url + "rest/neo4j/RamadanDate";

class RamadanDateServic {
  getRamadanDate() {
    return axios.get(User_API_BASE_URL);
  }
  createRamadanDate(RamadanDate) {
    return axios.post(User_API_BASE_URL, RamadanDate);
  }
  getRamadanDateById() {
    return axios.get(User_API_BASE_URL + "/1");
  }
  updateRamadanDate(RamadanDate) {
    return axios.put(User_API_BASE_URL + "/" + "1", RamadanDate);
  }
  deleteRamadanDate() {
    return axios.delete(User_API_BASE_URL + "/1");
  }
}

export default new RamadanDateServic();
