import React, { useState, useEffect } from 'react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [playerSymbol, setPlayerSymbol] = useState('X');
  const [gameStatus, setGameStatus] = useState('Choose game mode:');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isSinglePlayer, setIsSinglePlayer] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [scores, setScores] = useState({
    X: 0,
    O: 0,
    ties: 0
  });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const winner = calculateWinner(board);
      
      if (winner) {
        setGameStatus(`${winner} wins!`);
        setGameOver(true);
        
        // Update scores
        setScores(prevScores => ({
          ...prevScores,
          [winner]: prevScores[winner] + 1
        }));
        
        // Show toast for winner
        setToastMessage(`${winner} wins!`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        
        setTimeout(resetGame, 2000);
      } else if (!board.includes(null)) {
        setGameStatus('Game Draw!');
        setGameOver(true);
        
        // Update tie score
        setScores(prevScores => ({
          ...prevScores,
          ties: prevScores.ties + 1
        }));
        
        // Show toast for tie
        setToastMessage('Game Draw!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        
        setTimeout(resetGame, 2000);
      } else {
        setGameStatus(`Player ${isXNext ? 'X' : 'O'}'s turn`);
        
        // Display toast for current player's turn
        setToastMessage(`${isXNext ? 'X' : 'O'}'s turn`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        
        // Computer's turn in single player mode
        if (isSinglePlayer && 
            ((isXNext && playerSymbol === 'O') || (!isXNext && playerSymbol === 'X'))) {
          setTimeout(makeComputerMove, 600);
        }
      }
    }
  }, [board, isXNext, gameStarted, gameOver]);

  const calculateWinner = (squares) => {
    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (!gameStarted || gameOver) return;
    
    // In single player mode, prevent clicking when it's computer's turn
    if (isSinglePlayer && 
        ((isXNext && playerSymbol === 'O') || (!isXNext && playerSymbol === 'X'))) {
      return;
    }
    
    if (board[index]) return; // Square already filled

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const makeComputerMove = () => {
    if (gameOver) return;
    
    const availableSquares = board.map((square, index) => (square === null ? index : null)).filter(i => i !== null);
    
    if (availableSquares.length > 0) {
      // Simple AI: First check if computer can win, then check if player can win to block
      const computerSymbol = playerSymbol === 'X' ? 'O' : 'X';
      
      // Check if computer can win
      const winMove = findWinningMove(board, computerSymbol);
      if (winMove !== null) {
        makeMove(winMove);
        return;
      }
      
      // Check if player can win and block
      const blockMove = findWinningMove(board, playerSymbol);
      if (blockMove !== null) {
        makeMove(blockMove);
        return;
      }
      
      // Try to take center if available
      if (board[4] === null) {
        makeMove(4);
        return;
      }
      
      // Take a random available square
      const randomIndex = Math.floor(Math.random() * availableSquares.length);
      makeMove(availableSquares[randomIndex]);
    }
  };
  
  const findWinningMove = (currentBoard, symbol) => {
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const boardCopy = [...currentBoard];
        boardCopy[i] = symbol;
        if (calculateWinner(boardCopy) === symbol) {
          return i;
        }
      }
    }
    return null;
  };
  
  const makeMove = (index) => {
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const selectGameMode = (singlePlayer) => {
    setIsSinglePlayer(singlePlayer);
    setGameStatus('Choose your symbol:');
  };

  const chooseSymbol = (symbol) => {
    setPlayerSymbol(symbol);
    setGameStarted(true);
    setIsXNext(true); // X always goes first
    setGameStatus(`Player X's turn`);
    
    // Reset scores
    setScores({
      X: 0,
      O: 0,
      ties: 0
    });
    
    // Display first turn toast
    setToastMessage("X's turn");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    
    // If player chose O in single player mode, computer (X) makes first move
    if (isSinglePlayer && symbol === 'O') {
      setTimeout(() => makeComputerMove(), 600);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setIsXNext(true);
    
    // Display first turn toast for new game
    setToastMessage("X's turn");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
    
    // If player chose O in single player mode, computer (X) makes first move
    if (isSinglePlayer && playerSymbol === 'O') {
      setTimeout(() => makeComputerMove(), 600);
    }
  };

  const resetAll = () => {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setGameStarted(false);
    setIsXNext(true);
    setGameStatus('Choose game mode:');
    setScores({
      X: 0,
      O: 0,
      ties: 0
    });
  };

  const renderSquare = (index) => {
    return (
      <button 
        className={`square ${board[index] ? 'filled' : ''}`}
        onClick={() => handleClick(index)}
      >
        {board[index]}
      </button>
    );
  };

  const renderScoreboard = () => {
    return (
      <div className="scoreboard">
        <div className="score-item">
          <div className="score-symbol x-symbol">X</div>
          <div className="score-value">{scores.X}</div>
        </div>
        <div className="score-item">
          <div className="score-symbol tie-symbol">TIES</div>
          <div className="score-value">{scores.ties}</div>
        </div>
        <div className="score-item">
          <div className="score-symbol o-symbol">O</div>
          <div className="score-value">{scores.O}</div>
        </div>
      </div>
    );
  };

  // Render game mode selection
  if (!isSinglePlayer && !gameStarted) {
    return (
      <div className="game-container">
        <h1 className="game-title">Tic Tac Toe</h1>
        
        <div className="game-status">{gameStatus}</div>
        
        <div className="symbol-selector">
          <button 
            onClick={() => chooseSymbol('X')} 
            className="btn btn-symbol"
          >
            Play as X
          </button>
          <button 
            onClick={() => chooseSymbol('O')} 
            className="btn btn-symbol"
          >
            Play as O
          </button>
        </div>
        
        <div className="game-controls">
          <button 
            onClick={() => setGameStatus('Choose game mode:')} 
            className="btn btn-back"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      {showToast && (
        <div className="toast">
          {toastMessage}
        </div>
      )}
      
      <h1 className="game-title">Tic Tac Toe</h1>
      
      <div className="game-status">{gameStatus}</div>
      
      {!gameStarted ? (
        <>
          <div className="mode-selector">
            <button 
              onClick={() => selectGameMode(true)} 
              className="btn btn-mode"
            >
              1 Player
            </button>
            <button 
              onClick={() => selectGameMode(false)} 
              className="btn btn-mode"
            >
              2 Players
            </button>
          </div>
        </>
      ) : (
        <>
          {renderScoreboard()}
          
          <div className="board">
            {Array(9).fill(null).map((_, i) => renderSquare(i))}
          </div>
          
          <div className="game-controls">
            <button 
              onClick={resetGame} 
              className="btn btn-reset"
            >
              Reset Game
            </button>
            <button 
              onClick={resetAll} 
              className="btn btn-new-game"
            >
              New Game
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TicTacToe;