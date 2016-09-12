'use strict';

var express = require('express');
var router = express.Router();
var validate = require('express-jsonschema').validate;
var userAddSchema = require('../schema/useradd');
var changePasswordSchema = require('../schema/changePassword');
var child_process = require('child_process');
var accountUtil = require('../accountUtil');
var execFile = child_process.execFile;
var spawn = child_process.spawn;

router.get('/', function(req, res, next) {
  res.send('Pippen v0.1.0');
});

router.post('/add_user', validate({body: userAddSchema}), (req, res, next) => {
    var body = req.body;
    const callback = (err, message) => {
        if (err) {
            next(err);
        }
        else {
            res.status(201).send(message);
        }
    }
    accountUtil.createAccount(body.username, body.password, callback);
});

router.put('/change_password', validate({body: changePasswordSchema}), (req, res, next) => {
    var body = req.body;
    const callback = (err, message) => {
        if (err) {
            next(err);
        }
        else {
            res.status(200).send(message);
        }
    };
    accountUtil.verifyPassword(body.username, body.current_password, (err, message) => {
        if (err) {
            next(err);
        }
        else {
            accountUtil.changePassword(body.username, body.new_password, callback);
        }
    });
});

module.exports = router;
