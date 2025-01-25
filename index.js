window.oncontextmenu = (e) => { e.preventDefault() };
window.onload = initLoad;

window.practiceTimeouts = [];
window.currentPracticePhase = 0;
window.timerId = null;
window.lastClickTime = 0;
window.startTime = 0;

const allElements = [
    "Hydrogen", "Helium", "Lithium", "Beryllium", "Boron", "Carbon", "Nitrogen", "Oxygen", "Fluorine", "Neon",
    "Sodium", "Magnesium", "Aluminium", "Silicon", "Phosphorus", "Sulfur", "Chlorine", "Argon", "Potassium", "Calcium",
    "Scandium", "Titanium", "Vanadium", "Chromium", "Manganese", "Iron", "Cobalt", "Nickel", "Copper", "Zinc",
    "Gallium", "Germanium", "Arsenic", "Selenium", "Bromine", "Krypton", "Rubidium", "Strontium", "Yttrium", "Zirconium",
    "Niobium", "Molybdenum", "Technetium", "Ruthenium", "Rhodium", "Palladium", "Silver", "Cadmium", "Indium", "Tin",
    "Antimony", "Tellurium", "Iodine", "Xenon", "Cesium", "Barium", "Lanthanum", "Cerium", "Praseodymium", "Neodymium",
    "Promethium", "Samarium", "Europium", "Gadolinium", "Terbium", "Dysprosium", "Holmium", "Erbium", "Thulium", "Ytterbium",
    "Lutetium", "Hafnium", "Tantalum", "Tungsten", "Rhenium", "Osmium", "Iridium", "Platinum", "Gold", "Mercury",
    "Thallium", "Lead", "Bismuth", "Polonium", "Astatine", "Radon", "Francium", "Radium", "Actinium", "Thorium",
    "Protactinium", "Uranium", "Neptunium", "Plutonium", "Americium", "Curium", "Berkelium", "Californium", "Einsteinium", "Fermium",
    "Mendelevium", "Nobelium", "Lawrencium", "Rutherfordium", "Dubnium", "Seaborgium", "Bohrium", "Hassium", "Meitnerium", "Darmstadtium",
    "Roentgenium", "Copernicium", "Nihonium", "Flerovium", "Moscovium", "Livermorium", "Tennessine", "Oganesson"
];

