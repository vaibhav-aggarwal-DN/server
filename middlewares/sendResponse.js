const { ValidationError } = require('express-validation');

function sendResponse(result, _req, res, next) {
    try {
        if (result instanceof (ValidationError)) {
            throw new Error(result);
        }
        if (result.err) {
            throw result.err;
        }
        const responseData = {
            meta: {
                code: 200,
                success: true,
                message: 'Success',
            },
            data: result.data,
        };
        return res.status(responseData.meta.code).json(responseData);
    } catch (e) {
        next(e);
    }
}

module.exports = sendResponse;
