/**
 * MisaLala Game Engine - Modern ES6+ Version
 * Consolidates logic from all levels into a reusable Game class
 */

class Game {
  constructor(config = {}) {
    // Configuration
    this.level = config.level || 1;
    this.gridSize = config.gridSize || 9; // 3x3 for level 1, 4x4 for level 2, 6x6 for level 3
    this.timeLimit = config.timeLimit || 30;
    this.imageSource = config.imageSource || [];
    this.containerSelector = config.containerSelector || '#game-grid';
    this.scoreDisplaySelector = config.scoreDisplaySelector || '#score';
    this.timerDisplaySelector = config.timerDisplaySelector || '#timer';
    this.statusDisplaySelector = config.statusDisplaySelector || '#status';

    // Game State
    this.gameState = {
      score: this.loadScore(),
      timeRemaining: this.timeLimit,
      matchesFound: 0,
      gameOver: false,
      isWon: false,
      selectedCards: [],
      revealedCards: new Set(),
    };

    // Game Logic
    this.cards = [];
    this.shuffledImages = [];
    this.timerInterval = null;
    this.isProcessing = false;

    this.init();
  }

  /**
   * Initialize the game
   */
  init() {
    this.shuffleImages();
    this.renderGrid();
    this.attachEventListeners();
    this.startTimer();
    this.updateDisplay();
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  shuffleImages() {
    this.shuffledImages = [...this.imageSource];

    for (let i = this.shuffledImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledImages[i], this.shuffledImages[j]] = [
        this.shuffledImages[j],
        this.shuffledImages[i],
      ];
    }
  }

  /**
   * Render the game grid
   */
  renderGrid() {
    const container = document.querySelector(this.containerSelector);
    container.innerHTML = '';

    const gridColumns = Math.sqrt(this.gridSize);
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
    container.style.gap = '10px';

    for (let i = 0; i < this.gridSize; i++) {
      const card = document.createElement('div');
      card.className = 'game-card';
      card.dataset.cardIndex = i;
      card.dataset.imageSource = this.shuffledImages[i];

      const img = document.createElement('img');
      img.src = 'img/empty.jpg';
      img.alt = 'Card';
      img.className = 'card-image';

      card.appendChild(img);
      container.appendChild(card);
      this.cards.push(card);
    }
  }

  /**
   * Attach event listeners to cards
   */
  attachEventListeners() {
    this.cards.forEach((card) => {
      card.addEventListener('click', (e) => this.handleCardClick(e));
    });
  }

  /**
   * Handle card click
   */
  handleCardClick(event) {
    if (this.isProcessing || this.gameState.gameOver) return;

    const card = event.currentTarget;
    const cardIndex = parseInt(card.dataset.cardIndex);

    // Prevent clicking already revealed or selected cards
    if (
      this.gameState.revealedCards.has(cardIndex) ||
      this.gameState.selectedCards.find((c) => c.index === cardIndex)
    ) {
      return;
    }

    // Reveal card
    this.revealCard(card, cardIndex);
    
    // Lucky card is handled separately, don't add to selectedCards
    if (!this.shuffledImages[cardIndex].includes('lucky.jpg')) {
      this.gameState.selectedCards.push({ card, index: cardIndex });

      if (this.gameState.selectedCards.length === 2) {
        this.checkMatch();
      }
    }
  }

  /**
   * Reveal a card
   */
  revealCard(card, cardIndex) {
    const img = card.querySelector('img');
    img.src = this.shuffledImages[cardIndex];
    img.style.display = 'block';
    card.classList.add('flipped');

    // Check for lucky card bonus
    if (this.shuffledImages[cardIndex].includes('lucky.jpg')) {
      this.handleLuckyCard(card, cardIndex);
    }
  }

  /**
   * Handle lucky card (special bonus card)
   */
  handleLuckyCard(card, cardIndex) {
    this.isProcessing = true;
    this.gameState.revealedCards.add(cardIndex);
    card.classList.add('matched');
    
    this.addScore(1000);
    this.showScorePopup('+1000 (Lucky!)');
    
    // Clear selection and reset
    setTimeout(() => {
      this.gameState.selectedCards = [];
      this.isProcessing = false;
      this.updateDisplay();
    }, 500);
  }

