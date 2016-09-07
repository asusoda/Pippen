var express = require('express');
var router = express.Router();
var validate = require('express-jsonschema').validate;
var userAddSchema = require('../schema/useradd');
var child_process = require('child_process');
var execFile = child_process.execFile;
var spawn = child_process.spawn;

router.get('/', function(req, res, next) {
  res.send('Pippen v0.1.0');
});

router.post('/add_user', validate({body: userAddSchema}), (req, res, next) => {
    var body = req.body;
    const useradd = execFile('adduser', ['--disabled-password', '--gecos', '""', body.username], (err, stdout, stderr) => {
        if (err) {
            next(err);
        }
        else {
            const pass = spawn('chpasswd');
            pass.on('close', (code) => {
                if (code === 0) {
                    res.status(201);
                    res.send('User created');
                }
                else {
                    res.status(500);
                    res.send('Could not set password for user');
                }
            })
            pass.stdin.write(`${body.username}:${body.password}`);
            pass.stdin.end();
        }
    });
});

module.exports = router;
