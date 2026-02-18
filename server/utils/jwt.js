const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET

const signToken = (payload, expiresIn = "7d") => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

const verifyToken = (token) => {
    try{
        return jwt.verify(token, JWT_SECRET);
    }catch(err){
        return null;
    }
}

module.exports = {
    signToken,
    verifyToken
}