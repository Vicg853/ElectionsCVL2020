//Getting necessary modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

//Defining api main const (literally what runs all the server)
const api = express();

//Making api use some features
api.use(cors());
api.use(helmet());
api.use(morgan());
api.use(bodyParser.json());

//Starting connection with mongoose
mongoose.connect(
    process.env.MONGO_URL, { 
    useUnifiedTopology: true,
    useNewUrlParser: true ,
    useFindAndModify: false,
    useCreateIndex: true
});

//Defining necessary things to use session and 
//connecting it to mongodb
api.use(session({
    name: 'electionsLfpSession',
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGO_URL,
        ttl: 1000*60*60*4,
    }),
    cookie: {
        maxAge: 1000*60*60*4,
        sameSite: false,
        secure: false,
    }
}));

//Importing routes
api.use(require("./routes/electionEdit"));
api.use(require("./routes/electionInfo"));
api.use(require("./routes/electionWCandidates"));

//Making api listen
api.listen(process.env.API_LISTEN_PORT, process.env.API_HOST_NAME, () => {
    console.log("Running on: http://" + process.env.API_HOST_NAME + ":" + process.env.API_LISTEN_PORT);
});