const isValidUsername = (userName) => {
    const regex = /^[a-zA-Z\-]+$/;
    return userName.match(regex);
}

module.exports = {isValidUsername};


