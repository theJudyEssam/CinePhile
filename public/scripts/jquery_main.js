$(document).ready(function () {
    console.log("hello from the jquery file!");
    // Apply the marquee effect
    $('.marquee').marquee({
        duration: 5000,  // Duration for the scroll
        duplicated: true, // Loop the text after it finishes
        direction: 'left', // Scroll direction
        pauseOnHover: true // Pause on hover
    });
});

console.log("hello from the jquery file!");