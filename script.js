// Globální proměnné
const mainMenu = document.getElementById('mainMenu');
const leaderboardButton = document.getElementById('leaderboardButton');
const gameArea = document.getElementById('gameArea');
const menuButton = document.getElementById('menuButton');
const gameContainer = document.getElementById('gameContainer');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const gameOver = document.getElementById('gameOver');
const finalScore = document.getElementById('finalScore');
const leaderboard = document.getElementById('leaderboard');
const leaderboardList = document.getElementById('leaderboardList');
const playerNameInput = document.getElementById('playerName');

let score = 0;
let timeLeft = 60;
let timerInterval;
let gameActive = false;
let difficulty = "easy";

// Funkce pro zobrazení výběru obtížnosti
function showDifficultyMenu() {
    mainMenu.classList.add('hidden');
    document.getElementById('difficultyMenu').classList.remove('hidden');
}

// Funkce pro návrat do hlavního menu
function returnToMainMenu() {
    document.querySelectorAll('.menu').forEach(menu => menu.classList.add('hidden'));
    mainMenu.classList.remove('hidden');
}

// Funkce pro spuštění hry
function startGame(selectedDifficulty) {
    difficulty = selectedDifficulty;
    document.querySelectorAll('.menu').forEach(menu => menu.classList.add('hidden'));
    gameArea.classList.remove('hidden');
    resetGame();
    startTimer();
    spawnPositiveTargets(difficulty === "easy" ? 8 : difficulty === "medium" ? 5 : 3);
    spawnNegativeTargets();
}

// Funkce pro reset hry
function resetGame() {
    score = 0;
    timeLeft = 60;
    scoreElement.textContent = `⭐ Skóre: ${score}`;
    timerElement.textContent = `⏳ Čas: ${timeLeft}`;
    gameContainer.innerHTML = '';
    gameActive = true;
}

// Funkce pro spuštění časovače
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `⏳ Čas: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

// Funkce pro ukončení hry
function endGame() {
    gameActive = false;
    gameArea.classList.add('hidden');
    gameOver.classList.remove('hidden');
    finalScore.textContent = score;
}

// Funkce pro vytváření pozitivních cílů
function spawnPositiveTargets(count) {
    for (let i = 0; i < count; i++) {
        createPositiveTarget();
    }
}

function createPositiveTarget() {
    const target = document.createElement('div');
    target.classList.add('target', Math.random() < 0.5 ? 'big' : 'small');
    target.textContent = target.classList.contains('big') ? '😊' : '😁';

    setRandomPosition(target);

    target.addEventListener('click', () => {
        score += target.classList.contains('big') ? 1 : 2;
        scoreElement.textContent = `⭐ Skóre: ${score}`;
        gameContainer.removeChild(target);
        createPositiveTarget();
    });

    gameContainer.appendChild(target);

    // Cíl zmizí po 2,5 sekundách, pokud není kliknut
    setTimeout(() => {
        if (gameContainer.contains(target)) {
            gameContainer.removeChild(target);
        }
    }, 2500);
}

// Funkce pro vytváření negativních cílů
function spawnNegativeTargets() {
    setInterval(() => {
        if (!gameActive) return;

        const target = document.createElement('div');
        target.classList.add('target', 'negative');
        target.textContent = '😡';

        setRandomPosition(target);

        target.addEventListener('click', () => {
            score -= 5;
            scoreElement.textContent = `⭐ Skóre: ${score}`;
            gameContainer.removeChild(target);
        });

        gameContainer.appendChild(target);

        // Negativní cíl se pohybuje a mizí po 2,5 sekundách
        target.style.animation = 'move 2s infinite alternate';
        setTimeout(() => {
            if (gameContainer.contains(target)) {
                gameContainer.removeChild(target);
            }
        }, 2500);
    }, difficulty === "easy" ? 3000 : difficulty === "medium" ? 2000 : 1000);
}

// Funkce pro náhodné umístění cíle
function setRandomPosition(target) {
    const size = target.classList.contains('big') ? 60 : target.classList.contains('small') ? 40 : 50;
    const x = Math.random() * (gameContainer.offsetWidth - size);
    const y = Math.random() * (gameContainer.offsetHeight - size);

    target.style.left = `${x}px`;
    target.style.top = `${y}px`;
}

// Funkce pro leaderboard
function saveScore(name, score, difficulty) {
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboardData.push({ name, score, difficulty });
    leaderboardData.sort((a, b) => b.score - a.score);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboardData.slice(0, 10)));
    updateLeaderboard();
}

function updateLeaderboard() {
    leaderboardList.innerHTML = '';
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboardData.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.name} (${entry.difficulty}): ${entry.score}`;
        leaderboardList.appendChild(li);
    });
}

// Event Listeners
document.getElementById('submitScoreButton').addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        saveScore(playerName, score, difficulty);
        playerNameInput.value = '';
        returnToMainMenu();
    } else {
        alert('Prosím, zadejte své jméno.');
    }
});

menuButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    gameActive = false;
    returnToMainMenu();
});

leaderboardButton.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    leaderboard.classList.remove('hidden');
    updateLeaderboard();
});
