var jwt = require('jsonwebtoken');

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']; //Portador del token
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        return res.status(401).json({
            msg: "Null token"
        })
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET),(error, user) =>{
        if(error){
            return res.status(403).json({
                errro: error.messagge
            })
        }
        req.user = user;
        next();
    };
} 
module.exports = {authenticateToken};