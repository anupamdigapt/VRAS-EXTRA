const response = (res, data = [], message = 'success', status = 200) => {
    const success = status >= 200 && status < 300;
    return res.status(status).json({
        success,
        message,
        data,
    });
}

module.exports = {
    response
}
