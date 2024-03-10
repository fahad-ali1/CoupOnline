import axios from "axios";


const verifyAccount = async (username) => {
  try {
    const exists = await axios.get(`http://localhost:8080/players/check/byName/${username}`)
      .catch(() => {return false})
    if (exists.status === 200) {
      return exists.data
    }
  }catch (e){
    return false
  }
  return false
}

export default verifyAccount;