/// <reference lib="dom" />

const ws = new WebSocket(`ws://${location.host}`);
ws.onopen = () => {
    setInterval(() => ws.send("ping"), 5000);
    ws.send("Hello from the client!");
}

ws.onmessage = (e: MessageEvent) => {
    if (e.data === "reload") {
        location.reload();
    }
}

const canvas = document.getElementById("sudokuCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const width: number = canvas.width;
const height: number = canvas.height;
const cellSize: number = Math.round(Math.min(width, height) / 9);
const bgColor: string = "#DDD";
const thinLineColor: string = "#AAA";

function clearCanvas() {
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height);
}

function drawCell(
    x: number,
    y: number,
    cellSize: number,
    borderColor: string,
    fillColor?: string
) {
    const xPosition = x * cellSize;
    const yPosition = y * cellSize;
    fillColor = fillColor || bgColor;

    ctx.fillStyle = fillColor;
    ctx.fillRect(xPosition - 1, yPosition - 1, cellSize - 2, cellSize - 2);

    ctx.strokeStyle = borderColor;
    ctx.strokeRect(xPosition, yPosition, cellSize, cellSize);
}

function drawEmptyGrid() {
    clearCanvas();
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            drawCell(i, j, cellSize, thinLineColor)
        }
    }
}

drawEmptyGrid();