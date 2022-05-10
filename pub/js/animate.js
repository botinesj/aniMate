/* JS Libraries */
"use strict";

(function(global, document, $) { 

    // Global variables
    var playerObj = null
    var ballObj = null

    var animationField = null
    var animationFieldQuery = null
    var objToAnimate = null
    var objToAnimateType = "player"
    var createPathModeOn = false
    var currentEditingObj = null;
    var currentEditingObjID = null;
    var currentEditingAnimater = null;
    var currentEditingObjCopy = null;

    var duration = 1;
    var pathColour = "Black";
    var reset = true

    var instructionModeOn = true

    var numPathsToDoPrevious = 0

    var pauseOrPlay = "play"

    var playerObjClone = null
    var ballObjClone = null
    var playerInitiated = 0
    var ballInitiated = 0

    // Global counts
    let numberOfAnimateObj = 0; 

    // Global arrays
    var animateObjs = [] // Array of all aniMaters
    var animateObjsCopy = [] 

    // Instruction Mode Placement Div
    const placementDiv = document.createElement('div')
    placementDiv.style = 'width: 200px; height: 80px;' 
    placementDiv.style.display = "none"
    placementDiv.style.backgroundColor = "white"
    placementDiv.style.borderRadius = "25px"
    placementDiv.style.padding = "6px"
    placementDiv.style.fontSize = "20px"
    placementDiv.style.position = "absolute"
    placementDiv.style.border = "2px solid black"
    placementDiv.style.paddingLeft = "15px";
    placementDiv.style.paddingRight = "15px";

    const placementText = document.createTextNode("Double click on the current element to enter EDIT MODE");
    placementDiv.appendChild(placementText)
    // END of Instruction Mode Placement Div

    // Instruction Mode Edit Div
    const editDiv = document.createElement('div')
    editDiv.style = 'width: 475px; height: 170px;' 
    editDiv.style.position = "absolute"
    editDiv.style.display = "none"
    editDiv.style.backgroundColor = "white"
    editDiv.style.borderRadius = "25px"
    editDiv.style.padding = "6px"
    editDiv.style.fontSize = "20px"
    editDiv.style.border = "2px solid black"
    editDiv.style.border = "2px solid black"
    editDiv.style.paddingLeft = "15px";
    editDiv.style.paddingRight = "15px";

    const clickDiv = document.createElement("div");
    const clickText = document.createTextNode("CLICK anywhere in the field to add to the element's animation path");
    clickDiv.appendChild(clickText)

    const shiftDiv = document.createElement("div");
    const shiftText = document.createTextNode("SHIFT KEY: Delete the current element's animation path");
    shiftDiv.appendChild(shiftText)

    const backspaceDiv = document.createElement("div");
    const backspaceText = document.createTextNode("DELETE KEY: Delete the current element");
    backspaceDiv.appendChild(backspaceText)

    const enterDiv = document.createElement("div");
    const enterText = document.createTextNode("ENTER KEY: Exit EDIT MODE");
    enterDiv.appendChild(enterText)

    const instructionRemoveDiv = document.createElement("div");
    const instructionRemoveText = document.createTextNode("To remove these annotations, uncheck the box marked 'Instructions' below the animation field");
    instructionRemoveDiv.appendChild(instructionRemoveText)

    editDiv.appendChild(clickDiv)
    editDiv.appendChild(shiftDiv)
    editDiv.appendChild(backspaceDiv)
    editDiv.appendChild(enterDiv)
    editDiv.appendChild(instructionRemoveDiv)
    // END of Instruction Mode Edit Div

    function aM () {
    }

    aM.prototype = {

        // input is the selector query of the desired HTML element that is to be the animation field (for example: .initiate(‘#animationField’))
        initiate: function(input) {
            animationFieldQuery = input
            const newAnimationField = document.querySelector(input) 
            animationField = newAnimationField
            animationField.addEventListener('click', animationFieldHandler);
            console.log("Successfully initiated.")

            $(animationFieldQuery).append(placementDiv)
            $(animationFieldQuery).append(editDiv)

            for (let i = 0; i < animateObjs.length; i++) {
                const text = animateObjs[i].object.id.toString();
                $('#'+text).remove()
                $('.'+text).remove()
            }
            animateObjs = []
            pauseOrPlay = "play"
            $("#playButton").html("Play Animations");
            $("#playButton").css("background-color", "green");
            $( "#animationSlider" ).slider( "option", "disabled", false ); // .slider option set method: External Library call from the jQuery UI library: https://api.jqueryui.com/slider/#method-option
            // Explanation of my use of the .slider option set method here: 
            // I am using .slider( "option", "disabled", false ) to enable the slider since no animations are currently running
        },

        // input is the desired HTML element that will represent a player element
        setPlayer: function(input) {
            objToAnimate = input;
            playerObj = input

            playerObjClone = playerObj.cloneNode()
            playerObjClone.id = "playerObjClone"
            const height = parseInt(playerObjClone.style.height)
            const ratio = 30 / height
            const newWidth = parseInt(playerObjClone.style.width) * ratio
            if (!playerInitiated) {
                $( "#playerButton" ).append(playerObjClone);
                $( "#playerObjClone" ).css({"width": convertToPixelString(newWidth), "height": "30px", "margin-left": "auto", "margin-right": "auto"});
                playerInitiated = 1
            }
        
            const backgroundColor = playerObj.style.backgroundColor.charAt(0).toUpperCase() + playerObj.style.backgroundColor.slice(1) // source: https://stackoverflow.com/a/1026087
            if (["Blue", "Green", "Purple", "Black", "Brown"].includes(backgroundColor)) { // To do: Problem is background colour is blue which != Blue
                $( "#playerColourInput" ).css({"background-color": backgroundColor, "color": "White"})
            } else {
                $( "#playerColourInput" ).css({"background-color": backgroundColor, "color": "Black"})
            }
            $("#playerColourInput").val(backgroundColor)
        },

        // input is the desired HTML element that will represent a ball element
        setBall: function(input) { 
            ballObj = input
            ballObjClone = ballObj.cloneNode()
            ballObjClone.id = "ballObjClone"
            const height = parseInt(ballObj.style.height)
            const ratio = 30 / height
            const newWidth = parseInt(ballObj.style.width) * ratio
            if (!ballInitiated) {
                $( "#ballButton" ).append(ballObjClone);
                $( "#ballObjClone" ).css({"width": convertToPixelString(newWidth), "height": "30px", "margin-left": "auto", "margin-right": "auto"});    
                ballInitiated = 1
            }

            const backgroundColor = ballObj.style.backgroundColor.charAt(0).toUpperCase() + ballObj.style.backgroundColor.slice(1) // source: https://stackoverflow.com/a/1026087

            if (["Blue", "Green", "Purple", "Black", "Brown"].includes(backgroundColor)) {
                $( "#ballColourInput" ).css({"background-color": backgroundColor, "color": "White"})
            } else {
                $( "#ballColourInput" ).css({"background-color": backgroundColor, "color": "Black"})
            }
            $("#ballColourInput").val(backgroundColor)
        },

        // input is the boolean (true or false) determining whether or not elements will reset to their original positions
        // after finishing their animations
        setReset: function(input) {
            reset = input
        },

        horizontalInteracter: function() {
            const horizontalInteracter = document.createElement('div')
            horizontalInteracter.style = 'width: 800px; height: 100px;'
            horizontalInteracter.style.backgroundColor = "White"
            horizontalInteracter.style.border = "thick solid Black"

            const durationDiv = document.createElement('div')
            durationDiv.style.marginTop = "10px"
            durationDiv.appendChild(document.createTextNode("Duration (seconds):"))
            const durationInput = document.createElement('input')
            durationInput.setAttribute("value", "1");
            durationInput.type = "number"
            durationInput.min = "1"
            durationInput.step = "1"
            durationInput.style.width = "60px"
            durationInput.id = "durationInput"
            durationDiv.appendChild(durationInput)
            durationDiv.style.display =  "inline-block";
            durationDiv.style.float = "left"

            const colours = ["Black", "Red", "Orange", "Yellow", "Green", "Blue", "Purple", "Brown"]

            const pathColourDiv = document.createElement('div')
            pathColourDiv.appendChild(document.createTextNode("Path colour:"))

            const pathColourInput = document.createElement('select')
            pathColourInput.style.width = "70px"
            pathColourInput.id = "pathColourInput"
            pathColourInput.style.float = "right"
            pathColourInput.style.marginRight = "5px"
            pathColourInput.setAttribute("value", "Black");
            pathColourInput.style.backgroundColor = "Black";
            pathColourInput.style.color = "White";

            for (let i = 0; i < colours.length; i++) {
                const option1 = document.createElement('option')
                option1.value = colours[i];
                option1.text = colours[i];
                pathColourInput.appendChild(option1)
            }

            pathColourDiv.appendChild(pathColourInput)

            // Player Colour
            const playerColourDiv = document.createElement('div')
            playerColourDiv.style.width = "200px"
            playerColourDiv.appendChild(document.createTextNode("Player colour:"))

            const playerColourInput = document.createElement('select')
            playerColourInput.style.width = "70px"
            playerColourInput.style.float = "right"
            playerColourInput.style.marginRight = "5px"
            playerColourInput.id = "playerColourInput"
            playerColourInput.setAttribute("value", "Black");
            playerColourInput.style.backgroundColor = "Black";
            playerColourInput.style.color = "White";

            for (let i = 0; i < colours.length; i++) {
                const option1 = document.createElement('option')
                option1.value = colours[i];
                option1.text = colours[i];
                playerColourInput.appendChild(option1)
            }

            playerColourDiv.appendChild(playerColourInput)
            playerColourDiv.style.display =  "inline-block";
            playerColourDiv.style.float = "left"
            // End of Player Colour

            // Ball Colour
            const ballColourDiv = document.createElement('div')
            ballColourDiv.style.width = "200px"
            ballColourDiv.appendChild(document.createTextNode("Ball colour:"))

            const ballColourInput = document.createElement('select')
            ballColourInput.style.width = "70px"
            ballColourInput.id = "ballColourInput"
            ballColourInput.style.float = "right"
            ballColourInput.style.marginRight = "5px"
            ballColourInput.setAttribute("value", "Black");
            ballColourInput.style.backgroundColor = "Black";
            ballColourInput.style.color = "White";

            for (let i = 0; i < colours.length; i++) {
                const option1 = document.createElement('option')
                option1.value = colours[i];
                option1.text = colours[i];
                ballColourInput.appendChild(option1)
            }

            ballColourDiv.appendChild(ballColourInput)
            ballColourDiv.style.display =  "inline-block";
            ballColourDiv.style.float = "left"
            // End of Ball Colour

            const playButton = document.createElement('button')
            playButton.appendChild(document.createTextNode("Play Animations"))
            playButton.id = "playButton"
            playButton.style.backgroundColor = "Green"
            playButton.style.color = "White"
            
            const ballButton = document.createElement('button')
            ballButton.style.height = "50px"
            ballButton.style.width = "70px"
            ballButton.appendChild(document.createTextNode("Add Ball"))
            ballButton.id = "ballButton"

            const playerButton = document.createElement('button')
            playerButton.style.height = "50px"
            playerButton.style.width = "88px"
            playerButton.appendChild(document.createTextNode("Add Player"))
            playerButton.id = "playerButton"

            const currentModeDiv = document.createElement('div')
            currentModeDiv.style.fontSize = "20px"
            currentModeDiv.appendChild(document.createTextNode("Current Mode: "))

            const currentModeChangeDiv = document.createElement('div')
            const currentMode = document.createTextNode("ADD PLAYER")

            currentModeChangeDiv.style.color = "blue"
            currentModeChangeDiv.id = "currentMode"
            currentModeChangeDiv.style.display =  "inline-block";
            currentModeChangeDiv.appendChild(currentMode)

            currentModeDiv.appendChild(currentModeChangeDiv)
            currentModeDiv.style.display =  "inline-block";

            const animationSlider = document.createElement('div')
            animationSlider.id = "animationSlider"
            animationSlider.style.width = "380px"
            animationSlider.style.height = "10px"
            animationSlider.style.marginLeft = "0px"

            const instructionsDiv = document.createElement('div')
            instructionsDiv.style.width = "150px"
            instructionsDiv.style.marginLeft = "35px"
            instructionsDiv.style.height = "50px"
            instructionsDiv.appendChild(document.createTextNode("Instructions: "))
            instructionsDiv.style.fontSize = "20px"
            instructionsDiv.style.display =  "inline-block";
            const instructionCheckbox = document.createElement("input");
            instructionCheckbox.setAttribute("type", "checkbox");
            instructionCheckbox.id = "instructionCheckbox"
            instructionCheckbox.checked = true
            instructionsDiv.appendChild(instructionCheckbox)

            // Non-Slider Div
            const nonSliderDiv = document.createElement('div')
            nonSliderDiv.style = 'width: 900px; height: 50px;'

            const nonSliderDivDropDowns = document.createElement('div')
            nonSliderDivDropDowns.style = 'width: 200px; height: 50px;'
            nonSliderDivDropDowns.style.display =  "inline-block";
            nonSliderDivDropDowns.style.float = "left"
            nonSliderDivDropDowns.appendChild(durationDiv)
            nonSliderDivDropDowns.appendChild(pathColourDiv)

            const nonSliderDivButtons = document.createElement('div')
            nonSliderDivButtons.style = 'width: 700px; height: 50px;'
            nonSliderDivButtons.style.display =  "inline-block";
            nonSliderDivButtons.style.float = "left"
            nonSliderDivButtons.appendChild(playerButton)
            nonSliderDivButtons.appendChild(ballButton)
            nonSliderDivButtons.appendChild(instructionsDiv)
            nonSliderDivButtons.appendChild(currentModeDiv)

            nonSliderDiv.appendChild(nonSliderDivDropDowns)
            nonSliderDiv.appendChild(nonSliderDivButtons)
            // End of Non-Slider Div

            // Slider Div
            const sliderDiv = document.createElement('div')
            sliderDiv.style = 'width: 900px; height: 50px;'

            const sliderDivDropDowns = document.createElement('div')
            sliderDivDropDowns.style = 'width: 200px; height: 50px;'
            sliderDivDropDowns.style.display =  "inline-block";
            sliderDivDropDowns.style.float = "left"
            sliderDivDropDowns.appendChild(playerColourDiv)
            sliderDivDropDowns.appendChild(ballColourDiv)

            const sliderDivSlider = document.createElement('div')
            sliderDivSlider.style = 'width: 700px; height: 50px;'
            sliderDivSlider.style.display =  "inline-block";
            sliderDivSlider.style.float = "left"

            const sliderDivSliderParts = document.createElement('div')
            sliderDivSliderParts.style.height = "50px"
            sliderDivSliderParts.style.width = "400px"

            sliderDivSliderParts.style.display =  "inline-block";
            sliderDivSliderParts.style.float = "left"
            sliderDivSliderParts.id = "sliderDivSliderParts"
            const divText = document.createElement('div')
            divText.style.width = "380px"
            divText.style.fontSize = "20px"
            divText.style.textAlign = "center"
            divText.appendChild(document.createTextNode("Animation Slider (Must be held down to work)"))
            sliderDivSliderParts.appendChild(divText)
            sliderDivSliderParts.appendChild(animationSlider)

            const sliderDivSliderButton = document.createElement('div')
            sliderDivSliderButton.style.height =  "50px";
            sliderDivSliderButton.style.width =  "200px";
            sliderDivSliderButton.style.display =  "inline-block";
            sliderDivSliderButton.style.float = "left"
            sliderDivSliderButton.appendChild(playButton)
            playButton.style.height = "45px"
            playButton.style.width = "158px"
            playButton.style.marginTop = "3px"

            sliderDivSlider.appendChild(sliderDivSliderButton)
            sliderDivSlider.appendChild(sliderDivSliderParts)

            sliderDiv.appendChild(sliderDivDropDowns)
            sliderDiv.appendChild(sliderDivSlider)
            // End of Slider Div

            horizontalInteracter.appendChild(nonSliderDiv)
            horizontalInteracter.appendChild(sliderDiv)

            playButton.addEventListener('click', startAnimations);
            playerButton.addEventListener('click', playerOn);
            ballButton.addEventListener('click', ballOn);
            return horizontalInteracter
        },

        setSlider: function() {

            $( "#animationSlider" ).slider({ // .slider: External Library call from the jQuery UI library: https://api.jqueryui.com/slider/
            // Explanation of my use of .slider: 
            // I was having some difficulty obtaining the desired functionality for a slider with the vanilla event javascript listeners, but managed 
            // to achieve what I wanted using the jQuery UI slider plugin. I used the jQuery UI Slider plugin to create a slider element,
            // and put event listeners when the slider is dragged by the user and when the slider is released by the user.

                max: 100,
                min: 0,
                value: 0,
                slide: function( e, ui ) {
                    var value = $( "#animationSlider" ).slider( "option", "value" ) // .slider option get method: External Library call from the jQuery UI library: https://api.jqueryui.com/slider/#method-option
                    // Explanation of my use of the .slider option get method here: 
                    // I am using .slider( "option", "value" ) to get the current value of the slider element

                    for (let i = 0; i < animateObjs.length; i++) {
                        animateObjs[i].object.style.opacity = "1"
                    } 

                    if (objToAnimateType === "player") {
                        $("#currentMode").text("ADD PLAYER");
                        $("#currentMode").css( "color", "blue" );
                    }
                    else if (objToAnimateType === "ball") {
                        $("#currentMode").text("ADD BALL");
                        $("#currentMode").css( "color", "red" );
                    }
    
                    if (createPathModeOn) {
                        createPathModeOn = false
                        currentEditingObj.style.border = ""
                        currentEditingObj.style.outline = ""
                    }

                    if (currentEditingObjCopy != null) {
                        currentEditingObjCopy.remove()
                        currentEditingObjCopy = null
                    }
                
                    var maxPathLength = 1
                    for (let i = 0; i < animateObjs.length; i++) {
                        if (animateObjs[i].positions.length > maxPathLength) {
                            maxPathLength = animateObjs[i].positions.length
                        } 
                    }

                    const numPathsToDo = Math.floor((value / 100) * maxPathLength)

                    if (numPathsToDo != numPathsToDoPrevious) {
                        
                        var text = null;
                    
                        for (let i = 0; i < animateObjs.length; i++) {
                            text = animateObjs[i].object.id.toString();
                            const query = '#'+text 
                            if (animateObjs[i].positions.length >= numPathsToDo + 1 && numPathsToDoPrevious < numPathsToDo) {
                                for (let j = numPathsToDoPrevious; j < numPathsToDo; j++) {
                                    // Calculate necessary shift
                                    const left = convertToPixelString(parseInt(animateObjs[i].positions[j+1][0]) - parseInt(animateObjs[i].object.style.width) / 2)
                                    const top = convertToPixelString(parseInt(animateObjs[i].positions[j+1][1]) - parseInt(animateObjs[i].object.style.height) / 2)
                        
                                    $(query).animate({ "left": left, 
                                    "top": top }, {duration: animateObjs[i].durations[j]},
                                    "auto", );
                                } 
                            }
                            else if (animateObjs[i].positions.length >= numPathsToDo + 1 && numPathsToDoPrevious > numPathsToDo) {
                                for (let j = numPathsToDoPrevious; j > numPathsToDo; j--) {
                                    // Calculate necessary shift
                                    var left = null
                                    var top = null
                                    if (j-1 == 0) {
                                        left = convertToPixelString(parseInt(animateObjs[i].positions[j-1][0]))
                                        top = convertToPixelString(parseInt(animateObjs[i].positions[j-1][1]))
                                    } else {
                                        left = convertToPixelString(parseInt(animateObjs[i].positions[j-1][0]) - parseInt(animateObjs[i].object.style.width) / 2)
                                        top = convertToPixelString(parseInt(animateObjs[i].positions[j-1][1]) - parseInt(animateObjs[i].object.style.height) / 2)
                                    }

                                    $(query).animate({ "left": left, 
                                    "top": top }, {duration: animateObjs[i].durations[j-1]},
                                    "auto" );
                                } 
                            }
                        }

                        numPathsToDoPrevious = numPathsToDo
                    }
                },
                stop: function( event, ui ) {
                    $( "#animationSlider" ).slider( "value", 0 ) // .slider set value method: External Library call from the jQuery UI library: https://api.jqueryui.com/slider/#method-value
                     // Explanation of my use of the .slider option set value method here: 
                    // I am using .slider( "value", 0 ) to set the current value of the slider element to 0

                    $(".animatableObj").each(function() {
                        $("#" + this.id).stop(true, false)
                    });

                    numPathsToDoPrevious = 0

                    for (let k = 0; k < animateObjs.length; k++) {
                        animateObjs[k].currentPositionsIndex = 0
                        const curObjId = animateObjs[k].object.id
                        const query = "#" + curObjId
                        $(query).css({'top': animateObjs[k].positions[0][1], 'left' : animateObjs[k].positions[0][0]})
                    }
                }
            });
        }
    }

    // Private function
    function convertToPixelString(value) {
        return value.toString() + "px"
    }

    // Private function
    function getAnimater(id) {
        let correctAnimater;

        for (let i = 0; i < animateObjs.length; i++) {
            if (animateObjs[i].object.id == id) {
                correctAnimater = animateObjs[i];
            }
        }
        return correctAnimater;
    }

    // Private function
    // Source for lines 544 - 559: https://stackoverflow.com/a/55963590
    function linedraw(x1, y1, x2, y2, pathCol) {
        
        if (x2 < x1) {
            var tmp = 0;
            tmp = x2 ; 
            x2 = x1 ; 
            x1 = tmp;
            tmp = y2 ; 
            y2 = y1 ; 
            y1 = tmp;
        }

        var lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        var m = (y2 - y1) / (x2 - x1);

        var degree = Math.atan(m) * 180 / Math.PI;

        // Source for lines 562 - 570: https://stackoverflow.com/a/60643227
        let line = document.createElement('div');
        line.style.position = 'absolute'
        line.style.height = '2px',
        line.style.transformOrigin = 'top left'
        line.style.width = lineLength + "px"
        line.style.top = y1 + "px"
        line.style.left = x1 + "px"
        line.style.transform = "rotate(" + degree + "deg)"
        line.style.backgroundColor = pathCol
        line.className = currentEditingObjID
        animationField.appendChild(line);
    }

    // Private function
    function playerOn(e) {
        e.preventDefault()
        objToAnimate = playerObj
        objToAnimateType = "player"
        $("#currentMode").text("ADD PLAYER");
        $("#currentMode").css( "color", "blue" );

    }
    // Private function
    function ballOn(e) {
        e.preventDefault()
        objToAnimate = ballObj
        objToAnimateType = "ball"
        $("#currentMode").text("ADD BALL");
        $("#currentMode").css( "color", "red" );
    }

    // Private function
    function animationFieldHandler(e) {
        e.preventDefault()
        if (e.target.id == animationField.id || (e.target.className === "animatableObj" && createPathModeOn)) { 
            // SOURCE FOR CODE BLOCK: https://stackoverflow.com/a/10429969
            var x = e.pageX - $(animationFieldQuery).offset().left 
            var y = e.pageY - $(animationFieldQuery).offset().top 
            // END OF SOURCED CODE BLOCK

            if (!createPathModeOn) {
                x = x - (parseInt(objToAnimate.style.width))
                y = y - (parseInt(objToAnimate.style.height))
        
                x = convertToPixelString(x)
                y = convertToPixelString(y)

                const animater = new aniMater(objToAnimate)

                animateObjs.push(animater)
                animater.animate(objToAnimate, animationField, x, y)
            } else {
                duration = parseInt($("#durationInput").val())
                pathColour = $("#pathColourInput").val()

                const length = currentEditingAnimater.positions.length

                var previousX = parseInt(currentEditingAnimater.positions[length - 1][0])
                var previousY = parseInt(currentEditingAnimater.positions[length - 1][1])

                if (currentEditingAnimater.positions.length == 1) {
                    previousX = previousX + (parseInt(objToAnimate.style.width) / 2)
                    previousY = previousY + (parseInt(objToAnimate.style.height) / 2)
                }

                x = x - (parseInt(objToAnimate.style.width) / 2)
                y = y - (parseInt(objToAnimate.style.height) / 2)

                x = convertToPixelString(x)
                y = convertToPixelString(y)

                linedraw(previousX, previousY, parseInt(x), parseInt(y), pathColour)

                currentEditingAnimater.positions.push([x,y])
                currentEditingAnimater.durations.push(duration * 1000) 
                currentEditingAnimater.pathColours.push(pathColour) 

                if (currentEditingObjCopy === null) {
                    currentEditingObjCopy = currentEditingObj.cloneNode()
                    currentEditingObjCopy.style.border = "4px solid MediumVioletRed";
                    currentEditingObjCopy.style.position = 'absolute'
                    currentEditingObjCopy.id = "clone"
                }
                currentEditingObjCopy.style.left = convertToPixelString(parseInt(x) - (parseInt(currentEditingObjCopy.style.width) / 2));
                currentEditingObjCopy.style.top = convertToPixelString(parseInt(y) - (parseInt(currentEditingObjCopy.style.width) / 2));
                animationField.appendChild(currentEditingObjCopy)
            }
        }
    }

    // Private function
    function startAnimations(e) {
        e.preventDefault()
        if (pauseOrPlay === "play") {
            pauseOrPlay = "pause"
            $("#playButton").html("Pause Animations");
            $("#playButton").css("background-color", "red");
            $( "#animationSlider" ).slider( "option", "disabled", true );  // .slider option set method: External Library call from the jQuery UI library: https://api.jqueryui.com/slider/#method-option
            // Explanation of my use of the .slider option set method here: 
            // I am using .slider( "option", "disabled", true ) to disable the slider while animations are running

            if (createPathModeOn) {
                createPathModeOn = false
                currentEditingObj.style.border = ""
                currentEditingObj.style.outline = ""
            }
            for (let i = 0; i < animateObjs.length; i++) {
                if (currentEditingAnimater != animateObjs[i]) {
                    animateObjs[i].object.style.opacity = "1"
                }
            } 
            if (currentEditingObjCopy != null) {
                currentEditingObjCopy.remove()
                currentEditingObjCopy = null
            }

            var text = null;

            // This code works fine as long as we sort animateObjs so the aniMater with longest path is at at the end of the array
            animateObjs.sort(function(a, b) { // source for format of this sort function: https://developer.mozilla.org/en-US/docs/web/javascript/reference/global_objects/array/sort
                const a_sum = a.durations.reduce((c, d) => c + d, 0)
                const b_sum = b.durations.reduce((c, d) => c + d, 0)
                if (a_sum < b_sum) {
                return -1;
                }
                else if (a_sum > b_sum) {
                return 1;
                } else {
                    return 0;
                }
            });

            for (let i = 0; i < animateObjs.length; i++) {
                text = animateObjs[i].object.id.toString();
                const query = '#'+text 

                    for (let j = animateObjs[i].currentPositionsIndex; j < animateObjs[i].positions.length - 1; j++) {
                            // Calculate necessary shift
                            const left = convertToPixelString(parseInt(animateObjs[i].positions[j+1][0]) - parseInt(animateObjs[i].object.style.width) / 2)
                            const top = convertToPixelString(parseInt(animateObjs[i].positions[j+1][1]) - parseInt(animateObjs[i].object.style.height) / 2)
                
                            $(query).animate({ "left": left, 
                            "top": top }, {duration: animateObjs[i].durations[j],
                                complete: function() {
                                    animateObjs[i].currentPositionsIndex += 1
                                    animateObjsCopy[i].currentPositionsIndex += 1

                                    if (i === animateObjs.length - 1 && j == animateObjs[i].positions.length - 2 && reset) {
                                        for (let k = 0; k < animateObjs.length; k++) {
                                            animateObjs[k].currentPositionsIndex = 0
                                            const curObjId = animateObjs[k].object.id
                                            const query = "#" + curObjId
                                            $(query).css({'top': animateObjs[k].positions[0][1], 'left' : animateObjs[k].positions[0][0]})
                                        }
                                    }
                                } 
                            },
                            "auto");
                    } 
            }

            animateObjsCopy = _.cloneDeep(animateObjs); // _.cloneDeep: External Library call from the lodash library: https://lodash.com/docs/4.17.15#cloneDeep
            // Explanation of my use of cloneDeep: animateObjs is an array of aniMater's, which are custom javascript objects.
            // I needed to preserve a copy of animateObjs prior to the promise().done directly code below was called. A shallow copy
            // did not work with my code, thus I required a deep clone. In order to deep clone an array of custom javascript objects, 
            // I needed to use cloneDeep, since no other vanilla JS functionality was able to satisfy this need.

            $(":animated").promise().done(function() { // source for this line: https://stackoverflow.com/a/8333110
                pauseOrPlay = "play"
                $("#playButton").html("Play Animations");
                $("#playButton").css("background-color", "green");
                $( "#animationSlider" ).slider( "option", "disabled", false );  // .slider option set method: External Library call from the jQuery UI library: https://api.jqueryui.com/slider/#method-option
                // Explanation of my use of the .slider option set method here: 
                // I am using .slider( "option", "disabled", false ) to enable the slider since no animations are currently running

                if (!reset) { // clear all positions and arrows
                    for (let k = 0; k < animateObjs.length; k++) {
                        const idText = animateObjs[k].object.id.toString();
                        const idQuery = '#'+idText

                        const newStartingPos = $(idQuery).position()

                        animateObjs[k].currentPositionsIndex = 0
                        animateObjs[k].positions = [[convertToPixelString(newStartingPos.left), convertToPixelString(newStartingPos.top)]]
                        animateObjs[k].durations = []
                        animateObjs[k].pathColours = []
                        $("." + animateObjs[k].object.id).remove();
                    }
                }
            });

        } else if (pauseOrPlay === "pause") {
            pauseOrPlay = "play"
            $( "#animationSlider" ).slider( "option", "disabled", false ); // .slider option set method: External Library call from the jQuery UI library: https://api.jqueryui.com/slider/#method-option
            // Explanation of my use of the .slider option set method here: 
            // I am using .slider( "option", "disabled", false ) to enable the slider since no animations are currently running

            $(".animatableObj").each(function() {
                $("#" + this.id).stop(true, false)
            });

            animateObjs = _.cloneDeep(animateObjsCopy); // _.cloneDeep: External Library call from the lodash library: https://lodash.com/docs/4.17.15#cloneDeep
            // Explanation of my use of cloneDeep: animateObjsCopy is an array of aniMater's, which are custom javascript objects.
            // I needed to preserve a copy of animateObjsCopy. A shallow copy did not work with my code, thus I required a deep clone. 
            // In order to deep clone an array of custom javascript objects, I needed to use cloneDeep, since no other vanilla JS 
            // functionality was able to satisfy this need.
            for (let i = 0; i < animateObjs.length; i++) {
                $("." + animateObjs[i].object.id.toString()).remove();
            }


            for (let i = 0; i < animateObjs.length; i++) {
                if (animateObjs[i].positions.length > 1) {
                    for (let j = 1; j < animateObjs[i].positions.length; j++) {
                        if (j == 1) {
                            var previousX = parseInt(animateObjs[i].positions[j - 1][0]) + (parseInt(animateObjs[i].object.style.width) / 2)
                            var previousY = parseInt(animateObjs[i].positions[j - 1][1]) + (parseInt(animateObjs[i].object.style.height) / 2) 
                            var x = parseInt(animateObjs[i].positions[j][0]) 
                            var y = parseInt(animateObjs[i].positions[j][1]) 
                            currentEditingObjID = animateObjs[i].object.id
                            linedraw(previousX, previousY, parseInt(x), parseInt(y), animateObjs[i].pathColours[j - 1])
                        }
                        else {
                            var previousX = parseInt(animateObjs[i].positions[j - 1][0]) 
                            var previousY = parseInt(animateObjs[i].positions[j - 1][1]) 
                            var x = parseInt(animateObjs[i].positions[j][0]) 
                            var y = parseInt(animateObjs[i].positions[j][1]) 
                            currentEditingObjID = animateObjs[i].object.id
                            linedraw(previousX, previousY, parseInt(x), parseInt(y), animateObjs[i].pathColours[j - 1])
                        }
                    }
                }
            }
        }
    }

    // Private function
    function aniMater(object) {
        this.object = object;
        this.positions = [];
        this.durations = []
        this.pathColours = []
        this.currentPositionsIndex = 0
        numberOfAnimateObj++
    }

    // Private
    aniMater.prototype = {
        animate: function(animateObj, animationField, x, y) {

            var objAlreadyExists = false
            var clonedObj = null
            var clonedObjInd = null

            for (let i = 0; i < animateObjs.length; i++) {
                if (animateObjs[i].object == objToAnimate) {
                    objAlreadyExists = true
                    clonedObj = animateObjs[i].object.cloneNode()
                    clonedObjInd = i
                    break;
                }
            }

            if (!objAlreadyExists) { 

                animateObj.style.position = 'absolute'
                animateObj.id = numberOfAnimateObj
                animateObj.style.left = x;
                animateObj.style.top = y;
                animationField.appendChild(animateObj)

                let text = numberOfAnimateObj.toString();
                const added = '#'+text

                $(added).draggable({ // .draggable: External Library call from the jQuery UI library: https://api.jqueryui.com/draggable/
                    // Explanation of my use of .draggable: 
                    //  I used the jQuery UI Draggable plugin to make elements added to the animation field draggable, but cannot be dragged 
                    // outside of the animation field. Additionally, I used the plugin to put an event listener on each draggable element when it
                    // is dragged by the user. This event listener updates the starting position of the current element and positions in its animation path,
                    // redraws the new updated animation path, and removes a position from the element's animation path if it would result
                    // in the element leaving the animation field.
                    containment: "parent",
                    drag: function() {
                        $("." + animateObj.id.toString()).remove();

                        const currAnimator = animateObjs.filter(function(animater){ 
                            return animater.object.id == animateObj.id 
                        })
                        
                        const newStartingPos = $(added).position()
                        const oldStartingPos = currAnimator[0].positions[0]

                        const xDifference = Math.abs(newStartingPos.left - parseInt(oldStartingPos[0]))
                        const yDifference = Math.abs(newStartingPos.top - parseInt(oldStartingPos[1]))

                        currAnimator[0].positions[0] = [newStartingPos.left, newStartingPos.top]
                        if (newStartingPos.top < parseInt(oldStartingPos[1]) && newStartingPos.left < parseInt(oldStartingPos[0])) { 
                            for (let i = 1; i < currAnimator[0].positions.length; i++) {
                                currAnimator[0].positions[i][0] = parseInt(currAnimator[0].positions[i][0]) - xDifference 
                                currAnimator[0].positions[i][1] = parseInt(currAnimator[0].positions[i][1]) - yDifference 
                            }
                        }

                        else if (newStartingPos.top < parseInt(oldStartingPos[1]) && newStartingPos.left >= parseInt(oldStartingPos[0])) {
                            for (let i = 1; i < currAnimator[0].positions.length; i++) {
                                currAnimator[0].positions[i][0] = parseInt(currAnimator[0].positions[i][0]) + xDifference 
                                currAnimator[0].positions[i][1] = parseInt(currAnimator[0].positions[i][1]) - yDifference 
                            }
                        }
                        else if (newStartingPos.top >= parseInt(oldStartingPos[1]) && newStartingPos.left < parseInt(oldStartingPos[0])) { 
                            for (let i = 1; i < currAnimator[0].positions.length; i++) {
                                currAnimator[0].positions[i][0] = parseInt(currAnimator[0].positions[i][0]) - xDifference 
                                currAnimator[0].positions[i][1] = parseInt(currAnimator[0].positions[i][1]) + yDifference 
                            }
                        }

                        else if (newStartingPos.top >= parseInt(oldStartingPos[1]) && newStartingPos.left >= parseInt(oldStartingPos[0])) { 
                            for (let i = 1; i < currAnimator[0].positions.length; i++) {
                                currAnimator[0].positions[i][0] = parseInt(currAnimator[0].positions[i][0]) + xDifference 
                                currAnimator[0].positions[i][1] = parseInt(currAnimator[0].positions[i][1]) + yDifference 
                            }
                        }
                    }
                })

                animateObj.className = 'animatableObj'
            }
            else {
                clonedObj.style.position = 'absolute'
                clonedObj.id = numberOfAnimateObj
                clonedObj.style.left = x;
                clonedObj.style.top = y;
                animationField.appendChild(clonedObj)
                animateObjs[clonedObjInd].object = clonedObj

                let text = numberOfAnimateObj.toString();
                const added = '#'+text 
        
                $(added).draggable({ // .draggable: External Library call from the jQuery UI library: https://api.jqueryui.com/draggable/
                    // Explanation of my use of .draggable: 
                    // I used the jQuery UI Draggable plugin to make elements added to the animation field draggable, but cannot be dragged 
                    // outside of the animation field. Additionally, I used the plugin to put an event listener on each draggable element when it
                    // is dragged by the user. This event listener updates the starting position of the current element and positions in its animation path,
                    // redraws the new updated animation path, and removes a position from the element's animation path if it would result
                    // in the element leaving the animation field.
                    containment: "parent",
                    drag: function() {
                        const currAnimator = animateObjs.filter(function(animater){ 
                            return animater.object.id == clonedObj.id 
                        })

                        currentEditingObjID = clonedObj.id
                        $("." + clonedObj.id.toString()).remove();

                        const newStartingPos = $(added).position()
                        const oldStartingPos = currAnimator[0].positions[0]

                        const xDifference = Math.abs(newStartingPos.left - parseInt(oldStartingPos[0]))
                        const yDifference = Math.abs(newStartingPos.top - parseInt(oldStartingPos[1]))

                        currAnimator[0].positions[0] = [newStartingPos.left, newStartingPos.top]

                        if (newStartingPos.top < parseInt(oldStartingPos[1]) && newStartingPos.left < parseInt(oldStartingPos[0])) { 
                            for (let i = 1; i < currAnimator[0].positions.length; i++) {
                                currAnimator[0].positions[i][0] = parseInt(currAnimator[0].positions[i][0]) - xDifference 
                                currAnimator[0].positions[i][1] = parseInt(currAnimator[0].positions[i][1]) - yDifference 
                            }
                        }

                        else if (newStartingPos.top < parseInt(oldStartingPos[1]) && newStartingPos.left >= parseInt(oldStartingPos[0])) { 
                            for (let i = 1; i < currAnimator[0].positions.length; i++) {
                                currAnimator[0].positions[i][0] = parseInt(currAnimator[0].positions[i][0]) + xDifference 
                                currAnimator[0].positions[i][1] = parseInt(currAnimator[0].positions[i][1]) - yDifference 
                            }
                        }
                        else if (newStartingPos.top >= parseInt(oldStartingPos[1]) && newStartingPos.left < parseInt(oldStartingPos[0])) { 
                            for (let i = 1; i < currAnimator[0].positions.length; i++) {
                                currAnimator[0].positions[i][0] = parseInt(currAnimator[0].positions[i][0]) - xDifference 
                                currAnimator[0].positions[i][1] = parseInt(currAnimator[0].positions[i][1]) + yDifference 
                            }
                        }

                        else if (newStartingPos.top >= parseInt(oldStartingPos[1]) && newStartingPos.left >= parseInt(oldStartingPos[0])) { 
                            for (let i = 1; i < currAnimator[0].positions.length; i++) {
                                currAnimator[0].positions[i][0] = parseInt(currAnimator[0].positions[i][0]) + xDifference 
                                currAnimator[0].positions[i][1] = parseInt(currAnimator[0].positions[i][1]) + yDifference 
                            }
                        }

                        // Determine if path would take the element out of animation field
                        for (let i = currAnimator[0].positions.length - 1; i >= 0; i--) {
                            if (currAnimator[0].positions[i][0] < 0 || currAnimator[0].positions[i][0] > $(animationFieldQuery).width() || currAnimator[0].positions[i][1] < 0 || currAnimator[0].positions[i][1] > $(animationFieldQuery).height()) {
                                currAnimator[0].positions.splice(i, 1)
                            } 
                        }

                        if (currAnimator[0].positions.length > 1) {
                            for (let i = 1; i < currAnimator[0].positions.length; i++) {
                                if (i == 1) {
                                var previousX = parseInt(currAnimator[0].positions[i - 1][0]) + (parseInt(objToAnimate.style.width) / 2)
                                var previousY = parseInt(currAnimator[0].positions[i - 1][1]) + (parseInt(objToAnimate.style.height) / 2) 
                                var x = parseInt(currAnimator[0].positions[i][0]) 
                                var y = parseInt(currAnimator[0].positions[i][1]) 
                                linedraw(previousX, previousY, parseInt(x), parseInt(y), currAnimator[0].pathColours[i - 1])
                                }
                                else {
                                    var previousX = parseInt(currAnimator[0].positions[i - 1][0]) 
                                    var previousY = parseInt(currAnimator[0].positions[i - 1][1]) 
                                    var x = parseInt(currAnimator[0].positions[i][0]) 
                                    var y = parseInt(currAnimator[0].positions[i][1])  
                                    linedraw(previousX, previousY, parseInt(x), parseInt(y), currAnimator[0].pathColours[i - 1])
                                }
                            }
                        }

                        if (createPathModeOn && currAnimator[0].positions.length !== 1) {
                            const length = currAnimator[0].positions.length
                            currentEditingObjCopy.style.left = convertToPixelString(parseInt(currAnimator[0].positions[length - 1][0]) - (parseInt(currentEditingObjCopy.style.width) / 2));
                            currentEditingObjCopy.style.top = convertToPixelString(parseInt(currAnimator[0].positions[length - 1][1]) - (parseInt(currentEditingObjCopy.style.width) / 2));
                            animationField.appendChild(currentEditingObjCopy)
                        } else {
                            if (currentEditingObjCopy != null) {
                                currentEditingObjCopy.remove()
                                currentEditingObjCopy = null
                            }
                        }
                    }

                })

                clonedObj.className = 'animatableObj'

            }
            this.positions.push([x,y])
        },

    }

    $(document).on("dblclick", ".animatableObj", function(e) {
        e.preventDefault()
        if (!createPathModeOn) {
            $("#currentMode").text("EDIT MODE");
            $("#currentMode").css( "color", "purple" );
            placementDiv.style.display = "none"
            if (instructionModeOn) {
                const newTop = convertToPixelString(parseInt(e.target.style.top) - parseInt(editDiv.style.height))
                const newLeft = convertToPixelString(parseInt(e.target.style.left) - parseInt(editDiv.style.width) / 2.5)
                editDiv.style.display = "block"
                editDiv.style.top = newTop
                editDiv.style.left = newLeft
            }

            createPathModeOn = true
            currentEditingObj = e.target
            currentEditingObjID = e.target.id
            // Highlight the element 
            currentEditingObj.style.border = "4px solid lime";

            currentEditingObjCopy = e.target.cloneNode()
            currentEditingObjCopy.style.border = "4px solid MediumVioletRed";
            currentEditingObjCopy.style.position = 'absolute'
            currentEditingObjCopy.id = "clone"

            // get the desired element we are animating in the animaters so we can edit its path
            currentEditingAnimater = getAnimater(currentEditingObjID)

            const length = currentEditingAnimater.positions.length
            if (length != 1) {
                currentEditingObjCopy.style.left = convertToPixelString(parseInt(currentEditingAnimater.positions[length - 1][0]) - (parseInt(currentEditingObjCopy.style.width) / 2));
                currentEditingObjCopy.style.top = convertToPixelString(parseInt(currentEditingAnimater.positions[length - 1][1]) - (parseInt(currentEditingObjCopy.style.width) / 2));
                animationField.appendChild(currentEditingObjCopy)
            }

            for (let i = 0; i < animateObjs.length; i++) {
                if (currentEditingAnimater != animateObjs[i]) {
                    animateObjs[i].object.style.opacity = "0.3"
                }
            } 
        }
    });

    // End editing session by pressing enter key
    $(document).on("keypress", animationFieldQuery, function(e) {
        if(e.which == 13) {
            editDiv.style.display = "none"
            if (createPathModeOn) {
                createPathModeOn = false
                currentEditingObj.style.border = ""
                currentEditingObj.style.outline = ""
            }
            for (let i = 0; i < animateObjs.length; i++) {
                if (currentEditingAnimater != animateObjs[i]) {
                    animateObjs[i].object.style.opacity = "1"
                }
            } 
            if (currentEditingObjCopy != null) {
                currentEditingObjCopy.remove()
                currentEditingObjCopy = null
            }

            if (objToAnimateType === "player") {
                $("#currentMode").text("ADD PLAYER");
                $("#currentMode").css( "color", "blue" );
            }
            else if (objToAnimateType === "ball") {
                $("#currentMode").text("ADD BALL");
                $("#currentMode").css( "color", "red" );
            }
        }
    });

    // Delete current editing element by pressing delete key
    $(document).on("keydown", animationFieldQuery, function(e) {

        if(e.which == 8) {
            editDiv.style.display = "none"
            if (createPathModeOn) {
                createPathModeOn = false
                currentEditingObj.style.border = ""
                currentEditingObj.style.outline = ""

                for (let i = 0; i < animateObjs.length; i++) {
                    if (currentEditingAnimater != animateObjs[i]) {
                        animateObjs[i].object.style.opacity = "1"
                    }
                } 

                $("." + currentEditingObjID.toString()).remove();
                createPathModeOn = false
                if (currentEditingObj != null) {
                    currentEditingObj.remove()
                    currentEditingObj = null
                }

                animateObjs = animateObjs.filter(function(animater){ 
                    return animater != currentEditingAnimater; 
                })

                currentEditingObjCopy.remove()
                
                currentEditingObj = null;
                currentEditingObjID = null;
                currentEditingAnimater = null;
                currentEditingObjCopy = null;
                
                if (objToAnimateType === "player") {
                    $("#currentMode").text("ADD PLAYER");
                    $("#currentMode").css( "color", "blue" );
                }
                else if (objToAnimateType === "ball") {
                    $("#currentMode").text("ADD BALL");
                    $("#currentMode").css( "color", "red" );
                }
            }
        }
    });

    // Delete the current animation path of the selected element by pressing shift key
    $(document).on("keydown", animationFieldQuery, function(e) {
        if(e.which == 16) {
            if (createPathModeOn) {                
                currentEditingAnimater.positions = [currentEditingAnimater.positions[0]]
                currentEditingAnimater.durations = []
                currentEditingAnimater.pathColours = []

                $("." + currentEditingObjID.toString()).remove();
                currentEditingObjCopy.remove()

            }
        }
    });

    $(document).on("mouseover", ".animatableObj", function(e) {

        if (instructionModeOn && !createPathModeOn) {
            // Display placement mode Div element right above element
            const newTop = convertToPixelString(parseInt(e.target.style.top) - parseInt(placementDiv.style.height))
            const newLeft = convertToPixelString(parseInt(e.target.style.left) - parseInt(placementDiv.style.width) / 2.5)    
            placementDiv.style.display = "block"
            placementDiv.style.top = newTop
            placementDiv.style.left = newLeft

        } else if (instructionModeOn && createPathModeOn) {
            // Display edit mode Div element right above element
            const newTop = convertToPixelString(parseInt(e.target.style.top) - parseInt(editDiv.style.height))
            const newLeft = convertToPixelString(parseInt(e.target.style.left) - parseInt(editDiv.style.width) / 2.5)
            editDiv.style.display = "block"
            editDiv.style.top = newTop
            editDiv.style.left = newLeft

        }
    })

    $(document).on("mouseout", ".animatableObj", function(e) {
        if (instructionModeOn && !createPathModeOn) {
            placementDiv.style.display = "none"
        } else if (instructionModeOn && createPathModeOn) {
            editDiv.style.display = "none"
        }
    })

    $(document).on("change", "#pathColourInput", function(e) {
        const backgroundColor = $("#pathColourInput").val()
        if (["Blue", "Green", "Purple", "Black", "Brown"].includes(backgroundColor)) {
            $("#pathColourInput").css({"background-color": backgroundColor, "color": "White"})
        } else {
            $("#pathColourInput").css({"background-color": backgroundColor, "color": "Black"})
        }
    })

    $(document).on("change", "#ballColourInput", function(e) {
        const backgroundColor = $("#ballColourInput").val()
        if (["Blue", "Green", "Purple", "Black", "Brown"].includes(backgroundColor)) {
            $("#ballColourInput").css({"background-color": backgroundColor, "color": "White"})
        } else {
            $("#ballColourInput").css({"background-color": backgroundColor, "color": "Black"})
        }

        ballObj.style.backgroundColor = backgroundColor
        $("#ballObjClone").css("background-color", backgroundColor)

    })

    $(document).on("change", "#playerColourInput", function(e) {
        const backgroundColor = $("#playerColourInput").val()
        if (["Blue", "Green", "Purple", "Black", "Brown"].includes(backgroundColor)) {
            $("#playerColourInput").css({"background-color": backgroundColor, "color": "White"})
        } else {
            $("#playerColourInput").css({"background-color": backgroundColor, "color": "Black"})
        }

        playerObj.style.backgroundColor = backgroundColor
        $("#playerObjClone").css("background-color", backgroundColor)
    })

    $(document).on("change", "#instructionCheckbox", function(e) {
        instructionModeOn = $("#instructionCheckbox").is(":checked")
        placementDiv.style.display = "none"
        editDiv.style.display = "none"
    })

    // After setup:
    global.aM = global.aM || aM

})(window, window.document, $); 
