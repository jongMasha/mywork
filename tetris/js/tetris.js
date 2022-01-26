import BLOCKS from "./blocks.js"

//DOM
const playground = document.querySelector('.playground >ul');
const gametext = document.querySelector('.game-text');
const scoredisplay = document.querySelector('.score');
const restartButton = document.querySelector('.game-text > button');

// setting
const GAME_ROWS =20;
const GAME_COLS = 10;
//const DROP_TIME=5;

//variables
let score = 0;
let duration = 300;
let downInterval;
let tempMovingItem;


const movingItem = {
    type: "",
    direction: 2,
    top: 0,
    left: 0,
}

init();

//functions
function init() {
    tempMovingItem = { ...movingItem };
    for (let i = 0; i < GAME_ROWS; i++) {
        prependNewLine()
    }
    generateNewBlock()
}
function prependNewLine() {
    const li = document.createElement('li');
    const ul = document.createElement('ul');
    for (let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement('li');
        ul.prepend(matrix);
    }
    console.log(ul);
    li.prepend(ul)
    console.log(li);
    playground.prepend(li)
}
function renderBlocks(moveType = "") {
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving")
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })
    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvaliable = checkEmpty(target);
        if (isAvaliable) {
            target.classList.add(type, "moving")
        } else {
            tempMovingItem = { ...movingItem }
            if (moveType === 'retry') {
                clearInterval(downInterval)
                console.log(moveType);
                showGameovertext()
            }
            setTimeout(() => {
                renderBlocks('retry')
                if (moveType === "top") {
                    seizeBlock();
                }
            }, 0)
            // renderBlocks();
            return true;
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}
function seizeBlock() {
    const movingBlocks = document.querySelectorAll(".moving")
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch()
}
function checkMatch() {
    const childNodes = playground.childNodes;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            if (!li.classList.contains("seized")) {
                matched = false;
            }
        })
        if (matched) {
            child.remove();
            prependNewLine()
            score++;
            scoredisplay.innerText = score;
        }
    })
    generateNewBlock()
}
function generateNewBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top', 1)
    }, duration)
    const blockArray = Object.entries(BLOCKS)
    const randomIndex = Math.floor(Math.random() * blockArray.length)
    movingItem.type = blockArray[randomIndex][0]
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = { ...movingItem };
    renderBlocks()
}
function checkEmpty(target) {
    if (!target || target.classList.contains("seized")) {
        return false;
    }
    return true;
}
function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType)
}
function changeDirection() {
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks()
}
function dropBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top', 1)
    }, 7)
}
function showGameovertext() {
    gametext.style.display = "flex"
}
//event handling
document.addEventListener("keydown", e => {
    console.log(e)
    switch (e.keyCode) {
        case 39:
            //rightMoveBlock();
            moveBlock("left", 1);
            break;
        case 37:
            //leftMoveBlock();
            moveBlock("left", -1);
            break;
        // case 38:
        //     moveBlock("top", 1);
        //     break;
        case 40:
            changeDirection();
            break;
        case 17:
            dropBlock();
            break;
        default:
            break;
    }
})
restartButton.addEventListener("click", () => {
    playground.innerHTML = "";
    gametext.style.display = "none"
    init()
})