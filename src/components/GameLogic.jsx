import { useState } from "react"; // Importamos `useState` para manejar el estado del juego.
import GameBoard from "./GameBoard"; // Importamos el tablero de juego.

// 🔹 Función para verificar si hay un ganador
const checkWinner = (board) => {
  const lines = [
    [[0, 0], [0, 1], [0, 2]], // Filas
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]], // Columnas
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]], // Diagonal principal
    [[0, 2], [1, 1], [2, 0]], // Diagonal secundaria
  ];

  // Revisamos todas las combinaciones posibles de victoria.
  for (let line of lines) {
    const [a, b, c] = line;
    
    // Si hay tres en línea del mismo jugador, retornamos el ganador y su línea.
    if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
      return { winner: board[a[0]][a[1]], line: [a, c] };
    }
  }

  // Si no hay ganador, devolvemos `null`
  return { winner: null, line: null };
};

// 🔹 Función para verificar si el tablero está lleno (empate).
const isBoardFull = (board) => board.every(row => row.every(cell => cell !== null));

// 🔹 Componente principal que maneja la lógica del juego.
const GameLogic = () => {
  // Estado para manejar el tablero (matriz de 3x3).
  const [board, setBoard] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));

  // Estado para controlar qué jugador está jugando.
  const [currentPlayer, setCurrentPlayer] = useState("X");

  // Estado para determinar si hay un ganador.
  const [winner, setWinner] = useState(null);

  // Estado para guardar la línea ganadora (si hay un ganador).
  const [winningLine, setWinningLine] = useState(null);

  // Estado para determinar si hay empate.
  const [isDraw, setIsDraw] = useState(false);

  // 🔹 Estados para la puntuación (nueva mejora #5)
  const [scoreX, setScoreX] = useState(0); // Contador de victorias de X
  const [scoreO, setScoreO] = useState(0); // Contador de victorias de O
  const [draws, setDraws] = useState(0); // Contador de empates

  // 🔹 Función que maneja el clic en una celda del tablero.
  const handleCellClick = (row, col) => {
    // Si la casilla ya está ocupada o hay un ganador, no hacemos nada.
    if (board[row][col] || winner) return;

    // Clonamos el tablero para actualizarlo.
    const newBoard = board.map((rowArr, r) =>
      rowArr.map((cell, c) => (r === row && c === col ? currentPlayer : cell))
    );

    // Actualizamos el estado del tablero.
    setBoard(newBoard);

    // Verificamos si hay un ganador después de la jugada.
    const result = checkWinner(newBoard);
    
    if (result.winner) {
      setWinner(result.winner); // Guardamos el ganador.
      setWinningLine(result.line); // Guardamos la línea ganadora para dibujarla.

      // 🔹 Actualizar la puntuación del jugador ganador
      if (result.winner === "X") setScoreX(scoreX + 1);
      if (result.winner === "O") setScoreO(scoreO + 1);
    } else if (isBoardFull(newBoard)) {
      setIsDraw(true); // Si el tablero está lleno y no hay ganador, es un empate.
      setDraws(draws + 1); // 🔹 Aumentar el contador de empates.
    } else {
      // Si no hay ganador ni empate, cambiamos de turno.
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  // 🔹 Función para reiniciar el juego sin perder las puntuaciones.
  const resetGame = () => {
    setBoard(Array(3).fill(null).map(() => Array(3).fill(null))); // Reiniciar el tablero.
    setCurrentPlayer("X"); // Reiniciar al jugador X.
    setWinner(null); // Quitar el ganador.
    setWinningLine(null); // Quitar la línea ganadora.
    setIsDraw(false); // Reiniciar el estado de empate.
  };

  return (
    <div className="container">
      {/* 🔹 Mensaje de estado del juego */}
      <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
        {winner ? `🎉 Ganador: ${winner}` : isDraw ? "🤝 Empate" : `Turno: ${currentPlayer}`}
      </h2>

      {/* 🔹 Sección de puntuaciones */}
      <div className="scoreboard">
        <div className="score">
          <span className="player-x">X</span>: <span className="score-value">{scoreX}</span>
        </div>
        <div className="score">
          <span className="player-o">O</span>: <span className="score-value">{scoreO}</span>
        </div>
        <div className="score">
          <span className="draws">🤝 Empates</span>: <span className="score-value">{draws}</span>
        </div>
      </div>

      {/* 🔹 Renderizar el tablero */}
      <GameBoard matrizTablero={board} onCellClick={handleCellClick} lineaGanadora={winningLine} />

      {/* 🔹 Mostrar botón de reinicio si hay un ganador o empate */}
      {(winner || isDraw) && (
        <button onClick={resetGame}>Reiniciar Juego</button>
      )}
    </div>
  );
};

export default GameLogic;
