const BaseException = require('../exceptions/BaseException');

module.exports = (err, req, res, next) => {

    if (err instanceof BaseException) {

        if (err.shouldSendToSentry()) {
            // this.Sentry.captureException(error);
        }

        return res.error(err.getErrorData(), err.getErrorMessage(), err.getErrorCode())
    }

    return res.error({}, err.message, 400)
}