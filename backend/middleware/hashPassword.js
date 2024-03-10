import * as crypto from "crypto";


const hashPassword = async (req, res, next) => {
  const {body} = req
  const hash = crypto.createHash("sha256")
  hash.update(body["password"])
  body["password"] = hash.digest('hex')
  console.log(body)
  next()
}

export default hashPassword