
import verifyToken from "../middleware/verifyUser.js";
import express from "express"
import axios from "axios";
import {get_popular, get_discover, get_upcoming, search} from "../middleware/movieAPI.js"

const Prouter = express.Router()


Prouter.get("/:username/homepage", verifyToken, async (req, res)=>{

    try{

        let populardata = await get_popular();
        let discoverdata = await get_discover();
        let upcomingdata = await get_upcoming();

        res.render("home-page.ejs", 
            {popular_titles:populardata, 
            popular_images:populardata, 
            discover_images: discoverdata, 
            discover_titles: discoverdata, 
            upcoming_titles: upcomingdata, 
            upcoming_images: upcomingdata,
            personalized: true, 
            username: req.params.username
        })
    }
    catch(error){
        console.log("err:" + error.message)
    }

});


 

Prouter.get("/:username/account",verifyToken ,(req, res)=>{
    res.render("account.ejs", {username:req.params.username, personalized:true})
})


Prouter.get("/:username/:title",verifyToken ,async (req, res)=>{
    // console.log("I am in the /:title")
     const title = req.params.title
     const user = req.params.username
   //  console.log("Searching for title:", title);

     try{
         const result = await search(title);
         

         if (result && result.length > 0){
        res.render("movie-page.ejs", 
         {movie_title:result[0].original_title, 
          movie_overview:result[0].overview,
          movie_rating:result[0].vote_average,
          movie_poster : result[0].poster_path,
          personalized: false,
          username:user
         })
         }

         else{
            res.render("movie-page.ejs", {
                movie_title: "No results found",
                movie_overview: "No overview available",
                movie_rating: "N/A",
                movie_poster: "", 
                personalized: false,
                username:user

            });
         }
  
     }
     catch(error){
         console.log("the error is" + error.message)
     }
 })

Prouter.post("/:username/search",verifyToken ,async(req, res)=>{
    //  console.log("I am in the /search")
      const user = req.params.username
      const query = req.body["title"];
      const resultz = await search(query);
      //  console.log(query)
      // console.log(result)
       res.render("search-page.ejs", {result:resultz, search_query:query,personalized: false, username: user})
  })
  


export default Prouter