function initLoad() {
    let gameScreen = document.querySelector("#game-screen");
    let playAgain = document.querySelector("#play-again");

    document.querySelector("#play").onclick = () => {
        let gameTitle = document.querySelector(".game-title");
        gameTitle.style.top = "calc(50% - min(1vh,1.5vw))";
        playAgain.onclick = () => { initGame("READY FOR THE TEST?"); newRound(0, 0) }

        initGame("READY FOR THE TEST?");
        fadeInElem(gameScreen, "block", () => {
            setTimeout(() => {
                gameTitle.style.animation = "moveDown ease-in-out 0.2s";
                gameTitle.onanimationend = () => {
                    gameTitle.style.animation = "none";
                    gameTitle.onanimationend = null;

                    gameTitle.style.top = "calc(100% - min(40vh,60vw))";
                    fadeInElem(document.querySelector("#button-holder-1"), "block", null);
                    newRound(0, 0);
                }
            }, 1000);
        });
    }

    document.querySelector("#practice").onclick = () => {
        let gameTitle = document.querySelector(".game-title");
        gameTitle.style.top = "calc(50% - min(1vh,1.5vw))";
        playAgain.onclick = () => {
            let imgHolder = document.querySelector(".img-holder");
            fadeOutElem(imgHolder.lastChild, () => { imgHolder.lastChild.remove() });
            fadeOutElem(document.querySelector("#button-holder-2"), null);
            fadeOutElem(document.querySelector("#button-holder-1"), () => {
                initGame("REPEAT CORRECTLY!");
                gameTitle.style.animation = "moveUp ease-in-out 0.2s";
                gameTitle.onanimationend = () => {
                    gameTitle.style.top = "calc(50% - min(1vh,1.5vw))";
                    gameTitle.style.animation = "none";
                    gameTitle.onanimationend = null;
                    setTimeout(() => {
                        gameTitle.style.animation = "moveDown ease-in-out 0.2s";
                        gameTitle.onanimationend = () => {
                            gameTitle.style.animation = "none";
                            gameTitle.onanimationend = null;

                            gameTitle.style.top = "calc(100% - min(40vh,60vw))";
                            practiceAnimation(0);
                            newRound(0, 1, 0);
                        }
                    }, 1000);
                }
            });
        }

        initGame("REPEAT CORRECTLY!");
        fadeInElem(gameScreen, "block", () => {
            setTimeout(() => {
                gameTitle.style.animation = "moveDown ease-in-out 0.2s";
                gameTitle.onanimationend = () => {
                    gameTitle.style.animation = "none";
                    gameTitle.onanimationend = null;

                    gameTitle.style.top = "calc(100% - min(40vh,60vw))";
                    practiceAnimation(0);
                    newRound(0, 1, 0);
                }
            }, 1000);
        });
    }

    document.querySelector("#time-attack").onclick = () => {
        let gameTitle = document.querySelector(".game-title");
        gameTitle.style.top = "calc(50% - min(1vh,1.5vw))";
        playAgain.onclick = () => {
            initGame("TIME ATTACK MODE!");

            newRound(0, 2);
            window.timerId = null;
            window.lastClickTime = 0;
            window.startTime = 0;
            document.getElementById("timer-display").style.display = "none";
        };

        initGame(`<div class="centered-title">TIME ATTACK MODE`);
        fadeInElem(gameScreen, "block", () => {
            setTimeout(() => {
                gameTitle.style.animation = "moveDown ease-in-out 0.2s";
                gameTitle.onanimationend = () => {
                    gameTitle.style.animation = "none";
                    gameTitle.onanimationend = null;

                    gameTitle.style.top = "calc(100% - min(40vh,60vw))";
                    fadeInElem(document.querySelector("#button-holder-1"), "block", null);
                    newRound(0, 2);
                }
            }, 1000);
        });
    };

    document.querySelector("#back-to-menu").onclick = () => {
        document.querySelector(".game-title").style.top = "calc(50% - min(1vh,1.5vw))";
        fadeOutElem(document.querySelector("#button-holder-1"), null);
        fadeOutElem(gameScreen, null);
    }

    // Initialize search functionality (UPDATED)
    document.getElementById('element-search').addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        const elementsGrid = document.querySelector(".elements-grid");

        // Clear the grid
        elementsGrid.innerHTML = "";

        // If the search term is empty, re-populate with all elements
        if (searchTerm === "") {
            populateElementsGrid();
            return;
        }

        // Filter and re-insert matching elements
        allElements.forEach((element, index) => {
            const elementName = element.toLowerCase();
            const elementIndex = index + 1;

            if (
                elementName.includes(searchTerm) || // Match by name
                elementIndex.toString().startsWith(searchTerm) // Match by atomic number
            ) {
                const elementItem = document.createElement("div");
                elementItem.className = "element-item";
                elementItem.innerHTML = `<img src="./images/${index + 1}.png" alt="${element}">`;

                elementItem.onclick = () => {
                    const fullScreenElement = document.createElement("div");
                    fullScreenElement.className = "full-screen-element";
                    fullScreenElement.innerHTML = `<img src="./images/${index + 1}.png" alt="${element}">`;
                    fullScreenElement.onclick = () => {
                        document.body.removeChild(fullScreenElement);
                    };
                    document.body.appendChild(fullScreenElement);
                };

                elementsGrid.appendChild(elementItem);
            }
        });
    });
}

function fadeInElem(elem, display, callback) {
    elem.style.animation = "fadeIn ease-in-out 0.2s";
    elem.style.display = display;
    elem.onanimationend = () => {
        elem.style.animation = "none";
        elem.onanimationend = null;
        if (callback) callback();
    }
}

function fadeOutElem(elem, callback) {
    elem.style.animation = "fadeOut ease-in-out 0.2s";
    elem.onanimationend = () => {
        elem.style.animation = "none";
        elem.style.display = "none";
        elem.onanimationend = null;
        if (callback) callback();
    }
}

/*--Game Logic-------------------------------------------------------------------------------------------------------------------------------------*/
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function initGame(text) {
    document.querySelector(".game-title").innerHTML = text;
    document.querySelector("#button-holder-2").style.display = "none";
    let imgHolder = document.querySelector(".img-holder");
    while (imgHolder.children.length > 0) imgHolder.removeChild(imgHolder.lastChild);
}

