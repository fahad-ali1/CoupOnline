import * as crypto from "crypto";


export const  hashPasswordBody = async (req, res, next) => {
  const {body} = req
  const hash = crypto.createHash("sha256")
  hash.update(body["password"])
  body["password"] = hash.digest('hex')
  next()
}

export const hashPasswordParams = async (req, res, next) => {
  const {params} = req
  const hash = crypto.createHash("sha256")
  hash.update(params["password"])
  params["password"] = hash.digest('hex')
  next()
}

