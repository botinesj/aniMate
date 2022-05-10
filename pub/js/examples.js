/* JS Library usage examples */
"use strict";

const aMlibrary = new aM()

// Creating objects that I want to be animated
const player = document.createElement('div')
player.style = 'width: 40px; height: 40px; border-radius: 50%; background-color: Blue;'

const ball = document.createElement('div')
ball.style = 'width: 30px; height: 30px; border-radius: 50%; background-color: Brown;'

// Creating horizontal Interacter
const hInteracter = aMlibrary.horizontalInteracter()
hInteracter.style.marginLeft = "auto"
hInteracter.style.marginRight = "auto"

const footballButton = document.querySelector('#footballButton');
const soccerButton = document.querySelector('#soccerButton');

footballButton.addEventListener('click', footballInitiate);
soccerButton.addEventListener('click', soccerInitiate);

function footballInitiate(e) {
	e.preventDefault();
	aMlibrary.initiate('#animationField')
    aMlibrary.setReset(true)
    $( '#animationField' ).after( hInteracter);
    aMlibrary.setSlider(); // Must come after we put hInteracter
    // Set the desired objects to be put into the animation field
    aMlibrary.setPlayer(player) // Must come after we put hInteracter
    aMlibrary.setBall(ball) // Must come after we put hInteracter
}

function soccerInitiate(e) {
	e.preventDefault();
	aMlibrary.initiate('#animationField2')
    aMlibrary.setReset(false)
    $( '#animationField2' ).after( hInteracter);
    aMlibrary.setSlider(); // Must come after we put hInteracter
    // Set the desired objects to be put into the animation field
    aMlibrary.setPlayer(player) // Must come after we put hInteracter
    aMlibrary.setBall(ball) // Must come after we put hInteracter
}

console.log('Final Version of aniMate Library')


