

const favourites_button = document.getElementById("favourites_btn");

favourites_button.addEventListener("click", async function() {
    const id = favourites_button.getAttribute("movieid");
    const userID = favourites_button.getAttribute("user-id");

    try {
        let response;
        const isFavourite = favourites_button.classList.contains("added");
        if (isFavourite) {
            response = await axios.delete(`http://localhost:3000/user/${userID}/favourites/delete/${id}`);
        } else {
            response = await axios.post(`http://localhost:3000/user/${userID}/favourites/add/${id}`);
        }

        if (response.status === 200) {
            favourites_button.textContent = isFavourite ? "Add to favourites" : "Remove from favourites";
            favourites_button.classList.toggle("added");
        }
    } catch (error) {
        console.error("An error occurred", error);
    }
});


const watched_button = document.getElementById("watched_btn");

watched_button.addEventListener("click", async function() {
    const id = watched_button.getAttribute("movieid");
    const userID = watched_button.getAttribute("user-id");

    try {
        let response;
        const isWatched = watched_button.classList.contains("added");
        if (isWatched) {
            response = await axios.delete(`http://localhost:3000/user/${userID}/watchlist/delete/${id}`);
        } else {
            response = await axios.post(`http://localhost:3000/user/${userID}/watchlist/add/${id}`);
        }

        if (response.status === 200) {
            watched_button.textContent = isWatched ? "Add to Watchlist" : "Remove from Watchlist";
            watched_button.classList.toggle("added");
        }
    } catch (error) {
        console.error("An error occurred", error);
    }
});



const comments_btn = document.getElementById("comments-btn");

// fix this part
comments_btn.addEventListener("click", async function(){
    
    const id = comments_btn .getAttribute("movieid");
    const userID = comments_btn .getAttribute("user-id");
    const comment_val = document.getElementById("comment_input").value;
    const ratings_val = document.getElementById("rating_input").value;
    console.log(`${id} ${userID} ${comment_val} ${ratings_val}`);


    try{
        let response = await axios.post(`http://localhost:3000/reviews/${userID}/comment`,{ 
            movie_id: id,
            comment: comment_val,
            rating: ratings_val
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })


        if(response.status == 200){
            console.log("success")
            // location.reload();
        }
    }
    catch(error){
        console.error("An error occurred", error);
    }

})

