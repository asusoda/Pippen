var express = require('express');
var router = express.Router();
var validate = require('express-jsonschema').validate;
var userAddSchema = require('../schema/useradd');
var execFile = require('child_process').execFile;
var shellescape = require('shell-escape');
var passwd = require('passwd-linux');

router.get('/', function(req, res, next) {
  res.render('Pippen v0.1.0');
});

router.post('/useradd', validate({body: userAddSchema}), (req, res, next) => {
    var body = req.body;
    const useradd = execFile('useradd', [body.username], (err, stdout, stderr) => {
        if (err) {
            res.status(500);
            res.send('Could not create user');
        }
        else {
            const mkhomedir_helper = execFile('mkhomedir_helper' [body.username], (err, stdout, stderr) => {
                if (err) {
                    res.status(500);
                    res.send('Could not make home directory for user');
                }
                else {
                    passwd.changePass(body.username, body.password, (err, response) => {
                        if (err) {
                            res.status(500);
                            res.send('Could not set password for user');
                        }
                        else {
                            res.status(201);
                            res.send('User created');
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
