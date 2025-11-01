// Game State
class NumberGuessingGame {
    constructor() {
        this.min = 1;
        this.max = 100;
        this.currentGuess = null;
        this.guessCount = 0;
        this.startTime = null;
        this.gameTimer = null;
        this.guessHistory = [];
        this.gameActive = false;
        
        // Initialize UI elements
        this.initializeElements();
        this.attachEventListeners();
    }
    
    initializeElements() {
        // Setup elements
        this.setupSection = document.getElementById('setupSection');
        this.gameSection = document.getElementById('gameSection');
        this.winSection = document.getElementById('winSection');
        
        // Input elements
        this.minRangeInput = document.getElementById('minRange');
        this.maxRangeInput = document.getElementById('maxRange');
        this.difficultySelect = document.getElementById('difficulty');
        
        // Buttons
        this.startBtn = document.getElementById('startBtn');
        this.tooLowBtn = document.getElementById('tooLowBtn');
        this.tooHighBtn = document.getElementById('tooHighBtn');
        this.correctBtn = document.getElementById('correctBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.newGameBtn = document.getElementById('newGameBtn');
        
        // Display elements
        this.rangeText = document.getElementById('rangeText');
        this.guessNumber = document.getElementById('guessNumber');
        this.guessCard = document.getElementById('guessCard');
        this.guessCountDisplay = document.getElementById('guessCount');
        this.timeElapsedDisplay = document.getElementById('timeElapsed');
        this.maxGuessesDisplay = document.getElementById('maxGuesses');
        this.historyList = document.getElementById('historyList');
        
        // Win screen elements
        this.finalNumber = document.getElementById('finalNumber');
        this.finalGuesses = document.getElementById('finalGuesses');
        this.finalTime = document.getElementById('finalTime');
        this.efficiencyDisplay = document.getElementById('efficiency');
        
        // Time efficiency elements
        this.timePerGuessDisplay = document.getElementById('timePerGuess');
        this.averageSpeedDisplay = document.getElementById('averageSpeed');
        this.timeEfficiencyRatingDisplay = document.getElementById('timeEfficiencyRating');
        this.timeEfficiencyMessageDisplay = document.getElementById('timeEfficiencyMessage');
    }
    
    attachEventListeners() {
        // Setup button
        this.startBtn.addEventListener('click', () => this.startGame());
        
        // Response buttons
        this.tooLowBtn.addEventListener('click', () => this.handleResponse('low'));
        this.tooHighBtn.addEventListener('click', () => this.handleResponse('high'));
        this.correctBtn.addEventListener('click', () => this.handleResponse('correct'));
        
        // Reset buttons
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.playAgainBtn.addEventListener('click', () => this.playAgain());
        this.newGameBtn.addEventListener('click', () => this.newGame());
        
        // Difficulty change
        this.difficultySelect.addEventListener('change', (e) => this.handleDifficultyChange(e));
        
        // Quick start buttons
        document.querySelectorAll('.quick-start-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.getAttribute('data-difficulty');
                this.handleQuickStart(difficulty);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Enter key on inputs
        this.minRangeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startBtn.click();
        });
        this.maxRangeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startBtn.click();
        });
    }
    
    handleDifficultyChange(e) {
        const difficulty = e.target.value;
        const ranges = {
            easy: [1, 100],
            medium: [1, 1000],
            hard: [1, 10000]
        };
        
        const [min, max] = ranges[difficulty];
        this.minRangeInput.value = min;
        this.maxRangeInput.value = max;
    }
    
    handleQuickStart(difficulty) {
        const ranges = {
            easy: [1, 100],
            medium: [1, 1000],
            hard: [1, 10000]
        };
        
        const [min, max] = ranges[difficulty];
        this.minRangeInput.value = min;
        this.maxRangeInput.value = max;
        this.difficultySelect.value = difficulty;
        this.startGame();
    }
    
    calculateMaxGuesses() {
        const range = this.max - this.min + 1;
        return Math.ceil(Math.log2(range)) + 1;
    }
    
    startGame() {
        // Get range values
        const min = parseInt(this.minRangeInput.value);
        const max = parseInt(this.maxRangeInput.value);
        
        // Validation
        if (isNaN(min) || isNaN(max) || min >= max || min < 0) {
            alert('Please enter valid range values. Minimum must be less than maximum.');
            return;
        }
        
        // Initialize game state
        this.min = min;
        this.max = max;
        this.guessCount = 0;
        this.guessHistory = [];
        this.gameActive = true;
        this.startTime = Date.now();
        
        // Update UI
        this.rangeText.textContent = `${this.min} - ${this.max}`;
        this.maxGuessesDisplay.textContent = this.calculateMaxGuesses();
        
        // Show game section
        this.setupSection.classList.add('hidden');
        this.gameSection.classList.remove('hidden');
        this.winSection.classList.add('hidden');
        
        // Start timer
        this.startTimer();
        
        // Make first guess
        this.makeGuess();
        
        // Announce to screen readers
        this.announce(`Game started. Think of a number between ${this.min} and ${this.max}.`);
    }
    
    makeGuess() {
        if (!this.gameActive) return;
        
        // Binary search algorithm
        const guess = Math.floor((this.min + this.max) / 2);
        this.currentGuess = guess;
        this.guessCount++;
        
        // Update display
        this.guessNumber.textContent = guess;
        this.guessCountDisplay.textContent = this.guessCount;
        
        // Add animation
        this.guessCard.classList.add('new-guess');
        setTimeout(() => {
            this.guessCard.classList.remove('new-guess');
        }, 600);
        
        // Announce to screen readers
        this.announce(`AI guess number ${this.guessCount}: ${guess}`);
        
        // Check if we've exhausted all possibilities
        if (this.min >= this.max && this.guessCount > this.calculateMaxGuesses()) {
            this.endGame(false);
            return;
        }
    }
    
    handleResponse(response) {
        if (!this.gameActive) return;
        
        let feedback = '';
        
        switch(response) {
            case 'low':
                if (this.currentGuess >= this.max) {
                    alert('That cannot be correct! Please check your responses.');
                    return;
                }
                this.min = this.currentGuess + 1;
                feedback = 'Too Low';
                break;
            case 'high':
                if (this.currentGuess <= this.min) {
                    alert('That cannot be correct! Please check your responses.');
                    return;
                }
                this.max = this.currentGuess - 1;
                feedback = 'Too High';
                break;
            case 'correct':
                this.endGame(true);
                return;
        }
        
        // Add to history
        this.addToHistory(this.currentGuess, response);
        
        // Update range display
        this.rangeText.textContent = `${this.min} - ${this.max}`;
        
        // Check if range is invalid
        if (this.min > this.max) {
            this.endGame(false);
            return;
        }
        
        // Make next guess
        setTimeout(() => this.makeGuess(), 500);
    }
    
    addToHistory(guess, feedback) {
        const historyItem = {
            guess: guess,
            feedback: feedback,
            timestamp: Date.now()
        };
        
        this.guessHistory.push(historyItem);
        
        const item = document.createElement('div');
        item.className = 'history-item';
        item.setAttribute('role', 'listitem');
        item.setAttribute('aria-label', `Guess ${this.guessHistory.length}: ${guess}, ${feedback === 'low' ? 'too low' : feedback === 'high' ? 'too high' : 'correct'}`);
        
        const numberSpan = document.createElement('span');
        numberSpan.className = 'history-number';
        numberSpan.textContent = guess;
        
        const feedbackSpan = document.createElement('span');
        feedbackSpan.className = `history-feedback ${feedback}`;
        feedbackSpan.textContent = feedback === 'low' ? '⬆️ Too Low' : feedback === 'high' ? '⬇️ Too High' : '✅ Correct';
        
        item.appendChild(numberSpan);
        item.appendChild(feedbackSpan);
        
        // Add to top of history
        this.historyList.insertBefore(item, this.historyList.firstChild);
    }
    
    startTimer() {
        this.gameTimer = setInterval(() => {
            if (!this.gameActive) {
                clearInterval(this.gameTimer);
                return;
            }
            
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            
            if (minutes > 0) {
                this.timeElapsedDisplay.textContent = `${minutes}m ${seconds}s`;
            } else {
                this.timeElapsedDisplay.textContent = `${seconds}s`;
            }
        }, 1000);
    }
    
    endGame(success) {
        this.gameActive = false;
        clearInterval(this.gameTimer);
        
        if (success) {
            // Calculate time
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
            
            // Update win screen
            this.finalNumber.textContent = this.currentGuess;
            this.finalGuesses.textContent = this.guessCount;
            this.finalTime.textContent = timeString;
            
            // Calculate guess efficiency
            const maxGuesses = this.calculateMaxGuesses();
            const efficiency = ((maxGuesses - this.guessCount) / maxGuesses * 100).toFixed(0);
            
            if (this.guessCount === 1) {
                this.efficiencyDisplay.textContent = '🎯 Perfect! First try! That\'s incredibly efficient!';
            } else if (this.guessCount <= Math.ceil(maxGuesses * 0.5)) {
                this.efficiencyDisplay.textContent = `⚡ Excellent! ${efficiency}% more efficient than worst case!`;
            } else if (this.guessCount <= Math.ceil(maxGuesses * 0.75)) {
                this.efficiencyDisplay.textContent = `👍 Good! ${efficiency}% more efficient than worst case!`;
            } else {
                this.efficiencyDisplay.textContent = `✅ Success! Found in ${this.guessCount} guesses (max: ${maxGuesses})`;
            }
            
            // Calculate and display time efficiency
            this.calculateTimeEfficiency(elapsed, this.guessCount);
            
            // Show win screen
            this.gameSection.classList.add('hidden');
            this.winSection.classList.remove('hidden');
            
            // Add to history
            this.addToHistory(this.currentGuess, 'correct');
            
            // Announce to screen readers
            this.announce(`Game won! AI guessed ${this.currentGuess} in ${this.guessCount} tries in ${timeString}.`);
        } else {
            alert('Something went wrong! Please check your responses and try again.');
            this.resetGame();
        }
    }
    
    calculateTimeEfficiency(totalSeconds, guessCount) {
        // Calculate time per guess
        const timePerGuess = (totalSeconds / guessCount).toFixed(2);
        const timePerGuessSeconds = parseFloat(timePerGuess);
        
        // Format time per guess display
        if (timePerGuessSeconds < 1) {
            this.timePerGuessDisplay.textContent = `< 1s`;
        } else if (timePerGuessSeconds < 60) {
            this.timePerGuessDisplay.textContent = `${Math.round(timePerGuessSeconds)}s`;
        } else {
            const minutes = Math.floor(timePerGuessSeconds / 60);
            const seconds = Math.round(timePerGuessSeconds % 60);
            this.timePerGuessDisplay.textContent = `${minutes}m ${seconds}s`;
        }
        
        // Calculate average speed rating
        // Assuming optimal is < 10 seconds per guess, excellent is < 20s, good is < 30s
        let speedRating = '';
        let speedColor = '';
        
        if (timePerGuessSeconds < 10) {
            speedRating = '⚡ Lightning Fast';
            speedColor = 'lightning';
        } else if (timePerGuessSeconds < 20) {
            speedRating = '🚀 Very Fast';
            speedColor = 'very-fast';
        } else if (timePerGuessSeconds < 30) {
            speedRating = '✅ Fast';
            speedColor = 'fast';
        } else if (timePerGuessSeconds < 60) {
            speedRating = '👍 Good';
            speedColor = 'good';
        } else {
            speedRating = '⏰ Moderate';
            speedColor = 'moderate';
        }
        
        this.averageSpeedDisplay.textContent = speedRating;
        this.averageSpeedDisplay.className = `time-stat-value speed-${speedColor}`;
        
        // Calculate overall time efficiency rating
        // Based on total time and number of guesses
        const maxGuesses = this.calculateMaxGuesses();
        const expectedTimePerGuess = 15; // Expected seconds per guess for good performance
        const expectedTotalTime = maxGuesses * expectedTimePerGuess;
        const timeEfficiency = ((expectedTotalTime - totalSeconds) / expectedTotalTime * 100).toFixed(0);
        
        let efficiencyRating = '';
        let efficiencyColor = '';
        
        if (totalSeconds <= expectedTotalTime * 0.3) {
            efficiencyRating = '🌟 Excellent';
            efficiencyColor = 'excellent';
        } else if (totalSeconds <= expectedTotalTime * 0.5) {
            efficiencyRating = '⭐ Great';
            efficiencyColor = 'great';
        } else if (totalSeconds <= expectedTotalTime * 0.7) {
            efficiencyRating = '👍 Good';
            efficiencyColor = 'good';
        } else if (totalSeconds <= expectedTotalTime) {
            efficiencyRating = '✅ Average';
            efficiencyColor = 'average';
        } else {
            efficiencyRating = '⏱️ Slow';
            efficiencyColor = 'slow';
        }
        
        this.timeEfficiencyRatingDisplay.textContent = efficiencyRating;
        this.timeEfficiencyRatingDisplay.className = `time-stat-value rating-${efficiencyColor}`;
        
        // Display time efficiency message
        let message = '';
        if (timePerGuessSeconds < 10 && this.guessCount <= Math.ceil(maxGuesses * 0.5)) {
            message = `🎯 Outstanding performance! You responded quickly and the AI found your number efficiently in just ${guessCount} guesses!`;
        } else if (timePerGuessSeconds < 20) {
            message = `⚡ Great speed! You made quick decisions with an average of ${timePerGuess} seconds per guess.`;
        } else if (totalSeconds < expectedTotalTime * 0.7) {
            message = `👍 Good timing! The AI completed the search in ${totalSeconds} seconds.`;
        } else {
            message = `⏱️ Took your time! The game completed successfully in ${totalSeconds} seconds.`;
        }
        
        this.timeEfficiencyMessageDisplay.textContent = message;
    }
    
    resetGame() {
        this.gameActive = false;
        clearInterval(this.gameTimer);
        
        this.gameSection.classList.add('hidden');
        this.setupSection.classList.remove('hidden');
        this.winSection.classList.add('hidden');
        
        // Reset state
        this.guessCount = 0;
        this.guessHistory = [];
        this.historyList.innerHTML = '';
    }
    
    playAgain() {
        // Reset and start with same settings
        this.gameActive = false;
        clearInterval(this.gameTimer);
        
        this.guessCount = 0;
        this.guessHistory = [];
        this.historyList.innerHTML = '';
        
        this.startGame();
    }
    
    newGame() {
        // Go back to setup
        this.resetGame();
        
        // Focus on first input for accessibility
        this.minRangeInput.focus();
    }
    
    handleKeyboard(e) {
        // Only handle if game is active
        if (!this.gameActive) return;
        
        // Space or Enter on buttons
        if (e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) {
            return; // Let default behavior happen
        }
        
        // Keyboard shortcuts
        if (e.key === 'ArrowUp' || e.key === 'u' || e.key === 'U') {
            e.preventDefault();
            this.tooLowBtn.click();
        } else if (e.key === 'ArrowDown' || e.key === 'd' || e.key === 'D') {
            e.preventDefault();
            this.tooHighBtn.click();
        } else if (e.key === 'Enter' || e.key === 'c' || e.key === 'C') {
            if (document.activeElement === this.correctBtn) {
                return; // Let default behavior happen
            }
            e.preventDefault();
            this.correctBtn.click();
        }
    }
    
    announce(message) {
        // Create and remove an aria-live region for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new NumberGuessingGame();
    
    // Make it globally available for debugging if needed
    window.game = game;
});

