module.exports = function(err, req, res, next) {
    if (err.name === 'JsonSchemaValidation') {
        res.status(400);
        var responseData = {
           statusText: 'Bad Request',
           jsonSchemaValidation: true,
           validations: err.validations
        };
        res.json(responseData);
    }
    else {
        next(err);
    }
}
