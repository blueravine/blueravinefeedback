const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.json');
const response = require('./src/schemas/api.response.feedback');
const techerrorres = require('./src/schemas/api.response.techerror');
const winston = require('./utils/winston');

//Import routes for the feedback
const feedback = require('./src/routes/feedback.route');

//initial smartmedi services api
const app = express();

//set up MongoDB connection with mongoose
const mongoose = require('mongoose');

let db_url = 'mongodb://localhost:27017/feedback';
const mongoDB = process.env.MONGODB_URI || config.MONGODB_URI || db_url;

mongoose.connect(mongoDB, {useNewUrlParser: true} );
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind('MongoDB connection error'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// logging middleware
var num = 0;
app.use(function (req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var method = req.method;
    var url = req.url;

    winston.info(`${++num} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    next();
});

app.use('/feedback', feedback);

app.use(function (req, res, next) {
    winston.info(`'Cannot find RESTful resource!' - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    techerrorres.status=404;
    techerrorres.message = 'Cannot find RESTful resource!';
    techerrorres.messagecode = 5000;

    res.status(techerrorres.status).send(techerrorres);
  });

app.use(function (err, req, res, next) {
        winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - ${err.stack}`);

        techerrorres.status=500;
                techerrorres.message = 'Internal Server Error! ' + err.message;
                techerrorres.messagecode = 5001;

        res.status(techerrorres.status).send(techerrorres);
});

const port = process.env.PORT || config.PORT || 3007;

app.listen(port, () => {
    winston.info(`Server is running on the port: ${port} `);
});