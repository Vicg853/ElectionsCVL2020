require('dotenv').config();
const express = require('express');
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const api = express();

api.use(cors());
api.use(helmet());
api.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
}));
api.use(body_parser.json());

mongoose.connect(
    process.env.MONGO_URL, { 
    useUnifiedTopology: true, 
    useNewUrlParser: true 
});

api.use(require('./router'));

api.listen(process.env.API_LISTEN_PORT, 
    console.log("Listening on http://localhost:" + process.env.API_LISTEN_PORT)
);