function newRound(currElem, gamemode, endElem) {
    let choices = [];
    let rightChoice = random(0, 3);
    while (choices.length < 4) {
        if (choices.length === rightChoice) choices.push(currElem);
        else {
            let valid = true;
            let currChoice = random(0, allElements.length - 1);
            if (currChoice === currElem) valid = false;
            for (let i = 0; i < choices.length; i++) {
                if (choices[i] === currChoice) {
                    valid = false;
                    break;
                }
            }
            if (valid) choices.push(currChoice);
        }
    }
    let smallButtons = document.querySelectorAll(".small-button");
    for (let i = 0; i < smallButtons.length; i++) {
        smallButtons[i].innerHTML = allElements[choices[i]];
        if (gamemode === 0) smallButtons[i].onclick = () => { playChoiceMade(choices[i], currElem) }
        else if (gamemode === 1) smallButtons[i].onclick = () => { practiceChoiceMade(choices[i], currElem, endElem) }
        else if (gamemode === 2) smallButtons[i].onclick = () => { timeAttackChoiceMade(choices[i], currElem) }
    }
}

function playChoiceMade(curr, right) {
    let imgHolderContainer = document.querySelector(".img-holder-container");
    let imgHolder = document.querySelector(".img-holder");
    let gameTitle = document.querySelector(".game-title");

    if (curr === right) {
        gameTitle.innerHTML = "Correct!";
        let newImg = document.createElement("div");
        newImg.className = "img";
        newImg.style.backgroundImage = "url('./images/" + (curr + 1) + ".png')";

        if (curr === 0) {
            newImg.style.width = "100%";
            imgHolder.appendChild(newImg);
        }
        else if (curr === 1) {
            imgHolder.children[0].style.animation = "shrink ease-in-out 0.2s";
            imgHolder.children[0].onanimationend = () => {
                imgHolder.children[0].style.animation = "none";
                imgHolder.children[0].onanimationend = null;
                imgHolder.children[0].style.width = "30%";
                imgHolder.style.bottom = imgHolderContainer.offsetHeight - imgHolder.offsetHeight + "px";
                imgHolder.appendChild(newImg);
            }
            let elapsedTime = 0;
            let tempInterval = setInterval(() => {
                imgHolder.style.bottom = imgHolderContainer.offsetHeight - imgHolder.offsetHeight + "px";
                if (elapsedTime >= 200) clearInterval(tempInterval);
                elapsedTime += 16;
            }, 16);
        }
        else imgHolder.appendChild(newImg);

        curr++;
        if (curr < 118) newRound(curr, 0);
        else {
            gameTitle.innerHTML = "You Win!";
            fadeInElem(document.querySelector("#button-holder-2"), "block", null);
        }
        if (curr >= 9) imgHolder.style.bottom = "0px";
        else imgHolder.style.bottom = imgHolderContainer.offsetHeight - imgHolder.offsetHeight + "px";
    }
    else {
        fadeInElem(document.querySelector("#button-holder-2"), "block", null);
        gameTitle.innerHTML = "It's " + allElements[right] + "!";
        while (imgHolder.children.length > 0) imgHolder.removeChild(imgHolder.lastChild);
        let newImg = document.createElement("div");
        newImg.style.width = "100%";
        newImg.className = "img";
        newImg.style.backgroundImage = "url('./images/" + (right + 1) + ".png')";
        imgHolder.style.bottom = "0px";
        imgHolder.appendChild(newImg);
    }
}

