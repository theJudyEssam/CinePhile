
import verifyToken from "../middleware/verifyUser.js";
import express from "express"
import axios from "axios";
import {get_popular, get_discover, get_upcoming, search, search_by_id, get_recommentations} from "../middleware/movieAPI.js"
import {get_userID, check_movieID, check_watchlist} from "../middleware/database.js";
import router1 from "./favourites.js";


const Prouter = express.Router()


Prouter.get("/:username/favs", verifyToken, async (req, res)=>{
    const username = req.params.username
    console.log("We are in the favourites ")
    try
    {
        let response = await axios.get(`http://localhost:3000/user/get/${username}/favs`);
        let movies = response.data.movies
        console.log(movies)
        res.render('favourites.ejs', {username:username, results:movies})
    }
    catch(error)
    {
        console.log("There was an error: "+ error);
        res.sendStatus(404)
    }
   // res.render('favourites.ejs', {personalized:false, username:"ju",results:[1, 2, 3, 4]})
    //res.status(200).send("we are in the favourites page")
  //  res.render('favourites.ejs', {personalized:false, username:username})
})
  


Prouter.get("/:username/watchlist", verifyToken, async (req, res)=>{
    const username = req.params.username
    console.log("We are in the watchlist ")
    try
    {
        let response = await axios.get(`http://localhost:3000/user/get/${username}/watch`);
        let movies = response.data.movies
        console.log(movies)
        res.render('watchlist.ejs', {username:username, results:movies})
    }
    catch(error)
    {
        console.log("There was an error: "+ error);
        res.sendStatus(404)
    }
   // res.render('favourites.ejs', {personalized:false, username:"ju",results:[1, 2, 3, 4]})
    //res.status(200).send("we are in the favourites page")
  //  res.render('favourites.ejs', {personalized:false, username:username})
})


Prouter.get("/:username/homepage", verifyToken, async (req, res)=>{

    try{
      //  let resu = await search_by_id(343611);
        //console.log(resu);

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


Prouter.get("/:username/:title/:id",verifyToken ,async (req, res)=>{
    // console.log("I am in the /:title")
     const title = req.params.title
     const id = req.params.id
     const user = req.params.username
     const user_id = await get_userID(user)
     const is_favourite = await check_movieID(id, user_id)
     const is_watched = await check_watchlist(id, user_id)
     const recommendations = await get_recommentations(id);
     console.log(recommendations)
    // console.log(is_favourite)
    // console.log(id)
   //  console.log("Searching for title:", title);

     try{
         const result = await search_by_id(id);
         const comments = await axios.get(`http://localhost:3000/reviews/${id}/all`);
         const data = comments.data.comments;
         //console.log(result)

         if (result || result.length > 0){
        res.render("movie-page.ejs", 
         {movie_title:result.original_title, 
          movie_overview:result.overview,
          movie_rating:result.vote_average,
          movie_poster : result.poster_path,
          recommentations : recommendations.results, 
          movie: result,
          personalized: false,
          movie_id: id,
          username:user,
          userid :user_id, 
          favourite:is_favourite,
          watched:is_watched,
          comments: data
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