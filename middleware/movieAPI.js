import dotenv from 'dotenv';
import axios from "axios";
dotenv.config()

//API authorization
//const API_KEY = process.env.API_KEY;
const API_Token = process.env.API_TOKEN; 
const config = {
    headers: { Authorization: `Bearer ${API_Token}` },
  };
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_Token}`
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

export {get_popular, get_discover, get_upcoming, search}