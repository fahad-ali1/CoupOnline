import axios from "axios";

const retrieveAccountByName = async (username, password) => {
    const request = {
      params: {
        username: username,
        password: password
      }
    }
    const response = await axios.get(`http://localhost:8080/players/byName/`, request)
    if (response.status === 200) {
      return response
    }else{
      return undefined
    }

}

export default retrieveAccountByName;