function practiceChoiceMade(curr, right, end) {
    let imgHolderContainer = document.querySelector(".img-holder-container");
    let imgHolder = document.querySelector(".img-holder");
    let gameTitle = document.querySelector(".game-title");

    if (curr === right) {
        gameTitle.innerHTML = "Correct!";
        let newImg = document.createElement("div");
        newImg.className = "img";
        newImg.style.backgroundImage = "url('./images/" + (curr + 1) + ".png')";

        if (curr === 0) {
            newImg.style.width = "100%";
            imgHolder.appendChild(newImg);
        }
        else if (curr === 1) {
            imgHolder.children[0].style.animation = "shrink ease-in-out 0.2s";
            imgHolder.children[0].onanimationend = () => {
                imgHolder.children[0].style.animation = "none";
                imgHolder.children[0].onanimationend = null;
                imgHolder.children[0].style.width = "30%";
                imgHolder.style.bottom = imgHolderContainer.offsetHeight - imgHolder.offsetHeight + "px";
                imgHolder.appendChild(newImg);
            }
            let elapsedTime = 0;
            let tempInterval = setInterval(() => {
                imgHolder.style.bottom = imgHolderContainer.offsetHeight - imgHolder.offsetHeight + "px";
                if (elapsedTime >= 200) clearInterval(tempInterval);
                elapsedTime += 16;
            }, 16);
        }
        else imgHolder.appendChild(newImg);
        if (curr >= 9) imgHolder.style.bottom = "0px";
        else imgHolder.style.bottom = imgHolderContainer.offsetHeight - imgHolder.offsetHeight + "px";

        curr++;
        if (curr < 118) {
            if (curr <= end) newRound(curr, 1, end);
            else {
                setTimeout(() => {
                    while (imgHolder.children.length > 0) imgHolder.removeChild(imgHolder.lastChild);
                    imgHolder.style.bottom = "0px";
                    fadeOutElem(document.querySelector("#button-holder-1"), () => {
                        initGame("");
                        gameTitle.style.top = "calc(50% - min(1vh,1.5vw))";
                        gameTitle.style.animation = "none";
                        gameTitle.onanimationend = null;
                        setTimeout(() => {
                            gameTitle.style.top = "calc(100% - min(40vh,60vw))";
                            gameTitle.style.animation = "none";
                            gameTitle.onanimationend = null;

                            end++;
                            curr = end - 2;
                            if (curr < 0) curr = 0;
                            practiceAnimation(end);
                            newRound(0, 1, end);
                        }, 500);
                    });
                }, 1000);
            }
        }
        else {
            gameTitle.innerHTML = "You Win!";
            fadeInElem(document.querySelector("#button-holder-2"), "block", null);
        }
    }
    else {
        fadeInElem(document.querySelector("#button-holder-2"), "block", null);
        gameTitle.innerHTML = "It's " + allElements[right] + "!";
        while (imgHolder.children.length > 0) imgHolder.removeChild(imgHolder.lastChild);
        let newImg = document.createElement("div");
        newImg.style.width = "100%";
        newImg.className = "img";
        newImg.style.backgroundImage = "url('./images/" + (right + 1) + ".png')";
        imgHolder.style.bottom = "0px";
        imgHolder.appendChild(newImg);
    }
}

function timeAttackChoiceMade(curr, right) {
    let imgHolderContainer = document.querySelector(".img-holder-container");
    let imgHolder = document.querySelector(".img-holder");
    let gameTitle = document.querySelector(".game-title");

    if (curr === right) {
        if (right === 0) {
            window.startTime = Date.now();
            window.lastClickTime = window.startTime;
            document.getElementById("timer-display").style.display = "block";
            updateTimer();
        } else {
            const currentTime = Date.now();
            if (currentTime - window.lastClickTime > 1000) {
                gameOverTimeAttack(right);
                return;
            }
            clearTimeout(window.timerId);
        }

        gameTitle.innerHTML = "Correct!";
        let newImg = document.createElement("div");
        newImg.className = "img";
        newImg.style.backgroundImage = "url('./images/" + (curr + 1) + ".png')";

        if (curr === 0) {
            newImg.style.width = "100%";
            imgHolder.appendChild(newImg);
        }
        else if (curr === 1) {
            imgHolder.children[0].style.animation = "shrink ease-in-out 0.2s";
            imgHolder.children[0].onanimationend = () => {
                imgHolder.children[0].style.animation = "none";
                imgHolder.children[0].onanimationend = null;
                imgHolder.children[0].style.width = "30%";
                imgHolder.style.bottom = imgHolderContainer.offsetHeight - imgHolder.offsetHeight + "px";
                imgHolder.appendChild(newImg);
            }
            let elapsedTime = 0;
            let tempInterval = setInterval(() => {
                imgHolder.style.bottom = imgHolderContainer.offsetHeight - imgHolder.offsetHeight + "px";
                if (elapsedTime >= 200) clearInterval(tempInterval);
                elapsedTime += 16;
            }, 16);
        }
        else {
            imgHolder.appendChild(newImg);
            if (curr >= 9) {
                imgHolder.style.bottom = "0px";
            } else {
                imgHolder.style.bottom = imgHolderContainer.offsetHeight - imgHolder.offsetHeight + "px";
            }
        }

        curr++;
        if (curr < 118) {
            window.timerId = setTimeout(() => { gameOverTimeAttack(curr); }, 1000);
            window.lastClickTime = Date.now();
            newRound(curr, 2);
        } else {
            clearTimeout(window.timerId);
            document.getElementById("timer-display").style.display = "none";
            gameTitle.innerHTML = "Congratulations! You are a master!";
            fadeInElem(document.querySelector("#button-holder-2"), "block", null);
        }
    } else {
        gameOverTimeAttack(right);
    }
}

