let gameTime = 60;
let timeGone = 0;
let timeLeft = gameTime;
let firstCard = null;
let secondCard = null;
let firstCardElement = null;
let secondCardElement = null;
let isProcessing = false; // Prevent rapid clicking
let matchedContents = new Set(); // Track matched cards by content

// Load and display best score from localStorage
let bestScore = localStorage.getItem("bestScore");
if (bestScore) {
    document.getElementById("best-score").textContent = `Best Score: ${bestScore}s`;
} else {
    document.getElementById("best-score").textContent = `Best Score: 0s`;
}

// Timer
let timer = setInterval(function() {
    timeGone++;
    timeLeft = gameTime - timeGone;
    let timerElement = document.getElementById('timer');
    timerElement.textContent = `Time Left: ${timeLeft}s`;
    
    if (timeLeft <= gameTime * 0.25) {
        timerElement.style.color = "#ff0000";
    } else if (timeLeft <= gameTime * 0.5) {
        timerElement.style.color = "#ffff00";
    } else if (timeLeft <= gameTime * 0.75) {
        timerElement.style.color = "#ff5c00";
    }
    
    if (timeLeft <= 0) {
        clearInterval(timer);
        alert('Time is up! You lost!');
        location.reload();
    }
}, 1000);

// Cards data
let cardImages = [
    "1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png",
    "1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png",
    "shuffle.jpg", "bomb.svg"
];

let cardData = cardImages.map((content, index) => ({
    id: index,
    content: content
}));


function toggleCards() {
    let cards = document.querySelectorAll('.card-inner');
    
    cards.forEach((card, index) => {
       card.classList.toggle('flipped');
    });
}


let cards = document.querySelectorAll('.card');

// Shuffle function
function shuffleImages(array) {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    
    let cardsFront = document.querySelectorAll('.card-front');
    cardsFront.forEach((card, index) => {
        card.innerHTML = `<img src="images/${array[index].content}" alt="Card Front">`;
        card.dataset.cardId = array[index].id;
        card.dataset.cardContent = array[index].content;
    });
    
    // Reapply matched state
    cards.forEach(card => {
        let inner = card.querySelector('.card-inner');
        let content = inner.querySelector('.card-front').dataset.cardContent;
        
        if (matchedContents.has(content)) {
            inner.classList.remove('flipped'); // Keep open
            card.style.pointerEvents = 'none'; // Disable clicks
        } else {
            inner.classList.add('flipped'); // Keep closed
            card.style.pointerEvents = 'auto'; // Enable clicks
        }
    });
}

shuffleImages(cardData);
// Show the cards for the first time
toggleCards();
// Hide the cards after 0.8 second
let timerForFirstFlip = setTimeout(toggleCards, 800);
// Function to check if the player has won
function checkWin() {
    // Total normal pairs = 7, so matchedContents size should be 7
    if (matchedContents.size === 7) {
        clearInterval(timer); // Stop timer
        let timeTaken = timeGone; // How long the player took
        alert(`🎉 You Won! Time: ${timeTaken}s`);
        
        let storedBest = localStorage.getItem("bestScore");
        if (!storedBest || timeTaken < parseInt(storedBest)) {
            localStorage.setItem("bestScore", timeTaken);
            document.getElementById("best-score").textContent = `Best Score: ${timeTaken}s`;
            alert("🏆 New Best Score!");
        }
        
        // Optionally restart game
        setTimeout(() => location.reload(), 1500);
    }
}

// Card click handler
cards.forEach(card => {
    card.addEventListener('click', () => {
        if (isProcessing) return; // Prevent spam clicks
        
        let inner = card.querySelector('.card-inner');
        let content = inner.querySelector('.card-front').dataset.cardContent;
        
        // Ignore already open or matched
        if (matchedContents.has(content)) return;
        if (!inner.classList.contains('flipped')) return;
        
        // Flip card
        inner.classList.toggle('flipped');
        
        // Bomb card
        if (content === "bomb.svg") {
            setTimeout(() => {
                alert('💣 BoOoOoOoM! You lost the game!');
                location.reload();
            }, 400);
            return;
        }
        
        // Shuffle card
        if (content === "shuffle.jpg") {
            setTimeout(() => {
                shuffleImages(cardData);
                alert('🔀 You fell into a shuffle trap! Cards are shuffled!');
                firstCard = null;
                secondCard = null;
                firstCardElement = null;
                secondCardElement = null;
                isProcessing = false;
            }, 300);
            return;
        }
        
        // First card choice
        if (firstCard === null) {
            firstCard = content;
            firstCardElement = card;
        }
        // Second card choice
        else if (secondCard === null && card !== firstCardElement) {
            secondCard = content;
            secondCardElement = card;
            isProcessing = true;
            
            setTimeout(() => {
                if (firstCard === secondCard) {
                    matchedContents.add(firstCard);
                    firstCardElement.style.pointerEvents = 'none';
                    secondCardElement.style.pointerEvents = 'none';
                    
                    checkWin(); // <-- Check win after each match
                } else {
                    firstCardElement.querySelector('.card-inner').classList.add('flipped');
                    secondCardElement.querySelector('.card-inner').classList.add('flipped');
                }
                
                // Reset for next turn
                firstCard = null;
                secondCard = null;
                firstCardElement = null;
                secondCardElement = null;
                isProcessing = false;
            }, 1000);
        }
    });
});
// Card click handler
cards.forEach(card => {
    card.addEventListener('click', () => {
        if (isProcessing) return; // Prevent spam clicks

        let inner = card.querySelector('.card-inner');
        let content = inner.querySelector('.card-front').dataset.cardContent;

        // Ignore already open or matched
        if (matchedContents.has(content)) return;
        if (!inner.classList.contains('flipped')) return;

        // Flip card
        inner.classList.toggle('flipped');

        // Bomb card
        if (content === "bomb.svg") {
            setTimeout(() => {
                alert('💣 BoOoOoOoM! You lost the game!');
                location.reload();
            }, 400);
            return;
        }

        // Shuffle card
        if (content === "shuffle.jpg") {
            setTimeout(() => {
                shuffleImages(cardData);
                alert('🔀 You fell into a shuffle trap! Cards are shuffled!');
                firstCard = null;
                secondCard = null;
                firstCardElement = null;
                secondCardElement = null;
                isProcessing = false;
            }, 300);
            return;
        }

        // First card choice
        if (firstCard === null) {
            firstCard = content;
            firstCardElement = card;
        }
        // Second card choice
        else if (secondCard === null && card !== firstCardElement) {
            secondCard = content;
            secondCardElement = card;
            isProcessing = true;

            setTimeout(() => {
                if (firstCard === secondCard) {
                    matchedContents.add(firstCard);
                    firstCardElement.style.pointerEvents = 'none';
                    secondCardElement.style.pointerEvents = 'none';

                    checkWin(); // <-- Check win after each match
                } else {
                    firstCardElement.querySelector('.card-inner').classList.add('flipped');
                    secondCardElement.querySelector('.card-inner').classList.add('flipped');
                }

                // Reset for next turn
                firstCard = null;
                secondCard = null;
                firstCardElement = null;
                secondCardElement = null;
                isProcessing = false;
            }, 1000);
        }
    });
});
