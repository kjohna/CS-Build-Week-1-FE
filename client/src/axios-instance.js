import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;
console.log(apiURL);
const instance = axios.create({ baseURL: apiURL });

// grab token if exists
const token = localStorage.getItem("advToken");
if (token) {
  instance.defaults.headers.common["Authorization"] = `Token ${token}`;
}

export default instance;
