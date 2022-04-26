var express = require('express');
var bodyParser = require('body-parser');
var authCtrl = require('./auth');

const router = express.Router();

const requestFormValidation = (preValidation, callback) => {
    return(req, res, next) => {
        if(req.body && req.body.data)
            req.body = JSON.parse(req.body.data);
        const formValidation = preValidation(req.body, req.method);
        if (formValidation.isValid)
            return callback(req, res, next);

        res.status(400).json(formValidation);
    };
};
