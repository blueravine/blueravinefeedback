const Feedback = require('../models/feedback.model');
const response = require('../schemas/api.response.feedback');
const winston = require('../../utils/winston');

//Test
exports.test = function (req, res) {
    winston.info(`Hello there! - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    response.status=200;
    response.message = 'Hello!';
    response.messagecode = 1001;
    response.Feedback=null;
    response.token=null;
    res.status(response.status).send(response);
};

exports.register = function (req, res, next) {
    var newFeedback = feedback_create(req);
    
};

exports.feedback_create = function (req, res, next) {
    winston.info(`creating feedback - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    let feedback = new Feedback({
        id: req.body.id,
        appname: req.body.appname,
        appversion: req.body.appversion,
        feedback: req.body.feedback
    });

    feedback.save(function (err) {
        if (err) {
            winston.error(`${err.status || 500} - error while creating feedback - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return next(err);
        }
        winston.info(`feedback created - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        response.message = 'feedback created';
        response.messagecode = 1002;
        response.status=200;
        response.Feedback = feedback;
        response.token = null;
        res.status(response.status).send(response);
    })

};

exports.feedback_retrieve = function (req, res, next) {
    winston.info(`retrieving feedback for an app ${req.body.appname} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    Feedback.find({"appname":req.body.appname}, function (err, feedbackretrieved) {
                    if (err) {
                        winston.error(`${err.status || 500} - error while finding all feedback - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                        return next(err);
                    }

                    if(feedbackretrieved) {
                        winston.info(`found all feedback - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                    response.status=200;
                    response.message = 'feedback found';
                    response.messagecode = 1003;
                    response.Feedback = feedbackretrieved;
                    response.token=null;
                    }
                    else {
                        winston.info(`feedback not found - ${req.originalUrl} - ${req.method} - ${req.ip}`);

                        response.status=200;
                        response.message = 'feedback not found';
                        response.messagecode = 1004;
                        response.Feedback = null;
                        response.token=null;
                    }
                    res.status(response.status).send(response);
                })
};