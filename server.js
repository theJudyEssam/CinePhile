import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import router from "./routes/userAuth.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import Prouter from "./routes/personalizeduser.js"
import dotenv from 'dotenv';
import router1 from "./routes/favourites.js";
// import fetch from "node-fetch";





dotenv.config()
const app = express();


app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3000', // Update to match your frontend URL
    credentials: true // Allow credentials to be passed (cookies)
}));

//Middlewares
app.use('/scripts', express.static('public/scripts'));
app.use('/styles', express.static('public/styles'));
app.use('/displays', express.static('public/displays'));

//app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));


//Routes
app.get("/", (req, res)=>{
    res.render("start.ejs")
   
})

app.get("/login", (req, res)=>{
    res.render("login.ejs")
})

app.get("/register", (req, res)=>{
    res.render("signup.ejs")
})

app.post("/login" , async (req, res)=>{
    const username1 = req.body["username"];
    const password1 = req.body["password"];
  //  console.log("Login attemmpt:", password1);

    try {

        const loginResponse = await axios.post('http://localhost:3000/auth/login', {
            username: username1,
            password: password1
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        });

       // console.log("API response:", loginResponse);

        if (loginResponse.status === 200) {
            // console.log("the token from loginResponse:" + loginResponse.data.token)

            res.cookie('token', loginResponse.data.token, {
                httpOnly: true, // Prevents JavaScript access to the cookie
                maxAge: 3600000 // 1 hour
            });

            // Redirect to the personalized page
            res.redirect(`/user/${username1}/homepage`);

        } else {
            res.status(403).send("Login failed");
        }

    } 
    catch (error) {
        console.error("Error during login process:",  error.message);
        res.status(500).send("An error occurred during login");
    }
})

app.use("/auth",router)
app.use("/user",Prouter);
app.use("/user", router1)


app.listen(process.env.PORT, ()=>{
    console.log(`Listening to port ${process.env.PORT}`);
})