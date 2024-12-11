//same functionality as favourites

import express from "express"
import pg from "pg"
import {get_userID, check_movieID} from "../middleware/database.js"
import cors from "cors";
import { search_by_id } from "../middleware/movieAPI.js";

const w_router = express.Router()
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "movies", 
    password: process.env.MY_PASSWORD, 
    port: 5432
})
db.connect().catch(err => console.error(err.stack))

w_router.use(cors());


w_router.post("/:username/watchlist/add/:id" , async (req, res)=>{
    //the username is stored in the header
    let username = req.params.username
    try{
        //get the id of the said username
        let user_id = await get_userID(username);
        if(user_id === -1) {return res.status(404)}
        //insert the movie id and the userid in the favourites DB
        let movie_id = req.params.id;

        await db.query("INSERT INTO watchlist (movie_id, user_id) VALUES ($1, $2)", [movie_id,user_id]);

        return res.status(200).send("success")
    }
    catch(error) {
       return res.status(404).send(error)
    }
})

w_router.delete("/:username/watchlist/delete/:id" , async (req, res)=>{
    let username = req.params.username;
    let movie_id = req.params.id;
    try{
        //get the id of the said username
        let user_id = await get_userID(username);
        if(user_id === -1) {return res.status(404)}
        //insert the movie id and the userid in the favourites DB

        await db.query("DELETE FROM watchlist WHERE movie_id = $1 AND user_id = $2", [movie_id, user_id]);
        return res.status(200).send("success")
    }
    catch(error) {
       return res.status(404).send(error)
    }
})



w_router.get("/get/:username/watch", async (req, res)=>{
    let username = req.params.username;
    //console.log(username)
    //return  res.status(200).send("we are here")

     try{
         const userid = await get_userID(username);
         if(userid == -1)  return res.status(403).json({ message: "Forbidden: User not found or unauthorized." });
 
         // console.log(`Fetched user ID: ${userid}`);
         const results = await db.query("SELECT movie_id FROM watchlist WHERE user_id = $1", [userid]);
       
         const movies_details = []
         for(let i = 0; i < results.rows.length;i++){
          const movie_detail = await search_by_id(results.rows[i].movie_id)
          const movie = {
              id: results.rows[i].movie_id,
              movie_title : movie_detail.original_title,
              movie_overview: movie_detail.overview,
              movie_rating: movie_detail.vote_average,
              movie_poster: movie_detail.poster_path
          }
          movies_details.push(movie)
           
         }
      
        
        return res.json({ movies: movies_details , user_id: userid});
     }
     catch{
         return res.status(404)
     }
 })


 



export default w_router