  /**
   * Check if selected cards match
   */
  checkMatch() {
    this.isProcessing = true;

    const [card1Data, card2Data] = this.gameState.selectedCards;
    const img1 = this.shuffledImages[card1Data.index];
    const img2 = this.shuffledImages[card2Data.index];

    if (img1 === img2) {
      // Match found
      this.gameState.matchesFound++;
      this.gameState.revealedCards.add(card1Data.index);
      this.gameState.revealedCards.add(card2Data.index);

      card1Data.card.classList.add('matched');
      card2Data.card.classList.add('matched');

      this.addScore(100);
      this.showScorePopup('+100');

      // Check if game won
      const totalPairs = (this.gridSize - (this.level === 1 ? 1 : 0)) / 2;
      if (this.gameState.matchesFound === totalPairs) {
        this.addScore(1000);
        this.showScorePopup('+1000 (Bonus!)');
        this.winGame();
      }

      this.gameState.selectedCards = [];
      this.isProcessing = false;
    } else {
      // No match - flip back after delay
      setTimeout(() => {
        card1Data.card.querySelector('img').src = 'img/empty.jpg';
        card2Data.card.querySelector('img').src = 'img/empty.jpg';
        card1Data.card.classList.remove('flipped');
        card2Data.card.classList.remove('flipped');

        this.addScore(-50);
        this.showScorePopup('-50');

        this.gameState.selectedCards = [];
        this.isProcessing = false;
      }, 1000);
    }

    this.updateDisplay();
  }

  /**
   * Start the game timer
   */
  startTimer() {
    this.timerInterval = setInterval(() => {
      this.gameState.timeRemaining--;
      this.updateDisplay();

      // Show warning in last 5 seconds
      if (this.gameState.timeRemaining <= 5 && this.gameState.timeRemaining > 0) {
        document.querySelector(this.statusDisplaySelector).textContent =
          this.gameState.timeRemaining;
      }

      if (this.gameState.timeRemaining <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  /**
   * Update display elements
   */
  updateDisplay() {
    document.querySelector(this.scoreDisplaySelector).textContent =
      this.gameState.score;
    document.querySelector(this.timerDisplaySelector).textContent =
      `${this.gameState.timeRemaining}s`;
  }

  /**
   * Add score
   */
  addScore(points) {
    this.gameState.score = this.gameState.score + points;
    this.saveScore();
  }

  /**
   * Show score popup
   */
  showScorePopup(text) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = text;
    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 2000);
  }

  /**
   * Win the game
   */
  winGame() {
    this.gameState.isWon = true;
    this.gameState.gameOver = true;
    clearInterval(this.timerInterval);
    document.querySelector(this.statusDisplaySelector).innerHTML =
      '<img src="img/win.png" alt="You Win!" width="150" height="150">';
    
    // Set flag for level progression
    sessionStorage.setItem('level_progression', 'true');
    sessionStorage.setItem('record', this.gameState.score);
    
    // Mark level as completed
    localStorage.setItem(`level_${this.level}_completed`, 'true');
    
    // Redirect to next level or end
    setTimeout(() => {
      if (this.level < 3) {
        window.location.href = `game.html?level=${this.level + 1}`;
      } else {
        window.location.href = `game.html?level=end`;
      }
    }, 2000);
  }

  /**
   * End the game (time up)
   */
  endGame() {
    this.gameState.gameOver = true;
    clearInterval(this.timerInterval);
    document.querySelector(this.statusDisplaySelector).innerHTML =
      '<img src="img/lose.png" alt="Game Over" width="150" height="150">';
    this.showPlayAgainButton();
  }

  /**
   * Show play again button
   */
  showPlayAgainButton() {
    const btn = document.getElementById('playagain');
    if (btn) {
      btn.style.display = 'block';
      btn.addEventListener('click', () => this.reset());
    }
  }

  /**
   * Save score to localStorage
   */
  saveScore() {
    localStorage.setItem(`misalala_score_level${this.level}`, this.gameState.score);
  }

  /**
   * Load score from localStorage
   */
  loadScore() {
    const isProgressing = sessionStorage.getItem('level_progression');
    if (isProgressing) {
      sessionStorage.removeItem('level_progression');
      const prevScore = sessionStorage.getItem('record');
      return prevScore ? parseInt(prevScore) : 0;
    }
    // Direct refresh or new game - reset score to 0
    return 0;
  }

  /**
   * Reset game
   */
  reset() {
    // Hide the Play Again button and game status
    const btn = document.getElementById('playagain');
    if (btn) btn.style.display = 'none';
    const statusElement = document.querySelector(this.statusDisplaySelector);
    if (statusElement) statusElement.innerHTML = '';

    this.gameState = {
      score: 0,
      timeRemaining: this.timeLimit,
      matchesFound: 0,
      gameOver: false,
      isWon: false,
      selectedCards: [],
      revealedCards: new Set(),
    };
    this.saveScore();
    clearInterval(this.timerInterval);
    this.cards = [];
    this.init();
  }
}
