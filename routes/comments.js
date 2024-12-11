import express from "express"
import pg from "pg"
import {get_userID, check_movieID} from "../middleware/database.js"
import bodyParser from "body-parser";
import cors from "cors";



//database configeration 
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "movies", 
    password: process.env.MY_PASSWORD, 
    port: 5432
})
db.connect().catch(err => console.error(err.stack))


const c_router = express.Router()

c_router.use(bodyParser.urlencoded({ extended: true }));
c_router.use(bodyParser.json());



c_router.post("/:username/comment", async (req, res)=>{
    let comment = req.body["comment"];
    let rating = req.body["rating"];
    let movie_id = req.body["movie_id"];
    let username = req.params.username;

    let user_id = await get_userID(username);
    if(user_id === -1) {return res.status(404)}

    try{

        await db.query("INSERT into reviews (user_id, movie_id, comment, rating, username) VALUES ($1, $2, $3, $4, $5)",
            [user_id, movie_id, comment,rating,username]);

        return res.status(200).send("success")


    }
    catch(e){
        return res.status(404).send(e)
    }
    

})

c_router.get("/:movie_id/all", async(req, res)=>{
    const movie_id = req.params.movie_id;

    try{
        let comment = await db.query("SELECT * FROM reviews WHERE movie_id = $1", [movie_id]);

        return res.json({comments: comment.rows});
    }
    catch(e){
        return res.status(404).send(e.message)
    }
})

export default c_router