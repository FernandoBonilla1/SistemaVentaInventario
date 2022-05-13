var jwt = require('jsonwebtoken');

function jwtTokens ({rut, name, surname, password, address, phone, city}){
    const user = {rut, name, surname, password, address, phone, city};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '15m'});
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,{expiresIn: '5m'});
    return ({ accessToken,refreshToken});
}

module.exports = {jwtTokens};