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
            // alert("You need to log in again!");
            return res.redirect('/user/login');
        }
    }
    
    try
    {
        //verifying that the token is valid, while also checking that the username in the header is
        //the same username in the 
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

       // console.log(decoded.data);
       // console.log(req.params)

        req.data = decoded.data;
        if(decoded.data != req.params.username){
            console.log("You need to log in again!");
            //window.alert("Session Timeout");
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

 
}


export default verifyToken