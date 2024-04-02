import axios from 'axios'

export default axios.create({
    //Our base URL for our api
    baseURL: "http://localhost:5000/api/v1/restaurants",
    headers: {
        "Content-type": "application/json"
    }
});