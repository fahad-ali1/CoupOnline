import express from "express";
import cors from "cors";
import morgan from "morgan";
//import cookieParser from "cookie-parser";
import session from "express-session";
import { default as connectMongoDBSession } from "connect-mongodb-session";

const SESS_SECRET = "test";
const COOKIE_NAME = "AxiosCookie";
const MAX_AGE = 1000 * 60 * 60 * 3;

const MongoURI = process.env.DB_PASS
  ? `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`
  : `mongodb://127.0.0.1:27017/couponline`;

const MongoDBStore = connectMongoDBSession(session);

const mongoDBstore = new MongoDBStore({
  uri: MongoURI,
  collection: "mySessions",
});

const app = express();

app.use(
  cors({
    origin: ["https://batec2.github.io", "http://localhost:5173"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(morgan("dev")); //console logging
app.use(express.json()); //body parsing
app.use(express.urlencoded({ extended: true })); //query string

app.use(
  session({
    name: COOKIE_NAME,
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoDBstore,
    cookie: {
      maxAge: MAX_AGE,
      sameSite: false,
      secure: false,
    },
  })
);
// app.use(cookieParser());

export default app;
