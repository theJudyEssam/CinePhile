import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();

function verifyToken(req, res, next){
    
    const token = req.cookies["token"];
    

    // for debugging purposes
    // console.log("The token is: " + token)
    // console.log("Full request URL:", req.originalUrl);
    // console.log("Request params:", req.params);
    // console.log("Route pattern:", req.route?.path);
    // console.log("Base URL:", req.baseUrl);

    if(token == null)
    {
        if (!token)
        {
            return res.redirect('/user/login');
        }
    }
    
    try
    {
        const decoded = jwt.verify(token, "4832812")

       // console.log(decoded.data);
       // console.log(req.params)

        req.data = decoded.data;
        if(decoded.data != req.params.username){
            console.log("You need to log in again!")
            return res.redirect('/login');
        }

        next();
    }
    catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(401).json({ error: `Invalid token, ${error.message}` });
    }


    // console.log("Token: ", token);
    // console.log("Checking token validity...");

    // next();
}


export default verifyToken