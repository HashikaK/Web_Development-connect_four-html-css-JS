const container = document.querySelector(".container");
const playerTurn = document.getElementById("playerTurn");
const startScreen = document.querySelector(".startScreen");
const startButton = document.getElementById("start");
const message = document.getElementById("message");
let initialMatrix = Array.from({ length: 6 }, () => Array(7).fill(0)); // 6 rows, 7 columns
let currentPlayer = 1; // Always start with player 1

const generateRandomNumber = (min, max) =>
    Math.floor(Math.random() * (max - min)) + min;

const verifyArray = (arrayElement) => {
    let count = 0;
    return arrayElement.some((element) => {
        if (element === currentPlayer) {
            count += 1;
            return count === 4;
        }
        count = 0; // Reset count if sequence is broken
        return false;
    });
};

const gameOverCheck = () => {
    if (initialMatrix.flat().every(val => val !== 0)) {
        message.innerText = "Game Over - It's a Tie!";
        startScreen.classList.remove("hide");
    }
};

const checkAdjacentRowValues = (row) => verifyArray(initialMatrix[row]);

const checkAdjacentColumnValues = (column) => {
    let colWinCount = 0;
    return initialMatrix.some((element) => {
        if (element[column] === currentPlayer) {
            colWinCount += 1;
            return colWinCount === 4;
        }
        colWinCount = 0; // Reset if sequence is broken
        return false;
    });
};

// Add diagonal check logic here...

const winCheck = (row, column) => {
    return checkAdjacentRowValues(row) ||
           checkAdjacentColumnValues(column);
};

const setPiece = (startCount, colValue) => {
    if (initialMatrix[startCount][colValue] !== 0) {
        if (startCount > 0) {
            setPiece(startCount - 1, colValue);
        } else {
            return; // Prevent infinite recursion
        }
    } else {
        let currentRow = document.querySelectorAll(".grid-row")[startCount];
        let currentBox = currentRow.querySelectorAll(".grid-box")[colValue];
        currentBox.classList.add("filled", `player${currentPlayer}`);
        initialMatrix[startCount][colValue] = currentPlayer; // Update matrix

        if (winCheck(startCount, colValue)) {
            message.innerHTML = `Player <span>${currentPlayer}</span> wins! 🎉`;
            startScreen.classList.remove("hide");
            return;
        }
    }
    gameOverCheck();
};

const fillBox = (e) => {
    let colValue = parseInt(e.target.getAttribute("data-value"));
    setPiece(5, colValue); // Start from the bottom
    currentPlayer = currentPlayer === 1 ? 2 : 1; // Switch players
    playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;
};

const matrixCreator = () => {
    container.innerHTML = ""; // Clear container
    initialMatrix.forEach((_, rowIndex) => {
        let outerDiv = document.createElement("div");
        outerDiv.classList.add("grid-row");
        for (let j = 0; j < 7; j++) { // 7 columns
            let innerDiv = document.createElement("div");
            innerDiv.classList.add("grid-box");
            innerDiv.setAttribute("data-value", j);
            innerDiv.addEventListener("click", fillBox);
            outerDiv.appendChild(innerDiv);
        }
        container.appendChild(outerDiv);
    });
};

const startGame = async () => {
    currentPlayer = 1; // Always start with player 1
    await matrixCreator();
    playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;
};

startButton.addEventListener("click", () => {
    startScreen.classList.add("hide");
    startGame();
});
