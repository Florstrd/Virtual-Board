require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports =  (req, res, next) => {
    try{
        const userData = jwt.verify(localStorage.getItem("jwt"), process.env.JWT_SECRET);
        console.log(`token authorized for user ${userData.sub} ${userData.name}`);

        req.userData = userData;
        
        next();

    } catch (error) {
        console.log(error.message);
        res.status(401).send({
            message: "Authorization error"
        });
    }
}