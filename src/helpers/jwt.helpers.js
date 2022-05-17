var jwt = require('jsonwebtoken');

function jwtTokens ({rut, name, surname, address, phone, city}){
    const user = {rut, name, surname, address, phone, city};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '2h'});
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,{expiresIn: '2h'});
    return ({ accessToken,refreshToken});
}

module.exports = {jwtTokens};