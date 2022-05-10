### Link to Landing Page
https://animate-csc309-final.herokuapp.com/examples.html

### Link to Documentation
https://animate-csc309-final.herokuapp.com/documentation.html

## Getting Started

The following code must be included in the head of your HTML file:

`<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>` <br />
`<script defer src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>`  
`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css">` <br />
`<script defer src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>` <br />
`<script defer type="text/javascript" src='js/animate.js'></script>`


## How to Use
Create the HTML Div element that will be the animation field:<br />
`<div id="animationField"></div>`

The HTML Div element must be relatively positioned, otherwise the library will not work:

 `#animationField {` <br />
&nbsp;&nbsp;&nbsp;&nbsp;`...` <br />
&nbsp;&nbsp;&nbsp;&nbsp;`position: relative;` <br />
&nbsp;&nbsp;&nbsp;&nbsp;`...` <br />
`}`

Then use the library in the JavaScript file. The background colours for the player and ball elements must be among the following: Black, Red, Orange, Yellow, Green, Blue, Purple or Brown. Please note that the order of the aniMate method calls must be the same as below for the library to work:

`const aMlibrary = new aM() // Create the object necessary to use the library`

`// Create objects that you want to be animated` <br />
`const player = document.createElement('div')` <br />
`player.style = 'width: 40px; height: 40px; border-radius: 50%; background-color: Blue;'` <br />

`const ball = document.createElement('div')` <br />
`ball.style = 'width: 30px; height: 30px; border-radius: 50%; background-color: Brown;'` <br />

`// Create the horizontal interacter element` <br />
`const hInteracter = aMlibrary.horizontalInteracter()` <br />

`aMlibrary.initiate('#animationField') // Set the HTML Div element that we want to be the animation field` <br />
`aMlibrary.setReset(true) // Set whether we want the animations to reset upon completion` <br />
`$('#animationField').after( hInteracter); // Insert the horizontal interacter into the DOM wherever desired` <br />
`aMlibrary.setSlider(); // Set the slider in the horizontal interacter` <br />
`aMlibrary.setPlayer(player) // Set the HTML element that will represent a player` <br />
`aMlibrary.setBall(ball) // Set the HTML element that will represent a ball` <br />
