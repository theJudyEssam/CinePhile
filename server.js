//The NPM packages
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import router from "./routes/userAuth.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
import Prouter from "./routes/personalizeduser.js"


// import fetch from "node-fetch";



//TODO: isolate all these stuff in a separate file
//Global Variables
const port = 3000;
const app = express();
const API_KEY = "8e16d019711cfa5e7d07bedad91f9667";
const API_Token = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTE2ZDAxOTcxMWNmYTVlN2QwN2JlZGFkOTFmOTY2NyIsIm5iZiI6MTcyMjAzMzM1MS40MDA4NDIsInN1YiI6IjY0NTRmMmVhYzA0NDI5MDE4NTcyNjE3NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tTKKLJ7jQwdgfD3mMcUWI3MCg3H-d5bOSt5XpkiQ7Ig';
const config = {
    headers: { Authorization: `Bearer ${API_Token}` },
  };
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTE2ZDAxOTcxMWNmYTVlN2QwN2JlZGFkOTFmOTY2NyIsIm5iZiI6MTcyMjAzMzM1MS40MDA4NDIsInN1YiI6IjY0NTRmMmVhYzA0NDI5MDE4NTcyNjE3NSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tTKKLJ7jQwdgfD3mMcUWI3MCg3H-d5bOSt5XpkiQ7Ig'
    }
  };



//API urls
const popular_url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
const discover_url = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc"
const upcoming_url = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';


//API calls
async function get_popular(){
    const response = await axios.get(popular_url, config);
    const result = response.data.results;
    return result;
}

async function get_discover(){
    const response = await axios.get(discover_url, config);
    const result = response.data.results;
    return result;
}

async function get_upcoming(){
    const response = await axios.get(upcoming_url, config);
    const result = response.data.results;
    return result;
}

async function search(title){
    try{
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=false&language=en-US&page=1`, config)
        const result = response.data.results;
        return result;  
        }
        catch(error){
            console.log(error.message)
        }
}

//----------------------------------------------------//


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
            // The login was successful, set cookies if needed from the response
           console.log("the token from loginResponse:" + loginResponse.data.token)

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




app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})