
import verifyToken from "../middleware/verifyUser.js";
import express from "express"
import axios from "axios";


 
//TODO: put this in a seperate file for the love of ALLAH
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
     //   console.log("API search result:", response.data);
        return result;  
        }
        catch(error){
            console.log(error.message)
        }
}

//-------------------------------------------------------------------------------//


const Prouter = express.Router()


Prouter.get("/:username/homepage", verifyToken, async (req, res)=>{

    try{

        let populardata = await get_popular();
        let discoverdata = await get_discover();
        let upcomingdata = await get_upcoming();

        //console.log(req.params.username);

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
                movie_poster: "", // You can use a placeholder image if needed
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