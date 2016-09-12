const child_process = require('child_process');
const fs = require('fs');
const crypt = require('crypt3/async');
const spawn = child_process.spawn;
const execFile = child_process.execFile;
const shadowLocation = '/etc/shadow';

function createAccount(username, password, callback) {
    const adduser = execFile('adduser', ['--disabled-password', '--gecos', '""', username], (err, stdout, stderr) => {
        if (err) {
            callback(err);
        }
        else {
            changePassword(username, password, (pass_err, message) => {
                if (pass_err) {
                    callback(pass_err);
                }
                else {
                    callback(null, 'User account has been created')
                }
            });
        }
    });
};

function verifyPassword(username, password, callback) {
    fs.readFile(shadowLocation, (err, file) => {
        if (err) {
            callback(err);
        }
        else {
            var shadowArray = file.toString().split('\n');
            var userTokens;
            shadowArray.forEach((line) => {
                var tokens = line.split(':');
                if (tokens[0] === username) {
                    userTokens = tokens;
                }
            });
            if (userTokens) {
                var passwordHash = userTokens[1];
                crypt(password, passwordHash, (err, value) => {
                    if (err) {
                        callback(err);
                    }
                    else if (value !== passwordHash) {
                        callback(new Error('Password verification failed'));
                    }
                    else {
                        callback(null, 'Password verified')
                    }
                });
            }
            else {
                callback(new Error('User not found'));
            }
        }
    });
};

function changePassword(username, password, callback) {
    const pass = spawn('chpasswd');
    pass.on('close', (code) => {
        if (code == 0) {
            callback(null, 'User password has been updated');
        }
        else {
            err = new Error("Could not set password for user");
            callback(err);
        }
    });
    pass.stdin.write(`${username}:${password}`);
    pass.stdin.end();
};

module.exports.createAccount = createAccount;
module.exports.verifyPassword = verifyPassword;
module.exports.changePassword = changePassword;
