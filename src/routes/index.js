var express = require('express');
var router = express.Router();
var validate = require('express-jsonschema').validate;
var userAddSchema = require('../schema/useradd');
var execFile = require('child_process').execFile;
var shellescape = require('shell-escape');

router.get('/', function(req, res, next) {
  res.render('Pippen v0.1.0');
});

router.post('/useradd', validate({body: userAddSchema}), (req, res, next) => {
    var body = req.body;
    const useradd = execFile('adduser', ['--disabled-password', '--gecos', '""', body.username], (err, stdout, stderr) => {
        if (err) {
            next(err);
        }
        else {
            const pass = execFile('echo' [`${body.username}:${body.password}`, '|', 'chpasswd'], (err, stdout, stderr) => {
                if (err) {
                    res.status(500);
                    next(err);
                }
                else {
                    res.status(201);
                    res.send('User created');
                }
            });
        }
    });
});

module.exports = router;
