function generateErrorResponse(status, code, message) {
    return {status, code, message};
}

module.exports = {
    generateErrorResponse
}
