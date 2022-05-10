var jwt = require('jsonwebtoken');

function jwtTokens ({rut}){
    const user = {rut};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '20s'});
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET,{expiresIn: '5m'});
    return ({ accessToken,refreshToken});
}

module.exports = {jwtTokens};