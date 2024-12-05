//add favourites functionality
// user add to favourite
// get the favourites
// delete the favourites


//import the necessary packages
import express from "express"
import pg from "pg"
import {get_userID, check_movieID} from "../middleware/database.js"
import cors from "cors";
import { search_by_id } from "../middleware/movieAPI.js";

const router1 = express.Router()
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "movies", 
    password: process.env.MY_PASSWORD, 
    port: 5432
})
db.connect().catch(err => console.error(err.stack))

router1.use(cors());




//we will have to call this API from the frontend part of the project
router1.post("/:username/favourites/add/:id" , async (req, res)=>{
     //the username is stored in the header
     let username = req.params.username
     try{
         //get the id of the said username
         let user_id = await get_userID(username);
         if(user_id === -1) {return res.status(404)}
         //insert the movie id and the userid in the favourites DB
         let movie_id = req.params.id;

         await db.query("INSERT INTO favourites (movie_id, user_id) VALUES ($1, $2)", [movie_id,user_id]);

         return res.status(200).send("success")
     }
     catch(error) {
        return res.status(404).send(error)
     }
})


router1.delete("/:username/favourites/delete/:id" , async (req, res)=>{
    let username = req.params.username;
    let movie_id = req.params.id;
    try{
        //get the id of the said username
        let user_id = await get_userID(username);
        if(user_id === -1) {return res.status(404)}
        //insert the movie id and the userid in the favourites DB

        await db.query("DELETE FROM favourites WHERE movie_id = $1 AND user_id = $2", [movie_id, user_id]);
        return res.status(200).send("success")
    }
    catch(error) {
       return res.status(404).send(error)
    }
})

router1.get("/get/:username/favs", async (req, res)=>{
      let username = req.params.username;
      //return  res.status(200).send("we are here")
       try{
           const userid = await get_userID(username);
           if(userid == -1)  return res.status(403).json({ message: "Forbidden: User not found or unauthorized." });
   
   
           // console.log(`Fetched user ID: ${userid}`);
           const results = await db.query("SELECT movie_id FROM favourites WHERE user_id = $1", [userid]);
           const movies_details = []
           for(let i = 0; i < 5;i++){
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

          // console.log(movies_details)
          
          // console.log("got the results")
          return res.json({ movies: movies_details , user_id: userid});
       }
       catch{
           return res.status(404)
       }
   })

// router1.get("/:username/stuff2/stuff3", (req, res) => {
    
//     return res.status(200).send("Test route working!");
// });
   

export default router1