const CHOICES = ['s', 'w', 'g'];
const IMAGES = {
    's': './assets/snake.png',
    'w': './assets/water.png',
    'g': './assets/gun.png'
};

let gameState = {
    mode: null, // 'pvc' or 'pvp'
    p1Choice: null,
    p2Choice: null,
    scores: { p1: 0, p2: 0 }
};

// DOM Elements
const screens = {
    menu: document.getElementById('menu-screen'),
    game: document.getElementById('game-screen'),
    result: document.getElementById('result-screen')
};

const ui = {
    p1Name: document.getElementById('p1-name'),
    p2Name: document.getElementById('p2-name'),
    scoreP1: document.getElementById('score-p1'),
    scoreP2: document.getElementById('score-p2'),
    instruction: document.getElementById('instruction'),
    resultText: document.getElementById('result-text'),
    resP1Img: document.getElementById('res-p1-img'),
    resP2Img: document.getElementById('res-p2-img'),
    resP1Name: document.getElementById('res-p1-name'),
    resP2Name: document.getElementById('res-p2-name')
};

function showScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function startGame(mode) {
    gameState.mode = mode;
    gameState.scores = { p1: 0, p2: 0 };
    updateScoreboard();

    if (mode === 'pvc') {
        ui.p1Name.textContent = "You";
        ui.p2Name.textContent = "Computer";
        ui.resP1Name.textContent = "You";
        ui.resP2Name.textContent = "Computer";
    } else {
        ui.p1Name.textContent = "Player 1";
        ui.p2Name.textContent = "Player 2";
        ui.resP1Name.textContent = "Player 1";
        ui.resP2Name.textContent = "Player 2";
    }

    resetRound();
    showScreen('game');
}

function showMenu() {
    showScreen('menu');
}

function resetRound() {
    gameState.p1Choice = null;
    gameState.p2Choice = null;

    if (gameState.mode === 'pvc') {
        ui.instruction.textContent = "Choose your weapon!";
        ui.instruction.style.color = "var(--primary)";
    } else {
        ui.instruction.textContent = "Player 1: Choose your weapon!";
        ui.instruction.style.color = "var(--primary)";
    }
}

function makeChoice(choice) {
    if (gameState.mode === 'pvc') {
        gameState.p1Choice = choice;
        gameState.p2Choice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
        calculateResult();
    } else {
        // PvP
        if (!gameState.p1Choice) {
            gameState.p1Choice = choice;
            ui.instruction.textContent = "Player 2: Choose your weapon!";
            ui.instruction.style.color = "var(--secondary)";
            // In a real local PvP, we might want to hide the screen or something, 
            // but for simplicity we just change the text.
        } else {
            gameState.p2Choice = choice;
            calculateResult();
        }
    }
}

function checkWin(p1, p2) {
    if (p1 === p2) return null;

    if (p1 === 's') {
        if (p2 === 'w') return true;
        if (p2 === 'g') return false;
    } else if (p1 === 'w') {
        if (p2 === 'g') return true;
        if (p2 === 's') return false;
    } else if (p1 === 'g') {
        if (p2 === 's') return true;
        if (p2 === 'w') return false;
    }
}

function calculateResult() {
    const result = checkWin(gameState.p1Choice, gameState.p2Choice);

    let resultMsg = "";
    if (result === null) {
        resultMsg = "It's a Tie!";
    } else if (result) {
        gameState.scores.p1++;
        resultMsg = (gameState.mode === 'pvc' ? "You Win!" : "Player 1 Wins!");
    } else {
        gameState.scores.p2++;
        resultMsg = (gameState.mode === 'pvc' ? "Computer Wins!" : "Player 2 Wins!");
    }

    updateScoreboard();
    showResult(resultMsg);
}

function updateScoreboard() {
    ui.scoreP1.textContent = gameState.scores.p1;
    ui.scoreP2.textContent = gameState.scores.p2;
}

function showResult(msg) {
    ui.resultText.textContent = msg;
    ui.resP1Img.src = IMAGES[gameState.p1Choice];
    ui.resP2Img.src = IMAGES[gameState.p2Choice];
    showScreen('result');
}

function playAgain() {
    resetRound();
    showScreen('game');
}
