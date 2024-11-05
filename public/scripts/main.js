


let favourites_button = document.getElementById("favourites_btn")
let unfavourites_button = document.getElementById("remove-favourites")


favourites_button.addEventListener("click", async function() {
    const id = favourites_button.getAttribute("movieid")
    const userID = favourites_button.getAttribute("user-id")
    console.log("the button has been pressed!")
    console.log(id)
    console.log(userID)

    try{
        const addToFavourites = await axios.post(`http://localhost:3000/user/${userID}/favourites/add/${id}`)

        console.log(addToFavourites.status)
        if(addToFavourites.status === 200){
            favourites_button.style.display = "none"
            unfavourites_button.style.display = "block"
            console.log("added successfully")
        }
        else{
            console.log("an error occurred")
        }
    }
    catch(error){
        console.error("an error occured", error)
    }
    

})

unfavourites_button.addEventListener("click", async function() {
    const id = favourites_button.getAttribute("movieid")
    const userID = favourites_button.getAttribute("user-id")
    console.log("the button has been pressed!")
    console.log(id)
    console.log(userID)

    try{
        const addToFavourites = await axios.delete(`http://localhost:3000/user/${userID}/favourites/delete/${id}`)

        console.log(addToFavourites.status)
        if(addToFavourites.status === 200){
            // favourites_button.style.display = "none"
            // unfavourites_button.style.display = "block"
            console.log("deleted successfully")
        }
        else{
            console.log("an error occurred")
        }
    }
    catch(error){
        console.error("an error occured", error)
    }
    

})