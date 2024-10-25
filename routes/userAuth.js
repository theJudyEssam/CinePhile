import express from "express"
import bodyParser from "body-parser"
import pg from "pg";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import cookieParser from 'cookie-parser'
dotenv.config(); 



//database configeration 
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "movies", 
    password: process.env.MY_PASSWORD, 
    port: 5432
})
db.connect().catch(err => console.error(err.stack))


const router = express.Router()

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser())


router.post("/register", async (req, res)=>{
   
    //uses body-parser to get the user's creditentials 
    const first_name = req.body["first-name"]
    const last_name = req.body["last-name"]
    const email = req.body["email"]
    const username = req.body["username"]
    const password =req.body["password"]
    const age = req.body["age"]
    const gender = req.body["gender"]
    const phone = req.body["phone_number"]

    try{
        // checks if user already exists
        const existingUsername = await db.query("SELECT username FROM users WHERE username = $1", [username]);
        if (existingUsername.rows.length === 0) {
 
            bcrypt.hash(password, 10, async (err, hash)=>{
                    if(err){
                        console.log("Trouble hashing");
                    }
                    else{
                     await db.query("INSERT INTO users (fullname ,email ,age, gender ,username ,password ,phone_num ) VALUES ($1, $2, $3, $4, $5 , $6, $7)", 
                        [first_name+" "+ last_name, email,age ,gender, username, hash, phone]
                    );


                    const token = jwt.sign({data:username}, process.env.SECRET_KEY, {
                        expiresIn: '1h',
                    });

                    res.cookie('token', token, {
                        httpOnly:true, sameSite:'None', maxAge:3600000
                    })
                    
                   
                    res.status(200).json({
                        message: "Registration successful",
                        token: token
                    });
                    }      
            })
        } 
        else {
            res.status(409).json({ message: "Username already exists" });
        }

    }
    
    catch(error)
    {
        console.error(error); 
        res.status(500).json({ message: "An error occurred" });
    }

})

router.post("/login", async (req,res)=>{

    const username = req.body.username
    const loginpassword = req.body.password

    console.log("Login attemmpt from  API:", req.body.password);

    try{
        const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
        // console.log(result)

        if(result.rows.length === 0){
            return res.sendStatus(403)
        }

        else{

            const user = result.rows[0];
            const hashedpassword = user.password;
            bcrypt.compare(loginpassword, hashedpassword, (err, result)=>{
                
                if(err){
                    console.error("Error de-hashing ", err);
                }

                else{
                    if(result){
                        const token = jwt.sign({data:username}, process.env.SECRET_KEY, {
                            expiresIn: '1h',
                            });

                        res.cookie('token', token, {
                            httpOnly: true, // Allow client-side access
                            maxAge: 3600000 // 1 hour
                        });
                            
                     
                        res.status(200).json({
                            message: "Login successful",
                            token
                        });
                        
                        
                    }
                    else{
                        return res.status(403).json({message:"Wrong Password"})
                    }
                }
            })

        }


    }
    catch (err)
    {
        res.status(403).json({message: `An error occurred: ${err.message}`})
    }

})

export default router;