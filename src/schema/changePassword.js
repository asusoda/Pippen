'use strict';

var ChangePasswordSchema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
            required: true
        },
        current_password: {
            type: 'string',
            required: true
        },
        new_password: {
            type: 'string',
            required: true
        }
    }
};

module.exports = ChangePasswordSchema;
