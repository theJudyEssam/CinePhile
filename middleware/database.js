import pg from "pg"
import dotenv from "dotenv"

dotenv.config();
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "movies", 
    password: process.env.MY_PASSWORD, 
    port: 5432
})
db.connect().catch(err => console.error(err.stack))


async function get_userID(username){
    try{
        const userID = await db.query("SELECT user_id from users WHERE username = $1",[username])
        let user_id = userID.rows[0].user_id
        return user_id;
    }
    catch(error){
        return -1
    }
}

async function check_movieID(movie_id, user_id){
    try
    {
        let movies = await db.query("SELECT * FROM favourites WHERE movie_id = $1 AND user_id = $2", [movie_id, user_id])
        if(movies.rows.length <= 0 ){
            return false;
        }
        return true;
    }
    catch{
        return -1
    }
}

async function check_watchlist(movie_id, user_ud){
    try
    {
        let movies = await db.query("SELECT * FROM watchlist WHERE movie_id = $1 AND user_id = $2", [movie_id, user_id])
        if(movies.rows.length <= 0 ){
            return false;
        }
        return true;
    }
    catch{
        return -1
    }
}



export {get_userID, check_movieID, check_watchlist}