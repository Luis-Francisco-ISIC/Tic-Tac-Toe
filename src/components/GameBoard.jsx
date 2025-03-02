import { useEffect, useRef } from "react";

// Definimos el componente GameBoard que recibe:
// matrizTablero: la matriz del tablero de juego
// onCellClick: función para manejar clics en las casillas
// lineaGanadora: coordenadas de la línea ganadora (si hay un ganador)
const GameBoard = ({ matrizTablero, onCellClick, lineaGanadora }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const size = canvas.width / 3;

    // 🔹 Limpiar solo el área del tablero antes de dibujar, sin borrar todo el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🔹 Dibujar las líneas del tablero
    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(size * i, 0);
      ctx.lineTo(size * i, canvas.height);
      ctx.moveTo(0, size * i);
      ctx.lineTo(canvas.width, size * i);
      ctx.stroke();
    }

    // 🔹 Dibujar las "X" y "O"
    matrizTablero.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          ctx.font = "50px Arial";
          ctx.fillStyle = cell === "X" ? "blue" : "red";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(cell, c * size + size / 2, r * size + size / 2);
        }
      });
    });

    // 🔹 Dibujar la línea ganadora si existe, sin borrar el tablero
    if (lineaGanadora) {
      let progress = 0;
      
      const animateLine = () => {
        if (progress <= 1) {
          const tempCanvas = document.createElement("canvas"); // Crear un canvas temporal
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext("2d");

          // Copiar el contenido del canvas principal al temporal
          tempCtx.drawImage(canvas, 0, 0);

          ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas principal
          ctx.drawImage(tempCanvas, 0, 0); // Volver a dibujar el contenido original

          ctx.strokeStyle = "#cfe4ef";
          ctx.lineWidth = 6;
          ctx.beginPath();

          const [start, end] = lineaGanadora;
          ctx.moveTo(
            start[1] * size + size / 2,
            start[0] * size + size / 2
          );

          ctx.lineTo(
            start[1] * size + (end[1] - start[1]) * size * progress + size / 2,
            start[0] * size + (end[0] - start[0]) * size * progress + size / 2
          );

          ctx.stroke();

          progress += 0.05;
          requestAnimationFrame(animateLine);
        }
      };
      animateLine();
    }
  }, [matrizTablero, lineaGanadora]);

  // 🔹 Manejar los clics del usuario en el tablero
  const handleClick = (event) => {
    const canvas = canvasRef.current;
    const size = canvas.width / 3;
    const x = Math.floor(event.nativeEvent.offsetX / size);
    const y = Math.floor(event.nativeEvent.offsetY / size);

    onCellClick(y, x);
  };

  // 🔹 Renderizar el canvas y asignarle el evento de clic
  return <canvas ref={canvasRef} width={300} height={300} onClick={handleClick} />;
};

export default GameBoard;
