
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
