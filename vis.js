console.log("script.js loaded");

const svgWidth = 1920;
const svgHeight = 500;
const svgRad = 250;
let circles = document.querySelectorAll("circle");

circles.forEach((circle) => {
    circle.addEventListener("click", () => {
        let randomX = Math.floor(Math.random() * svgWidth);
        let randomY = Math.floor(Math.random() * svgHeight);
        let randomRad = Math.floor(Math.random() * svgRad);
        console.log(randomX, randomY)
        circle.setAttribute("cx", randomX);
        circle.setAttribute("cy", randomY);
        circle.setAttribute("r", randomRad);
    });
});