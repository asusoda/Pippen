var UserAddSchema = {
    type: 'object',
    properties: {
        username: {
            type: 'string',
            required: true
        },
        password: {
            type: 'string',
            required: true
        }
    }
};

module.exports = UserAddSchema;