function updateTimer() {
    const timerElement = document.getElementById("timer-display");
    const elapsed = Date.now() - window.lastClickTime;
    const remaining = 1000 - elapsed;
    timerElement.textContent = `${(remaining / 1000).toFixed(2)}`;

    if (remaining > 0) {
        requestAnimationFrame(updateTimer);
    }
}

function gameOverTimeAttack(correctElement) {
    clearTimeout(window.timerId);
    document.getElementById("timer-display").style.display = "none";
    fadeInElem(document.querySelector("#button-holder-2"), "block", null);
    document.querySelector(".game-title").innerHTML = "Time's Up!";
    let imgHolder = document.querySelector(".img-holder");
    while (imgHolder.children.length > 0) imgHolder.removeChild(imgHolder.lastChild);
    let newImg = document.createElement("div");
    newImg.style.width = "100%";
    newImg.className = "img";
    newImg.style.backgroundImage = "url('./images/" + (correctElement + 1) + ".png')";
    imgHolder.style.bottom = "0px";
    imgHolder.appendChild(newImg);
}

function practiceAnimation(currElem) {
    if (window.practiceTimeouts) {
        window.practiceTimeouts.forEach(clearTimeout);
        window.practiceTimeouts = [];
    }

    window.currentPracticePhase = currElem;
    document.getElementById("skip-preview").style.display = "block";

    let imgHolder = document.querySelector(".img-holder");
    window.practiceTimeouts = [];

    for (let i = 0; i <= currElem; i++) {
        let letter = document.createElement("div");
        letter.innerHTML = allElements[i];
        letter.className = "letter";
        let time = (1000 - (currElem - i) * 100);
        if (time < 100) time = 100;
        const timeoutId = setTimeout(() => {
            while (imgHolder.children.length > 0) imgHolder.removeChild(imgHolder.lastChild);
            imgHolder.appendChild(letter);
            if (i === currElem) {
                setTimeout(() => {
                    if (imgHolder.children.length > 0) fadeOutElem(imgHolder.lastChild, () => { imgHolder.lastChild.remove() });
                    fadeInElem(document.querySelector("#button-holder-1"), "block", null);
                    document.querySelector(".game-title").innerHTML = "REPEAT CORRECTLY!";
                    document.getElementById("skip-preview").style.display = "none";
                }, 1000);
            }
        }, i * time);
        window.practiceTimeouts.push(timeoutId);
    }
}

document.getElementById("skip-preview").onclick = function () {
    window.practiceTimeouts.forEach(clearTimeout);
    window.practiceTimeouts = [];

    let imgHolder = document.querySelector(".img-holder");
    while (imgHolder.children.length > 0) imgHolder.removeChild(imgHolder.lastChild);

    let letter = document.createElement("div");
    letter.innerHTML = allElements[window.currentPracticePhase];
    letter.className = "letter";
    imgHolder.appendChild(letter);

    setTimeout(() => {
        if (imgHolder.children.length > 0) fadeOutElem(imgHolder.lastChild, () => { imgHolder.lastChild.remove() });
        fadeInElem(document.querySelector("#button-holder-1"), "block", null);
        document.querySelector(".game-title").innerHTML = "REPEAT CORRECTLY!";
        document.getElementById("skip-preview").style.display = "none";
    }, 1000);
};

document.querySelector("#nft").onclick = () => {
    window.open("https://getgems.io/creaturestable", "_blank");
};

document.querySelector("#elements").onclick = () => {
    document.querySelector("#main-screen").style.display = "none";
    document.querySelector("#elements-screen").style.display = "block";
    populateElementsGrid();
};

document.querySelector("#back-to-main").onclick = () => {
    document.querySelector("#elements-screen").style.display = "none";
    document.querySelector("#main-screen").style.display = "block";
};

function populateElementsGrid() {
    const elementsGrid = document.querySelector(".elements-grid");
    elementsGrid.innerHTML = "";

    allElements.forEach((element, index) => {
        const elementItem = document.createElement("div");
        elementItem.className = "element-item";
        elementItem.innerHTML = `<img src="./images/${index + 1}.png" alt="${element}">`;

        elementItem.onclick = () => {
            const fullScreenElement = document.createElement("div");
            fullScreenElement.className = "full-screen-element";
            fullScreenElement.innerHTML = `<img src="./images/${index + 1}.png" alt="${element}">`;
            fullScreenElement.onclick = () => {
                document.body.removeChild(fullScreenElement);
            };
            document.body.appendChild(fullScreenElement);
        };

        elementsGrid.appendChild(elementItem);
    });
}